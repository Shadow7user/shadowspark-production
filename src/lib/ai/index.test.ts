import { generateAIResponse } from "./index";

jest.mock("./gemini", () => ({
  generateWithGemini: jest.fn().mockResolvedValue("Gemini response"),
}));

jest.mock("./openai", () => ({
  generateWithOpenAI: jest.fn().mockResolvedValue("OpenAI response"),
}));

describe("generateAIResponse", () => {
  beforeEach(() => {
    process.env.GEMINI_API_KEY = "test-key";
    process.env.OPENAI_API_KEY = "test-key";
    process.env.WHATSAPP_ESCALATION_NUMBER = "+2348107677660";
    process.env.WHATSAPP_ESCALATION_NAME = "Reginald";
  });

  it("uses Gemini when key is available", async () => {
    const { generateWithGemini } = await import("./gemini");
    const result = await generateAIResponse("system", "hello", []);
    expect(generateWithGemini).toHaveBeenCalled();
    expect(result).toBe("Gemini response");
  });

  it("falls back to OpenAI when Gemini fails", async () => {
    const { generateWithGemini } = await import("./gemini");
    const { generateWithOpenAI } = await import("./openai");
    (generateWithGemini as jest.Mock).mockRejectedValueOnce(new Error("Gemini error"));
    const result = await generateAIResponse("system", "hello", []);
    expect(generateWithOpenAI).toHaveBeenCalled();
    expect(result).toBe("OpenAI response");
  });

  it("returns safe fallback when both fail", async () => {
    const { generateWithGemini } = await import("./gemini");
    const { generateWithOpenAI } = await import("./openai");
    (generateWithGemini as jest.Mock).mockRejectedValueOnce(new Error("Gemini error"));
    (generateWithOpenAI as jest.Mock).mockRejectedValueOnce(new Error("OpenAI error"));
    const result = await generateAIResponse("system", "hello", []);
    expect(result).toContain(process.env.WHATSAPP_ESCALATION_NUMBER!);
  });
});
