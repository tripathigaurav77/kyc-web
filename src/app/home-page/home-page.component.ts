import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert2';

declare var $;

@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  channelForm: FormGroup;

  constructor(private router: Router,
    private _fb: FormBuilder,
    private translateService: TranslateService) { }

  ngOnInit() {
    this.channelForm = this._fb.group({
      channelName: ["", Validators.required]
    });
  }

  onSubmit() {
    if (this.channelForm.invalid) {
      swal.fire({
        width: 400,
        title: this.translateService.instant("Alert"),
        text: this.translateService.instant("All fields are required"),
        icon: "warning",
        heightAuto: false,
      });
      $("#login-form input").css({
        transition: "all .2s eas-in-out",
        "border-color": "rgba(255, 0, 0, .5)",
        "border-style": "solid",
        "border-width": "1px",
      });
      setTimeout(() => {
        $("#login-form input").css({
          transition: "all .2s eas-in-out",
          "border-color": "lightgray",
          "border-style": "solid",
          "border-width": "1px",
        });
      }, 2000);
      return;
    }

    this.router.navigate(['verification']).then(nav => {
      console.log(nav); // true if navigation is successful
    }, err => {
      console.log(err) // when there's an error
    }); 
  }

}
