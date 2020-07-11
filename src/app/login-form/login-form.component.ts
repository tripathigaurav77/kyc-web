import { SpinnerService } from "./../spinner.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../api.service";
import { Router } from "@angular/router";
import swal from "sweetalert2";
import { TranslateService } from "@ngx-translate/core";
import { LoggerService } from "../logger.service";
import { DomSanitizer } from "@angular/platform-browser";

declare var $;

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  loginForm: FormGroup;
  userMenus: any;
  isConnected = navigator.onLine;
  logoMain: any;
  arabic = { name: "ar", display: "عربى", country: "UAE", dir: "rtl" };
  english = { name: "en", display: "English", country: "US", dir: "ltr" };
  selectedLanguage: string;
  dir = "ltr";
  param = { value: "Hassan" };
  translate: any;

  constructor(
    private _fb: FormBuilder,
    private _service: ApiService,
    private router: Router,
    private spinnerService: SpinnerService,
    private sanitizer: DomSanitizer,
    private loggerService: LoggerService,
    private translateService: TranslateService
  ) {
    this.translate = translateService;
    translateService.setDefaultLang("en");
    this.selectedLanguage = "en";
    const val = sessionStorage.getItem("lang");
    if (val === undefined || val === null) {
      sessionStorage.setItem("lang", "en");
      this.selectedLanguage = "en";
    }
    if (val === "ar") {
      this.selectedLanguage = "ar";
      this.changeLanguage("ar", "rtl");
    }
    translateService.use(val || "en");
  }

  changeLanguage(l: string, d: string) {
    this.selectedLanguage = l;
    sessionStorage.setItem("lang", l);
    this.translateService.use(l);
    this.dir = d;
    sessionStorage.setItem("dir", d);

    if (l === "ar") {
      const rtlStyles =
        '<link class="rtl-styles" rel="stylesheet" type="text/css" href="assets/css/bootstrap-rtl.min.css">' +
        '<link class="rtl-styles" rel="stylesheet" type="text/css" href="assets/css/mouldifi-rtl-core.css">' +
        '<link class="rtl-styles" rel="stylesheet" type="text/css" href="assets/css/rtl.css">';
      $("head").append(rtlStyles);
    } else {
      $(".rtl-styles").remove();
    }
  }

  ngOnInit() {
    this.getLogo();
    this.loginForm = this._fb.group({
      userName: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  getLogo() {
    this._service.logo("/auth/app/get/app-content").subscribe(
      (data: any) => {
        this.loggerService.log(data);
        if (data.success) {
          this.logoMain = this.sanitize(
            "data:application/pdf;base64, " + data.result.logoMain
          );
          sessionStorage.setItem("logoMain", data.result.logoMain);
          sessionStorage.setItem("logoSecondary", data.result.logoSmall);
          sessionStorage.setItem("country", data.result.textMain);
          sessionStorage.setItem("companyEmail", data.result.textSecondary);
          sessionStorage.setItem("companyName", data.result.title);
        }
        this.spinnerService.display(false);
      },
      (error) => {
        this.loggerService.log(error);
        this.spinnerService.display(false);
      }
    );
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  onSubmit() {
    if (this.loginForm.invalid) {
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
    if (!this.isConnected) {
      swal.fire({
        width: 400,
        title: this.translateService.instant("Alert"),
        text: this.translateService.instant("No Internet Connection"),
        icon: "warning",
        heightAuto: false,
      });

      return;
    }

    this.loggerService.log(this.loginForm.value);

    this._service
      .login("/auth/login", this.loginForm.value)
      .subscribe((res: any) => {
        this.loggerService.log(res);
        this.loggerService.log("1 : res.success :" + res.success);

        if (res.success) 
        {
          sessionStorage.setItem("access token", res.result.accessToken);
          sessionStorage.setItem("refreshToken", res.result.refreshToken);
          sessionStorage.setItem("username", this.loginForm.value.userName);          
          this._service
            .GetService("/user/get/", this.loginForm.value.userName)
            .subscribe(
              (data: any) => {
                this.loggerService.log(data);
                if (data.success === false) {
                  swal.fire({
                    width: 400,
                    title: this.translateService.instant("Alert"),
                    text: data.message,
                    icon: "warning",
                    heightAuto: false,
                  });
                  
                  this.spinnerService.display(false);
                  return;
                } 
                else 
                {
                  this.router.navigate(['verification']).then(nav => {
                    console.log(nav); // true if navigation is successful
                  }, err => {
                    console.log(err) // when there's an error
                  });   //this.router.navigate([routerLink]);
                }
              },
              (error) => {
                this.loggerService.log(error);
                this.spinnerService.display(false);
              }
            );
          
        } else {
          swal.fire({
            width: 400,
            title: this.translateService.instant("Alert"),
            text: this.translateService.instant(res.message), //message: Your password expired. please reset
            icon: "warning",
            heightAuto: false,
          });

          this.spinnerService.display(false);
        }
      });
  }
}



