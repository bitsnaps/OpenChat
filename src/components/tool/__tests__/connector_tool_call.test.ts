import { describe, expect, it } from "vitest";
import {
	buildConnectorDisplayLabel,
	CONNECTOR_ACTION_LABELS,
} from "../connector_tool_call";

describe("CONNECTOR_ACTION_LABELS", () => {
	it("is defined and has expected entries", () => {
		expect(CONNECTOR_ACTION_LABELS).toBeDefined();
		expect(typeof CONNECTOR_ACTION_LABELS).toBe("object");
	});

	it("has googlecalendar label", () => {
		expect(CONNECTOR_ACTION_LABELS.googlecalendar).toBe("Consulting");
	});

	it("has googledocs label", () => {
		expect(CONNECTOR_ACTION_LABELS.googledocs).toBe("Drafting in");
	});

	it("has googledrive label", () => {
		expect(CONNECTOR_ACTION_LABELS.googledrive).toBe("Syncing with");
	});

	it("has googlesheets label", () => {
		expect(CONNECTOR_ACTION_LABELS.googlesheets).toBe("Updating");
	});

	it("has slack label", () => {
		expect(CONNECTOR_ACTION_LABELS.slack).toBe("Messaging via");
	});

	it("has linear label", () => {
		expect(CONNECTOR_ACTION_LABELS.linear).toBe("Triaging in");
	});

	it("has github label", () => {
		expect(CONNECTOR_ACTION_LABELS.github).toBe("Reviewing on");
	});

	it("has twitter label", () => {
		expect(CONNECTOR_ACTION_LABELS.twitter).toBe("Broadcasting to");
	});

	it("has gmail label", () => {
		expect(CONNECTOR_ACTION_LABELS.gmail).toBe("Checking with");
	});

	it("has notion label", () => {
		expect(CONNECTOR_ACTION_LABELS.notion).toBe("Working with");
	});
});

describe("buildConnectorDisplayLabel", () => {
	it("returns label with prefix for known connector types", () => {
		expect(buildConnectorDisplayLabel("gmail", "Gmail")).toBe(
			"Checking with Gmail"
		);
		expect(buildConnectorDisplayLabel("notion", "Notion")).toBe(
			"Working with Notion"
		);
		expect(buildConnectorDisplayLabel("slack", "Slack")).toBe(
			"Messaging via Slack"
		);
	});

	it("returns default label for unknown connector types", () => {
		// Cast to allow testing unknown connector type
		const result = buildConnectorDisplayLabel(
			"unknown" as Parameters<typeof buildConnectorDisplayLabel>[0],
			"Unknown Service"
		);
		expect(result).toBe("Working with Unknown Service");
	});

	it("handles all known connector types correctly", () => {
		const cases: [Parameters<typeof buildConnectorDisplayLabel>[0], string][] =
			[
				["googlecalendar", "Google Calendar"],
				["googledocs", "Google Docs"],
				["googledrive", "Google Drive"],
				["googlesheets", "Google Sheets"],
				["linear", "Linear"],
				["github", "GitHub"],
				["twitter", "Twitter"],
			];

		for (const [connectorType, displayName] of cases) {
			const result = buildConnectorDisplayLabel(connectorType, displayName);
			const expectedPrefix = CONNECTOR_ACTION_LABELS[connectorType];
			expect(result).toBe(`${expectedPrefix} ${displayName}`);
		}
	});

	it("handles display name with special characters", () => {
		const result = buildConnectorDisplayLabel("gmail", "User's Gmail Account");
		expect(result).toBe("Checking with User's Gmail Account");
	});

	it("handles empty display name", () => {
		const result = buildConnectorDisplayLabel("notion", "");
		expect(result).toBe("Working with ");
	});

	it("preserves display name spacing", () => {
		const result = buildConnectorDisplayLabel(
			"googlecalendar",
			"My Personal Calendar"
		);
		expect(result).toBe("Consulting My Personal Calendar");
	});
});
