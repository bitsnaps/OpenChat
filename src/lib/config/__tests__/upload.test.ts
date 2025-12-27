import { describe, expect, it } from "vitest";
import {
  formatBytes,
  getAllowedLabel,
  PASTE_ALLOWED_MIME,
  UPLOAD_ACCEPT,
  UPLOAD_ALLOWED_MIME,
  UPLOAD_MAX_BYTES,
  UPLOAD_MAX_LABEL,
} from "../upload";

describe("Upload Config Constants", () => {
  describe("UPLOAD_MAX_BYTES", () => {
    it("is 10 MiB", () => {
      expect(UPLOAD_MAX_BYTES).toBe(10 * 1024 * 1024);
    });
  });

  describe("UPLOAD_ALLOWED_MIME", () => {
    it("includes common image types", () => {
      expect(UPLOAD_ALLOWED_MIME).toContain("image/jpeg");
      expect(UPLOAD_ALLOWED_MIME).toContain("image/png");
      expect(UPLOAD_ALLOWED_MIME).toContain("image/gif");
      expect(UPLOAD_ALLOWED_MIME).toContain("image/webp");
    });

    it("includes PDF type", () => {
      expect(UPLOAD_ALLOWED_MIME).toContain("application/pdf");
    });
  });

  describe("UPLOAD_ACCEPT", () => {
    it("is a comma-separated string of MIME types", () => {
      expect(typeof UPLOAD_ACCEPT).toBe("string");
      expect(UPLOAD_ACCEPT).toContain(",");
      expect(UPLOAD_ACCEPT).toContain("image/jpeg");
      expect(UPLOAD_ACCEPT).toContain("application/pdf");
    });
  });

  describe("PASTE_ALLOWED_MIME", () => {
    it("only includes image types", () => {
      for (const mime of PASTE_ALLOWED_MIME) {
        expect(mime.startsWith("image/")).toBe(true);
      }
    });

    it("does not include PDF", () => {
      expect(PASTE_ALLOWED_MIME).not.toContain("application/pdf");
    });
  });

  describe("UPLOAD_MAX_LABEL", () => {
    it("is a formatted string", () => {
      expect(typeof UPLOAD_MAX_LABEL).toBe("string");
      expect(UPLOAD_MAX_LABEL).toContain("MB");
    });
  });
});

describe("formatBytes", () => {
  it("returns '0 B' for zero bytes", () => {
    expect(formatBytes(0)).toBe("0 B");
  });

  it("formats bytes correctly", () => {
    expect(formatBytes(100)).toBe("100.00 B");
    expect(formatBytes(512)).toBe("512.00 B");
  });

  it("formats kilobytes correctly", () => {
    expect(formatBytes(1024)).toBe("1.00 KB");
    expect(formatBytes(1536)).toBe("1.50 KB");
    expect(formatBytes(2048)).toBe("2.00 KB");
  });

  it("formats megabytes correctly", () => {
    expect(formatBytes(1024 * 1024)).toBe("1.00 MB");
    expect(formatBytes(5 * 1024 * 1024)).toBe("5.00 MB");
    expect(formatBytes(10 * 1024 * 1024)).toBe("10.00 MB");
  });

  it("formats gigabytes correctly", () => {
    expect(formatBytes(1024 * 1024 * 1024)).toBe("1.00 GB");
    expect(formatBytes(2.5 * 1024 * 1024 * 1024)).toBe("2.50 GB");
  });

  it("formats terabytes correctly", () => {
    expect(formatBytes(1024 * 1024 * 1024 * 1024)).toBe("1.00 TB");
  });
});

describe("getAllowedLabel", () => {
  it("returns empty string for empty array", () => {
    expect(getAllowedLabel([])).toBe("");
  });

  it("returns single label for single MIME type", () => {
    expect(getAllowedLabel(["image/jpeg"])).toBe("JPG");
    expect(getAllowedLabel(["application/pdf"])).toBe("PDF");
  });

  it("returns formatted list for two MIME types", () => {
    expect(getAllowedLabel(["image/jpeg", "image/png"])).toBe("JPG and PNG");
  });

  it("returns formatted list for multiple MIME types", () => {
    expect(getAllowedLabel(["image/jpeg", "image/png", "image/gif"])).toBe("JPG, PNG and GIF");
  });

  it("handles unknown MIME types by returning them as-is", () => {
    expect(getAllowedLabel(["unknown/type"])).toBe("unknown/type");
  });

  it("uses default UPLOAD_ALLOWED_MIME when no argument provided", () => {
    const result = getAllowedLabel();
    expect(result).toContain("JPG");
    expect(result).toContain("PDF");
  });

  it("deduplicates labels", () => {
    expect(getAllowedLabel(["image/jpeg", "image/jpeg"])).toBe("JPG");
  });
});
