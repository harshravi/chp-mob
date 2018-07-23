import { Component, OnInit } from '@angular/core';
import { LibraryManagementService } from '../../../../services';


@Component({
  selector: 'app-medication',
  templateUrl: './medication.component.html',
  styleUrls: ['./medication.component.scss'],
  providers: [LibraryManagementService]
})
export class MedicationComponent implements OnInit {
  medicationData;
  rows;
  columns;

  count = 0;
  offset = 0;
  limit = 10;
  externalPaging = true;
  constructor(private LibraryManagementService: LibraryManagementService) { }

  ngOnInit() {

    this.columns = [
      { prop: 'brand_name', name: 'Brand' },
      { prop: 'active_numerator_strength', name: 'Substance Dose' },
      { prop: 'route_name', name: 'Application' },
      { prop: 'company', name: 'Company' },
      { prop: 'company_name', name: 'Custom' }
    ];

    this.getDrugs(this.offset, this.limit);
  }

  onPage(event) {
    this.offset = 0;
    const myOffset = (event.offset * this.limit) + 1;
    this.getDrugs(myOffset, this.limit);

  }

  getDrugs(offset, limit) {
    this.LibraryManagementService.getDrugsList(offset, limit).then(data => {
      if (offset === 0) {
        this.medicationData = data.drugs_list;
        this.count = data.no_of_records;
        this.rows = this.medicationData;
      } else {
        const tempData = data.drugs_list;
        for (const obj in tempData) {
          if (tempData[obj]) {
            this.medicationData.push(tempData[obj]);
            this.rows.push(tempData[obj]);
          }
        }
      }
      // this.page(this.offset,this.limit);
    });
  }

  loadMore() {
    (this.offset === 0) ? (this.offset = this.offset + 11) : (this.offset = this.offset + 10);
    this.getDrugs(this.offset, this.limit);
  }

}
