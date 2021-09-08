"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EgalAuthConstructor = void 0;
const AuthAction_1 = require("../Auth/AuthAction");
class EgalAuthConstructor extends AuthAction_1.AuthAction {
    constructor(authParams, environment) {
        super(authParams.userName, authParams.password, authParams.modelName, authParams.connectionType, environment);
        this.egalAuth = new AuthAction_1.AuthAction(authParams.userName, authParams.password, authParams.modelName, authParams.connectionType, environment);
        this.url = authParams.url;
        this.initAuthAction();
    }
    initAuthAction() {
        this.egalAuth.setBaseURL(this.url);
        return this.egalAuth;
    }
}
exports.EgalAuthConstructor = EgalAuthConstructor;
