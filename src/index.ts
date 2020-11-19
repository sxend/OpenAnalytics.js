import { factory } from "./analytics";

(function (global) {
  const OpenAnalyticsObject = global.OpenAnalyticsObject || "oa";
  global[OpenAnalyticsObject] = factory(OpenAnalyticsObject);
})((0, eval)("this"));
