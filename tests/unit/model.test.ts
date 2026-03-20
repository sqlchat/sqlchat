import { describe, it, expect } from "vitest";
import { models, getModel } from "@/utils/model";

describe("Model configuration", () => {
  describe("models array", () => {
    it("contains MiniMax-M2.7", () => {
      const minimax = models.find((m) => m.name === "MiniMax-M2.7");
      expect(minimax).toBeDefined();
    });

    it("contains MiniMax-M2.7-highspeed", () => {
      const minimax = models.find((m) => m.name === "MiniMax-M2.7-highspeed");
      expect(minimax).toBeDefined();
    });

    it("MiniMax-M2.7 has correct config", () => {
      const minimax = models.find((m) => m.name === "MiniMax-M2.7")!;
      expect(minimax.temperature).toBeGreaterThan(0);
      expect(minimax.temperature).toBeLessThanOrEqual(1);
      expect(minimax.max_token).toBe(204800);
      expect(minimax.cost_per_call).toBe(1);
    });

    it("MiniMax-M2.7-highspeed has correct config", () => {
      const minimax = models.find((m) => m.name === "MiniMax-M2.7-highspeed")!;
      expect(minimax.temperature).toBeGreaterThan(0);
      expect(minimax.temperature).toBeLessThanOrEqual(1);
      expect(minimax.max_token).toBe(204800);
      expect(minimax.cost_per_call).toBe(1);
    });

    it("MiniMax temperature is within valid range (0, 1]", () => {
      const minimaxModels = models.filter((m) => m.name.startsWith("MiniMax"));
      expect(minimaxModels.length).toBe(2);
      for (const model of minimaxModels) {
        expect(model.temperature).toBeGreaterThan(0);
        expect(model.temperature).toBeLessThanOrEqual(1);
      }
    });
  });

  describe("getModel", () => {
    it("returns MiniMax-M2.7 by name", () => {
      const model = getModel("MiniMax-M2.7");
      expect(model.name).toBe("MiniMax-M2.7");
    });

    it("returns MiniMax-M2.7-highspeed by name", () => {
      const model = getModel("MiniMax-M2.7-highspeed");
      expect(model.name).toBe("MiniMax-M2.7-highspeed");
    });

    it("returns default model for unknown name", () => {
      const model = getModel("unknown-model");
      expect(model.name).toBe("gpt-3.5-turbo");
    });

    it("returns correct model for empty string", () => {
      const model = getModel("");
      expect(model.name).toBe("gpt-3.5-turbo");
    });
  });
});
