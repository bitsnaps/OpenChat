import { describe, expect, it } from "vitest";
import { PROVIDERS, PROVIDERS_OPTIONS } from "../providers";

describe("Providers Config", () => {
  describe("PROVIDERS array", () => {
    it("is a non-empty array", () => {
      expect(Array.isArray(PROVIDERS)).toBe(true);
      expect(PROVIDERS.length).toBeGreaterThan(0);
    });

    it("each provider has required properties", () => {
      for (const provider of PROVIDERS) {
        expect(provider.id).toBeDefined();
        expect(typeof provider.id).toBe("string");
        expect(provider.id.length).toBeGreaterThan(0);

        expect(provider.name).toBeDefined();
        expect(typeof provider.name).toBe("string");
        expect(provider.name.length).toBeGreaterThan(0);

        expect(provider.icon).toBeDefined();
      }
    });

    it("provider ids are unique", () => {
      const ids = PROVIDERS.map((p) => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("contains major AI providers", () => {
      const ids = PROVIDERS.map((p) => p.id);
      expect(ids).toContain("openai");
      expect(ids).toContain("anthropic");
      expect(ids).toContain("gemini");
    });

    it("contains DeepSeek provider", () => {
      const ids = PROVIDERS.map((p) => p.id);
      expect(ids).toContain("deepseek");
    });

    it("contains xAI provider", () => {
      const ids = PROVIDERS.map((p) => p.id);
      expect(ids).toContain("xai");
    });

    it("contains OpenRouter provider", () => {
      const ids = PROVIDERS.map((p) => p.id);
      expect(ids).toContain("openrouter");
    });

    it("contains Meta provider", () => {
      const ids = PROVIDERS.map((p) => p.id);
      expect(ids).toContain("meta");
    });

    it("contains Mistral provider", () => {
      const ids = PROVIDERS.map((p) => p.id);
      expect(ids).toContain("mistral");
    });
  });

  describe("Provider icon variations", () => {
    it("some providers have light icon variant", () => {
      const providersWithLightIcon = PROVIDERS.filter((p) => p.icon_light);
      expect(providersWithLightIcon.length).toBeGreaterThan(0);
    });

    it("openai has light icon variant", () => {
      const openai = PROVIDERS.find((p) => p.id === "openai");
      expect(openai?.icon_light).toBeDefined();
    });

    it("anthropic has light icon variant", () => {
      const anthropic = PROVIDERS.find((p) => p.id === "anthropic");
      expect(anthropic?.icon_light).toBeDefined();
    });

    it("xai has light icon variant", () => {
      const xai = PROVIDERS.find((p) => p.id === "xai");
      expect(xai?.icon_light).toBeDefined();
    });
  });

  describe("PROVIDERS_OPTIONS", () => {
    it("is the same as PROVIDERS", () => {
      expect(PROVIDERS_OPTIONS).toBe(PROVIDERS);
    });
  });
});
