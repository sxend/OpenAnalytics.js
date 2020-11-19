export function factory(oa: any) {
  function analytics(...params: any[]) {
    console.log(...params);
  }
  if (oa.q) {
    for (const command of oa.q) {
      analytics(...command);
    }
  }
  return analytics;
}
