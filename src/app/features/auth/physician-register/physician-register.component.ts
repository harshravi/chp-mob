import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../../../services';
import { ValidationService } from '../../../components/core/error-messages';
import { LocalStorageService } from 'angular-2-local-storage';
import { OTPComponent } from '../OTP/otp.component';
import { IRegistrationData, IRegPersonalDetail, IPasswordForm } from './model/physician-register.model';

@Component({
  selector: 'app-physician-register',
  templateUrl: './physician-register.component.html',
  styleUrls: ['./physician-register.component.scss']
})
export class PhysicianRegisterComponent implements OnInit {
  passwordSectionHide;
  passwordSectionDisplay;
  // FormGroup Name is loginForm
  registerForm: FormGroup;
  registerForm2: FormGroup;
  form: FormGroup;
  registrationData: IRegistrationData;
  userDetail: any;
  matchPwd: boolean;
  roleId: string;
  regType: number;
  userMail: string;
  invitationCode: number;

  constructor(private _fb: FormBuilder, private _auth: AuthenticationService,
    private _storage: LocalStorageService, private _router: Router,
    private route: ActivatedRoute) {


    this.invitationCode = parseInt(this.route.snapshot.params['id'], 10);

  }

  ngOnInit() {
    this.getPhysicianDetail();
    this.passwordSectionDisplay = false;
    this.passwordSectionHide = true;
    this.registerForm = this._fb.group({
      'email_id': ['', ValidationService.emailValidator],
      'role_name': ['', ValidationService.roleName],
      'first_name': ['', ValidationService.firstName],
      'last_name': ['', ValidationService.lastName],
      'mobile_number': ['', ValidationService.phoneOnlyNumbers],
      'address_line_1': ['', ValidationService.addressValidate],
      'city': ['', ValidationService.cityValidate],
      'state': ['', ValidationService.stateValidate],
      'zip_code': ['', ValidationService.onlyNumbers]
    });

    this.registerForm2 = this._fb.group({
      'password': ['', ValidationService.confirmPassword],
      'confirm_password': ['', ValidationService.confirmPassword],
    });

  }

  displayPasswordSection(obj: IRegPersonalDetail) {
    this.registrationData = <IRegistrationData>{
      email_id: obj.email_id,
      role_name: obj.role_name,
      role_id: this.roleId,
      first_name: obj.first_name,
      last_name: obj.last_name,
      mobile_number: obj.mobile_number,
      opt: null,
      password: null,
      confirm_password: null,
      timezone_offset: 0,
      registration_type: this.regType,
      address: {
        address_line_1: obj.address_line_1,
        city: obj.city,
        state: obj.state,
        zip_code: obj.zip_code
      },
      user_id: null
    };

    this.passwordSectionDisplay = true;
    this.passwordSectionHide = false;
    console.log('Phy register step 1 ---- methoad success');
  }

  physicianRegister(objForm2: IPasswordForm) {
    if (objForm2.password === objForm2.confirm_password) {
      this.matchPwd = false;
      this.registrationData.password = objForm2.password;
      this.registrationData.confirm_password = objForm2.confirm_password;

      this._auth.getRegister(this.registrationData).then(data => {
        this._storage.set('registration_type', data.registration_type);
        this._storage.set('user_id', data.user_id);
        this._router.navigate(['/otp']);
        this.registerForm2.reset();
      }, error => {
        console.log('Phy register service call failed ' + this.registrationData.error_message);
      });
    } else {
      this.matchPwd = true;
    }

  }

  getPhysicianDetail() {
    this._auth.getInvitationDetail(this.invitationCode).then(data => {
      this._storage.set('email_id', data.email_id);
      this.userDetail = data;
      this.registerForm.controls['role_name'].patchValue(data.role_name);
      this.registerForm.controls['email_id'].patchValue(data.email_id);
      this.roleId = data.role_id;
      this.regType = data.registration_type;
    });
  }
}
