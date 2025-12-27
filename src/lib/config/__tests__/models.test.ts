import { describe, expect, it } from "vitest";
import { z } from "zod";
import { MODELS, MODELS_DATA, MODELS_MAP, MODELS_OPTIONS, MODELS_RAW } from "../models/index";
import { ModelSchema } from "../schemas";

describe("Models Configuration", () => {
  describe("MODELS_DATA", () => {
    it("is a non-empty array", () => {
      expect(Array.isArray(MODELS_DATA)).toBe(true);
      expect(MODELS_DATA.length).toBeGreaterThan(0);
    });
  });

  describe("MODELS_RAW", () => {
    it("is a non-empty array", () => {
      expect(Array.isArray(MODELS_RAW)).toBe(true);
      expect(MODELS_RAW.length).toBeGreaterThan(0);
    });

    it("validates all models through Zod schema", () => {
      const schema = z.array(ModelSchema);
      const result = schema.safeParse(MODELS_DATA);
      expect(result.success).toBe(true);
    });

    it("rejects invalid model data", () => {
      const invalidModel = {
        id: 123,
        name: "Test",
        provider: "test",
        premium: "not-boolean",
        description: "Test",
      };
      const result = ModelSchema.safeParse(invalidModel);
      expect(result.success).toBe(false);
    });

    it("requires mandatory fields", () => {
      const missingFields = { id: "test" };
      const result = ModelSchema.safeParse(missingFields);
      expect(result.success).toBe(false);
    });
  });

  describe("MODELS", () => {
    it("is a non-empty array", () => {
      expect(Array.isArray(MODELS)).toBe(true);
      expect(MODELS.length).toBeGreaterThan(0);
    });

    it("each model has required properties", () => {
      for (const model of MODELS) {
        expect(model.id).toBeDefined();
        expect(typeof model.id).toBe("string");
        expect(model.id.length).toBeGreaterThan(0);

        expect(model.name).toBeDefined();
        expect(typeof model.name).toBe("string");

        expect(model.provider).toBeDefined();
        expect(typeof model.provider).toBe("string");
      }
    });

    it("model ids are unique", () => {
      const ids = MODELS.map((m) => m.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("contains models from multiple providers", () => {
      const providers = new Set(MODELS.map((m) => m.provider));
      expect(providers.size).toBeGreaterThan(1);
    });

    it("includes major AI providers", () => {
      const providers = MODELS.map((m) => m.provider);
      expect(providers).toContain("openai");
      expect(providers).toContain("anthropic");
      expect(providers).toContain("gemini");
    });

    it("includes DeepSeek models", () => {
      const providers = MODELS.map((m) => m.provider);
      expect(providers).toContain("deepseek");
    });

    it("includes xAI models", () => {
      const providers = MODELS.map((m) => m.provider);
      expect(providers).toContain("xai");
    });
  });

  describe("MODELS_MAP", () => {
    it("is an object", () => {
      expect(typeof MODELS_MAP).toBe("object");
      expect(MODELS_MAP).not.toBeNull();
    });

    it("contains all models from MODELS array", () => {
      for (const model of MODELS) {
        expect(MODELS_MAP[model.id]).toBeDefined();
        expect(MODELS_MAP[model.id].id).toBe(model.id);
      }
    });

    it("provides O(1) lookup by id", () => {
      const firstModel = MODELS[0];
      if (firstModel) {
        const lookedUp = MODELS_MAP[firstModel.id];
        expect(lookedUp).toBeDefined();
        expect(lookedUp.id).toBe(firstModel.id);
      }
    });

    it("returns undefined for non-existent id", () => {
      expect(MODELS_MAP["non-existent-model"]).toBeUndefined();
    });
  });

  describe("MODELS_OPTIONS", () => {
    it("is the same as MODELS", () => {
      expect(MODELS_OPTIONS).toBe(MODELS);
    });
  });

  describe("Model features", () => {
    it("some models have features array", () => {
      const modelsWithFeatures = MODELS.filter((m) => m.features && m.features.length > 0);
      expect(modelsWithFeatures.length).toBeGreaterThan(0);
    });

    it("some models support reasoning", () => {
      const reasoningModels = MODELS.filter((m) =>
        m.features?.some((f) => f.id === "reasoning" && f.enabled),
      );
      expect(reasoningModels.length).toBeGreaterThan(0);
    });

    it("some models support file upload", () => {
      const fileUploadModels = MODELS.filter((m) =>
        m.features?.some((f) => f.id === "file-upload" && f.enabled),
      );
      expect(fileUploadModels.length).toBeGreaterThan(0);
    });

    it("some models support tool calling", () => {
      const toolCallingModels = MODELS.filter((m) =>
        m.features?.some((f) => f.id === "tool-calling" && f.enabled),
      );
      expect(toolCallingModels.length).toBeGreaterThan(0);
    });
  });

  describe("Model premium status", () => {
    it("some models are premium", () => {
      const premiumModels = MODELS.filter((m) => m.premium === true);
      expect(premiumModels.length).toBeGreaterThan(0);
    });

    it("some models are not premium", () => {
      const nonPremiumModels = MODELS.filter((m) => !m.premium);
      expect(nonPremiumModels.length).toBeGreaterThan(0);
    });
  });
});
