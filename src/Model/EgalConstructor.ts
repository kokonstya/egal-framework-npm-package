import {Model} from "./Model";
import {EventObserver} from "../Actions/NetworkRequests/SocketConnection/Observer";


export class EgalConstructor extends Model {
  private readonly egalModel: Model
  private egalObserver: EventObserver = EventObserver.getInstance()
  modelName: string
  userName: string
  password: string
  environment: string
  private readonly url: string
  private readonly connectionType: string

  constructor(modelParams: { modelName: string, userName: string, password: string, url: string, connectionType: string, tokenName: string, environment: string }) {
    super(modelParams.modelName, modelParams.userName, modelParams.password, modelParams.environment)
    this.modelName = modelParams.modelName
    this.userName = modelParams.userName
    this.password = modelParams.password
    this.url = modelParams.url
    this.environment = modelParams.environment
    this.connectionType = modelParams.connectionType
    this.egalModel = new Model(this.modelName, this.userName, this.password, this.environment)
    this.initModel()
  }

  initModel() {
    this.egalModel.setBaseUrl(this.url, this.connectionType)
    return this.egalModel
  }

  initModelObserver() {
    return new Promise((resolve, reject) => {
      this.egalObserver.subscribe(this.modelName, (data: any, actionName: string, modelName: string, actionMessage: object) => {
        let receivedData
        if (actionName !== 'error') {
          receivedData = [data[0], actionName, modelName, actionMessage]
          resolve(receivedData)
        } else {
          receivedData = [data[0], actionName, modelName, actionMessage]
          reject(receivedData)
        }
      })
    })
  }
}
