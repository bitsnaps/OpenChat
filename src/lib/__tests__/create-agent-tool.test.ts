import { describe, expect, it } from "vitest";
import { z } from "zod";

// Test the input schema validation logic directly since the internal functions
// are not exported. We can test the schema definitions and validation patterns.

const toolNameSchema = z.string().min(1, "Tool name is required");

const toolListSchema = z.union([
	toolNameSchema,
	z.array(toolNameSchema).min(1, "At least one tool is required"),
]);

const createAgentInputSchema = z.object({
	tool: toolListSchema.describe(
		'One or more connector toolkits to enable (e.g. "GMAIL", "NOTION").'
	),
	task: z
		.string()
		.min(1, "Task description is required")
		.max(2000, "Task must be 2000 characters or less")
		.describe("High-level task for the delegated agent to complete."),
	context: z
		.string()
		.max(5000, "Context must be 5000 characters or less")
		.optional()
		.describe(
			"Optional context from previous operations to provide to the agent."
		),
});

// Helper to simulate the analysis function logic
type SubAgentAnalysis = {
	success: boolean;
	toolCallCount: number;
	toolNames: string[];
	finishReason: string;
	issues: string[];
	summary: string;
	errorMessage?: string;
};

const analyzeSubAgentExecution = ({
	toolCalls,
	finishReason,
	finalText,
	subAgentError,
}: {
	toolCalls: { toolName: string; [key: string]: unknown }[];
	finishReason: string;
	finalText: string;
	subAgentError: Error | null;
}): SubAgentAnalysis => {
	const toolCallCount = toolCalls.length;
	const toolNames = toolCalls.map((tc) => tc.toolName);

	const attemptedTools = toolCallCount > 0;
	const normalFinish = finishReason === "stop" || finishReason === "length";
	const hasSubstantialOutput = finalText.length > 25;
	const hasError = subAgentError !== null;

	const success =
		attemptedTools && normalFinish && hasSubstantialOutput && !hasError;

	const issues: string[] = [];
	if (hasError) {
		issues.push(`Error: ${subAgentError?.message || "Unknown error"}`);
	}
	if (!attemptedTools) {
		issues.push("No tools were called");
	}
	if (finishReason === "error") {
		issues.push("Sub-agent encountered an error");
	}
	if (finishReason === "tool-calls") {
		issues.push("Sub-agent stopped mid-execution");
	}
	if (!hasSubstantialOutput) {
		issues.push("Insufficient output produced");
	}

	return {
		success,
		toolCallCount,
		toolNames,
		finishReason,
		issues,
		summary: finalText.slice(0, 300),
		errorMessage: subAgentError?.message,
	};
};

