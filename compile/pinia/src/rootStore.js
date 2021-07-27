"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.piniaSymbol = exports.storesMap = exports.getActivePinia = exports.setActivePinia = exports.activePinia = void 0;
const vue_1 = require("vue");
/**
 * Sets or unsets the active pinia. Used in SSR and internally when calling
 * actions and getters
 *
 * @param pinia - Pinia instance
 */
const setActivePinia = (pinia) => (exports.activePinia = pinia);
exports.setActivePinia = setActivePinia;
/**
 * Get the currently active pinia
 */
const getActivePinia = () => {
    if (!exports.activePinia) {
        vue_1.warn(`[🍍]: getActivePinia was called with no active Pinia. Did you forget to install pinia?\n\n` +
            `const pinia = createPinia()\n` +
            `app.use(pinia)\n\n` +
            `This will fail in production.`);
    }
    return exports.activePinia;
};
exports.getActivePinia = getActivePinia;
/**
 * Map of stores based on a Pinia instance. Allows setting and retrieving stores
 * for the current running application (with its pinia).
 */
exports.storesMap = new WeakMap();
exports.piniaSymbol = (Symbol('pinia'));
