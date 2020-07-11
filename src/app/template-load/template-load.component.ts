import { Component, OnInit, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatDialogComponent } from '../mat-dialog/mat-dialog.component';

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

  constructor(
    private sanitizer: DomSanitizer,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
      this.logoSecondary = this.sanitize(
        "data:image/png;base64, " + sessionStorage.getItem("logoSecondary")
      );
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
