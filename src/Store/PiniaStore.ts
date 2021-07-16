// @ts-ignore
import { createApp } from 'vue'
import {defineStore, createPinia} from 'pinia'
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
            getItems() {}
        }
    })
}

const app = createApp(PiniaStore)

app.use(pinia)