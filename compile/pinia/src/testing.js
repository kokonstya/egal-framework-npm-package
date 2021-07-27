"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestingPinia = void 0;
const vue_1 = require("vue");
const createPinia_1 = require("./createPinia");
const rootStore_1 = require("./rootStore");
/**
 * Creates a pinia instance designed for unit tests that **requires mocking**
 * the stores. By default, **all actions are mocked** and therefore not
 * executed. This allows you to unit test your store and components separately.
 * You can change this with the `stubActions` option. If you are using jest,
 * they are replaced with `jest.fn()`, otherwise, you must provide your own
 * `createSpy` option.
 *
 * @param options - options to configure the testing pinia
 * @returns a augmented pinia instance
 */
function createTestingPinia({ plugins = [], stubActions = true, stubPatch = false, fakeApp = false, createSpy, } = {}) {
    const pinia = createPinia_1.createPinia();
    plugins.forEach((plugin) => pinia.use(plugin));
    // @ts-ignore
    createSpy = createSpy || (typeof jest !== undefined && jest.fn);
    if (!createSpy) {
        throw new Error('You must configure the `createSpy` option.');
    }
    // Cache of all actions to share them across all stores
    const spiedActions = new Map();
    pinia.use(({ store, options }) => {
        if (!spiedActions.has(options.id)) {
            spiedActions.set(options.id, {});
        }
        const actionsCache = spiedActions.get(options.id);
        Object.keys(options.actions || {}).forEach((action) => {
            actionsCache[action] =
                actionsCache[action] ||
                    (stubActions
                        ? createSpy()
                        : // @ts-expect-error:
                            createSpy(store[action]));
            // @ts-expect-error:
            store[action] = actionsCache[action];
        });
        store.$patch = stubPatch ? createSpy() : createSpy(store.$patch);
    });
    if (fakeApp) {
        const app = vue_1.createApp({});
        app.use(pinia);
    }
    pinia._testing = true;
    rootStore_1.setActivePinia(pinia);
    return Object.assign({
        resetSpyCache() {
            spiedActions.clear();
        },
        get app() {
            return this._a;
        },
    }, pinia);
}
exports.createTestingPinia = createTestingPinia;
