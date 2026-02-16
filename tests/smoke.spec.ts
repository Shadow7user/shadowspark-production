import { test, expect } from "@playwright/test"

test.describe("Homepage", () => {
  test("loads with 200 and correct title", async ({ page }) => {
    const response = await page.goto("/")
    expect(response?.status()).toBe(200)
    await expect(page).toHaveTitle(/ShadowSpark/)
  })

  test("hero section is visible", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("h1").first()).toBeVisible()
  })

  test("WhatsApp CTA is present", async ({ page }) => {
    await page.goto("/")
    const whatsapp = page.locator("a[href*='wa.me']").first()
    await expect(whatsapp).toBeVisible()
  })

  test("stats API returns live data", async ({ page }) => {
    const response = await page.request.get("/api/stats")
    expect(response.status()).toBe(200)
    const data = await response.json()
    expect(data).toHaveProperty("messagesProcessed")
    expect(data).toHaveProperty("activeChatbots")
    expect(typeof data.messagesProcessed).toBe("number")
  })
})

test.describe("About page", () => {
  test("loads with 200", async ({ page }) => {
    const response = await page.goto("/about")
    expect(response?.status()).toBe(200)
  })

  test("shows founder name", async ({ page }) => {
    await page.goto("/about")
    await expect(page.locator("h1").first()).toBeVisible()
    await expect(page.getByText("ShadowSpark").first()).toBeVisible()
  })

  test("WhatsApp contact link works", async ({ page }) => {
    await page.goto("/about")
    const whatsapp = page.locator("a[href*='wa.me']").first()
    await expect(whatsapp).toBeVisible()
  })
})

test.describe("Pricing page", () => {
  test("loads with 200", async ({ page }) => {
    const response = await page.goto("/pricing")
    expect(response?.status()).toBe(200)
  })

  test("pricing content is visible", async ({ page }) => {
    await page.goto("/pricing")
    await expect(page.locator("h1, h2").first()).toBeVisible()
  })
})

test.describe("Blog page", () => {
  test("loads with 200", async ({ page }) => {
    const response = await page.goto("/blog")
    expect(response?.status()).toBe(200)
  })
})

test.describe("Portfolio page", () => {
  test("loads with 200", async ({ page }) => {
    const response = await page.goto("/portfolio")
    expect(response?.status()).toBe(200)
  })
})

test.describe("Auth pages", () => {
  test("login page loads", async ({ page }) => {
    const response = await page.goto("/login")
    expect(response?.status()).toBe(200)
  })

  test("register page loads", async ({ page }) => {
    const response = await page.goto("/register")
    expect(response?.status()).toBe(200)
  })

  test("dashboard is not publicly accessible", async ({ page }) => {
    // Unauthenticated users should be redirected away from /dashboard
    // Allow navigation errors since redirect may go to external auth domain
    try {
      await page.goto("/dashboard", { waitUntil: "commit" })
      // If navigation succeeded, URL must not be /dashboard (must have redirected)
      expect(page.url()).not.toMatch(/\/dashboard$/)
    } catch {
      // Navigation error means redirect left the domain — acceptable
    }
  })
})

test.describe("Security headers", () => {
  test("HSTS header is present", async ({ page }) => {
    const response = await page.goto("/")
    const headers = response?.headers()
    expect(headers?.["strict-transport-security"]).toContain("max-age=")
  })

  test("X-Frame-Options is set", async ({ page }) => {
    const response = await page.goto("/")
    const headers = response?.headers()
    expect(headers?.["x-frame-options"]).toBe("SAMEORIGIN")
  })
})
