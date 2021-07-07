import {defineStore} from 'pinia'

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
                modelItems: [],
                modelMetadata: {}
            }
        },
    })
}