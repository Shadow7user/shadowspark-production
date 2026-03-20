#!/usr/bin/env python3

from __future__ import annotations

import hashlib
import json
import os
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

REQUEST_TIMEOUT_SECONDS = 20
MAX_PAGES_PER_SITE = 6
DEFAULT_USER_AGENT = (
    "ShadowweaverScraper/1.0 (+https://shadowspark-tech.org)"
)
PHONE_PATTERN = re.compile(r"(?:\+?\d[\d\s().-]{7,}\d)")
EMAIL_PATTERN = re.compile(
    r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b",
    re.IGNORECASE,
)
CONTACT_PATH_HINTS = ("contact", "about", "team", "support", "reach")


@dataclass(frozen=True)
class LeadCandidate:
    email: str | None
    name: str
    notes: str
    organization_name: str
    phone: str
    source: str
    url: str


def load_required_env(name: str) -> str:
    value = os.getenv(name, "").strip()
    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


def load_source_urls() -> list[str]:
    raw = os.getenv("SCRAPER_SOURCE_URLS", "").strip()
    if not raw:
      raise RuntimeError(
          "Missing SCRAPER_SOURCE_URLS. Provide one or more absolute URLs."
      )

    parts = [
        part.strip()
        for chunk in raw.splitlines()
        for part in chunk.split(",")
        if part.strip()
    ]

    unique_parts: list[str] = []
    seen: set[str] = set()
    for part in parts:
        if part in seen:
            continue
        seen.add(part)
        unique_parts.append(part)

    return unique_parts


def state_path() -> Path:
    configured = os.getenv("SCRAPER_STATE_PATH", ".scraper-cache/state.json").strip()
    path = Path(configured)
    path.parent.mkdir(parents=True, exist_ok=True)
    return path


def load_state() -> dict[str, bool]:
    path = state_path()
    if not path.exists():
        return {}

    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {}

    if not isinstance(payload, dict):
        return {}

    return {str(key): bool(value) for key, value in payload.items()}


def save_state(state: dict[str, bool]) -> None:
    path = state_path()
    path.write_text(
        json.dumps(state, indent=2, sort_keys=True),
        encoding="utf-8",
    )


def build_session() -> requests.Session:
    session = requests.Session()
    session.headers.update({"User-Agent": DEFAULT_USER_AGENT})
    return session


def fetch_html(session: requests.Session, url: str) -> BeautifulSoup | None:
    try:
        response = session.get(url, timeout=REQUEST_TIMEOUT_SECONDS)
        response.raise_for_status()
    except requests.RequestException as error:
        print(f"[warn] failed to fetch {url}: {error}", file=sys.stderr)
        return None

    content_type = response.headers.get("content-type", "")
    if "html" not in content_type:
        print(f"[warn] skipped non-HTML response from {url}", file=sys.stderr)
        return None

    return BeautifulSoup(response.text, "html.parser")


