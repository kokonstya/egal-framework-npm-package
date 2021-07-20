"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PiniaStore = void 0;
const pinia_1 = require("pinia");
const GetItemsAction_1 = require("../Actions/GetItemsAction/GetItemsAction");
const ModelConnection_1 = require("../Model/ModelConnection");
const vue_1 = require("vue");
class PiniaStore {
    constructor(storeId) {
        this.app = vue_1.createApp(PiniaStore);
        this.pinia = pinia_1.createPinia();
        this.app.use(this.pinia);
        this.storeId = storeId;
        this.egalStore = pinia_1.defineStore({
            // @ts-ignore
            id: this.storeId,
            state() {
                return {
                    modelItems: ['hhh'],
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
                // getItems(object:object) {
                //     console.log(object, 'pinia get items')
                // }
                getItems(username, password, microserviceName, modelName, actionName, connectionType, perPage, page, filter, withs, orders) {
                    console.log('get items pinia');
                    const initializeGetItems = new GetItemsAction_1.GetItemsAction(username, password, microserviceName, modelName, actionName);
                    initializeGetItems.actionParameters.with(withs);
                    initializeGetItems.actionParameters.filters(filter);
                    initializeGetItems.actionParameters.orders(orders);
                    if (perPage !== undefined && page !== undefined) {
                        initializeGetItems.actionParameters.setPagination(perPage, page);
                    }
                    new ModelConnection_1.ModelConnection().createConnection(connectionType, initializeGetItems);
                }
            }
        });
    }
}
exports.PiniaStore = PiniaStore;
