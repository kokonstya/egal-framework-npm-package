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
        this.modelStore = modelStoreInit.egalStore
        console.log('init store in vue store')
    }

    refreshStore(){
        this.modelStore.$state = {}
    }

}