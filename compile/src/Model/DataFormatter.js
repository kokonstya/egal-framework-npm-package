"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataFormatter = void 0;
class DataFormatter {
    constructor(receivedData, allItems) {
        this.receivedData = receivedData;
        this.formattedData = [];
        this.allItems = allItems.items;
    }
    include() {
        for (const i in this.allItems) {
            this.formattedData.push(Object.fromEntries(Object.entries(this.allItems[i]).filter(([key, val]) => this.receivedData.includes(key))));
        }
        return this.formattedData;
    }
    exclude() {
        for (const i in this.allItems) {
            this.formattedData.push(Object.fromEntries(Object.entries(this.allItems[i]).filter(([key, val]) => !this.receivedData.includes(key))));
        }
        return this.formattedData;
    }
}
exports.DataFormatter = DataFormatter;
