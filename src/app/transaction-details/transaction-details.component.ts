import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from "src/app/api.service";
import { LoggerService } from "src/app/logger.service";
import { SpinnerService } from '../spinner.service';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.css']
})
export class TransactionDetailsComponent implements OnInit {
  detailsForm: FormGroup;

  constructor(private router: Router,
    private _fb: FormBuilder,
    private _service: ApiService,
    private loggerService: LoggerService,
    private translateService: TranslateService,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit() {
    this.detailsForm = this._fb.group({
      eidExp: [sessionStorage.getItem("eidExp"), Validators.nullValidator],
      passportExp: [sessionStorage.getItem("passportExp"), Validators.nullValidator],
      customerName: [sessionStorage.getItem("customerName"), Validators.nullValidator],
      cifId: [sessionStorage.getItem("cifId"), Validators.nullValidator],
      passportNo: [sessionStorage.getItem("passportNo"), Validators.nullValidator],
      molNo: [sessionStorage.getItem("molNo"), Validators.nullValidator],
      emiratesId: [sessionStorage.getItem("emiratesId"), Validators.nullValidator],
      nationality: [sessionStorage.getItem("nationality"), Validators.nullValidator],
      dob: [sessionStorage.getItem("dob"), Validators.nullValidator]
    });
    // console.log(this.detailsForm.value);
    // this.username = sessionStorage.getItem("username");
  }

  onSubmit() {
    
    this.router.navigate(['template-load']).then(nav => {
      console.log(nav); // true if navigation is successful
    }, err => {
      console.log(err) // when there's an error
    });    
  }
}
