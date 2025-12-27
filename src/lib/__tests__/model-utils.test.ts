import { describe, expect, it } from "vitest";
import { MODEL_DEFAULT, MODELS } from "@/lib/config";
import {
  createModelValidator,
  getModelById,
  getModelProvider,
  isModelPremium,
  requiresUserApiKey,
  supportsReasoningEffort,
} from "../model-utils";

describe("model-utils", () => {
  describe("supportsReasoningEffort", () => {
    it("returns false for non-existent model", () => {
      expect(supportsReasoningEffort("non-existent-model")).toBe(false);
    });

    it("returns false for models without features", () => {
      // Find a model without reasoning feature
      const modelWithoutReasoning = MODELS.find(
        (m) => !m.features?.some((f) => f.id === "reasoning"),
      );
      expect(modelWithoutReasoning).toBeDefined();
      expect(supportsReasoningEffort(modelWithoutReasoning!.id)).toBe(false);
    });

    it("returns true for models with reasoning + supportsEffort", () => {
      // Find a model with reasoning that supports effort
      const modelWithReasoning = MODELS.find((m) =>
        m.features?.some((f) => f.id === "reasoning" && f.enabled && f.supportsEffort),
      );
      expect(modelWithReasoning).toBeDefined();
      expect(supportsReasoningEffort(modelWithReasoning!.id)).toBe(true);
    });

    it("returns false for reasoning models without supportsEffort", () => {
      // Find a model with reasoning but no supportsEffort
      const modelWithBasicReasoning = MODELS.find((m) =>
        m.features?.some((f) => f.id === "reasoning" && f.enabled && !f.supportsEffort),
      );
      expect(modelWithBasicReasoning).toBeDefined();
      expect(supportsReasoningEffort(modelWithBasicReasoning!.id)).toBe(false);
    });
  });

  describe("createModelValidator", () => {
    it("returns a function", () => {
      const validator = createModelValidator();
      expect(typeof validator).toBe("function");
    });

    it("returns preferred model when it exists", () => {
      const validator = createModelValidator();
      const validModel = MODELS[0]?.id;
      expect(validModel).toBeDefined();
      expect(validator(validModel)).toBe(validModel);
    });

    it("returns default model for non-existent model", () => {
      const validator = createModelValidator();
      expect(validator("non-existent-model")).toBe(MODEL_DEFAULT);
    });

    it("returns default model when preferred is disabled", () => {
      const validator = createModelValidator();
      const validModel = MODELS[0]?.id;
      expect(validModel).toBeDefined();
      expect(validator(validModel, [validModel])).toBe(MODEL_DEFAULT);
    });

    it("returns preferred model when not in disabled list", () => {
      const validator = createModelValidator();
      const validModel = MODELS[0]?.id;
      expect(validModel).toBeDefined();
      expect(validator(validModel, ["some-other-model"])).toBe(validModel);
    });
  });

  describe("getModelById", () => {
    it("returns undefined for non-existent model", () => {
      expect(getModelById("non-existent-model")).toBeUndefined();
    });

    it("returns model for existing id", () => {
      const model = MODELS[0];
      expect(model).toBeDefined();
      const result = getModelById(model.id);
      expect(result).toBeDefined();
      expect(result?.id).toBe(model.id);
    });

    it("returns model with all expected properties", () => {
      const model = MODELS[0];
      expect(model).toBeDefined();
      const result = getModelById(model.id);
      expect(result?.id).toBeDefined();
      expect(result?.name).toBeDefined();
      expect(result?.provider).toBeDefined();
    });
  });

  describe("isModelPremium", () => {
    it("returns false for non-existent model", () => {
      expect(isModelPremium("non-existent-model")).toBe(false);
    });

    it("returns true for premium models", () => {
      const premiumModel = MODELS.find((m) => m.premium === true);
      expect(premiumModel).toBeDefined();
      expect(isModelPremium(premiumModel!.id)).toBe(true);
    });

    it("returns false for non-premium models", () => {
      const nonPremiumModel = MODELS.find((m) => !m.premium);
      expect(nonPremiumModel).toBeDefined();
      expect(isModelPremium(nonPremiumModel!.id)).toBe(false);
    });
  });

  describe("requiresUserApiKey", () => {
    it("returns false for non-existent model", () => {
      expect(requiresUserApiKey("non-existent-model")).toBe(false);
    });

    it("returns true for models requiring user API key", () => {
      const userKeyModel = MODELS.find((m) => m.apiKeyUsage?.userKeyOnly === true);
      expect(userKeyModel).toBeDefined();
      expect(requiresUserApiKey(userKeyModel!.id)).toBe(true);
    });

    it("returns false for models not requiring user API key", () => {
      const noUserKeyModel = MODELS.find((m) => !m.apiKeyUsage?.userKeyOnly);
      expect(noUserKeyModel).toBeDefined();
      expect(requiresUserApiKey(noUserKeyModel!.id)).toBe(false);
    });
  });

  describe("getModelProvider", () => {
    it("returns undefined for non-existent model", () => {
      expect(getModelProvider("non-existent-model")).toBeUndefined();
    });

    it("returns provider for existing model", () => {
      const model = MODELS[0];
      expect(model).toBeDefined();
      const provider = getModelProvider(model.id);
      expect(provider).toBeDefined();
      expect(typeof provider).toBe("string");
    });

    it("returns correct provider for different models", () => {
      // Test a few known providers
      const openaiModel = MODELS.find((m) => m.provider === "openai");
      expect(openaiModel).toBeDefined();
      expect(getModelProvider(openaiModel!.id)).toBe("openai");

      const anthropicModel = MODELS.find((m) => m.provider === "anthropic");
      expect(anthropicModel).toBeDefined();
      expect(getModelProvider(anthropicModel!.id)).toBe("anthropic");

      const googleModel = MODELS.find((m) => m.provider === "gemini");
      expect(googleModel).toBeDefined();
      expect(getModelProvider(googleModel!.id)).toBe("gemini");
    });
  });
});
