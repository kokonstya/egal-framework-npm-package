"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PiniaStore = void 0;
const pinia_1 = require("pinia");
class PiniaStore {
    constructor(storeId) {
        this.egalStore = pinia_1.defineStore({
            // @ts-ignore
            id: this.storeId,
            state() {
                return {
                    modelItems: [],
                    modelMetadata: {}
                };
            },
        });
        this.storeId = storeId;
    }
}
exports.PiniaStore = PiniaStore;
