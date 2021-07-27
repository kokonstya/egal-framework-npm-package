"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineStore = void 0;
const vue_1 = require("vue");
const types_1 = require("./types");
const rootStore_1 = require("./rootStore");
const IS_CLIENT = false;
function innerPatch(target, patchToApply) {
    // TODO: get all keys like symbols as well
    for (const key in patchToApply) {
        const subPatch = patchToApply[key];
        const targetValue = target[key];
        if (types_1.isPlainObject(targetValue) &&
            types_1.isPlainObject(subPatch) &&
            !vue_1.isRef(subPatch) &&
            !vue_1.isReactive(subPatch)) {
            target[key] = innerPatch(targetValue, subPatch);
        }
        else {
            // @ts-ignore
            target[key] = subPatch;
        }
    }
    return target;
}
const { assign } = Object;
/**
 * Create an object of computed properties referring to
 *
 * @param rootStateRef - pinia.state
 * @param id - unique name
 */
function computedFromState(rootStateRef, id) {
    // let asComputed = computed<T>()
    const reactiveObject = {};
    const state = rootStateRef.value[id];
    for (const key in state) {
        // @ts-expect-error: the key matches
        reactiveObject[key] = vue_1.computed({
            get: () => rootStateRef.value[id][key],
            set: (value) => (rootStateRef.value[id][key] = value),
        });
    }
    return reactiveObject;
}
/**
 * Creates a store with its state object. This is meant to be augmented with getters and actions
 *
 * @param id - unique identifier of the store, like a name. eg: main, cart, user
 * @param buildState - function to build the initial state
 * @param initialState - initial state applied to the store, Must be correctly typed to infer typings
 */
function initStore($id, buildState = () => ({}), initialState) {
    const pinia = rootStore_1.getActivePinia();
    pinia.state.value[$id] = initialState || buildState();
    // const state: Ref<S> = toRef(_p.state.value, $id)
    let isListening = true;
    let subscriptions = vue_1.markRaw([]);
    let actionSubscriptions = vue_1.markRaw([]);
    let debuggerEvents;
    function $patch(partialStateOrMutator) {
        let subscriptionMutation;
        isListening = false;
        // reset the debugger events since patches are sync
        /* istanbul ignore else */
        // if (__DEV__) {
        //   debuggerEvents = []
        // }
        if (typeof partialStateOrMutator === 'function') {
            partialStateOrMutator(pinia.state.value[$id]);
            subscriptionMutation = {
                type: types_1.MutationType.patchFunction,
                storeId: $id,
                events: debuggerEvents,
            };
        }
        else {
            innerPatch(pinia.state.value[$id], partialStateOrMutator);
            subscriptionMutation = {
                type: types_1.MutationType.patchObject,
                payload: partialStateOrMutator,
                storeId: $id,
                events: debuggerEvents,
            };
        }
        isListening = true;
        // because we paused the watcher, we need to manually call the subscriptions
        subscriptions.forEach((callback) => {
            callback(subscriptionMutation, pinia.state.value[$id]);
        });
    }
    function $subscribe(callback) {
        subscriptions.push(callback);
        // watch here to link the subscription to the current active instance
        // e.g. inside the setup of a component
        const options = { deep: true, flush: 'sync' };
        /* istanbul ignore else */
        // if (__DEV__) {
        //   options.onTrigger = (event) => {
        //     if (isListening) {
        //       debuggerEvents = event
        //     } else {
        //       // let patch send all the events together later
        //       /* istanbul ignore else */
        //       if (Array.isArray(debuggerEvents)) {
        //         debuggerEvents.push(event)
        //       } else {
        //         console.error(
        //           '🍍 debuggerEvents should be an array. This is most likely an internal Pinia bug.'
        //         )
        //       }
        //     }
        //   }
        // }
        const stopWatcher = vue_1.watch(() => pinia.state.value[$id], (state, oldState) => {
            if (isListening) {
                callback({
                    storeId: $id,
                    type: types_1.MutationType.direct,
                    events: debuggerEvents,
                }, state);
            }
        }, options);
        const removeSubscription = () => {
            const idx = subscriptions.indexOf(callback);
            if (idx > -1) {
                subscriptions.splice(idx, 1);
                stopWatcher();
            }
        };
        if (vue_1.getCurrentInstance()) {
            vue_1.onUnmounted(removeSubscription);
        }
        return removeSubscription;
    }
    function $onAction(callback) {
        actionSubscriptions.push(callback);
        const removeSubscription = () => {
            const idx = actionSubscriptions.indexOf(callback);
            if (idx > -1) {
                actionSubscriptions.splice(idx, 1);
            }
        };
        if (vue_1.getCurrentInstance()) {
            vue_1.onUnmounted(removeSubscription);
        }
        return removeSubscription;
    }
    function $reset() {
        pinia.state.value[$id] = buildState();
    }
    const storeWithState = {
        $id,
        _p: pinia,
        _as: actionSubscriptions,
        // $state is added underneath
        $patch,
        $subscribe,
        $onAction,
        $reset,
    };
    const injectionSymbol = Symbol(`PiniaStore(${$id})`);
    return [
        storeWithState,
        {
            get: () => pinia.state.value[$id],
            set: (newState) => {
                isListening = false;
                pinia.state.value[$id] = newState;
                isListening = true;
            },
        },
        injectionSymbol,
    ];
}
const noop = () => { };
/**
 * Creates a store bound to the lifespan of where the function is called. This
 * means creating the store inside of a component's setup will bound it to the
 * lifespan of that component while creating it outside of a component will
 * create an ever living store
 *
 * @param partialStore - store with state returned by initStore
 * @param descriptor - descriptor to setup $state property
 * @param $id - unique name of the store
 * @param getters - getters of the store
 * @param actions - actions of the store
 */
