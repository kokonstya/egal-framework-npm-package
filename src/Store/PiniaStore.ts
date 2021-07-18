// @ts-ignore
import { createApp } from 'vue'
import {defineStore, createPinia} from 'pinia'
import {GetItemsAction} from "../Actions/GetItemsAction/GetItemsAction";
import {ModelConnection} from "../Model/ModelConnection";
const pinia:any = createPinia()
export class PiniaStore {
    storeId: string
    constructor(storeId: string) {
        this.storeId = storeId
    }

    egalStore = defineStore({
        // @ts-ignore
        id: this.storeId,
        state() {
            return {
                modelItems: ['hui'],
                modelMetadata: {}
            }
        },
        getters: {
            getReceivedItems():any[] {
                return this.modelItems
            },
            getModelMetadata():any {
                return this.modelMetadata
            }
        },
        actions: {
            getItems(username:string, password:string, microserviceName:string, modelName:string, actionName:string,
                     connectionType:string,
                     perPage?:number, page?:number,
                     filter?: (string | object)[] | undefined,
                     withs?: string | string[],
                     orders?: string[][]) {
                const initializeGetItems = new GetItemsAction(username, password, microserviceName, modelName, actionName);
                initializeGetItems.actionParameters.with(withs)
                initializeGetItems.actionParameters.filters(filter);
                initializeGetItems.actionParameters.orders(orders);
                if (perPage !== undefined && page !== undefined) {
                    initializeGetItems.actionParameters.setPagination(perPage, page);
                }
                new ModelConnection().createConnection(connectionType, initializeGetItems)
            }
        }
    })
}

const app = createApp(PiniaStore)

app.use(pinia)