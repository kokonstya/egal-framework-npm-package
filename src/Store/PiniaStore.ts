import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
import {defineStore, createPinia, PiniaPlugin} from 'pinia'
const pinia:any = createPinia()
Vue.use(VueCompositionApi)
Vue.use(PiniaPlugin)
Vue.use(pinia)


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
        actions: {
            getItems() {}
        }
    })
}