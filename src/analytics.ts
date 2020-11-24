export interface OpenAnalytics {
  q?: any[][];
  t: { [name: string]: Tracker };
  L: number;
  (...params: any): void;
  (fn: (oa?: OpenAnalytics) => void): void;
}

const DEFAULT_TRACKER_NAME = "t0";
const methods: { [methodName: string]: Function } = {
  create,
};

export function factory(oa: OpenAnalytics) {
  if (!oa?.q) return oa;
  const analytics: OpenAnalytics = (() => {
    function analytics(...params: any[]) {
      const headParam = params[0];
      if (typeof headParam === "function") {
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/command-queue-reference?hl=en#ready-callback
        headParam(analytics.t[DEFAULT_TRACKER_NAME]);
        return;
      } else if (typeof headParam === "string") {
        const command = parseCommand(headParam);
        if (!command?.methodName) return;
        if (!methods[command.methodName]) return;
        methods[command.methodName]?.(analytics, ...params.slice(1));
      }
    }
    analytics.t = <{ [name: string]: Tracker }>{}; // trackers
    analytics.L = Date.now(); // load time
    return analytics;
  })();
  for (const command of oa?.q || []) {
    analytics(...command);
  }
  return analytics;
}
const COMMAND_REGEX = /^(\w+\.)?(\w+\:)?(\w+)$/;
function parseCommand(command: string) {
  // https://developers.google.com/analytics/devguides/collection/analyticsjs/command-queue-reference?hl=en#parameters
  const [, trackerName, pluginName, methodName] =
    COMMAND_REGEX.exec(command) || [];
  return {
    trackerName: trackerName?.replace(".", ""),
    pluginName: pluginName?.replace(":", ""),
    methodName,
  };
}
class Tracker {
  constructor(public model: Model) {}
}
class Model {}

function create(
  oa: OpenAnalytics,
  trackingId?: string,
  cookieDomain?: string,
  name?: string,
  fieldsObject: any = {}
) {
  if (oa.t[name]) return;
  fieldsObject.trackingId = trackingId;
  fieldsObject.cookieDomain = cookieDomain;
  const model = new Model();
  oa.t[name] = new Tracker(model);
}
