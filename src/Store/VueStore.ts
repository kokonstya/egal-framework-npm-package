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

    public initStore(modelName:string) {
        let modelStoreInit = new PiniaStore(modelName)
        this.modelStore = modelStoreInit.egalStore()
        console.log('init store in vue store', this.modelStore.modelItems )
    }

    // getItems(username:string, password:string, microserviceName:string, modelName:string, actionName:string,
    //          connectionType:string,
    //          perPage?:number, page?:number,
    //          filter?: (string | object)[] | undefined,
    //          withs?: string | string[],
    //          orders?: string[][]){
    //     this.modelStore.getItems(username, password, microserviceName, modelName, actionName,
    //         connectionType,
    //         perPage, page,
    //         filter,
    //         withs,
    //         orders)
    //     console.log('get items')
    // }

    deleteItemFromStore() {
        this.modelStore.deleteStoreItem()
    }

    addItemToStore() {
        this.modelStore.addStoreItem()
    }

    resetStore() {
        this.modelStore.$reset()
    }

    getBy(propertyName: string, propertyValue: any) {
        this.modelStore.getBy(propertyName, propertyValue)
    }


}
