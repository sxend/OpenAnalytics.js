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
  send(_oa: OpenAnalytics, hitType: string, ...params: any[]) {
    params = params || [];
    const fieldsObject = params[params.length - 1] || {};
    fieldsObject.hitType = hitType;
    switch (hitType) {
      case "pageview":
        fieldsObject.page = params[0];
        break;
      case "event":
        fieldsObject.eventCategory = params[0];
        fieldsObject.eventAction = params[1];
        fieldsObject.eventLabel = params[2];
        fieldsObject.eventValue = params[3];
        break;
      case "social":
        fieldsObject.socialNetwork = params[0];
        fieldsObject.socialAction = params[1];
        fieldsObject.socialTarget = params[2];
        break;
      case "timing":
        fieldsObject.timingCategory = params[0];
        fieldsObject.timingVar = params[1];
        fieldsObject.timingValue = params[2];
        fieldsObject.timingLabel = params[3];
        break;
      default:
        break;
    }
    this.beacon(fieldsObject);
  }
  private beacon(_param: any): void {
    const img = document.createElement("img");
    document.body.appendChild(img);
  }
}
function objToMap(obj: any): Map<string, any> {
  const map = new Map();
  for (const key of Object.keys(obj)) {
    map.set(key, obj[key]);
  }
  return map;
}
class Model {
  private map: Map<string, any> = new Map();
  constructor(params: any) {
    this.map = objToMap(params);
    console.log(this.map);
  }
}

function create(
  oa: OpenAnalytics,
  trackingId: string,
  cookieDomain: string,
  name: string,
  endpoint: string,
  fieldsObject: any = {}
) {
  if (oa.t[name]) return;
  fieldsObject.trackingId = trackingId;
  fieldsObject.cookieDomain = cookieDomain;
  fieldsObject.endpoint = endpoint;
  const model = new Model(fieldsObject);
  oa.t[name] = new Tracker(model);
}
