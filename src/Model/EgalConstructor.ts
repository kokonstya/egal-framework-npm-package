import {Model} from "./Model";
import {EventObserver} from "../Actions/NetworkRequests/SocketConnection/Observer";


export class EgalConstructor extends Model {
    private readonly egalModel: Model
    private egalObserver: EventObserver = EventObserver.getInstance()
    modelName: string
    userName: string
    password: string
    microserviceName:string
    url: string
    connectionType: string

    constructor(modelParams: { modelName: string, userName: string, password: string, url: string, connectionType: string, microserviceName: string }) {
        super(modelParams.modelName, modelParams.userName, modelParams.password, modelParams.microserviceName, modelParams.connectionType)
        this.modelName = modelParams.modelName
        this.userName = modelParams.userName
        this.password = modelParams.password
        this.microserviceName = modelParams.microserviceName
        this.url = modelParams.url
        this.connectionType = modelParams.connectionType
        this.egalModel = new Model(this.modelName, this.userName, this.password, this.microserviceName, this.connectionType)
        this.initModel()
    }

    initModel() {
        this.egalModel.setBaseUrl(this.url, this.connectionType)
        return this.egalModel
    }

    initModelObserver() {
        return new Promise((resolve, reject) => {
            this.egalObserver.subscribe(this.modelName, (data: any, actionName: string, modelName: string) => {
                console.log('constructor log')
                let receivedData
                if (actionName !== 'error') {
                    receivedData = [data[0], actionName, modelName]
                    resolve(receivedData)
                } else {
                    receivedData = [data[0], actionName, modelName]
                    reject(receivedData)
                }
            })
        })
    }
}
