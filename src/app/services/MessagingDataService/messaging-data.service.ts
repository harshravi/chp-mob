import { Injectable } from '@angular/core';

@Injectable()
export class MessagingDataService {

  listOfAllContactsGlobal: any;
  tigerTextClient: any;
  tigerTextConversation= [];
  constructor() { }

  getListOfData() {
    return this.listOfAllContactsGlobal;
  }

  setListOfData(list) {
    this.listOfAllContactsGlobal = list;
  }

  getTigerTextClient() {
    return this.tigerTextClient;
  }
  setTigerTextClient(client) {
    this.tigerTextClient = client;
  }

  getTigerTextConversation() {
    return this.tigerTextConversation;
  }

  setTigerTextConversation(conversation) {
    this.tigerTextConversation.push(conversation);
  }
}
