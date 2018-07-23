import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ClientService } from '../client.service';


@Component({
  selector: 'app-view-clients',
  templateUrl: './view-clients.component.html',
  styleUrls: ['./view-clients.component.scss'],
  providers: [ClientService]
})
export class ViewClientsComponent implements OnInit {

  // Client Grid's title
  gridIBoxTitle = 'Client List';

  // Client Data for the data Grid
  clientAccountData: Object;
  checked;

  constructor(private _clientService: ClientService) {
  }

  ngOnInit() {
    this.getClientList();
  }

  /**
   * Method to get the list of Clients
   */
  getClientList() {
    /** Get the Data from the Client Service */
    this._clientService.getClientList(0).then(data => {
      this.clientAccountData = data;
    });
  }

  checboxState(checked) {
    let checkedValue = 1;
    this.checked = checked;
    checked ? (checkedValue = 1) : (checkedValue = 0);

    this._clientService.getClientList(checkedValue).then(data => {
      this.clientAccountData = data;
    });
  }

  /** Approve or Reject or Enable or Disable */
  selectedStatus(event) {
    if (event === 'Edit') {
    }else {
      this._clientService.setOrChangeStatus(event).then(data => {
        let checkedValue = 1;
        this.checked ? (checkedValue = 1) : (checkedValue = 0);
        this._clientService.getClientList(checkedValue).then(res => {
          this.clientAccountData = res;
        });
      });
    }
  }

  // Refresh the grid if the Value coming from the Popup is true
  refreshGrid(event) {
    if (event) {
      this.getClientList();
    }
  }

}
