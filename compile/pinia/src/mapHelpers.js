"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapWritableState = exports.mapActions = exports.mapGetters = exports.mapState = exports.mapStores = exports.setMapStoreSuffix = exports.mapStoreSuffix = void 0;
function getCachedStore(vm, useStore) {
    const cache = '_pStores' in vm ? vm._pStores : (vm._pStores = {});
    const id = useStore.$id;
    return (cache[id] ||
        (cache[id] = useStore(vm.$pinia)));
}
exports.mapStoreSuffix = 'Store';
/**
 * Changes the suffix added by `mapStores()`. Can be set to an empty string.
 * Defaults to `"Store"`. Make sure to extend the MapStoresCustomization
 * interface if you need are using TypeScript.
 *
 * @param suffix - new suffix
 */
function setMapStoreSuffix(suffix // could be 'Store' but that would be annoying for JS
) {
    exports.mapStoreSuffix = suffix;
}
exports.setMapStoreSuffix = setMapStoreSuffix;
/**
 * Allows using stores without the composition API (`setup()`) by generating an
 * object to be spread in the `computed` field of a component. It accepts a list
 * of store definitions.
 *
 * @example
 * ```js
 * export default {
 *   computed: {
 *     // other computed properties
 *     ...mapStores(useUserStore, useCartStore)
 *   },
 *
 *   created() {
 *     this.userStore // store with id "user"
 *     this.cartStore // store with id "cart"
 *   }
 * }
 * ```
 *
 * @param stores - list of stores to map to an object
 */
function mapStores(...stores) {
    if (__DEV__ && Array.isArray(stores[0])) {
        console.warn(`[🍍]: Directly pass all stores to "mapStores()" without putting them in an array:\n` +
            `Replace\n` +
            `\tmapStores([useAuthStore, useCartStore])\n` +
            `with\n` +
            `\tmapStores(useAuthStore, useCartStore)\n` +
            `This will fail in production if not fixed.`);
        stores = stores[0];
    }
    return stores.reduce((reduced, useStore) => {
        // @ts-ignore: $id is added by defineStore
        reduced[useStore.$id + exports.mapStoreSuffix] = function () {
            return getCachedStore(this, useStore);
        };
        return reduced;
    }, {});
}
exports.mapStores = mapStores;
/**
 * Allows using state and getters from one store without using the composition
 * API (`setup()`) by generating an object to be spread in the `computed` field
 * of a component.
 *
 * @param useStore - store to map from
 * @param keysOrMapper - array or object
 */
function mapState(useStore, keysOrMapper) {
    return Array.isArray(keysOrMapper)
        ? keysOrMapper.reduce((reduced, key) => {
            reduced[key] = function () {
                // @ts-expect-error
                return getCachedStore(this, useStore)[key];
            };
            return reduced;
        }, {})
        : Object.keys(keysOrMapper).reduce((reduced, key) => {
            reduced[key] = function () {
                const store = getCachedStore(this, useStore);
                const storeKey = keysOrMapper[key];
                // for some reason TS is unable to infer the type of storeKey to be a
                // function
                return typeof storeKey === 'function'
                    ? storeKey.call(this, store)
                    : store[storeKey];
            };
            return reduced;
        }, {});
}
exports.mapState = mapState;
/**
 * Alias for `mapState()`. You should use `mapState()` instead.
 * @deprecated use `mapState()` instead.
 */
exports.mapGetters = mapState;
/**
 * Allows directly using actions from your store without using the composition
 * API (`setup()`) by generating an object to be spread in the `methods` field
 * of a component.
 *
 * @param useStore - store to map from
 * @param keysOrMapper - array or object
 */
function mapActions(useStore, keysOrMapper) {
    return Array.isArray(keysOrMapper)
        ? keysOrMapper.reduce((reduced, key) => {
            // @ts-expect-error
            reduced[key] = function (...args) {
                // @ts-expect-error
                return getCachedStore(this, useStore)[key](...args);
            };
            return reduced;
        }, {})
        : Object.keys(keysOrMapper).reduce((reduced, key) => {
            // @ts-expect-error
            reduced[key] = function (...args) {
                // @ts-expect-error
                return getCachedStore(this, useStore)[keysOrMapper[key]](...args);
            };
            return reduced;
        }, {});
}
exports.mapActions = mapActions;
/**
 * Allows using state and getters from one store without using the composition
 * API (`setup()`) by generating an object to be spread in the `computed` field
 * of a component.
 *
 * @param useStore - store to map from
 * @param keysOrMapper - array or object
 */
function mapWritableState(useStore, keysOrMapper) {
    return Array.isArray(keysOrMapper)
        ? keysOrMapper.reduce((reduced, key) => {
            // @ts-ignore
            reduced[key] = {
                get() {
                    // @ts-expect-error
                    return getCachedStore(this, useStore)[key];
                },
                set(value) {
                    // it's easier to type it here as any
                    // @ts-expect-error
                    return (getCachedStore(this, useStore)[key] = value);
                },
            };
            return reduced;
        }, {})
        : Object.keys(keysOrMapper).reduce((reduced, key) => {
            // @ts-ignore
            reduced[key] = {
                get() {
                    // @ts-expect-error
                    return getCachedStore(this, useStore)[keysOrMapper[key]];
                },
                set(value) {
                    // it's easier to type it here as any
                    // @ts-expect-error
                    return (getCachedStore(this, useStore)[keysOrMapper[key]] =
                        value);
                },
            };
            return reduced;
        }, {});
}
exports.mapWritableState = mapWritableState;
