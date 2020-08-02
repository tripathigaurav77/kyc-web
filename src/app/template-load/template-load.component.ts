import { Component, OnInit, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatDialogComponent } from '../mat-dialog/mat-dialog.component';
import { SpinnerService } from '../spinner.service';
import { TranslateService } from '@ngx-translate/core';
import { LoggerService } from '../logger.service';
import { ApiService } from '../api.service';

export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
  selector: 'template-load',
  templateUrl: './template-load.component.html',
  styleUrls: ['./template-load.component.css']
})
export class TemplateLoadComponent implements OnInit {

  logoMain: any;
  logoSecondary: any;
  orgName: any;
  
  constructor(
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private _service: ApiService,
    private loggerService: LoggerService,
    private translateService: TranslateService,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit(): void {
    this.spinnerService.display(true);
    this._service
      .GetService("/kyctemplate/get/template-new/Empay", "")
      .subscribe(
        (data: any) => {
          console.log("Template fetched!")
          console.log(data);
          if (!data.error) {
            this.spinnerService.display(false);
          }
          this.orgName =  data.result.orgBranch.organization.orgName;
          this.logoSecondary =  this.sanitize(
               "data:image/png;base64, " +data.result.orgBranch.organization.orgLogo);
          this.spinnerService.display(false);
        },
        (error) => {
          this.loggerService.log(error);
          this.spinnerService.display(false);
        }
      );
      // this.logoSecondary = this.sanitize(
      //   "data:image/png;base64, " + sessionStorage.getItem("orgLogo")
      // );
      // this.orgName = sessionStorage.getItem("orgName")
  }

  openDialog() {
    this.dialog.open(MatDialogComponent, {
      data: {
        animal: 'panda'
      }
    });
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
