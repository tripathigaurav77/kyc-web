import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.css']
})
export class TransactionDetailsComponent implements OnInit {
  detailsForm: FormGroup;

  constructor(private router: Router,
    private _fb: FormBuilder,
    private translateService: TranslateService) { }

  ngOnInit() {
    this.detailsForm = this._fb.group({
      eidExp: ["", Validators.required],
      passportExp: ["", Validators.required],
      customerName: ["", Validators.required],
      cifId: ["", Validators.required],
      passportNo: ["", Validators.required],
      molNo: ["", Validators.required],
      emiratesId: ["", Validators.required],
      nationality: ["", Validators.required],
      dob: ["", Validators.required]
    });
  }

  onSubmit() {
    this.router.navigate(['details']).then(nav => {
      console.log(nav); // true if navigation is successful
    }, err => {
      console.log(err) // when there's an error
    }); 
  }

}
