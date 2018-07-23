import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../../../services';
import { ValidationService } from '../../../components/core/error-messages';
import { LocalStorageService } from 'angular-2-local-storage';
import { IotpRegForm } from './model/otp.model';

@Component({
    selector: 'app-otp',
    templateUrl: './otp.component.html',
    styleUrls: ['./otp.component.scss']
})
export class OTPComponent implements OnInit {

    // FormGroup Name is loginForm
    passcodeForm: FormGroup;
    reg: IotpRegForm;
    errorMessage: string;

    constructor(private _fb: FormBuilder, private _auth: AuthenticationService,
        private _storage: LocalStorageService, private _router: Router) { }

    ngOnInit() {
        this.passcodeForm = this._fb.group({
            'passcode': ['', ValidationService.alphaNumeric]
        });
    }

    submitPhysicianOTP(formData) {
        const userId: string = <string>this._storage.get('user_id');
        const regType: number = <number>this._storage.get('registration_type');

        this.reg = <IotpRegForm>{
            user_id: userId.toString(),
            otp: formData.passcode,
            registration_type: regType
        };


        this._auth.submitPasscode(this.reg).then(data => {
            console.log('Passcode entered');
            this.passcodeForm.reset();
            this._router.navigate(['/login']);
        }, error => {
            console.log('passcode service call failed ' + this.reg.error_message);
        });

    }
}
