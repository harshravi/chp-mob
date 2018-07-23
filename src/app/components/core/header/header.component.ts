import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { UserManagementService } from '../../../services/UserManagement';
import { LocalStorageService } from 'angular-2-local-storage';
import { HeaderTaskService } from '../../../services/HeaderService';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { InterventionComponent, InterventionModalContext, EmergencyActionPlanModalComponent, EmergencyActionPlanModalContext } from '../../../features/home/global-modal';
/** Imports for the Modal to be involked on Button Click */
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { AuthenticationService } from '../../../services/Authentication/authentication.service';
import { MessagingDataService } from '../../../services/MessagingDataService/messaging-data.service';
import { ToasterService } from 'angular2-toaster';
import { TwilioService, DateUtilityService } from '../../../services';
declare var _;
declare var $;
/** Imports for the Modal to be involked on Button Click */
import {
    TermsConditionModalContext, TermsConditionComponent,
    PrivacyPolicyComponent, PrivacyPolicyModalContext
} from '../../../features/home/global-modal';
import { GlobalEventEmitterService } from '../../../services/EventEmitter/global-event-emitter.service';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    // host: { '[style.max-height.px]': 'height' },

    providers: [UserManagementService, HeaderTaskService, AuthenticationService]
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {

    tasklist;
    alertList;
    seizureQuestionsAlertList;
    medicatonAlertList;
    vitalTasks = [];
    emergencyActionPlans;
    tasklength;
    showAllTasks = true;
    showAllAlerts = false;
    taskDetails;
    showCarePlan = true;
    userObject: any;
    showForm = false;
    vitalsSelected: any = [];
    interventionList: any = {};
    snoozeDropdown = ['hours', 'days'];
    snoozeType = 'hours';
    snooze_duration: any;
    showSnooze = false;
    showAssign = false;
    showOutreach = false;
    openOrClosed: boolean;
    tasksSelected = [];
    errorMessage: string;
    intervalForTask;
    intervalForAlert;
    showTaksList = false;
    showAlertList = false;
    isTaskButtonClicked = false;
    isAlertButtonClicked = false;
    contentClass = 'col-md-12';
    taskClass = '';
    showTaskIndicator = false;
    totalPatient;
    phyDisplayName;
    fullName;
    loginTimeStamp;
    timeZoneName;
    height: number;
    taskListCount: number = null;
    public _dateTime: DateUtilityService;

    constructor(private _auth: AuthenticationService, private _UserManagementService: UserManagementService,
        private _storage: LocalStorageService, private _twilio: TwilioService, private _globalEmitterService: GlobalEventEmitterService,
        private _headerService: HeaderTaskService, private _modal: Modal, private _msgDataService: MessagingDataService,
        private _toasterService: ToasterService, private dateTime: DateUtilityService) {
        this._dateTime = dateTime;
        this.openOrClosed = true;
        // this.height = window.innerHeight - 68;
    }

    ngAfterViewInit() {
        this._globalEmitterService.taskPanelOpenEvent(true);
    }

    ngOnInit() {
        // Calling the Function for the hamburger
        $('.navbar-minimalize').on('click', function () {
            $('body').toggleClass('mini-navbar');
            SmoothlyMenu();

        });

        function SmoothlyMenu() {
            if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
                // Hide menu in order to smoothly turn on when maximize menu
                $('#side-menu').hide();
                // For smoothly turn on menu
                setTimeout(
                    function () {
                        $('#side-menu').fadeIn(400);
                    }, 200);
            } else if ($('body').hasClass('fixed-sidebar')) {
                $('#side-menu').hide();
                setTimeout(
                    function () {
                        $('#side-menu').fadeIn(400);
                    }, 100);
            } else {
                // Remove all inline style from jquery fadeIn function to reset menu state
                $('#side-menu').removeAttr('style');
            }
        }

        this.getPhysicianShortName();
        // Getting the userObject from localStorage.
        this.userObject = this._storage.get('userdetails');

        // Putting this condition to not to call the service when Client Admin logs in.
        // No task list required for the client admin
        if (this.userObject.roleType !== 'ADMIN') {
            this.showTaskCards();
            // get Tasks for Physician
            this.getTaskList();
            this.intervalForTask = setInterval(() => {
                this.getTaskList();
            }, 5000);
        }
        this.intervalForAlert = setInterval(() => {
            this.getAlertList();
        }, 5000);

        document.getElementsByTagName('body')[0].addEventListener('click', (e) => {
            const logout_div = document.getElementsByClassName('dropdown-menu')[0];
            if (logout_div) {
                if (logout_div.classList.contains('show')) {
                    logout_div.classList.remove('show');
                }
            }
        });

        // While body scrolling right side pannel position fixed
        window.addEventListener('scroll', function (evt) {
            var distance_from_top = document.documentElement.scrollTop || document.body.scrollTop;
            var el = document.getElementById('elId');
            if (distance_from_top === 0) {
                // console.log('dowm');
                el.style.top = '68px';
                el.style.zIndex = '0';
            }
            if (distance_from_top >= 1) {
                el.style.top = '0px';
                el.style.zIndex = '999';
            }
        });

    }

    /* When the user clicks on the button, toggle between hiding and showing the dropdown content */
    showTasks() {
        // document.getElementById('myDropdown').classList.toggle('show');
        this.showAlertList = false;
        this.showTaksList = !this.showTaksList;
        if (this.showTaksList) {
            this.contentClass = 'col-md-9';
            this.taskClass = 'col-md-3 no-padding';
            this._globalEmitterService.taskPanelOpenEvent(true);
        } else {
            this.contentClass = 'col-md-12';
            this.taskClass = '';
            this._globalEmitterService.taskPanelOpenEvent(false);
        }
        if (!this.isTaskButtonClicked) {
            this.isTaskButtonClicked = true;
        }
        setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 100);
    }


    showAlerts() {
        // document.getElementById('myDropdown').classList.toggle('show');
        if (this.showTaksList) {
            this.showTasks();
        }
        this.showAlertList = !this.showAlertList;
        if (this.showAlertList) {
            this.contentClass = 'col-md-9';
            this.taskClass = 'col-md-3 no-padding';
            this._globalEmitterService.taskPanelOpenEvent(true);
        } else {
            this.contentClass = 'col-md-12';
            this.taskClass = '';
            this._globalEmitterService.taskPanelOpenEvent(false);
        }
        if (!this.isAlertButtonClicked) {
            this.isAlertButtonClicked = true;
        }
        setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 100);
    }

    selectedTask(item) {
        let t;
        this._modal.open(InterventionComponent,
            overlayConfigFactory({ addMedicationPlan: false, participantId: item.participant_id },
                InterventionModalContext)).then(d => {
                    t = d.result.then(data => {
                        this.updateTaskOnModalOpen();
                    });
                });
    }
    nameOfPatient(item) {
        this._UserManagementService.getSearchedParticipant(item.participantDetails.participant_id, item.target.value).then(data => {
            this.totalPatient = data;
        });
    }

    selectedParticipantDetails(item) {
        let selectedParticipant = {
            "participant_id": item.participantDetails.participant_id,
            "staff_id": this.userObject.id,
            "new_staff_id": item.staff_id
        }
        this._UserManagementService.reassignActionPlan(selectedParticipant).then(data => {
            if (data.success_message) {
                this._toasterService.pop('success', 'Saved', data.success_message);
            } else if (data.error_message) {
                this._toasterService.pop('error', 'Error', data.error_message);
            }
        });
    }

    selectedActionPlansTask(item) {
        // this.updateTaskOnModalOpen();
        let t;
        if (item.is_emergency_action_plan === true) {
            this._modal.open(EmergencyActionPlanModalComponent,
                overlayConfigFactory({ submitBtnText: 'Submit', edit: false, EmergencyActionPlanData: item, emergencyActionPlanPlan: true, participantId: item.participant_id }, EmergencyActionPlanModalContext)).then(d => {
                    t = d.result.then(data => {
                        this._globalEmitterService.updateMedicationListDetails();
                        this.updateTaskOnModalOpen();
                    });
                });
        } else if (item.is_emergency_action_plan === false) {
            this.selectedTask(item);
        }
    }

    checkReassign(openOrClosed) {
        this.openOrClosed = !openOrClosed;
    }

    // to update task when open a modal
    updateTaskOnModalOpen() {
        if (this.showAllTasks) {
            this._UserManagementService.getTasks().then(data => {
                this.tasklist = data;
                this.vitalTasks = (this.tasklist.vitalsAndemergency_action_plans != null) ? this.tasklist.vitalsAndemergency_action_plans : [];
                // this.emergencyActionPlans = (this.tasklist.emergency_action_plans != null) ? this.tasklist.emergency_action_plans : [];
            });
        }
    }

    /** Get Taks list */
    getTaskList() {
        this._UserManagementService.getTasks().then(data => {
            if (this.showAllTasks) {
                // this.tasklist = data;
                this.updateTasklist(data);
                // this.vitalTasks = (this.tasklist.vitals != null) ? this.tasklist.vitals : [];
                // if (this.vitalTasks.length > 0) {
                //     this.vitalTasks.forEach(element => {
                //         element.toShowVitalTaskContent = true;
                //     });
                // } else {
                //     this.vitalTasks = [];
                // }
                // this.emergencyActionPlans = (this.tasklist.emergency_action_plans != null) ? this.tasklist.emergency_action_plans : [];
                // if (this.emergencyActionPlans.length > 0) {
                //     this.emergencyActionPlans.forEach(element => {
                //         element.toShowActionplanContent = true;
                //     });
                // } else {
                //     this.emergencyActionPlans = [];
                // }
                if (this.vitalTasks.length === 0) {
                    // this.tasklist['showMsg'] = true;
                    this.showTaskIndicator = false;
                } else {
                    // this.tasklist['showMsg'] = false;
                    if (this.vitalTasks.length > 0) {
                        this.showTaskIndicator = true;
                    }
                }
                this.tasklength = this.vitalTasks.length;
                // this.checkTaskIndicator();
            }
        });
    }
    formatFirstLastName(data) {
        var firstName = data['participant_name'].substr(0, data['participant_name'].indexOf(' '));
        var lastName = data['participant_name'].substr(data['participant_name'].indexOf(' ') + 1);
        var firstNameFirstLtr = firstName.charAt(0);
        var secontNameFirstLtr = lastName.charAt(0);
        var FirstLastLtrName = firstNameFirstLtr + secontNameFirstLtr;
        data.participantName = FirstLastLtrName;
    }
    alertData(data, checkAlert) {
        if (checkAlert === 'medicatonAlert') {
            data.forEach(element => {
                this.formatFirstLastName(element);
            });
            this.medicatonAlertList = data;
        }
        if (checkAlert === 'seizureQuestionsAlert') {
            data.forEach(element => {
                this.formatFirstLastName(element);
            });
            this.seizureQuestionsAlertList = data;
        }
    }

    /** Get Alert list */
    getAlertList() {
        this._UserManagementService.getAlerts().then(data => {
            // data[0].medication_alert = [
            //     {
            //         alert_string: "3 medications need notification times set",
            //         medication_count: 3,
            //         mobile_number: "4678887678",
            //         participant_id: "Q2194",
            //         participant_name: "Ramya S"
            //     }
            // ];
            this.alertList = data;
            data.forEach(element => {
                if (element.medication_alert) {
                    this.alertData(element.medication_alert, 'medicatonAlert');
                }
                if (element.seizure_questions_alert) {
                    this.alertData(element.seizure_questions_alert, 'seizureQuestionsAlert');
                }
            });
        });
    }

    /** Check weather task indicator should be there or not */
    // checkTaskIndicator() {
    //   this.showTaskIndicator = false;
    //   this.vitalTasks.forEach((data) => {
    //     if (data.read_flag === 0) {
    //       this.showTaskIndicator = true;
    //     }
    //   });
    // }

    /** stop interval on logout */
    ngOnDestroy() {
        clearInterval(this.intervalForTask);
        clearInterval(this.intervalForAlert);
    }

    showLogout($event) {
        // get TimeZone
        let localTimeZone = moment.tz.guess();
        this.timeZoneName = moment(this.userObject.login_timestamp).tz(localTimeZone).format('z');

        document.getElementById('logout-dropdown').classList.toggle('show');
        $event.stopPropagation();
    }

    /** onClick for calling in the Logout Feature */
    onLogout() {

        // setting the messaging data service as null.
        this._msgDataService.setListOfData(null);
        // closing the connection to twilio
        this._twilio.shutdownClientInstance();
        this._auth.logout();
    }

    getPhysicianShortName() {
        this.userObject = this._storage.get('userdetails');
        this.phyDisplayName = this.userObject.first_name[0] + this.userObject.last_name[0];
        this.fullName = this.userObject.first_name + ' ' + this.userObject.last_name;
    }
    // open terms and condition modal
    openTnCModal() {
        this._modal.open(TermsConditionComponent,
            overlayConfigFactory({ edit: true, termConditionSettingsData: 'TnC' },
                TermsConditionModalContext));
    }
    // open privacy and policy modal
    openPnPModal() {
        this._modal.open(PrivacyPolicyComponent,
            overlayConfigFactory({ edit: true, privacyPolicySettingsData: 'PnP' },
                PrivacyPolicyModalContext));
    }
    // show time zone
    // showTimeZone(){
    // var tp = moment.tz.guess();
    // var k = moment(this.userObject.login_timestamp).tz(tp).format('z');
    // console.log("------------------------------------------" + k);
    // }

    showTaskCards() {

        if (window.screen.width > 1260) {
            this.showTaksList = true;
            this.contentClass = 'col-md-9';
            this.taskClass = 'col-md-3 no-padding';
        }
        if (window.screen.width < 1260) {
            this.showTaksList = false;
            this.contentClass = 'col-md-12';
            this.taskClass = '';
        }
        window.onresize = (event) => {
            if (!this.isTaskButtonClicked) {
                if (window.screen.width > 1260) {
                    this.showTaksList = true;
                    this.contentClass = 'col-md-9';
                    this.taskClass = 'col-md-3 no-padding';
                }
                if (window.screen.width < 1260) {
                    this.showTaksList = false;
                    this.contentClass = 'col-md-12';
                    this.taskClass = '';
                }
            }
        };
    }

    /**
     *  Checking the change in data and then only assigning it.
     *  this will solve repainting issue in IE and Safari.
     */
    updateTasklist(data) {
        if (this.taskListCount === null) {
            this.taskListCount = this.getTotalTaskCont(data);
            this.tasklist = data;
            this.vitalTasks = (this.tasklist.vitalsAndemergency_action_plans != null) ? this.tasklist.vitalsAndemergency_action_plans : [];
        } else {
            const tempLengthForTask: number = this.getTotalTaskCont(data);
            if (tempLengthForTask !== this.taskListCount) {
                this.taskListCount = tempLengthForTask;
                this.tasklist = data;
                this.vitalTasks = (this.tasklist.vitalsAndemergency_action_plans != null) ? this.tasklist.vitalsAndemergency_action_plans : [];
            } else {
                // console.log(this.checkReassign(event));
                if (this.openOrClosed) {
                    if (!_.isEqual(this.tasklist, data)) {
                        this.vitalTasks = (data.vitalsAndemergency_action_plans != null) ? data.vitalsAndemergency_action_plans : [];
                        this.openOrClosed = true;
                    }
                }

            }
        }
    }

    getTotalTaskCont(data) {
        let temptaskCount = 0;
        let obj: any = 0;
        if (data.vitalsAndemergency_action_plans !== null) {
            // for (obj in data.vitals) {
            //     if (data.vitals[obj].vitalDetails) {
            //         temptaskCount = temptaskCount + data.vitals[obj].overall_seizure_counts + data.vitals[obj].vital_count;
            //     }
            // }
            temptaskCount = data.vitalsAndemergency_action_plans.length;

        }

        // if (data.emergency_action_plans !== null) {
        //     temptaskCount = temptaskCount + data.emergency_action_plans.length;
        // }
        return temptaskCount;
    }
}
class Student {
    fullName: string;
    constructor(public firstName: string, public middleInitial: string, public lastName: string) {
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
}

interface Person {
    firstName: string;
    lastName: string;
}

function greeter(person: Person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}

var user = new Student("Jane", "M.", "User");

console.log(greeter(user));