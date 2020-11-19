export function factory(oa: any) {
  if (!oa.q) return oa;
  function analytics(..._params: any[]) {}
  analytics.L = Date.now();
  for (const command of oa.q) {
    analytics(...command);
  }
  return analytics;
}
