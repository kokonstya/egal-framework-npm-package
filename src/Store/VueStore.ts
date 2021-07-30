import {StoreType} from "./StoreType";
import {PiniaStore} from "./PiniaStore";
import {EventObserver} from "../Actions/NetworkRequests/SocketConnection/Observer";

export class VueStore extends StoreType {
    private static instance: VueStore | null;
    private modelStore:any
    private vueObserver: EventObserver = EventObserver.getInstance()
    constructor() {
        super();
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new VueStore();
        }
        return this.instance;
    }

     initStore(modelName:string) {
        let modelStoreInit = new PiniaStore(modelName)
        this.modelStore = modelStoreInit.egalStore()
    }
    commitItemsToStore(newItems: object[], actionName: string, modelName:string) {
        if(actionName === 'getItems') {
            this.modelStore.$patch({
                modelItems: newItems
            })
            this.vueObserver.broadcast(newItems, actionName, modelName)
        } else {
            this.modelStore.$patch({
                modelMetadata: newItems
            })
            this.vueObserver.broadcast(newItems, actionName, modelName)
        }

    }

    deleteFromStore(itemId: number | string) {
        this.modelStore.deleteItem(itemId)
    }

    addToStore(item: object) {
        this.modelStore.addItem(item)
    }

    resetStore() {
        this.modelStore.$reset()
    }

    getBy(propertyName: string, propertyValue: any) {
        this.modelStore.getBy(propertyName, propertyValue)
    }

}
