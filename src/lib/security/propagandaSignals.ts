import type {
  NormalizedVariant,
  PropagandaTechniqueMatch,
  PropagandaTechniqueRule,
  RiskCategory,
} from "@/lib/security/types";

const PROPAGANDA_TECHNIQUE_RULES: ReadonlyArray<PropagandaTechniqueRule> = [
  {
    id: "fear_appeal",
    name: "Fear Appeal / Catastrophizing",
    psychologicalTrigger: "panic, loss aversion, urgency under perceived threat",
    linguisticPatterns: [
      /\b(act now|before it is too late|before it's too late|immediately or else)\b/i,
      /\b(catastrophe|collapse|disaster|threat to survival|existential threat)\b/i,
      /\b(urgent secret danger|everyone will suffer|only hours left)\b/i,
    ],
    riskSignals: [
      "panic-framed compliance pressure",
      "catastrophic certainty without evidence",
      "time-pressure persuasion",
    ],
    mappedCategories: ["phishing_fraud", "out_of_scope"],
    mitigation:
      "Slow the interaction down, require plain factual restatement, and avoid action under urgency-only framing.",
  },
  {
    id: "authority_pressure",
    name: "Authority Pressure / Implicit Obedience",
    psychologicalTrigger: "deference to perceived authority or institutional legitimacy",
    linguisticPatterns: [
      /\b(as ordered by|authorized by|from headquarters|senior command|official directive)\b/i,
      /\b(do not question|comply immediately|mandatory compliance)\b/i,
      /\b(ignore prior rules|override policy|special exemption)\b/i,
    ],
    riskSignals: [
      "attempt to bypass policy through claimed authority",
      "coercive obedience framing",
      "institutional impersonation risk",
    ],
    mappedCategories: ["prompt_injection", "policy_evasion", "phishing_fraud"],
    mitigation:
      "Do not accept claimed authority as proof. Verify through approved channels and keep policy enforcement unchanged.",
  },
  {
    id: "bandwagon_pressure",
    name: "Bandwagon / Manufactured Social Proof",
    psychologicalTrigger: "need for belonging, fear of exclusion, herd behavior",
    linguisticPatterns: [
      /\b(everyone is doing it|all serious teams|all smart companies)\b/i,
      /\b(join now or be left behind|only fools refuse)\b/i,
      /\b(the majority already agrees|nobody questions this)\b/i,
    ],
    riskSignals: [
      "manufactured consensus pressure",
      "social exclusion framing",
      "herd-compliance persuasion",
    ],
    mappedCategories: ["out_of_scope", "phishing_fraud"],
    mitigation:
      "Ignore consensus claims unless independently verified and classify manipulative pressure as untrusted context.",
  },
  {
    id: "scapegoating_dehumanization",
    name: "Scapegoating / Dehumanization",
    psychologicalTrigger: "ingroup loyalty, anger displacement, moral disengagement",
    linguisticPatterns: [
      /\b(blame (them|those people|the outsiders)|they ruined everything)\b/i,
      /\b(parasites|vermin|traitors|subhuman)\b/i,
      /\b(remove them|purge them|they do not belong)\b/i,
    ],
    riskSignals: [
      "group-targeted hostility",
      "dehumanizing language",
      "harm-normalizing persuasion",
    ],
    mappedCategories: ["illegal_activity", "out_of_scope"],
    mitigation:
      "Refuse targeted hostility, de-escalate, and redirect to safety-focused or neutral support guidance only.",
  },
  {
    id: "false_dilemma",
    name: "False Dilemma / Forced Binary",
    psychologicalTrigger: "decision compression, fear of ambiguity, coerced commitment",
    linguisticPatterns: [
      /\b(either you do this or everything fails)\b/i,
      /\b(only two choices|with us or against us)\b/i,
      /\b(no middle ground|no alternative)\b/i,
    ],
    riskSignals: [
      "binary coercion",
      "suppression of safer alternatives",
      "forced unsafe choice framing",
    ],
    mappedCategories: ["policy_evasion", "out_of_scope"],
    mitigation:
      "Reintroduce alternatives, require plain objective goals, and refuse coercive framing as a reason to bypass safeguards.",
  },
  {
    id: "conspiracy_hidden_truth",
    name: "Conspiracy / Hidden Truth Extraction",
    psychologicalTrigger: "secret-knowledge appeal, suspicion, epistemic exclusivity",
    linguisticPatterns: [
      /\b(hidden truth|what they do not want you to know|secret cabal)\b/i,
      /\b(decode the real message|extract the concealed plan)\b/i,
      /\b(embedded instructions|hidden agenda|buried command)\b/i,
    ],
    riskSignals: [
      "secret-knowledge manipulation",
      "hidden-content extraction pressure",
      "transform-driven trust bypass",
    ],
    mappedCategories: ["suspicious_transform", "policy_evasion", "out_of_scope"],
    mitigation:
      "Treat concealed-content claims as untrusted, normalize first, and never execute or obey extracted instructions by default.",
  },
  {
    id: "repetition_slogan_flooding",
    name: "Repetition / Slogan Flooding",
    psychologicalTrigger: "mere-exposure effect, cognitive saturation, reduced scrutiny",
    linguisticPatterns: [
      /\b(repeat after me|say it again and again)\b/i,
      /\b(always trust the message|the slogan is the proof)\b/i,
      /\b([A-Z]{4,}(?:\s+[A-Z]{4,}){1,})\b/,
    ],
    riskSignals: [
      "persuasion through repetition instead of evidence",
      "content flooding",
      "slogan dominance over facts",
    ],
    mappedCategories: ["out_of_scope"],
    mitigation:
      "Down-rank repeated slogans, ask for verifiable claims, and avoid treating repetition as credibility.",
  },
];

function addMatch(
  matches: PropagandaTechniqueMatch[],
  rule: PropagandaTechniqueRule,
): void {
  matches.push({
    id: rule.id,
    name: rule.name,
    mappedCategories: [...rule.mappedCategories],
    reasons: [
      `Detected ${rule.name.toLowerCase()} patterns.`,
      ...rule.riskSignals.map((signal) => `Risk signal: ${signal}.`),
    ],
    mitigation: rule.mitigation,
  });
}

export function detectPropagandaSignals(
  input: string,
  variants: NormalizedVariant[],
): PropagandaTechniqueMatch[] {
  const texts = [input, ...variants.map((variant) => variant.content)];
  const matches: PropagandaTechniqueMatch[] = [];

  for (const rule of PROPAGANDA_TECHNIQUE_RULES) {
    if (texts.some((text) => rule.linguisticPatterns.some((pattern) => pattern.test(text)))) {
      addMatch(matches, rule);
    }
  }

  return matches;
}

export function collectPropagandaCategories(
  matches: ReadonlyArray<PropagandaTechniqueMatch>,
): RiskCategory[] {
  return Array.from(
    new Set(matches.flatMap((match) => match.mappedCategories)),
  );
}

export { PROPAGANDA_TECHNIQUE_RULES };
