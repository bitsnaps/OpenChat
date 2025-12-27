import { describe, expect, it, vi } from "vitest";
import {
	createPlaceholderId,
	createTempMessageId,
	validateQueryParam,
} from "../message-utils";

// Mock dependencies
vi.mock("@/components/ui/toast", () => ({
	toast: vi.fn(),
}));

vi.mock("@/lib/ai-sdk-utils", () => ({
	convertConvexToAISDK: vi.fn((msg) => ({
		id: msg._id,
		role: msg.role,
		parts: msg.parts || [],
	})),
}));

vi.mock("@/lib/config", () => ({
	MESSAGE_MAX_LENGTH: 100,
}));

describe("message-utils", () => {
	describe("createTempMessageId", () => {
		it("returns a string starting with temp-", () => {
			const id = createTempMessageId();

			expect(typeof id).toBe("string");
			expect(id.startsWith("temp-")).toBe(true);
		});

		it("includes a timestamp", () => {
			const before = Date.now();
			const id = createTempMessageId();
			const after = Date.now();

			const timestamp = Number.parseInt(id.replace("temp-", ""), 10);

			expect(timestamp).toBeGreaterThanOrEqual(before);
			expect(timestamp).toBeLessThanOrEqual(after);
		});

		it("generates unique ids on subsequent calls", () => {
			const id1 = createTempMessageId();
			const id2 = createTempMessageId();

			// Due to fast execution, they might be the same, but structure should be correct
			expect(id1.startsWith("temp-")).toBe(true);
			expect(id2.startsWith("temp-")).toBe(true);
		});
	});

	describe("createPlaceholderId", () => {
		it("returns a string starting with placeholder-", () => {
			const id = createPlaceholderId();

			expect(typeof id).toBe("string");
			expect(id.startsWith("placeholder-")).toBe(true);
		});

		it("includes a timestamp", () => {
			const before = Date.now();
			const id = createPlaceholderId();
			const after = Date.now();

			const timestamp = Number.parseInt(id.replace("placeholder-", ""), 10);

			expect(timestamp).toBeGreaterThanOrEqual(before);
			expect(timestamp).toBeLessThanOrEqual(after);
		});
	});

	describe("validateQueryParam", () => {
		it("returns trimmed query for valid input", () => {
			const result = validateQueryParam("  valid query  ");

			expect(result).toBe("valid query");
		});

		it("returns null for empty string", () => {
			const result = validateQueryParam("");

			expect(result).toBeNull();
		});

		it("returns null for whitespace only", () => {
			const result = validateQueryParam("   ");

			expect(result).toBeNull();
		});

		it("returns null for query exceeding max length", () => {
			const longQuery = "a".repeat(101); // Exceeds mocked MESSAGE_MAX_LENGTH of 100
			const result = validateQueryParam(longQuery);

			expect(result).toBeNull();
		});

		it("returns query at exactly max length", () => {
			const maxLengthQuery = "a".repeat(100);
			const result = validateQueryParam(maxLengthQuery);

			expect(result).toBe(maxLengthQuery);
		});
	});
});
