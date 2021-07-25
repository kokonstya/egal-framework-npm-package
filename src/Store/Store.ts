import {StoreType} from "./StoreType";

export class Store extends StoreType {
    private static instance: Store | null;
    constructor() {
        super();
        this.initStore()
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new Store();
        }
        return this.instance;
    }

    initStore() {
        console.log('init store in store')
    }
}