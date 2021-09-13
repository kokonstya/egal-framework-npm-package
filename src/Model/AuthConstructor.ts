import {AuthAction} from '../Auth/AuthAction'

export class EgalAuthConstructor extends AuthAction {
    egalAuth: AuthAction;
    url: string;
    environment: string;
    constructor(authParams: { modelName: string, userName: string, password: string, url: string, connectionType: string, environment: string}) {
        super(authParams.userName, authParams.password, authParams.modelName, authParams.connectionType, authParams.environment)
        this.egalAuth = new AuthAction(authParams.userName, authParams.password, authParams.modelName, authParams.connectionType, authParams.environment)
        this.url = authParams.url
        this.environment = authParams.environment
        this.initAuthAction()
    }
    initAuthAction(){
        this.egalAuth.setEnvironment(this.environment);
        this.egalAuth.setBaseURL(this.url)
        return this.egalAuth
    }
}
