"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VueStore = void 0;
const StoreType_1 = require("./StoreType");
const PiniaStore_1 = require("./PiniaStore");
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
        this.modelStore = modelStoreInit.egalStore();
        console.log('init store in vue store', this.modelStore.modelItems);
    }
    getItems(username, password, microserviceName, modelName, actionName, connectionType, perPage, page, filter, withs, orders) {
        this.modelStore.getItems(username, password, microserviceName, modelName, actionName, connectionType, perPage, page, filter, withs, orders);
        console.log('get items');
    }
    refreshStore() {
        this.modelStore.$state = {};
    }
}
exports.VueStore = VueStore;