function buildStoreToUse(partialStore, descriptor, $id, getters = {}, actions = {}, options) {
    const pinia = rootStore_1.getActivePinia();
    const computedGetters = {};
    for (const getterName in getters) {
        // @ts-ignore: it's only readonly for the users
        computedGetters[getterName] = vue_1.computed(() => {
            rootStore_1.setActivePinia(pinia);
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            // @ts-ignore
            return getters[getterName].call(store, store);
        });
    }
    const wrappedActions = {};
    for (const actionName in actions) {
        wrappedActions[actionName] = function () {
            rootStore_1.setActivePinia(pinia);
            const args = Array.from(arguments);
            const localStore = this || store;
            let afterCallback = noop;
            let onErrorCallback = noop;
            function after(callback) {
                afterCallback = callback;
            }
            function onError(callback) {
                onErrorCallback = callback;
            }
            partialStore._as.forEach((callback) => {
                // @ts-expect-error
                callback({ args, name: actionName, store: localStore, after, onError });
            });
            let ret;
            try {
                ret = actions[actionName].apply(localStore, args);
                Promise.resolve(ret).then(afterCallback).catch(onErrorCallback);
            }
            catch (error) {
                onErrorCallback(error);
                throw error;
            }
            return ret;
        };
    }
    const store = vue_1.reactive(assign({}, partialStore, 
    // using this means no new properties can be added as state
    computedFromState(pinia.state, $id), computedGetters, wrappedActions));
    // use this instead of a computed with setter to be able to create it anywhere
    // without linking the computed lifespan to wherever the store is first
    // created.
    Object.defineProperty(store, '$state', descriptor);
    // add getters for devtools
    // if (__DEV__ && IS_CLIENT) {
    //   store._getters = markRaw(Object.keys(getters))
    // }
    // apply all plugins
    pinia._p.forEach((extender) => {
        // if (__DEV__ && IS_CLIENT) {
        //   // @ts-expect-error: conflict between A and ActionsTree
        //   const extensions = extender({ store, app: pinia._a, pinia, options })
        //   Object.keys(extensions || {}).forEach((key) =>
        //     store._customProperties.add(key)
        //   )
        //   assign(store, extensions)
        // } else {
        // @ts-expect-error: conflict between A and ActionsTree
        assign(store, extender({ store, app: pinia._a, pinia, options }));
        // }
    });
    return store;
}
/**
 * Creates a `useStore` function that retrieves the store instance
 * @param options - options to define the store
 */
function defineStore(options) {
    const { id, state, getters, actions } = options;
    function useStore(pinia) {
        const currentInstance = vue_1.getCurrentInstance();
        // only run provide when pinia hasn't been manually passed
        const shouldProvide = currentInstance && !pinia;
        // avoid injecting if `useStore` when not possible
        pinia =
            // in test mode, ignore the argument provided as we can always retrieve a
            // pinia instance with getActivePinia()
            (rootStore_1.activePinia && rootStore_1.activePinia._testing ? null : pinia) ||
                (currentInstance && vue_1.inject(rootStore_1.piniaSymbol));
        if (pinia)
            rootStore_1.setActivePinia(pinia);
        // TODO: worth warning on server if no piniaKey as it can leak data
        pinia = rootStore_1.getActivePinia();
        let storeCache = rootStore_1.storesMap.get(pinia);
        if (!storeCache)
            rootStore_1.storesMap.set(pinia, (storeCache = new Map()));
        let storeAndDescriptor = storeCache.get(id);
        let store;
        if (!storeAndDescriptor) {
            storeAndDescriptor = initStore(id, state, pinia.state.value[id]);
            // @ts-expect-error: annoying to type
            storeCache.set(id, storeAndDescriptor);
            store = buildStoreToUse(storeAndDescriptor[0], storeAndDescriptor[1], id, getters, actions, options);
            // allow children to reuse this store instance to avoid creating a new
            // store for each child
            if (shouldProvide) {
                vue_1.provide(storeAndDescriptor[2], store);
            }
        }
        else {
            store =
                (currentInstance && vue_1.inject(storeAndDescriptor[2], null)) ||
                    buildStoreToUse(storeAndDescriptor[0], storeAndDescriptor[1], id, getters, actions, options);
        }
        // save stores in instances to access them devtools
        if (currentInstance && currentInstance.proxy) {
            const vm = currentInstance.proxy;
            const cache = '_pStores' in vm ? vm._pStores : (vm._pStores = {});
            // @ts-expect-error: still can't cast Store with generics to Store
            cache[store.$id] = store;
        }
        return store;
    }
    // needed by map helpers
    useStore.$id = id;
    return useStore;
}
exports.defineStore = defineStore;
