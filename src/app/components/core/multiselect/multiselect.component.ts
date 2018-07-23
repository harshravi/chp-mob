import { Component, OnInit, Input, ViewChild, AfterViewInit,
     EventEmitter, Output, ElementRef, OnChanges, SimpleChange } from '@angular/core';
import { CheckBoxService } from '../../../services';

@Component({
    selector: 'app-multiselect',
    templateUrl: './multiselect.component.html',
    styleUrls: ['./multiselect.component.scss'],
    providers: [CheckBoxService]
})
export class MultiselectComponent implements AfterViewInit, OnChanges {
    @Output() selection = new EventEmitter<Object>();

    /** Inputs for the Multiselect View */
    @Input() options: any;
    @Input() multiSelectIndex: any;
    @Input() planText: any;
    @Input() updatedData;
    @Input() listData;
    @Input() defaultName;




    @ViewChild('item') private item: ElementRef;

    selected = {};
    selectedArray = [];
    obj: any;
    isCurrentItem: any = false;
    selectedValue;
    constructor(private _CheckBoxService: CheckBoxService) { }



    /** Perform the initialization after the view initializes */
    ngAfterViewInit() {

        /** Adding a Listener to the Click Event */
        this.item.nativeElement.addEventListener('click', (event) => {

            event.stopPropagation();

            /** Gather all the multiselect that have a class open attahced */
            const openMultiselects = document.querySelector('.multiselectdropdown.open');
            if (openMultiselects) {
                openMultiselects.classList.remove('open');
            }

            // Adding a local referance to the element
            const element = this.item.nativeElement;

            /**
             * Toggling the classes to open and close the list of options.
             * Here the Open Class is coming from Bootstrap and is being used
             * in order to open the dropdown and close it.
             */
            if (element.classList.contains('open')) {
                element.classList.remove('open');
            } else {
                // element.classList.remove('open');
                element.classList.add('open');
                if (openMultiselects) {
                    openMultiselects.classList.remove('open');
                }       
            }

            document.getElementsByTagName('body')[0].addEventListener('click', (e) => {
                element.classList.remove('open');
                e.stopPropagation();
            });
        });
    }

    selectedOption(data) {
        this._CheckBoxService.setCheckBoxData(data);
        this.selection.emit(data);
    }

    ngOnChanges(changes: { [propName: string]: SimpleChange }) {

        if (changes['listData'] !== undefined) {
            this.options = this.listData;
        }

        if (changes['updatedData'] !== undefined) {
            if (this.updatedData) {
                this.selectedArray = this.updatedData;
            }
        }
    }
}
