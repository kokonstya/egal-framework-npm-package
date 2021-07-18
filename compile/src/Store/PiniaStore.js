"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PiniaStore = void 0;
// @ts-ignore
const vue_1 = require("vue");
const pinia_1 = require("pinia");
const GetItemsAction_1 = require("../Actions/GetItemsAction/GetItemsAction");
const ModelConnection_1 = require("../Model/ModelConnection");
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
                getItems(username, password, microserviceName, modelName, actionName, connectionType, perPage, page, filter, withs, orders) {
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
        this.storeId = storeId;
    }
}
exports.PiniaStore = PiniaStore;
const app = vue_1.createApp(PiniaStore);
app.use(pinia);
