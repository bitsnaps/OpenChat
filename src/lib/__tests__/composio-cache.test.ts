import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Use vi.hoisted to define mock functions that will be available when mock is hoisted
const { mockJsonGet, mockJsonSet, mockExpire, mockKeys, mockDel, mockPing } = vi.hoisted(() => ({
  mockJsonGet: vi.fn(),
  mockJsonSet: vi.fn(),
  mockExpire: vi.fn(),
  mockKeys: vi.fn(),
  mockDel: vi.fn(),
  mockPing: vi.fn(),
}));

// Mock Redis before importing the module
vi.mock("@upstash/redis", () => ({
  Redis: class MockRedis {
    json = {
      get: mockJsonGet,
      set: mockJsonSet,
    };
    expire = mockExpire;
    keys = mockKeys;
    del = mockDel;
    ping = mockPing;
  },
}));

// Import after mocking
import {
  checkRedisHealth,
  getCachedConvertedTools,
  invalidateUserToolsCache,
  setCachedConvertedTools,
} from "../composio-cache";

describe("composio-cache", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("getCachedConvertedTools", () => {
    it("returns null when cache is empty", async () => {
      mockJsonGet.mockResolvedValue(null);

      const result = await getCachedConvertedTools("user-123", ["gmail", "notion"]);

      expect(result).toBeNull();
      expect(mockJsonGet).toHaveBeenCalled();
    });

    it("returns null when cached value is empty array", async () => {
      mockJsonGet.mockResolvedValue([]);

      const result = await getCachedConvertedTools("user-123", ["gmail"]);

      expect(result).toBeNull();
    });

    it("returns cached tools when available", async () => {
      const cachedTools = { tool1: { name: "test" } };
      mockJsonGet.mockResolvedValue([cachedTools]);

      const result = await getCachedConvertedTools("user-123", ["gmail"]);

      expect(result).toEqual(cachedTools);
    });

    it("sorts toolkit slugs for consistent cache keys", async () => {
      mockJsonGet.mockResolvedValue(null);

      await getCachedConvertedTools("user-123", ["notion", "gmail"]);

      // The cache key should use sorted slugs
      const callArg = mockJsonGet.mock.calls[0][0] as string;
      expect(callArg).toContain("gmail,notion");
    });

    it("uses correct cache key prefix", async () => {
      mockJsonGet.mockResolvedValue(null);

      await getCachedConvertedTools("user-123", ["gmail"]);

      const callArg = mockJsonGet.mock.calls[0][0] as string;
      expect(callArg).toContain("composio:converted:");
      expect(callArg).toContain("user-123");
    });
  });

  describe("setCachedConvertedTools", () => {
    it("sets tools in cache with correct key", async () => {
      mockJsonSet.mockResolvedValue("OK");
      mockExpire.mockResolvedValue(1);

      const tools = { tool1: { name: "test" } };
      await setCachedConvertedTools("user-123", ["gmail"], tools as never);

      expect(mockJsonSet).toHaveBeenCalled();
      expect(mockExpire).toHaveBeenCalled();
    });

    it("sorts toolkit slugs for consistent cache keys", async () => {
      mockJsonSet.mockResolvedValue("OK");
      mockExpire.mockResolvedValue(1);

      await setCachedConvertedTools("user-123", ["notion", "gmail"], {} as never);

      const callArg = mockJsonSet.mock.calls[0][0] as string;
      expect(callArg).toContain("gmail,notion");
    });

    it("silently fails on error", async () => {
      mockJsonSet.mockRejectedValue(new Error("Redis error"));

      // Should not throw - simply await to verify it resolves
      await setCachedConvertedTools("user-123", ["gmail"], {} as never);
    });

    it("sets TTL of 48 hours", async () => {
      mockJsonSet.mockResolvedValue("OK");
      mockExpire.mockResolvedValue(1);

      await setCachedConvertedTools("user-123", ["gmail"], {} as never);

      // 48 hours = 48 * 60 * 60 = 172800 seconds
      expect(mockExpire).toHaveBeenCalledWith(expect.any(String), 172_800);
    });
  });

  describe("invalidateUserToolsCache", () => {
    it("deletes all cache keys for user", async () => {
      mockKeys.mockResolvedValue([
        "composio:converted:user-123:gmail",
        "composio:converted:user-123:notion",
      ]);
      mockDel.mockResolvedValue(2);

      await invalidateUserToolsCache("user-123");

      expect(mockKeys).toHaveBeenCalledWith("composio:converted:user-123:*");
      expect(mockDel).toHaveBeenCalled();
    });

    it("does not call del when no keys found", async () => {
      mockKeys.mockResolvedValue([]);

      await invalidateUserToolsCache("user-123");

      expect(mockDel).not.toHaveBeenCalled();
    });

    it("silently fails on error", async () => {
      mockKeys.mockRejectedValue(new Error("Redis error"));

      // Should not throw - simply await to verify it resolves
      await invalidateUserToolsCache("user-123");
    });
  });

  describe("checkRedisHealth", () => {
    it("returns true when Redis is healthy", async () => {
      mockPing.mockResolvedValue("PONG");

      const result = await checkRedisHealth();

      expect(result).toBe(true);
      expect(mockPing).toHaveBeenCalled();
    });

    it("returns false when Redis is unhealthy", async () => {
      mockPing.mockRejectedValue(new Error("Connection failed"));

      const result = await checkRedisHealth();

      expect(result).toBe(false);
    });
  });
});
