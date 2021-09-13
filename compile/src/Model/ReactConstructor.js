"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactConstructor = void 0;
const Model_1 = require("./Model");
const Observer_1 = require("../Actions/NetworkRequests/SocketConnection/Observer");
class ReactConstructor extends Model_1.Model {
    constructor(modelParams) {
        super(modelParams.modelName, modelParams.userName, modelParams.password, modelParams.environment);
        this.egalObserver = Observer_1.EventObserver.getInstance();
        this.modelName = modelParams.modelName;
        this.userName = modelParams.userName;
        this.password = modelParams.password;
        this.listenerFunction = modelParams.listenerFunction;
        this.environment = modelParams.environment;
        this.url = modelParams.url;
        this.connectionType = modelParams.connectionType;
        this.egalModel = new Model_1.Model(this.modelName, this.userName, this.password, this.environment);
        this.initModel();
    }
    initModel() {
        this.egalModel.setEnvironment(this.environment);
        this.egalModel.setBaseUrl(this.url, this.connectionType);
        return this.egalModel;
    }
    initModelObserver() {
        console.log(this.modelName, 'modelName from initModelObserver');
        this.egalObserver.subscribe(this.modelName, (data, actionName, modelName, actionMessage) => {
            console.log('initModelObserver');
            const receivedData = [data[0], actionName, modelName, actionMessage];
            this.listenerFunction(receivedData);
        });
    }
}
exports.ReactConstructor = ReactConstructor;
