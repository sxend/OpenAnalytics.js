export function factory(oa: any) {
  if (!oa.q) return oa;
  function analytics(...params: any[]) {
    console.log(...params);
  }
  for (const command of oa.q) {
    analytics(...command);
  }
  return analytics;
}
