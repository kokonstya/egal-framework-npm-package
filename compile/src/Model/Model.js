"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
const GetItemsAction_1 = require("../Actions/GetItemsAction/GetItemsAction");
const CRUDAction_1 = require("../Actions/CRUDActions/CRUDAction");
const CustomAction_1 = require("../Actions/CustomAction/CustomAction");
const GetModelMetadataAction_1 = require("../Actions/GetMetadataAction/GetModelMetadataAction");
const DataFormatter_1 = require("./DataFormatter");
const Observer_1 = require("../Actions/NetworkRequests/SocketConnection/Observer");
const GlobalVariables_1 = require("../GlobalVariables");
const StoreCreator_1 = require("../Store/StoreCreator");
const ModelConnection_1 = require("./ModelConnection");
const observer = Observer_1.EventObserver.getInstance();
class Model {
    constructor(modelName, username, password, microserviceName, connectionType) {
        this.modelName = modelName;
        this.username = username;
        this.password = password;
        this.microserviceName = microserviceName;
        this.connectionType = connectionType;
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
        this.createStore();
        this.initObserver();
    }
    /**
     * Function that inits model observer to commit items to store
     */
    initObserver() {
        observer.subscribe(this.modelName, (data, actionName) => {
            switch (actionName) {
                case 'getItems':
                case 'getMetadata':
                    this.commitToStore(data, actionName);
                    break;
                case 'create':
                case 'update':
                case 'delete':
                case 'createMany':
                case 'updateMany':
                case 'deleteMany':
                case 'createManyRaw':
                case 'updateManyRaw':
                case 'deleteManyRaw':
                    this.actionGetItems(this.microserviceName, this.connectionType);
                    break;
                default:
                    console.log('default');
                    break;
            }
        });
    }
    /**
     * function that inits a store for a chosen model
     */
    createStore() {
        this.storeCreator = new StoreCreator_1.StoreCreator().createStore();
        this.storeCreator.initStore(this.modelName);
    }
    /**
     * Function commits items received from 'actionGetItems' to model's store
     * @param data
     */
    commitToStore(data, actionName) {
        this.storeCreator.commitItemsToStore(data, actionName, this.modelName);
    }
    /**
     * Function that allows to receive items from store based on some parameter
     * @param propertyName
     * @param propertyValue
     */
    getItemFromStoreBy(propertyName, propertyValue) {
        this.storeCreator.getBy(propertyName, propertyValue);
    }
    /**
     * Function that allows to add item to store, but not to database
     * @param item
     */
    addItemToStore(item) {
        this.storeCreator.addToStore(item);
    }
    /**
     * Function that allows to delete item from store, but not from database
     * @param itemId
     */
    deleteItemFromStore(itemId) {
        this.storeCreator.deleteFromStore(itemId);
    }
    /**
     * Function that allows to clear store
     */
    resetStore() {
        this.storeCreator.resetStore();
    }
    /**
     * Action for receiving model metadata
     * @param microserviceName
     * @param connectionType
     */
    actionGetMetadata(microserviceName, connectionType) {
        const initializeGetMetadataRequest = new GetModelMetadataAction_1.GetModelMetadataAction(this.username, this.password, microserviceName, 'getMetadata', this.modelName);
        new ModelConnection_1.ModelConnection().createConnection(connectionType, initializeGetMetadataRequest);
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
    actionGetItems(microserviceName, connectionType, perPage, page, filter, withs, orders) {
        console.log('action get items');
        const initializeGetItems = new GetItemsAction_1.GetItemsAction(this.username, this.password, microserviceName, this.modelName, 'getItems');
        initializeGetItems.actionParameters.with(withs);
        initializeGetItems.actionParameters.filters(filter);
        initializeGetItems.actionParameters.orders(orders);
        if (perPage !== undefined && page !== undefined) {
            initializeGetItems.actionParameters.setPagination(perPage, page);
        }
        new ModelConnection_1.ModelConnection().createConnection(connectionType, initializeGetItems);
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
    actionGetItem(microserviceName, connectionType, id, filter, withs, orders) {
        const initializeGetItem = new GetItemsAction_1.GetItemsAction(this.username, this.password, microserviceName, this.modelName, 'getItem');
        initializeGetItem.actionParameters.with(withs);
        initializeGetItem.actionParameters.filters(filter);
        initializeGetItem.actionParameters.orders(orders);
        initializeGetItem.actionParameters.setId(id);
        new ModelConnection_1.ModelConnection().createConnection(connectionType, initializeGetItem);
    }
    /**
     * Action for updating an item
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */
    actionUpdate(microserviceName, connectionType, actionParams) {
        const initializeActionUpdate = new CRUDAction_1.CRUDAction(this.username, this.password, microserviceName, this.modelName, 'update', actionParams);
        new ModelConnection_1.ModelConnection().createConnection(connectionType, initializeActionUpdate);
    }
    /**
     * Action for updating several items
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */
    actionUpdateMany(microserviceName, connectionType, actionParams) {
        const initializeActionUpdateMany = new CRUDAction_1.CRUDAction(this.username, this.password, microserviceName, this.modelName, 'updateMany', actionParams);
        new ModelConnection_1.ModelConnection().createConnection(connectionType, initializeActionUpdateMany);
    }
    /**
     * Action for updating several items based on user params
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */
    actionUpdateManyWithFilter(microserviceName, connectionType, actionParams) {
        const initializeActionUpdateManyWithFilter = new CRUDAction_1.CRUDAction(this.username, this.password, microserviceName, this.modelName, 'updateManyRaw', actionParams);
        new ModelConnection_1.ModelConnection().createConnection(connectionType, initializeActionUpdateManyWithFilter);
    }
    /**
     * Action for item creation
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     * @param channelParameters
     */
    actionCreate(microserviceName, connectionType, actionParams, channelParameters) {
        const initializeActionCreate = new CRUDAction_1.CRUDAction(this.username, this.password, microserviceName, this.modelName, 'create', actionParams, channelParameters);
        new ModelConnection_1.ModelConnection().createConnection(connectionType, initializeActionCreate);
    }
    /**
     * Action for creating several items
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */
    actionCreateMany(microserviceName, connectionType, actionParams) {
        const initializeActionCreateMany = new CRUDAction_1.CRUDAction(this.username, this.password, microserviceName, this.modelName, 'createMany', actionParams);
        new ModelConnection_1.ModelConnection().createConnection(connectionType, initializeActionCreateMany);
    }
    /**
     * Action for deleting an item
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */
    actionDelete(microserviceName, connectionType, actionParams) {
        const initializeActionDelete = new CRUDAction_1.CRUDAction(this.username, this.password, microserviceName, this.modelName, 'delete', actionParams);
        new ModelConnection_1.ModelConnection().createConnection(connectionType, initializeActionDelete);
    }
    /**
     * Action for deleting several items
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */
    actionDeleteMany(microserviceName, connectionType, actionParams) {
        const initializeActionDeleteMany = new CRUDAction_1.CRUDAction(this.username, this.password, microserviceName, this.modelName, 'deleteMany', actionParams);
        new ModelConnection_1.ModelConnection().createConnection(connectionType, initializeActionDeleteMany);
    }
    /**
     * Action for deleting several items based on user params
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */
    actionDeleteManyWithFilter(microserviceName, connectionType, actionParams) {
        const initializeActionDeleteManyWithFilter = new CRUDAction_1.CRUDAction(this.username, this.password, microserviceName, this.modelName, 'deleteManyRaw', actionParams);
        new ModelConnection_1.ModelConnection().createConnection(connectionType, initializeActionDeleteManyWithFilter);
    }
    /**
     * Action that can be used for custom endpoints
     * @param microserviceName
     * @param actionName
     * @param connectionType
     * @param actionParams
     */
    actionCustom(microserviceName, actionName, connectionType, actionParams) {
        const initializeActionCustom = new CustomAction_1.CustomAction(this.username, this.password, microserviceName, this.modelName, actionName, actionParams);
        new ModelConnection_1.ModelConnection().createConnection(connectionType, initializeActionCustom);
    }
    /**
     * Function that allows to receive only certain fields.
     *
     * @param fields - a list of fields 'dataToFilter' that needs to be filtered by
     * @param filterType - 'include' will return the list of fields from param 'fields', 'exclude' will return all the fields but those from 'fields' param.
     * @param dataToFilter - a list of items that needs to be filtered by field
     */
    getSpecificFields(fields, filterType, dataToFilter) {
        if (filterType === 'includes')
            return new DataFormatter_1.DataFormatter(fields, dataToFilter).include();
        return new DataFormatter_1.DataFormatter(fields, dataToFilter).exclude();
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
    setBaseUrl(URL, connectionType) {
        if (connectionType === 'socket')
            GlobalVariables_1.GlobalVariables.socketBaseUrl = URL;
        GlobalVariables_1.GlobalVariables.httpBaseUrl = URL;
    }
    /**
     * Function allows to call disconnect on current socket connection
     */
    socketDisconnect() {
        observer.broadcastSocketDisconnect('disconnect');
    }
}
exports.Model = Model;
