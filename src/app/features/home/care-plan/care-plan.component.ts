import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'app-care-plan',
  templateUrl: './care-plan.component.html',
  styleUrls: ['./care-plan.component.scss']
})
export class CarePlanComponent implements OnInit {

  constructor(private _storage: LocalStorageService) { }

  ngOnInit() {
    this._storage.set('careTeamFromPatientProfile', false);
  }


}
