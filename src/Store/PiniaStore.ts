import {createPinia} from '../../pinia/src/createPinia'
import {defineStore} from '../../pinia/src/store'
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
                    modelItems: [],
                    modelMetadata: []
                }
            },
            getters: {
                getReceivedItems(state) {
                    // @ts-ignore
                    return state.modelItems
                },
                getModelMetadata(state) {
                    // @ts-ignore
                    return state.modelMetadata
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
                },
                deleteItem(itemId:string|number) {
                    // @ts-ignore
                    this.modelItems = this.modelItems.filter(item => item.id !== itemId)
                    console.log(this.modelItems, 'model items pinia')
                },
                addItem(item: object) {
                    // @ts-ignore
                    this.modelItems.push(item)
                    console.log(this.modelItems, 'add store item')
                },
                getItems(object:object) {
                    console.log(object, 'pinia get items')
                }
            }
        })
    }
}
