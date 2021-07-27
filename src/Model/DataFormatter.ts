export class DataFormatter {
  receivedData: string[];
  formattedData: object[];
  allItems: object[];

  constructor(receivedData: string[], allItems: object[]) {
    this.receivedData = receivedData;
    this.formattedData = [];
    this.allItems = (allItems as any).items;
  }
  include() {
    for (const i in this.allItems) {
      this.formattedData.push(
        Object.fromEntries(
          Object.entries(this.allItems[i]).filter(([key, val]) => this.receivedData.includes(key))
        )
      );
    }
    return this.formattedData;
  }
  exclude() {
    for (const i in this.allItems) {
      this.formattedData.push(
        Object.fromEntries(
          Object.entries(this.allItems[i]).filter(([key, val]) => !this.receivedData.includes(key))
        )
      );
    }
    return this.formattedData;
  }
}
