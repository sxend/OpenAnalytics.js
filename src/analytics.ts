const DEFAULT_TRACKER_NAME = "t0";
export function factory(oa: any) {
  if (!oa?.q) return oa;
  function analytics(...params: any[]) {
    const headParam = params[0];
    if (typeof headParam === "function") {
      // https://developers.google.com/analytics/devguides/collection/analyticsjs/command-queue-reference?hl=en#ready-callback
      headParam(analytics.t[DEFAULT_TRACKER_NAME]);
      return;
    } else if (typeof headParam === "string") {
      const command = parseCommand(headParam);
      console.log(command);
    }
  }
  analytics.t = <any>{}; // trackers
  analytics.L = Date.now(); // load time
  for (const command of oa?.q || []) {
    analytics(...command);
  }
  return analytics;
}
const COMMAND_REGEX = /^(\w+.)?(\w+:)?(\w+)$/;
function parseCommand(command: string) {
  // https://developers.google.com/analytics/devguides/collection/analyticsjs/command-queue-reference?hl=en#parameters
  const [ok, trackerName, pluginName, methodName] =
    COMMAND_REGEX.exec(command) || [];
  if (!ok) return {};
  return {
    trackerName,
    pluginName,
    methodName,
  };
}
