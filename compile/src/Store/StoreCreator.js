"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreCreator = void 0;
// @ts-ignore
// import * as process from "process";
const VueStore_1 = require("./VueStore");
const Store_1 = require("./Store");
class StoreCreator {
    createStore() {
        // let projectFramework = process.env.VUE_APP_ENV
        let projectFramework = 'vue';
        switch (projectFramework) {
            case 'vue':
                const vueStore = VueStore_1.VueStore.getInstance();
                return vueStore;
            case 'react':
                return new Store_1.Store();
            default:
                return 'Unknown project environment!';
        }
    }
}
exports.StoreCreator = StoreCreator;
