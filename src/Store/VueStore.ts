import {StoreType} from "./StoreType";
import {PiniaStore} from "./PiniaStore";
import { createApp } from 'vue'
import CompositionApi from 'vue'
import {defineStore, createPinia} from 'pinia'
const pinia = createPinia()
// @ts-ignore
const app = createApp(App)
// @ts-ignore
app.use(CompositionApi)
app.use(pinia)

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
        console.log('init store in vue store', this.modelStore.modelItems)
    }

    refreshStore(){
        this.modelStore.$state = {}
    }

}
