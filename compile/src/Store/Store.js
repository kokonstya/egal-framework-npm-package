"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
const StoreType_1 = require("./StoreType");
class Store extends StoreType_1.StoreType {
    constructor() {
        super();
        this.initStore();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new Store();
        }
        return this.instance;
    }
    initStore() {
        console.log('init store in store');
    }
}
exports.Store = Store;
