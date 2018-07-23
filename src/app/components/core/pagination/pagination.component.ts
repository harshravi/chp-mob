import { Component, Input, Output, OnInit, OnChanges, SimpleChange } from '@angular/core';

@Component({
    selector: 'vh-pagination',
    templateUrl: './pagination.component.html'
})

export class VHPagination implements OnInit, OnChanges {

    // Inputs and Outputs
    @Input() count: number;
    @Output() selectedPage;
    @Input() limit: number;

    // component variables
    selected = 1;
    selectedList;

    constructor() { }

    ngOnInit() {
    }

    ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    }

    getPageList() {
        const tempArray = [];
        if (this.count % this.limit === 0) {
        } else {
            console.log(this.count % this.limit);
        }
        for (const i = this.selected; tempArray.length <= 5; i + 1) {

        }
    }

}
