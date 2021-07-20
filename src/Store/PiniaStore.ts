import {createPinia, defineStore} from 'pinia'
import {GetItemsAction} from "../Actions/GetItemsAction/GetItemsAction";
import {ModelConnection} from "../Model/ModelConnection";
import {createApp} from "vue";
export class PiniaStore {
    storeId: string
    egalStore: any
    app = createApp(PiniaStore)
    pinia = createPinia()
    constructor(storeId: string) {
        this.app.use(this.pinia)
        this.storeId = storeId
        this.egalStore = defineStore({
            // @ts-ignore
            id: this.storeId,
            state() {
                return {
                    modelItems: ['hhh'],
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
                // getItems(object:object) {
                //     console.log(object, 'pinia get items')
                // }
                getItems(username:string, password:string, microserviceName:string, modelName:string, actionName:string,
                         connectionType:string,
                         perPage?:number, page?:number,
                         filter?: (string | object)[] | undefined,
                         withs?: string | string[],
                         orders?: string[][]) {
                    console.log('get items pinia')
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
}
