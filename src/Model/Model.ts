import {ModelInterface} from './ModelInterface';
import {GetItemsAction} from '../Actions/GetItemsAction/GetItemsAction';
import {CRUDAction} from '../Actions/CRUDActions/CRUDAction';
import {CustomAction} from "../Actions/CustomAction/CustomAction";
import {GetModelMetadataAction} from '../Actions/GetMetadataAction/GetModelMetadataAction';
import {DataFormatter} from './DataFormatter';
import {MetaDataInterface} from './MetaDataInterface';
import {EventObserver} from '../Actions/NetworkRequests/SocketConnection/Observer';
import {GlobalVariables} from '../GlobalVariables';
import {RoutingKeyParams} from "../Actions/Interfaces/RoutingKeyParams";
import {StoreCreator} from "../Store/StoreCreator";
import {ModelConnection} from "./ModelConnection";

const observer:EventObserver = EventObserver.getInstance();

export class Model implements ModelInterface {
    modelName: string;
    username: string;
    password: string;
    microserviceName: string;
    connectionType: string;
    private modelMetaData!: MetaDataInterface;
    private readonly modelItems: (string | object)[];
    private modelActionList: string[];
    private readonly modelValidationRules: object;
    private modelActionsMetaData: object;
    private actionResponse: string | object;
    private databaseFields: string[];
    private fieldsWithTypes: object[];
    private allModelsMetadata: string | object;
    private tokenUst: boolean;
    private tokenUmt: boolean;
    private storeCreator: any

    constructor(modelName: string, username: string, password: string, microserviceName: string, connectionType: string) {
        this.modelName = modelName;
        this.username = username;
        this.password = password;
        this.microserviceName = microserviceName;
        this.connectionType = connectionType
        this.modelItems = [];
        this.modelActionList = [];
        this.modelValidationRules = {};
        this.modelActionsMetaData = {};
        this.actionResponse = [];
        this.databaseFields = [];
        this.fieldsWithTypes = [];
        this.allModelsMetadata = {};
        this.tokenUst = false;
        this.tokenUmt = false;
        this.createStore()
        this.initModelObserver()
    }

    /**
     * Function that inits model observer to commit items to store
     */

    initModelObserver() {
        observer.subscribe(this.modelName, (data:any, actionName:string) => {
            switch(actionName) {
                case 'getItems':
                case 'getMetadata':
                    this.commitToStore(data, actionName)
                    break
                case 'create':
                case 'update':
                case 'delete':
                case 'createMany':
                case 'updateMany':
                case 'deleteMany':
                case 'createManyRaw':
                case 'updateManyRaw':
                case 'deleteManyRaw':
                    this.actionGetItems(this.microserviceName, this.connectionType)
                    break
                default:
                    console.log('default')
                    break
            }
        })
    }

    /**
     * function that inits a store for a chosen model
     */

    createStore() {
        this.storeCreator = new StoreCreator().createStore()
        this.storeCreator.initStore(this.modelName)
    }

    /**
     * Function commits items received from 'actionGetItems' to model's store
     * @param data
     */

    commitToStore(data:any, actionName: string){
        this.storeCreator.commitItemsToStore(data, actionName, this.modelName)
    }

    /**
     * Function that allows to receive items from store based on some parameter
     * @param propertyName
     * @param propertyValue
     */

    getItemFromStoreBy(propertyName:string, propertyValue:any) {
        this.storeCreator.getBy(propertyName, propertyValue)
    }

    /**
     * Function that allows to add item to store, but not to database
     * @param item
     */

    addItemToStore(item: object) {
        this.storeCreator.addToStore(item)
    }

    /**
     * Function that allows to delete item from store, but not from database
     * @param itemId
     */

    deleteItemFromStore(itemId: number | string) {
        this.storeCreator.deleteFromStore(itemId)
    }

    /**
     * Function that allows to clear store
     */
    resetStore() {
        this.storeCreator.resetStore()
    }

    /**
     * Action for receiving model metadata
     * @param microserviceName
     * @param connectionType
     */
    actionGetMetadata(microserviceName: string, connectionType: string) {
        const initializeGetMetadataRequest = new GetModelMetadataAction(
            this.username,
            this.password,
            microserviceName,
            'getMetadata',
            this.modelName
        );
        new ModelConnection().createConnection(connectionType, initializeGetMetadataRequest)
    }

    /**
     * Action for receiving model items with various params
     * @param microserviceName
     * @param connectionType
     * @param withs
     * @param filter
     * @param orders
     * @param page
     * @param perPage
     */
    actionGetItems(
        microserviceName: string,
        connectionType: string,
        perPage?: number,
        page?: number,
        filter?: (string | object)[] | undefined,
        withs?: string | string[],
        orders?: string[][]
    ) {
        console.log('action get items')
        const initializeGetItems = new GetItemsAction(this.username, this.password, microserviceName, this.modelName, 'getItems');
        initializeGetItems.actionParameters.with(withs)
        initializeGetItems.actionParameters.filters(filter);
        initializeGetItems.actionParameters.orders(orders);
        if (perPage !== undefined && page !== undefined) {
            initializeGetItems.actionParameters.setPagination(perPage, page);
        }
        new ModelConnection().createConnection(connectionType, initializeGetItems)
    }

