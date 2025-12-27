import { describe, expect, it } from "vitest";
import {
	FILE_UPLOAD_FEATURE,
	IMAGE_GENERATION_FEATURE,
	PDF_PROCESSING_FEATURE,
	REASONING_FEATURE,
	REASONING_FEATURE_BASIC,
	REASONING_FEATURE_DISABLED,
	TOOL_CALLING_FEATURE,
} from "../features";

describe("Feature Constants", () => {
	describe("FILE_UPLOAD_FEATURE", () => {
		it("has correct id", () => {
			expect(FILE_UPLOAD_FEATURE.id).toBe("file-upload");
		});

		it("is enabled by default", () => {
			expect(FILE_UPLOAD_FEATURE.enabled).toBe(true);
		});

		it("has a label", () => {
			expect(FILE_UPLOAD_FEATURE.label).toBeDefined();
			expect(typeof FILE_UPLOAD_FEATURE.label).toBe("string");
		});
	});

	describe("PDF_PROCESSING_FEATURE", () => {
		it("has correct id", () => {
			expect(PDF_PROCESSING_FEATURE.id).toBe("pdf-processing");
		});

		it("is enabled by default", () => {
			expect(PDF_PROCESSING_FEATURE.enabled).toBe(true);
		});

		it("has a label", () => {
			expect(PDF_PROCESSING_FEATURE.label).toBeDefined();
		});
	});

	describe("REASONING_FEATURE variants", () => {
		it("REASONING_FEATURE has correct id and supports effort", () => {
			expect(REASONING_FEATURE.id).toBe("reasoning");
			expect(REASONING_FEATURE.enabled).toBe(true);
			expect(REASONING_FEATURE.supportsEffort).toBe(true);
		});

		it("REASONING_FEATURE_BASIC has correct id but does not support effort", () => {
			expect(REASONING_FEATURE_BASIC.id).toBe("reasoning");
			expect(REASONING_FEATURE_BASIC.enabled).toBe(true);
			expect(REASONING_FEATURE_BASIC.supportsEffort).toBe(false);
		});

		it("REASONING_FEATURE_DISABLED has correct id and is disabled", () => {
			expect(REASONING_FEATURE_DISABLED.id).toBe("reasoning");
			expect(REASONING_FEATURE_DISABLED.enabled).toBe(false);
		});

		it("all reasoning features share same id", () => {
			expect(REASONING_FEATURE.id).toBe(REASONING_FEATURE_BASIC.id);
			expect(REASONING_FEATURE.id).toBe(REASONING_FEATURE_DISABLED.id);
		});
	});

	describe("IMAGE_GENERATION_FEATURE", () => {
		it("has correct id", () => {
			expect(IMAGE_GENERATION_FEATURE.id).toBe("image-generation");
		});

		it("is enabled by default", () => {
			expect(IMAGE_GENERATION_FEATURE.enabled).toBe(true);
		});

		it("has a label", () => {
			expect(IMAGE_GENERATION_FEATURE.label).toBeDefined();
		});
	});

	describe("TOOL_CALLING_FEATURE", () => {
		it("has correct id", () => {
			expect(TOOL_CALLING_FEATURE.id).toBe("tool-calling");
		});

		it("is enabled by default", () => {
			expect(TOOL_CALLING_FEATURE.enabled).toBe(true);
		});

		it("has a label mentioning tools", () => {
			expect(TOOL_CALLING_FEATURE.label).toBeDefined();
			expect(TOOL_CALLING_FEATURE.label.toLowerCase()).toContain("tool");
		});
	});
});
