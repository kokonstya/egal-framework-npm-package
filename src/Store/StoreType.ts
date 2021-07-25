export abstract class StoreType {
    static getInstance = (): void => {};
    abstract initStore(modelName:string):void
}