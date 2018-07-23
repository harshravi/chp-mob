import { Component, OnInit } from '@angular/core';
import { AccessManagementService } from './access-management.service';
import { ToasterService } from 'angular2-toaster';
/** importing breadcrumb service to set breadcrumb */
import { BreadcrumbService } from '../../../services';

@Component({
  selector: 'app-access-management',
  templateUrl: './access-management.component.html',
  styleUrls: ['./access-management.component.scss'],
  providers: [AccessManagementService]
})
export class AccessManagementComponent implements OnInit {

  // Client Grid's title
  gridIBoxTitle = 'Feature Settings';

  // List of roles
  listOfRoles;
  // List of roles and privleges mapping for a particular role selected
  listOfRolesAndPrivilegesMapping;

  // variable sends column name and property to data table component
  columnArray = [];

  // role name and selected by user from dropdown
  selectedRoleId;

  constructor(private _accessManagementService: AccessManagementService,
    private _toasterService: ToasterService, private _breadcrumbService: BreadcrumbService) { }

  ngOnInit() {
    this._breadcrumbService.setBreadcrumbs('Access Management', null);
    this._accessManagementService.getRoleListData().then(data => {
      this.listOfRoles = data;

      this.getRolesAndPrivilegesMapping(this.listOfRoles[0].role_id);
      this.selectedRoleId = this.listOfRoles[0].role_id;
    });
  }

  getRolesAndPrivilegesMapping(roleOnLoad) {
    const roleId = roleOnLoad;
    this._accessManagementService.getRolePrivilegeMapping(roleId).then(data => {
      this.listOfRolesAndPrivilegesMapping = data;
      // var firstObj = {prop : 'module_name', name: 'Pages/Features'};
      // this.columnArray.push(firstObj);
      for (const obj in data.actions) {
        if (data.actions[obj]) {
          const columnObject = { prop: 'selected', name: data.actions[obj].action_name };
          this.columnArray.push(columnObject);
        }
      }
    });
  }

  selectionChange(event) {
    for (const module of this.listOfRolesAndPrivilegesMapping.modules) {
      for (const feature of module.features) {
        if (feature.feature_id === event.feature_id) {
          for (const privilege of feature.privileges) {
            if (privilege.action_id === event.action_id) {
              privilege.selected = event.selected;
            }
          }
        }
      }
    }
  }

  saveTableData(event) {
    this._accessManagementService.saveRolePrvilegesMapping(this.listOfRolesAndPrivilegesMapping).then(data => {
      if (data.error_message) {
        this._toasterService.pop('failure', 'Error', data.error_message);
      } else {
        this._toasterService.pop('success', 'Success', data.success_message);
        // var roleId='AR512';
        this._accessManagementService.getRolePrivilegeMapping(this.selectedRoleId).then(res => {
          this.listOfRolesAndPrivilegesMapping = res;
        });

      }

    });
  }

  newRoleSelected(event) {
    this.selectedRoleId = event;
    this._accessManagementService.getRolePrivilegeMapping(this.selectedRoleId).then(data => {
      this.listOfRolesAndPrivilegesMapping = data;
    });
  }

  // Refresh the grid if the Value coming from the Popup is true
  refreshGrid(event) {
    if (event) {
      this._accessManagementService.getRoleListData().then(data => {
        this.listOfRoles = data;
      });
    }
  }

}
