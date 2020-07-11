import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-verification',
  templateUrl: './user-verification.component.html',
  styleUrls: ['./user-verification.component.css']
})
export class UserVerificationComponent implements OnInit {

  agentVerification: FormGroup;
  secondFormGroup: FormGroup;
  logoMain: any;
  logoSecondary: any;

  constructor(private router: Router,
    private _fb: FormBuilder) { }

  ngOnInit(): void {
    this.agentVerification = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }
}