describe("create-agent-tool", () => {
	describe("createAgentInputSchema", () => {
		describe("tool field validation", () => {
			it("accepts a single string tool name", () => {
				const result = createAgentInputSchema.safeParse({
					tool: "GMAIL",
					task: "Send an email to test@example.com",
				});

				expect(result.success).toBe(true);
				if (result.success) {
					expect(result.data.tool).toBe("GMAIL");
				}
			});

			it("accepts an array of tool names", () => {
				const result = createAgentInputSchema.safeParse({
					tool: ["GMAIL", "NOTION"],
					task: "Create a note and email it",
				});

				expect(result.success).toBe(true);
				if (result.success) {
					expect(result.data.tool).toEqual(["GMAIL", "NOTION"]);
				}
			});

			it("rejects empty string tool name", () => {
				const result = createAgentInputSchema.safeParse({
					tool: "",
					task: "Send an email",
				});

				expect(result.success).toBe(false);
			});

			it("rejects empty array of tools", () => {
				const result = createAgentInputSchema.safeParse({
					tool: [],
					task: "Send an email",
				});

				expect(result.success).toBe(false);
			});
		});

		describe("task field validation", () => {
			it("accepts a valid task description", () => {
				const result = createAgentInputSchema.safeParse({
					tool: "GMAIL",
					task: "Send an email to the team about the meeting",
				});

				expect(result.success).toBe(true);
			});

			it("rejects empty task", () => {
				const result = createAgentInputSchema.safeParse({
					tool: "GMAIL",
					task: "",
				});

				expect(result.success).toBe(false);
			});

			it("rejects task over 2000 characters", () => {
				const longTask = "a".repeat(2001);
				const result = createAgentInputSchema.safeParse({
					tool: "GMAIL",
					task: longTask,
				});

				expect(result.success).toBe(false);
			});

			it("accepts task exactly 2000 characters", () => {
				const maxTask = "a".repeat(2000);
				const result = createAgentInputSchema.safeParse({
					tool: "GMAIL",
					task: maxTask,
				});

				expect(result.success).toBe(true);
			});
		});

		describe("context field validation", () => {
			it("accepts optional context", () => {
				const result = createAgentInputSchema.safeParse({
					tool: "GMAIL",
					task: "Send an email",
					context: "Previous operation returned user list",
				});

				expect(result.success).toBe(true);
				if (result.success) {
					expect(result.data.context).toBe(
						"Previous operation returned user list"
					);
				}
			});

			it("accepts missing context", () => {
				const result = createAgentInputSchema.safeParse({
					tool: "GMAIL",
					task: "Send an email",
				});

				expect(result.success).toBe(true);
				if (result.success) {
					expect(result.data.context).toBeUndefined();
				}
			});

			it("rejects context over 5000 characters", () => {
				const longContext = "a".repeat(5001);
				const result = createAgentInputSchema.safeParse({
					tool: "GMAIL",
					task: "Send an email",
					context: longContext,
				});

				expect(result.success).toBe(false);
			});

			it("accepts context exactly 5000 characters", () => {
				const maxContext = "a".repeat(5000);
				const result = createAgentInputSchema.safeParse({
					tool: "GMAIL",
					task: "Send an email",
					context: maxContext,
				});

				expect(result.success).toBe(true);
			});
		});
	});

	describe("analyzeSubAgentExecution", () => {
		it("returns success when all conditions are met", () => {
			const result = analyzeSubAgentExecution({
				toolCalls: [{ toolName: "GMAIL_SEND" }, { toolName: "GMAIL_READ" }],
				finishReason: "stop",
				finalText: "Successfully sent the email to the recipient.",
				subAgentError: null,
			});

			expect(result.success).toBe(true);
			expect(result.toolCallCount).toBe(2);
			expect(result.toolNames).toEqual(["GMAIL_SEND", "GMAIL_READ"]);
			expect(result.finishReason).toBe("stop");
			expect(result.issues).toHaveLength(0);
		});

		it("returns failure when no tools were called", () => {
			const result = analyzeSubAgentExecution({
				toolCalls: [],
				finishReason: "stop",
				finalText: "I couldn't complete the task without tools.",
				subAgentError: null,
			});

			expect(result.success).toBe(false);
			expect(result.issues).toContain("No tools were called");
		});

		it("returns failure when finish reason is error", () => {
			const result = analyzeSubAgentExecution({
				toolCalls: [{ toolName: "GMAIL_SEND" }],
				finishReason: "error",
				finalText: "An error occurred during execution.",
				subAgentError: null,
			});

			expect(result.success).toBe(false);
			expect(result.issues).toContain("Sub-agent encountered an error");
		});

		it("returns failure when finish reason is tool-calls", () => {
			const result = analyzeSubAgentExecution({
				toolCalls: [{ toolName: "GMAIL_SEND" }],
				finishReason: "tool-calls",
				finalText: "Started sending but got interrupted.",
				subAgentError: null,
			});

			expect(result.success).toBe(false);
			expect(result.issues).toContain("Sub-agent stopped mid-execution");
		});

		it("returns failure when output is too short", () => {
			const result = analyzeSubAgentExecution({
				toolCalls: [{ toolName: "GMAIL_SEND" }],
				finishReason: "stop",
				finalText: "Done", // Less than 25 characters
				subAgentError: null,
			});

			expect(result.success).toBe(false);
			expect(result.issues).toContain("Insufficient output produced");
		});

		it("returns failure when there is an error", () => {
			const error = new Error("API rate limit exceeded");
			const result = analyzeSubAgentExecution({
				toolCalls: [{ toolName: "GMAIL_SEND" }],
				finishReason: "stop",
				finalText: "Attempted to send email but failed due to rate limit.",
				subAgentError: error,
			});

			expect(result.success).toBe(false);
			expect(result.issues).toContain("Error: API rate limit exceeded");
			expect(result.errorMessage).toBe("API rate limit exceeded");
		});

		it("truncates summary to 300 characters", () => {
			const longText = "a".repeat(500);
			const result = analyzeSubAgentExecution({
				toolCalls: [{ toolName: "GMAIL_SEND" }],
				finishReason: "stop",
				finalText: longText,
				subAgentError: null,
			});

			expect(result.summary.length).toBe(300);
		});

		it("handles length finish reason as success", () => {
			const result = analyzeSubAgentExecution({
				toolCalls: [{ toolName: "GMAIL_SEND" }],
				finishReason: "length",
				finalText: "Successfully completed the task with full details.",
				subAgentError: null,
			});

			expect(result.success).toBe(true);
		});

		it("collects multiple issues", () => {
			const error = new Error("Connection failed");
			const result = analyzeSubAgentExecution({
				toolCalls: [],
				finishReason: "error",
				finalText: "Failed",
				subAgentError: error,
			});

			expect(result.success).toBe(false);
			expect(result.issues).toContain("Error: Connection failed");
			expect(result.issues).toContain("No tools were called");
			expect(result.issues).toContain("Sub-agent encountered an error");
			expect(result.issues).toContain("Insufficient output produced");
		});
	});

	describe("toolListSchema", () => {
		it("validates single string", () => {
			const result = toolListSchema.safeParse("GMAIL");
			expect(result.success).toBe(true);
		});

		it("validates array of strings", () => {
			const result = toolListSchema.safeParse(["GMAIL", "NOTION", "SLACK"]);
			expect(result.success).toBe(true);
		});

		it("rejects number", () => {
			const result = toolListSchema.safeParse(123);
			expect(result.success).toBe(false);
		});

		it("rejects array with empty strings", () => {
			const result = toolListSchema.safeParse(["GMAIL", ""]);
			expect(result.success).toBe(false);
		});

		it("rejects null", () => {
			const result = toolListSchema.safeParse(null);
			expect(result.success).toBe(false);
		});
	});
});
