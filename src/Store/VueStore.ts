import {StoreType} from "./StoreType";

export class VueStore extends StoreType {
    private static instance: VueStore | null;
    constructor() {
        super();
        this.initStore()
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new VueStore();
        }
        return this.instance;
    }
    public initStore() {
        console.log('init store in vue store')
    }
}