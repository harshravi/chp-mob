import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-libraries',
  templateUrl: './libraries.component.html',
  styleUrls: ['./libraries.component.scss']
})
export class LibrariesComponent implements OnInit {

  categoryData: Object;

  constructor() { }

  ngOnInit() {
    this.categoryData = [
      {
        name: 'Roles',
        options: ['View List', 'Add Role'],
        enabled: true
      },
      {
        name: 'Medications',
        options: ['View List', 'Add Medication'],
        enabled: true
      },
      {
        name: 'Devices',
        options: [],
        enabled: false
      },
      {
        name: 'Languages',
        options: [],
        enabled: false
      },
      {
        name: 'Care Plan',
        options: [],
        enabled: false
      },
      {
        name: 'Vitals',
        options: [],
        enabled: false
      },
      {
        name: 'Assessments',
        options: [],
        enabled: false
      },
      {
        name: 'Documents',
        options: [],
        enabled: false
      }
    ];
  }

}
