"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PiniaStore = void 0;
const vue_1 = __importDefault(require("vue"));
const composition_api_1 = __importDefault(require("@vue/composition-api"));
const pinia_1 = require("pinia");
vue_1.default.use(composition_api_1.default);
vue_1.default.use(pinia_1.PiniaPlugin);
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
            actions: {
                getItems() { }
            }
        });
        this.storeId = storeId;
    }
}
exports.PiniaStore = PiniaStore;
