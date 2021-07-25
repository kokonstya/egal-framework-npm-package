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
    commitItemsToStore(newItems) {
        console.log(newItems, 'commit to store vue store');
        this.modelStore.$patch({
            modelItems: newItems
        });
    }
    deleteFromStore(itemId) {
        this.modelStore.deleteItem(itemId);
    }
    addToStore(item) {
        this.modelStore.addItem();
    }
    resetStore() {
        this.modelStore.$reset();
    }
    getBy(propertyName, propertyValue) {
        this.modelStore.getBy(propertyName, propertyValue);
    }
}
exports.VueStore = VueStore;
