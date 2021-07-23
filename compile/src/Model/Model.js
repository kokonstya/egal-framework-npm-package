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
    constructor(modelName, username, password) {
        this.modelName = modelName;
        this.username = username;
        this.password = password;
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
        // this.setObserver();
    }
    createStore() {
        this.storeCreator = new StoreCreator_1.StoreCreator().createStore();
        this.storeCreator.initStore(this.modelName);
    }
    /**
     * инициализация обзервера, в зависимости от экшена инициализируется нужное событие
     */
    deleteItemFromStore(propertyName, propertyValue) {
        this.storeCreator.getBy(propertyName, propertyValue);
    }
    /**
     * Получение метаданных модели
     * @param microserviceName
     * @param connectionType
     */
    actionGetMetadata(microserviceName, connectionType) {
        const initializeGetMetadataRequest = new GetModelMetadataAction_1.GetModelMetadataAction(this.username, this.password, microserviceName, 'getMetadata', this.modelName);
        new ModelConnection_1.ModelConnection().createConnection(connectionType, initializeGetMetadataRequest);
        // Model.setConnectionType(connectionType, initializeGetMetadataRequest);
    }
    /**
     * Получение данных модели с возможными параметрами, юзер передает все данные вместе, но в экшен их нужно передавать отдельно
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
        // this.storeCreator.getItems(this.username, this.password, microserviceName, this.modelName, 'getItems', connectionType,
        //     perPage, page, filter, withs, orders)
        const initializeGetItems = new GetItemsAction_1.GetItemsAction(this.username, this.password, microserviceName, this.modelName, 'getItems');
        initializeGetItems.actionParameters.with(withs);
        initializeGetItems.actionParameters.filters(filter);
        initializeGetItems.actionParameters.orders(orders);
        if (perPage !== undefined && page !== undefined) {
            initializeGetItems.actionParameters.setPagination(perPage, page);
        }
        new ModelConnection_1.ModelConnection().createConnection(connectionType, initializeGetItems);
        // Model.setConnectionType(connectionType, initializeGetItems);
    }
    /**
     * Отличается от getItems тем, что отдельно должен быть передан айди нужной записи
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
        // Model.setConnectionType(connectionType, initializeGetItem);
    }
    /**
     * Экшен обновления записи
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */
    actionUpdate(microserviceName, connectionType, actionParams) {
        const initializeActionUpdate = new CRUDAction_1.CRUDAction(this.username, this.password, microserviceName, this.modelName, 'update', actionParams);
        new ModelConnection_1.ModelConnection().createConnection(connectionType, initializeActionUpdate);
        // Model.setConnectionType(connectionType, initializeActionUpdate);
    }
    /**
     *
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */
    actionUpdateMany(microserviceName, connectionType, actionParams) {
        const initializeActionUpdateMany = new CRUDAction_1.CRUDAction(this.username, this.password, microserviceName, this.modelName, 'updateMany', actionParams);
        new ModelConnection_1.ModelConnection().createConnection(connectionType, initializeActionUpdateMany);
        // Model.setConnectionType(connectionType, initializeActionUpdate);
    }
    /**
     * Экшен обновляет записи, соответствующие заданным фильтрам
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */
    actionUpdateManyWithFilter(microserviceName, connectionType, actionParams) {
        const initializeActionUpdateManyWithFilter = new CRUDAction_1.CRUDAction(this.username, this.password, microserviceName, this.modelName, 'updateManyRaw', actionParams);
        new ModelConnection_1.ModelConnection().createConnection(connectionType, initializeActionUpdateManyWithFilter);
        // Model.setConnectionType(connectionType, initializeActionUpdateManyWithFilter);
    }
    /**
     * Экшен создания записи
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     * @param channelParameters
     */
    actionCreate(microserviceName, connectionType, actionParams, channelParameters) {
        const initializeActionCreate = new CRUDAction_1.CRUDAction(this.username, this.password, microserviceName, this.modelName, 'create', actionParams, channelParameters);
        new ModelConnection_1.ModelConnection().createConnection(connectionType, initializeActionCreate);
        // Model.setConnectionType(connectionType, initializeActionCreate);
    }
    /**
     *
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */
    actionCreateMany(microserviceName, connectionType, actionParams) {
        const initializeActionCreateMany = new CRUDAction_1.CRUDAction(this.username, this.password, microserviceName, this.modelName, 'createMany', actionParams);
        new ModelConnection_1.ModelConnection().createConnection(connectionType, initializeActionCreateMany);
        // Model.setConnectionType(connectionType, initializeActionCreate);
    }
    /**
     * Экшен удаления записи
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */
    actionDelete(microserviceName, connectionType, actionParams) {
        const initializeActionDelete = new CRUDAction_1.CRUDAction(this.username, this.password, microserviceName, this.modelName, 'delete', actionParams);
        new ModelConnection_1.ModelConnection().createConnection(connectionType, initializeActionDelete);
        // Model.setConnectionType(connectionType, initializeActionDelete);
    }
    /**
     *
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */
    actionDeleteMany(microserviceName, connectionType, actionParams) {
        const initializeActionDeleteMany = new CRUDAction_1.CRUDAction(this.username, this.password, microserviceName, this.modelName, 'deleteMany', actionParams);
        new ModelConnection_1.ModelConnection().createConnection(connectionType, initializeActionDeleteMany);
        // Model.setConnectionType(connectionType, initializeActionDelete);
    }
    /**
     * Экшен удаляет записи, соответствующие заданным фильтрам
     * @param microserviceName
     * @param connectionType
     * @param actionParams
     */
    actionDeleteManyWithFilter(microserviceName, connectionType, actionParams) {
        const initializeActionDeleteManyWithFilter = new CRUDAction_1.CRUDAction(this.username, this.password, microserviceName, this.modelName, 'deleteManyRaw', actionParams);
        new ModelConnection_1.ModelConnection().createConnection(connectionType, initializeActionDeleteManyWithFilter);
        // Model.setConnectionType(connectionType, initializeActionDeleteManyWithFilter);
    }
    /**
     *
     * @param microserviceName
     * @param actionName
     * @param connectionType
     * @param actionParams
     */
    actionCustom(microserviceName, actionName, connectionType, actionParams) {
        const initializeActionCustom = new CustomAction_1.CustomAction(this.username, this.password, microserviceName, this.modelName, actionName, actionParams);
        new ModelConnection_1.ModelConnection().createConnection(connectionType, initializeActionCustom);
        // Model.setConnectionType(connectionType, initializeActionCustom);
    }
    /**
     *   позволяет получить метадату текущей модели
     */
    getModelMetadata() {
        return this.modelMetaData;
    }
    /**
     * позволяет получить список доступных модели экшенов (получается с бэка в составе метадаты)
     */
    getModelActionList() {
        this.modelActionList = Object.keys(this.modelMetaData.actions_metadata);
        return this.modelActionList;
    }
    /**
     *  позволяет получить правила валидации для всех доступных филдов
     */
    getModelValidationRules() {
        return this.modelValidationRules;
    }
    /**
     *  позволяет получить расширинную информацию по каждому экшену
     */
    getModelActionsMetaData() {
        this.modelActionsMetaData = this.modelMetaData.actions_metadata;
        return this.modelActionsMetaData;
    }
    /**
     *  позволяет получить филды с типом base
     */
    getModelDataBaseFields() {
        this.databaseFields = this.modelMetaData.database_fields;
        return this.databaseFields;
    }
    /**
     *  позволяет получить филды с указанными типами
     */
    getModelFieldsWithTypes() {
        this.fieldsWithTypes = this.modelMetaData.fields_with_types;
        return this.fieldsWithTypes;
    }
    /**
     * позволяет получить отфильтрованные список айтемов.
     * в функцию передается массив с названиями филдов от пользователя (fields), массив всех айтемов,
     * которые нужно отфильтровать (dataToFilter) и указание типа фильтрации (filterType): includes возвращаяет только филды,
     * указанные в массиве, excludes исключает филды, указанные в массиве
     *
     * @param fields
     * @param filterType
     * @param dataToFilter
     */
    getSpecificFields(fields, filterType, dataToFilter) {
        if (filterType === 'includes')
            return new DataFormatter_1.DataFormatter(fields, dataToFilter).include();
        return new DataFormatter_1.DataFormatter(fields, dataToFilter).exclude();
    }
    /**
     * позволяет получить уже запрошенные айтемы модели
     */
    getItems() {
        return this.modelItems;
    }
    /**
     * позволяет получить уже запрошенную метадату всех моделей приложения
     */
    getAllModelsMetadata() {
        return this.allModelsMetadata;
    }
    /**
     * Функция используется для установки основного домена при начале работы с моделью
     * @param URL
     * @param connectionType
     */
    setBaseUrl(URL, connectionType) {
        if (connectionType === 'socket')
            GlobalVariables_1.GlobalVariables.socketBaseUrl = URL;
        GlobalVariables_1.GlobalVariables.httpBaseUrl = URL;
    }
    socketDisconnect() {
        observer.broadcastSocketDisconnect('disconnect');
    }
}
exports.Model = Model;
