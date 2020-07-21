import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import swal from "sweetalert2";
import { SpinnerService } from '../spinner.service';

@Component({
  selector: 'app-search-customer',
  templateUrl: './search-customer.component.html',
  styleUrls: ['./search-customer.component.css']
})
export class SearchCustomerComponent implements OnInit {
  searchForm: FormGroup;

  constructor(private router: Router,
    private _fb: FormBuilder,
    private _service: ApiService,
    private spinnerService: SpinnerService) { }

  ngOnInit() { 
    this.searchForm = this._fb.group({
      EmiratesId: [],
      CardNumber: [],
      MobileNo: [],
      cif: [],
      awb: []
    });
  }
  
  onSubmit() {
    this._service
        .PostService1("/validatecustomer/v1/ValidateCustomer", {
          MobileNo: this.searchForm.value.MobileNo,
          EmiratesId: this.searchForm.value.EmiratesId,
          CardNumber: this.searchForm.value.CardNumber,
        }, "")
        .subscribe((data: any) => {
          if (data.success) {
            swal
              .fire({
                width: 400,
                title: "Success",
                text: data.message,
                icon: "success",
                heightAuto: false,
              });
          } else {
            swal.fire({
              width: 400,
              title: "Alert",
              text: data.message,
              icon: "warning",
              heightAuto: false,
            });
          }
          this.spinnerService.display(false);
        });
    
  }

}
