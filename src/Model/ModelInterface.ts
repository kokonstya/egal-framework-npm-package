import {RoutingKeyParams} from "../Actions/Interfaces/RoutingKeyParams";

export interface ModelInterface {
  actionGetMetadata(microserviceName: string, actionName: string, connectionType: string): void;

  actionGetItem(
    microserviceName: string,
    connectionType: string,
    id: string,
    filter?: (string | object)[] | undefined,
    orders?: object[]
  ): void;

  actionGetItems(
    microserviceName: string,
    connectionType: string,
    perPage?: number,
    page?: number,
    filter?: (string | object)[] | undefined,
    withs?: string | string [] | undefined,
    orders?: object[]
  ): void;

  actionCreate(
    microserviceName: string,
    connectionType: string,
    actionParams?: any,
    channelParameters?: RoutingKeyParams | undefined
  ): void;

  actionUpdate(
    microserviceName: string,
    connectionType: string,
    actionParams?: any
  ): void;

  actionDelete(
    microserviceName: string,
    connectionType: string,
    actionParams?: any
  ): void;

  actionCreateMany(
      microserviceName: string,
      connectionType: string,
      actionParams?: any,
      channelParameters?: RoutingKeyParams | undefined
  ): void;

  actionUpdateMany(
      microserviceName: string,
      connectionType: string,
      actionParams?: any
  ): void;

  actionDeleteMany(
      microserviceName: string,
      connectionType: string,
      actionParams?: any
  ): void;

  actionCustom(
      microserviceName: string,
      actionName: string,
      connectionType: string,
      actionParams?: object
  ):void;

  actionUpdateManyWithFilter(
    microserviceName: string,
    connectionType: string,
    actionParams: object
  ): void;

  actionDeleteManyWithFilter(
    microserviceName: string,
    connectionType: string,
    actionParams: object
  ): void;

  getSpecificFields(
    fields: string[],
    filterType: string,
    dataToFilter: string | object | object[]
  ): void;

  setBaseUrl(URL: string, connectionType: string): void;
  getItemFromStoreBy(propertyName:string, propertyValue:any):void
  addItemToStore(item: object):void;
  deleteItemFromStore(itemId: number | string):void;
  resetStore():void;
}