def clean_text(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def normalise_phone(value: str) -> str | None:
    digits = re.sub(r"\D+", "", value)
    if len(digits) < 8:
        return None
    if digits.startswith("00"):
        digits = digits[2:]
    if value.strip().startswith("+"):
        return f"+{digits}"
    if digits.startswith("234"):
        return f"+{digits}"
    if digits.startswith("0") and len(digits) == 11:
        return f"+234{digits[1:]}"
    return f"+{digits}"


def discover_candidate_pages(base_url: str, soup: BeautifulSoup) -> list[str]:
    parsed = urlparse(base_url)
    root = f"{parsed.scheme}://{parsed.netloc}"
    pages = [base_url]

    for anchor in soup.find_all("a", href=True):
        href = anchor["href"].strip()
        if href.startswith("#") or href.startswith("mailto:") or href.startswith("tel:"):
            continue
        absolute_url = urljoin(root, href)
        absolute_parsed = urlparse(absolute_url)
        if absolute_parsed.netloc != parsed.netloc:
            continue
        lowered_path = absolute_parsed.path.lower()
        if not any(hint in lowered_path for hint in CONTACT_PATH_HINTS):
            continue
        if absolute_url not in pages:
            pages.append(absolute_url)
        if len(pages) >= MAX_PAGES_PER_SITE:
            break

    return pages


def extract_title(soup: BeautifulSoup) -> str:
    og_site_name = soup.find("meta", attrs={"property": "og:site_name"})
    if og_site_name and og_site_name.get("content"):
        return clean_text(str(og_site_name["content"]))

    if soup.title and soup.title.string:
        return clean_text(soup.title.string)

    heading = soup.find(["h1", "h2"])
    if heading:
        return clean_text(heading.get_text(" ", strip=True))

    return "Unknown Organization"


def extract_name_candidates(soup: BeautifulSoup) -> list[str]:
    candidates: list[str] = []

    for tag in soup.find_all(["h1", "h2", "h3"]):
        text = clean_text(tag.get_text(" ", strip=True))
        if 2 <= len(text) <= 80 and text not in candidates:
            candidates.append(text)

    return candidates


def extract_emails(soup: BeautifulSoup, text: str) -> list[str]:
    emails = {match.group(0).lower() for match in EMAIL_PATTERN.finditer(text)}

    for anchor in soup.find_all("a", href=True):
        href = anchor["href"].strip()
        if href.lower().startswith("mailto:"):
            email = href.split(":", 1)[1].split("?", 1)[0].strip().lower()
            if email:
                emails.add(email)

    return sorted(emails)


def extract_phones(soup: BeautifulSoup, text: str) -> list[str]:
    phones: set[str] = set()

    for match in PHONE_PATTERN.finditer(text):
        normalised = normalise_phone(match.group(0))
        if normalised:
            phones.add(normalised)

    for anchor in soup.find_all("a", href=True):
        href = anchor["href"].strip()
        if href.lower().startswith("tel:"):
            normalised = normalise_phone(href.split(":", 1)[1])
            if normalised:
                phones.add(normalised)

    return sorted(phones)


def build_lead_candidates(url: str, soup: BeautifulSoup) -> list[LeadCandidate]:
    page_text = clean_text(soup.get_text(" ", strip=True))
    organization_name = extract_title(soup)
    name_candidates = extract_name_candidates(soup)
    phones = extract_phones(soup, page_text)
    emails = extract_emails(soup, page_text)
    source = urlparse(url).netloc[:80]

    leads: list[LeadCandidate] = []

    for index, phone in enumerate(phones):
        name = name_candidates[index] if index < len(name_candidates) else organization_name
        email = emails[index] if index < len(emails) else (emails[0] if emails else None)
        notes = (
            f"Autonomously scraped from {url}. "
            f"Lead candidate discovered via public contact details."
        )[:2000]
        leads.append(
            LeadCandidate(
                email=email,
                name=name[:80],
                notes=notes,
                organization_name=organization_name[:160],
                phone=phone,
                source=source[:80],
                url=url,
            )
        )

    return leads


def fingerprint(candidate: LeadCandidate) -> str:
    material = "|".join(
        [
            candidate.source.lower(),
            candidate.organization_name.lower(),
            candidate.phone.lower(),
            (candidate.email or "").lower(),
            candidate.url.lower(),
        ]
    )
    return hashlib.sha256(material.encode("utf-8")).hexdigest()


def iter_candidates(session: requests.Session, source_urls: Iterable[str]) -> Iterable[LeadCandidate]:
    for source_url in source_urls:
        root_soup = fetch_html(session, source_url)
        if root_soup is None:
            continue

        for page_url in discover_candidate_pages(source_url, root_soup):
            page_soup = root_soup if page_url == source_url else fetch_html(session, page_url)
            if page_soup is None:
                continue

            for candidate in build_lead_candidates(page_url, page_soup):
                yield candidate


def push_lead(api_url: str, api_key: str, candidate: LeadCandidate) -> bool:
    payload = {
        "email": candidate.email,
        "location": urlparse(candidate.url).netloc[:120],
        "metadata": {
            "scrapedFrom": candidate.url[:500],
            "scraper": "github-actions",
        },
        "name": candidate.name,
        "notes": candidate.notes,
        "organizationName": candidate.organization_name,
        "phone": candidate.phone,
        "source": candidate.source,
    }

    try:
        response = requests.post(
            api_url,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json=payload,
            timeout=REQUEST_TIMEOUT_SECONDS,
        )
    except requests.RequestException as error:
        print(f"[warn] failed to push lead {candidate.phone}: {error}", file=sys.stderr)
        return False

    if response.status_code not in (200, 201):
        print(
            f"[warn] lead push rejected for {candidate.phone}: "
            f"{response.status_code} {response.text[:300]}",
            file=sys.stderr,
        )
        return False

    print(f"[info] pushed lead {candidate.phone} from {candidate.source}")
    return True


def main() -> int:
    api_url = load_required_env("SHADOWWEAVER_API_URL")
    api_key = load_required_env("SHADOWWEAVER_API_KEY")
    source_urls = load_source_urls()
    state = load_state()
    session = build_session()

    submitted = 0
    skipped = 0
    discovered = 0

    for candidate in iter_candidates(session, source_urls):
        discovered += 1
        lead_key = fingerprint(candidate)
        if state.get(lead_key):
            skipped += 1
            continue

        if push_lead(api_url, api_key, candidate):
            state[lead_key] = True
            submitted += 1

    save_state(state)
    print(
        f"[summary] discovered={discovered} submitted={submitted} skipped={skipped}"
    )

    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except RuntimeError as error:
        print(f"[error] {error}", file=sys.stderr)
        raise SystemExit(1) from error
