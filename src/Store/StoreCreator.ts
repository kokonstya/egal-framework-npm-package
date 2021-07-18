// @ts-ignore
// import * as process from "process";
import {VueStore} from "./VueStore";
import {Store} from "./Store";

export class StoreCreator {
    public createStore() {
        // let projectFramework = process.env.VUE_APP_ENV
        let projectFramework = 'vue'
        switch (projectFramework) {
            case 'vue':
                const vueStore:VueStore = VueStore.getInstance()
                return vueStore;
            case 'react':
                return  new Store();
            default:
                return 'Unknown project environment!';
        }
    }

}