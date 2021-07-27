"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPinia = void 0;
const rootStore_1 = require("./rootStore");
const vue_1 = require("vue");
// import { devtoolsPlugin } from './devtools'
// import { IS_CLIENT } from './env'
/**
 * Creates a Pinia instance to be used by the application
 */
function createPinia() {
    // NOTE: here we could check the window object for a state and directly set it
    // if there is anything like it with Vue 3 SSR
    const state = vue_1.ref({});
    let localApp;
    let _p = [];
    // plugins added before calling app.use(pinia)
    const toBeInstalled = [];
    const pinia = vue_1.markRaw({
        install(app) {
            pinia._a = localApp = app;
            app.provide(rootStore_1.piniaSymbol, pinia);
            app.config.globalProperties.$pinia = pinia;
            // if (IS_CLIENT) {
            // this allows calling useStore() outside of a component setup after
            // installing pinia's plugin
            rootStore_1.setActivePinia(pinia);
            // }
            toBeInstalled.forEach((plugin) => _p.push(plugin));
        },
        use(plugin) {
            if (!localApp) {
                toBeInstalled.push(plugin);
            }
            else {
                _p.push(plugin);
            }
            return this;
        },
        _p,
        // it's actually undefined here
        _a: localApp,
        state,
    });
    // pinia devtools rely on dev only features so they cannot be forced unless
    // the dev build of Vue is used
    // if (__DEV__ && IS_CLIENT) {
    //   pinia.use(devtoolsPlugin)
    // }
    return pinia;
}
exports.createPinia = createPinia;
