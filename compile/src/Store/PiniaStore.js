"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PiniaStore = void 0;
const pinia_1 = require("pinia");
const vue_1 = require("vue");
const Observer_1 = require("../Actions/NetworkRequests/SocketConnection/Observer");
class PiniaStore {
    constructor(storeId) {
        this.app = vue_1.createApp(PiniaStore);
        this.pinia = pinia_1.createPinia();
        this.piniaObserver = Observer_1.EventObserver.getInstance();
        this.app.use(this.pinia);
        this.storeId = storeId;
        this.egalStore = pinia_1.defineStore({
            // @ts-ignore
            id: this.storeId,
            state() {
                return {
                    modelItems: [
                        {
                            id: 1,
                            name: 'name1'
                        },
                        {
                            id: 2,
                            name: 'name2'
                        }
                    ],
                    modelMetadata: {}
                };
            },
            getters: {
                getReceivedItems() {
                    return this.modelItems;
                },
                getModelMetadata() {
                    return this.modelMetadata;
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
                }
                // deleteItem() {
                //     this.modelItems = []
                //     console.log(this.modelItems, 'model items pinia')
                // },
                // addItem() {
                //     this.modelItems.push({id: 3, name: 'name3'})
                //     console.log(this.modelItems, 'add store item')
                // }
                // getItems(object:object) {
                //     console.log(object, 'pinia get items')
                // }
                // getItems(username:string, password:string, microserviceName:string, modelName:string, actionName:string,
                //          connectionType:string,
                //          perPage?:number, page?:number,
                //          filter?: (string | object)[] | undefined,
                //          withs?: string | string[],
                //          orders?: string[][]) {
                //     console.log('get items pinia')
                //     const initializeGetItems = new GetItemsAction(username, password, microserviceName, modelName, actionName);
                //     initializeGetItems.actionParameters.with(withs)
                //     initializeGetItems.actionParameters.filters(filter);
                //     initializeGetItems.actionParameters.orders(orders);
                //     if (perPage !== undefined && page !== undefined) {
                //         initializeGetItems.actionParameters.setPagination(perPage, page);
                //     }
                //     new ModelConnection().createConnection(connectionType, initializeGetItems)
                // }
            }
        });
    }
    getDataFromObserver() {
        this.piniaObserver.subscribe(this.storeId, (data, actionName, modelName) => {
            console.log(data, 'data from pinia observer');
        });
    }
}
exports.PiniaStore = PiniaStore;
