export class Model {
  private collection: any = {};
  constructor() {}
  get(key: string): any {
    return this.collection[key];
  }
  set(key: string, value: any): void {
    this.collection[key] = value;
  }
}
