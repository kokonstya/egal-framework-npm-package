"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VueStore = void 0;
const StoreType_1 = require("./StoreType");
class VueStore extends StoreType_1.StoreType {
    constructor() {
        super();
        this.initStore();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new VueStore();
        }
        return this.instance;
    }
    initStore() {
        console.log('init store in vue store');
    }
}
exports.VueStore = VueStore;
