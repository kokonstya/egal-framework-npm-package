import {createPinia, defineStore} from 'pinia'
import {GetItemsAction} from "../Actions/GetItemsAction/GetItemsAction";
import {ModelConnection} from "../Model/ModelConnection";
import {createApp} from "vue";
import {EventObserver} from "../Actions/NetworkRequests/SocketConnection/Observer";
export class PiniaStore {
    storeId: string
    egalStore: any
    app = createApp(PiniaStore)
    pinia = createPinia()
    private piniaObserver: EventObserver = EventObserver.getInstance()
    constructor(storeId: string) {
        this.app.use(this.pinia)
        this.storeId = storeId
        this.egalStore = defineStore({
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
                }
            },
            getters: {
                getReceivedItems():any[] {
                    return this.modelItems
                },
                getModelMetadata():any {
                    return this.modelMetadata
                },

            },
            actions: {
                // @ts-ignore
                getBy(propertyName:string, propertyValue:any) {
                    let filteredItem = this.modelItems.filter((item:object) => {
                        console.log(item, propertyName, propertyValue)
                        // @ts-ignore
                        return item[propertyName] === propertyValue
                    })
                    console.log(filteredItem)
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
        })
    }
    getDataFromObserver(){
        this.piniaObserver.subscribe(this.storeId, (data:any, actionName:string, modelName:string) => {
            console.log(data, 'data from pinia observer')
        })
    }
}
