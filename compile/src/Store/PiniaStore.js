"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PiniaStore = void 0;
const createPinia_1 = require("../../pinia/src/createPinia");
const store_1 = require("../../pinia/src/store");
const vue_1 = require("vue");
const Observer_1 = require("../Actions/NetworkRequests/SocketConnection/Observer");
class PiniaStore {
    constructor(storeId) {
        this.app = vue_1.createApp(PiniaStore);
        this.pinia = createPinia_1.createPinia();
        this.piniaObserver = Observer_1.EventObserver.getInstance();
        this.app.use(this.pinia);
        this.storeId = storeId;
        this.egalStore = store_1.defineStore({
            // @ts-ignore
            id: this.storeId,
            state() {
                return {
                    modelItems: [],
                    modelMetadata: []
                };
            },
            getters: {
                getReceivedItems(state) {
                    // @ts-ignore
                    return state.modelItems;
                },
                getModelMetadata(state) {
                    // @ts-ignore
                    return state.modelMetadata;
                },
            },
            actions: {
                // @ts-ignore
                getBy(propertyName, propertyValue) {
                    let filteredItem = this.modelItems.filter((item) => {
                        console.log(item, propertyName, propertyValue);
                        // @ts-ignore
                        return item[propertyName] === propertyValue;
                    });
                    console.log(filteredItem);
                },
                deleteItem(itemId) {
                    // @ts-ignore
                    this.modelItems = this.modelItems.filter(item => item.id !== itemId);
                    console.log(this.modelItems, 'model items pinia');
                },
                addItem(item) {
                    // @ts-ignore
                    this.modelItems.push(item);
                    console.log(this.modelItems, 'add store item');
                },
                getItems(object) {
                    console.log(object, 'pinia get items');
                }
            }
        });
    }
}
exports.PiniaStore = PiniaStore;
