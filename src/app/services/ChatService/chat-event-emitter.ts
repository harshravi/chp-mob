import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';

@Injectable()
export class ChatEventEmitter extends Subject<Object>{

    constructor() {
        super();
    }
    emit(value) {
        super.next(value);
    }
}