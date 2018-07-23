import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
/** Imports for the Modal to be involked on Button Click */
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { CustomAddRoleModalContext, AddRoleModalComponent } from '../../global-modal/add-role';

@Component({
  selector: 'global-libraries',
  templateUrl: './global.component.html',
  styleUrls: ['./global.component.scss']
})
export class GlobalLibrariesComponent implements OnInit {
  categoryData: Object;
  constructor(private router: Router, private _modal: Modal) { }

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

  selectedList(event) {
    this.performSelectedAction(event);
  }

  performSelectedAction(action) {
    switch (action.option) {
      case 'Add Role': this._modal.open(AddRoleModalComponent, overlayConfigFactory({ edit: false }, CustomAddRoleModalContext)); break;
      case 'View List': this.getNavigationPath(action.category); break;
    }
  }

  getNavigationPath(category) {
    switch (category) {
      case 'Roles': this.router.navigate(['/home/access-management']); break;
      case 'Medications': this.router.navigate(['/home/libraries/medication']); break;
    }
  }
}
