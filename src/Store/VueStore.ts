import {StoreType} from "./StoreType";
import {PiniaStore} from "./PiniaStore";

export class VueStore extends StoreType {
    private static instance: VueStore | null;
    private modelStore:any
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
        console.log('init store in vue store', this.modelStore.modelItems )
    }
    commitItemsToStore(newItems: object[]) {
        console.log(newItems, 'commit to store vue store')
        this.modelStore.$patch({
            modelItems: newItems
        })
    }

    deleteFromStore(itemId: number | string) {
        this.modelStore.deleteItem(itemId)
    }

    addToStore(item: object) {
        this.modelStore.addItem()
    }

    resetStore() {
        this.modelStore.$reset()
    }

    getBy(propertyName: string, propertyValue: any) {
        this.modelStore.getBy(propertyName, propertyValue)
    }


}
