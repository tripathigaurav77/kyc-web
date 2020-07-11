import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert2';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-search-customer',
  templateUrl: './search-customer.component.html',
  styleUrls: ['./search-customer.component.css']
})
export class SearchCustomerComponent implements OnInit {
  searchForm: FormGroup;

  constructor(private router: Router,
    private _fb: FormBuilder,
    private _apiservice: ApiService) { }

  ngOnInit() { 
    this.searchForm = this._fb.group({
      eid: ["", Validators.required],
      cardNo: ["", Validators.required],
      mobileNo: ["", Validators.required],
      cif: ["", Validators.required],
      awb: ["", Validators.required]
    });
  }
  
  onSubmit() {
    // this._apiservice
    //   .GetService("/channelverification/v1/Channelverification/", this.searchForm.value.eid.json)
    //   .subscribe((resp) => {
    //     if (resp.success) {
    //       console.log(resp);
    //     /*  
    //     this.total = resp.result.totalKyc;
    //     this.kycDetailsData.push(resp.result.pendingKyc);
    //     this.kycDetailsData.push(resp.result.acceptedKyc);
    //     this.kycDetailsData.push(resp.result.provisionedKyc);
    //     this.kycDetailsData.push(resp.result.rejectedKyc);
    //     */

    //       // this.users = resp.result.usersCount;
    //       // this.roles = resp.result.rolesCount;
    //       // this.org = resp.result.organisationCount;
    //       // this.template = resp.result.templateCount;
    //       // this.organization = resp.result.organisationCount;
    //       // this.dashboardKycDTOS = resp.result.dashboardKycDTOS;
    //       // this.totalKyc = resp.result.totalKyc;
    //     }
    //     this.router.navigate(['details']).then(nav => {
    //       console.log(nav); // true if navigation is successful
    //     }, err => {
    //       console.log(err) // when there's an error
    //     }); 
    //   });
    
  }

}
