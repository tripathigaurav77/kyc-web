import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { SpinnerService } from '../spinner.service';
import { LoggerService } from '../logger.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'kyc-data',
  templateUrl: './kyc-data.component.html',
  styleUrls: ['./kyc-data.component.css']
})

export class KycDataComponent implements OnInit {
  panelOpenState = false;
  kycDataForm: FormGroup;
  cardFields: any
  fields: any

  constructor(
    private _service: ApiService,
    private router: Router,
    private spinnerService: SpinnerService,
    private loggerService: LoggerService,
    private _fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.kycDataForm = this._fb.group({
      creationDate: [""],
      deliveryParams: this._fb.group({
        EmiratesIdExpiry: [""],
        PassportExpiry: [""],
        CustomerName: [""],
        CIFId: [""],
        PassportNo: [""],
        MOLNumber: [""],
        EmiratesId: [""],
        Nationality: [""],
        DOB: [""],
      }),
      documents: this._fb.group({
        docGroupId: [""],
        docGroupName: [""],
        docOptions: this._fb.group({
          backValue: [""]
        })
      }),
      emiratesIdNumber: [""],
      enrolledBy: [""],
      enrolledFrom: [""],
      fullNameEnglish: [""],
      kycId: [""],

      kycInfo: this._fb.group({
        cardFields: this._fb.array([this.initItems()]),
        customFields: this._fb.array([]),
        signature: [""]
      }),  ////////ARRAY

      kycTemplate: this._fb.group({
        kycTemplateId: [""]
      }),
      packageRefNumber: [""],
      remarks: [""],
      status: [""],
      toolKitResponseRequestId: [""],
      toolKitResponseStatus: [""],
      toolKitResponseXML: [""]
    })

    this._service
      .GetService("/kyctemplate/get/template-new/Empay", "")
      .subscribe(
        (data: any) => {
          console.log("Template fetched!")
          this.cardFields = JSON.parse(data.result.cardFields)
          this.fields = this.cardFields.fields
          console.log(this.cardFields);
          // this.kycDataForm = this._fb.group({
          //   xml: [, Validators.nullValidator]
          // })

          if (!data.error) {
            this.spinnerService.display(false);
          }
          this.spinnerService.display(false);
        },
        (error) => {
          this.loggerService.log(error);
          this.spinnerService.display(false);
        }
      );
  }

  initItems() {
    return this._fb.group({
      fieldType: [""],
      label: [""],
      name: [""],
      value: [""]
    });
  }

  // initCustomItems() {
  //   return this._fb.group({});
  // }
  onSubmit() {
    this._service
      .PostService("/kyc-data/add", { data: this.kycDataForm.value }, "")
      .subscribe(
        (data: any) => {
          console.log(data)
          this.cardFields = JSON.parse(data.result.cardFields)
          this.fields = this.cardFields.fields
          console.log(this.cardFields);
          // this.kycDataForm = this._fb.group({
          //   xml: [, Validators.nullValidator]
          // })
          
          if (!data.error) {
            this.spinnerService.display(false);
          }
          this.spinnerService.display(false);
        },
        (error) => {
          this.loggerService.log(error);
          this.spinnerService.display(false);
        }
      );
  }
}
