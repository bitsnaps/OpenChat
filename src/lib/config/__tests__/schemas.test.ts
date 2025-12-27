import { describe, expect, it } from "vitest";
import { ApiKeyUsageSchema, ModelFeatureSchema, ModelSchema } from "../schemas";

describe("ModelFeatureSchema", () => {
	it("parses valid feature object", () => {
		const feature = {
			id: "reasoning",
			enabled: true,
		};

		const result = ModelFeatureSchema.parse(feature);

		expect(result.id).toBe("reasoning");
		expect(result.enabled).toBe(true);
	});

	it("accepts optional label", () => {
		const feature = {
			id: "reasoning",
			enabled: true,
			label: "Extended Thinking",
		};

		const result = ModelFeatureSchema.parse(feature);

		expect(result.label).toBe("Extended Thinking");
	});

	it("accepts optional supportsEffort", () => {
		const feature = {
			id: "reasoning",
			enabled: true,
			supportsEffort: true,
		};

		const result = ModelFeatureSchema.parse(feature);

		expect(result.supportsEffort).toBe(true);
	});

	it("rejects missing required fields", () => {
		expect(() => ModelFeatureSchema.parse({ id: "test" })).toThrow();
		expect(() => ModelFeatureSchema.parse({ enabled: true })).toThrow();
	});
});

describe("ApiKeyUsageSchema", () => {
	it("parses valid api key usage object", () => {
		const usage = {
			allowUserKey: true,
			userKeyOnly: false,
		};

		const result = ApiKeyUsageSchema.parse(usage);

		expect(result.allowUserKey).toBe(true);
		expect(result.userKeyOnly).toBe(false);
	});

	it("rejects missing required fields", () => {
		expect(() => ApiKeyUsageSchema.parse({ allowUserKey: true })).toThrow();
		expect(() => ApiKeyUsageSchema.parse({ userKeyOnly: false })).toThrow();
	});
});

describe("ModelSchema", () => {
	it("parses minimal valid model", () => {
		const model = {
			id: "gpt-4",
			name: "GPT-4",
			provider: "openai",
			premium: true,
			usesPremiumCredits: true,
			description: "OpenAI's most capable model",
		};

		const result = ModelSchema.parse(model);

		expect(result.id).toBe("gpt-4");
		expect(result.name).toBe("GPT-4");
		expect(result.provider).toBe("openai");
		expect(result.premium).toBe(true);
		expect(result.usesPremiumCredits).toBe(true);
		expect(result.description).toBe("OpenAI's most capable model");
	});

	it("provides default values for optional fields", () => {
		const model = {
			id: "gpt-4",
			name: "GPT-4",
			provider: "openai",
			premium: true,
			usesPremiumCredits: true,
			description: "Test model",
		};

		const result = ModelSchema.parse(model);

		expect(result.features).toEqual([]);
		expect(result.apiKeyUsage).toEqual({
			allowUserKey: false,
			userKeyOnly: false,
		});
	});

	it("accepts optional subName", () => {
		const model = {
			id: "gpt-4-turbo",
			name: "GPT-4",
			subName: "Turbo",
			provider: "openai",
			premium: true,
			usesPremiumCredits: true,
			description: "Test model",
		};

		const result = ModelSchema.parse(model);

		expect(result.subName).toBe("Turbo");
	});

	it("accepts optional displayProvider", () => {
		const model = {
			id: "test-model",
			name: "Test",
			provider: "openrouter",
			displayProvider: "anthropic",
			premium: false,
			usesPremiumCredits: false,
			description: "Test model",
		};

		const result = ModelSchema.parse(model);

		expect(result.displayProvider).toBe("anthropic");
	});

	it("accepts optional legacy flag", () => {
		const model = {
			id: "gpt-3.5-turbo",
			name: "GPT-3.5",
			provider: "openai",
			premium: false,
			usesPremiumCredits: false,
			description: "Legacy model",
			legacy: true,
		};

		const result = ModelSchema.parse(model);

		expect(result.legacy).toBe(true);
	});

	it("accepts optional skipRateLimit flag", () => {
		const model = {
			id: "unlimited-model",
			name: "Unlimited",
			provider: "test",
			premium: false,
			usesPremiumCredits: false,
			description: "Test model",
			skipRateLimit: true,
		};

		const result = ModelSchema.parse(model);

		expect(result.skipRateLimit).toBe(true);
	});

	it("accepts features array", () => {
		const model = {
			id: "gpt-4",
			name: "GPT-4",
			provider: "openai",
			premium: true,
			usesPremiumCredits: true,
			description: "Test model",
			features: [
				{ id: "reasoning", enabled: true },
				{ id: "file-upload", enabled: true },
			],
		};

		const result = ModelSchema.parse(model);

		expect(result.features).toHaveLength(2);
		expect(result.features[0].id).toBe("reasoning");
	});

	it("accepts custom apiKeyUsage", () => {
		const model = {
			id: "gpt-4",
			name: "GPT-4",
			provider: "openai",
			premium: true,
			usesPremiumCredits: true,
			description: "Test model",
			apiKeyUsage: {
				allowUserKey: true,
				userKeyOnly: true,
			},
		};

		const result = ModelSchema.parse(model);

		expect(result.apiKeyUsage.allowUserKey).toBe(true);
		expect(result.apiKeyUsage.userKeyOnly).toBe(true);
	});

	it("rejects missing required fields", () => {
		expect(() => ModelSchema.parse({ id: "test" })).toThrow();
		expect(() =>
			ModelSchema.parse({
				id: "test",
				name: "Test",
				provider: "openai",
			})
		).toThrow();
	});
});
