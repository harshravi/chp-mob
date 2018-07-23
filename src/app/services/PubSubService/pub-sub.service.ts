import { Injectable } from '@angular/core';
import { ChatEventEmitter } from '../ChatService';
@Injectable()
export class PubSubService {

  Stream: ChatEventEmitter;
  constructor() {
    this.Stream = new ChatEventEmitter();
  }

}
