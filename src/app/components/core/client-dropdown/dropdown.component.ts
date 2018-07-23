import {
    Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, Output,
    EventEmitter, OnChanges, SimpleChange, OnDestroy, HostListener
} from '@angular/core';

import { StopPropagationEmitterService } from '../../../services/EventEmitter/stop-propagation-emitter.service';

@Component({
    selector: 'app-client-dropdown',
    templateUrl: './dropdown.component.html',
    styleUrls: ['./dropdown.component.scss']
})
export class ClientDropDownComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
    @ViewChild('item') private item: ElementRef;

    @Input() listItems;
    @Input() options;

    @Output() slectedOption = new EventEmitter();

    propagationStoppedId: number;
    isDropdownOpen: boolean;

    constructor(private _stopPropagationEmitterService: StopPropagationEmitterService) {
        this._stopPropagationEmitterService = (<any>window).stopPropagationEmitterService;
        this._stopPropagationEmitterService.propagationStoppedObservable.subscribe(subPropagationStoppedId => {

            if (subPropagationStoppedId !== this.propagationStoppedId) {
                this.isDropdownOpen = false;
            }
        });
    }

    ngOnInit() {
    }

    /** Perform the initialization after the view initializes */
    ngAfterViewInit() {

        this.propagationStoppedId = new Date().getTime();

    }

    clicked(list) {
        this.slectedOption.emit(list);
    }

    dropdownClick(evt) {
        this.isDropdownOpen = !this.isDropdownOpen;
        const ele = evt.srcElement || evt.target;
        if (ele.parentElement.closest('.dropdown')) {
             event.stopPropagation();
            this._stopPropagationEmitterService.propagationStoppedEvent(this.propagationStoppedId);
        }
    }

    ngOnChanges(changes: { [propName: string]: SimpleChange }) {
        if (changes['options'] !== undefined) {
            this.listItems = changes['options'].currentValue;
        }
    }

    getClassForList(list) {
        switch (list) {
            case 'Enable': return 'green';
            case 'Disable': return 'red';
            case 'Invited': return 'text-warning';
        }
    }

    @HostListener('document:click', ['$event'])
    documentClick(event) {
        const ele = event.srcElement || event.target;
        if (ele.closest('.dropdown')) {
            // event.stopPropagation();

        } else {
            this.isDropdownOpen = false;
        }
    }

    ngOnDestroy() {
        this.item.nativeElement.removeEventListener();
        this.item.nativeElement.lastElementChild.removeEventListener();
    }
}
