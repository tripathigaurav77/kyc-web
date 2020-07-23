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
  ValidateCustomerReq: FormGroup;

  constructor(private router: Router,
    private _fb: FormBuilder,
    private _service: ApiService,
    private spinnerService: SpinnerService) { }

  ngOnInit() {



    this.ValidateCustomerReq = this._fb.group({
      Header: this._fb.group({
        "Source": "ICA",
        "MsgId": "081220181228",
        "DateTime": "2018-10-17T13:25:00",
        "Action": "POST",
        "ServiceName": "ValidateCustomer",
        "TrackingId": "234523452310"
      }),
      Body: this._fb.group({
        EmiratesId: [""],
        CardNumber: [""],
        MobileNo: [""],
        cif: [""],
        awb: [""]

      })
    });
  }

  onSubmit() {
    console.log(this.ValidateCustomerReq.value);
    this._service
      .PostService1("/validatecustomer/v1/ValidateCustomer", { ValidateCustomerReq: this.ValidateCustomerReq.value }, "")
      .subscribe((data: any) => {
        if (data.ValidateCustomerRes.Body.ResponseDesc) {
          console.log(data);
          sessionStorage.setItem("eidExp", data.ValidateCustomerRes.Body.EmiratesIdExpiry);
          sessionStorage.setItem("passportExp", data.ValidateCustomerRes.Body.PassportExpiry);
          sessionStorage.setItem("customerName", data.ValidateCustomerRes.Body.CustomerName);
          sessionStorage.setItem("cifId", data.ValidateCustomerRes.Body.CIFId);
          sessionStorage.setItem("passportNo", data.ValidateCustomerRes.Body.PassportNo);
          sessionStorage.setItem("molNo", data.ValidateCustomerRes.Body.MOLNumber);
          sessionStorage.setItem("emiratesId", data.ValidateCustomerRes.Body.EmiratesId);
          sessionStorage.setItem("nationality", data.ValidateCustomerRes.Body.Nationality);
          sessionStorage.setItem("dob", data.ValidateCustomerRes.Body.DOB);
          swal
            .fire({
              width: 400,
              title: "Success",
              text: data.ValidateCustomerRes.Body.ResponseDesc,
              icon: "success",
              heightAuto: false,
            });
            this.router.navigate(['details'])
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
