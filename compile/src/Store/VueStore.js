"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VueStore = void 0;
const StoreType_1 = require("./StoreType");
const PiniaStore_1 = require("./PiniaStore");
const vue_1 = require("vue");
const vue_2 = __importDefault(require("vue"));
const pinia_1 = require("pinia");
const pinia = pinia_1.createPinia();
// @ts-ignore
const app = vue_1.createApp(App);
// @ts-ignore
app.use(vue_2.default);
app.use(pinia);
class VueStore extends StoreType_1.StoreType {
    constructor() {
        super();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new VueStore();
        }
        return this.instance;
    }
    initStore(modelName) {
        let modelStoreInit = new PiniaStore_1.PiniaStore(modelName);
        this.modelStore = modelStoreInit.egalStore;
        console.log('init store in vue store', this.modelStore.modelItems);
    }
    refreshStore() {
        this.modelStore.$state = {};
    }
}
exports.VueStore = VueStore;
