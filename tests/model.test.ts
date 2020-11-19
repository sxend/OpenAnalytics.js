import { Model } from "../src/model";

describe("model", () => {
  describe("#get", () => {
    it("returns set value", () => {
      const model = new Model();
      const now = Date.now();
      model.set("now", now);
      expect(model.get("now")).toEqual(now);
    });
  });
});
