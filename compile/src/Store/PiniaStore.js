"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PiniaStore = void 0;
// @ts-ignore
const vue_1 = require("vue");
const pinia_1 = require("pinia");
const pinia = pinia_1.createPinia();
class PiniaStore {
    constructor(storeId) {
        this.egalStore = pinia_1.defineStore({
            // @ts-ignore
            id: this.storeId,
            state() {
                return {
                    modelItems: ['hui'],
                    modelMetadata: {}
                };
            },
            getters: {
                getReceivedItems() {
                    return this.modelItems;
                },
                getModelMetadata() {
                    return this.modelMetadata;
                }
            },
            actions: {
                getItems() { }
            }
        });
        this.storeId = storeId;
    }
}
exports.PiniaStore = PiniaStore;
const app = vue_1.createApp(PiniaStore);
app.use(pinia);
