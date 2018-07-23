import { Component, HostListener, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { StopPropagationEmitterService } from '../../../services/EventEmitter/stop-propagation-emitter.service';


@Component({
    selector: 'app-combo-box',
    templateUrl: './combo-box.component.html',
    styleUrls: ['./combo-box.component.scss']
})
export class ComboBoxComponent implements OnInit, AfterViewInit {

    @ViewChild('tempItem') private item: ElementRef;
    @Input() optionsList: any = [];
    @Output() optionSelected = new EventEmitter();
    @Input() logType: any;

    displayName = this.getDisplayName('default');
    isDropdownOpen = false;
    propagationStoppedId: number;


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

    dropdownClick(evt) {
        this.isDropdownOpen = !this.isDropdownOpen;
        const ele = evt.srcElement || evt.target;
        if (ele.closest('.dropdown')) {
            event.stopPropagation();
            this._stopPropagationEmitterService.propagationStoppedEvent(this.propagationStoppedId);
        }
    }

    /** Perform the initialization after the view initializes */
    ngAfterViewInit() {
        this.propagationStoppedId = new Date().getTime();

        // /** Adding a Listener to the Click Event */
        // this.item.nativeElement.addEventListener('click', (event) => {

        //     // Adding a local referance to the element
        //     const element = this.item.nativeElement;

        //     // Toggling the classes to open and close the list of options.
        //     // Here the Open Class is coming from Bootstrap and is being used
        //     // in order to open the dropdown and close it.

        //     if (element.classList.contains('open')) {
        //         element.classList.remove('open');
        //     }
        //     else {
        //         element.classList.add('open');
        //     }
        // });
    }

    @HostListener('document:click', ['$event'])
    documentClick(event) {
        const ele = event.srcElement || event.target;
        if (ele.closest('.dropdown')) {
            // event.stopPropagation();
            // do nothing
        } else {
            this.isDropdownOpen = false;
        }
    }

    optionChoosed(id, itemId) {
        if (id === 1) {
            for (const obj of this.optionsList) {
                if (obj.intervention_type_cd === itemId) {
                    obj.selected_flag = true;
                    this.displayName = obj.intervention_type_desc;
                } else if (obj.outcome_type_cd === itemId) {
                    obj.selected_flag = true;
                    this.displayName = obj.outcome_type_desc;
                } else if (obj.multi_selectable === 0 || obj.multi_selectable === 1) {
                    obj.selected_flag = false;
                }
            }
        } else {
            for (const obj of this.optionsList) {
                if (obj.intervention_type_cd === itemId) {
                    this.displayName = this.getDisplayName('Intervention');
                } else if (obj.outcome_type_cd === itemId) {
                    this.displayName = this.getDisplayName('Outcome');
                } else if (obj.multi_selectable === 0) {
                    obj.selected_flag = false;
                }
            }
        }
        this.optionSelected.emit(this.optionsList);
    }

    getDisplayName(type) {
        const temp = [];
        let dName = '';
        if (typeof this.optionsList !== 'undefined') {
            this.optionsList.filter(obj => {
                if (obj.selected_flag) {
                    temp.push(obj);
                    if (obj.intervention_type_desc) {
                        (type === 'default') ? type = 'Intervention' : type = type;
                        dName = obj.intervention_type_desc;
                    } else if (obj.outcome_type_desc) {
                        (type === 'default') ? type = 'Outcome' : type = type;
                        dName = obj.outcome_type_desc;
                    }
                }
            });
        }
        (temp.length === 0) ? dName = '' : (temp.length === 1) ?
            dName = dName : (temp.length > 1) ? dName = temp.length + ' ' + type + 's' + ' ' + 'selected' : dName = '';
        return dName;
    }

    getDisabledClass(data) {
        // console.log(data);
        if (data) {
            return 'not-active';
        }
    }
}
