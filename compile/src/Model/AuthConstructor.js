"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EgalAuthConstructor = void 0;
const AuthAction_1 = require("../Auth/AuthAction");
class EgalAuthConstructor extends AuthAction_1.AuthAction {
    constructor(authParams) {
        super(authParams.userName, authParams.password, authParams.modelName, authParams.connectionType, authParams.environment);
        this.egalAuth = new AuthAction_1.AuthAction(authParams.userName, authParams.password, authParams.modelName, authParams.connectionType, authParams.environment);
        this.url = authParams.url;
        this.environment = authParams.environment;
        this.initAuthAction();
    }
    initAuthAction() {
        this.egalAuth.setEnvironment(this.environment);
        this.egalAuth.setBaseURL(this.url);
        return this.egalAuth;
    }
}
exports.EgalAuthConstructor = EgalAuthConstructor;