    /**
     * Action for receiving a single item based on its id
     * @param microserviceName
     * @param connectionType
     * @param id
     * @param withs
     * @param filter
     * @param orders
     */
    actionGetItem(
        microserviceName: string,
        connectionType: string,
        id: string,
        filter?: (string | object)[] | undefined,
        withs?: [],
        orders?: string[][]
    ) {
        const initializeGetItem = new GetItemsAction(this.username, this.password, microserviceName, this.modelName, 'getItem');
        initializeGetItem.actionParameters.with(withs);
        initializeGetItem.actionParameters.filters(filter);
        initializeGetItem.actionParameters.orders(orders);
        initializeGetItem.actionParameters.setId(id);
        new ModelConnection().createConnection(connectionType, initializeGetItem)
    }

    /**
     * Action for updating an item
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */
    actionUpdate(
        microserviceName: string,
        connectionType: string,
        actionParams: object
    ) {
        const initializeActionUpdate = new CRUDAction(
            this.username,
            this.password,
            microserviceName,
            this.modelName,
            'update',
            actionParams
        );
        new ModelConnection().createConnection(connectionType, initializeActionUpdate)
    }

    /**
     * Action for updating several items
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */

    actionUpdateMany(
        microserviceName: string,
        connectionType: string,
        actionParams: object
    ) {
        const initializeActionUpdateMany = new CRUDAction(
            this.username,
            this.password,
            microserviceName,
            this.modelName,
            'updateMany',
            actionParams
        );
        new ModelConnection().createConnection(connectionType, initializeActionUpdateMany)
    }

    /**
     * Action for updating several items based on user params
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */
    actionUpdateManyWithFilter(
        microserviceName: string,
        connectionType: string,
        actionParams: object
    ) {
        const initializeActionUpdateManyWithFilter = new CRUDAction(
            this.username,
            this.password,
            microserviceName,
            this.modelName,
            'updateManyRaw',
            actionParams
        );
        new ModelConnection().createConnection(connectionType, initializeActionUpdateManyWithFilter)
    }

    /**
     * Action for item creation
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     * @param channelParameters
     */
    actionCreate(
        microserviceName: string,
        connectionType: string,
        actionParams: object,
        channelParameters?: RoutingKeyParams
    ) {
        const initializeActionCreate = new CRUDAction(
            this.username,
            this.password,
            microserviceName,
            this.modelName,
            'create',
            actionParams,
            channelParameters
        );
        new ModelConnection().createConnection(connectionType, initializeActionCreate)
    }

    /**
     * Action for creating several items
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */

    actionCreateMany(
        microserviceName: string,
        connectionType: string,
        actionParams: object
    ) {
        const initializeActionCreateMany = new CRUDAction(
            this.username,
            this.password,
            microserviceName,
            this.modelName,
            'createMany',
            actionParams
        );
        new ModelConnection().createConnection(connectionType, initializeActionCreateMany)
    }

    /**
     * Action for deleting an item
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */
    actionDelete(
        microserviceName: string,
        connectionType: string,
        actionParams: string[]
    ) {
        const initializeActionDelete = new CRUDAction(
            this.username,
            this.password,
            microserviceName,
            this.modelName,
            'delete',
            actionParams
        );
        new ModelConnection().createConnection(connectionType, initializeActionDelete)
    }

    /**
     * Action for deleting several items
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */

    actionDeleteMany(
        microserviceName: string,
        connectionType: string,
        actionParams: string[]
    ) {
        const initializeActionDeleteMany = new CRUDAction(
            this.username,
            this.password,
            microserviceName,
            this.modelName,
            'deleteMany',
            actionParams
        );
        new ModelConnection().createConnection(connectionType, initializeActionDeleteMany)
    }

    /**
     * Action for deleting several items based on user params
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */
    actionDeleteManyWithFilter(
        microserviceName: string,
        connectionType: string,
        actionParams: object
    ) {
        const initializeActionDeleteManyWithFilter = new CRUDAction(
            this.username,
            this.password,
            microserviceName,
            this.modelName,
            'deleteManyRaw',
            actionParams
        );
        new ModelConnection().createConnection(connectionType, initializeActionDeleteManyWithFilter)
    }

    /**
     * Action that can be used for custom endpoints
     * @param microserviceName
     * @param actionName
     * @param connectionType
     * @param actionParams
     */

    actionCustom(
        microserviceName: string,
        actionName: string,
        connectionType: string,
        actionParams?: object
    ) {
        const initializeActionCustom = new CustomAction(
            this.username,
            this.password,
            microserviceName,
            this.modelName,
            actionName,
            actionParams
        );
        new ModelConnection().createConnection(connectionType, initializeActionCustom)
    }

    /**
     * Function that allows to receive only certain fields.
     *
     * @param fields - a list of fields 'dataToFilter' that needs to be filtered by
     * @param filterType - 'include' will return the list of fields from param 'fields', 'exclude' will return all the fields but those from 'fields' param.
     * @param dataToFilter - a list of items that needs to be filtered by field
     */

    getSpecificFields(fields: string[], filterType: string, dataToFilter: object[]) {
        if (filterType === 'includes') return new DataFormatter(fields, dataToFilter).include();
        return new DataFormatter(fields, dataToFilter).exclude();
    }

    /**
     * Function that allows to receive model items from store (if store is not empty)
     */
    getItems() {
        return this.modelItems;
    }

    /**
     * Function that allows to receive model metadata from store (if store is not empty)
     */
    getAllModelsMetadata() {
        return this.allModelsMetadata;
    }

    /**
     * Function for setting base url to start working with model
     * @param URL
     * @param connectionType
     */

    setBaseUrl(URL: string, connectionType: string) {
        if (connectionType === 'socket') GlobalVariables.socketBaseUrl = URL;
        GlobalVariables.httpBaseUrl = URL;
    }

    /**
     * Function allows to call disconnect on current socket connection
     */

    socketDisconnect() {
        observer.broadcastSocketDisconnect('disconnect')
    }

}
