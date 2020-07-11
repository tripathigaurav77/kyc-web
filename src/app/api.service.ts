import { environment } from "./../environments/environment.prod";
import { SpinnerService } from "./spinner.service";
import { Injectable } from "@angular/core";
import swal from "sweetalert2";

import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { retry, catchError } from "rxjs/operators";
import { LoggerService } from "./logger.service";
import { AppConfig } from "./config";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  baseUrll = this.server.getConfig("serverip");
  icaRegister = this.server.getConfig("icaRegister");
  icaDeregister = this.server.getConfig("icaDeregister");
  //baseUrll = environment.url;
  userProfile;
  activities: any;
  loading = true;
  constructor(
    private _http: HttpClient,
    private spinnerService: SpinnerService,
    private loggerService: LoggerService,
    private server: AppConfig,
    private translate: TranslateService
  ) {}

  public login(url, data) {
    this.spinnerService.display(true);
    const contentHeader = new HttpHeaders({
      "Content-Type": "application/json",
      login_type: "BY_UNAME_PASS",
    });

    return this._http
      .post(this.baseUrll + url, data, { headers: contentHeader })
      .pipe(retry(1), catchError(this.handleError.bind(this)));
  }

  public logo(url) {
    this.spinnerService.display(true);
    const contentHeader = new HttpHeaders({
      "Content-Type": "application/json",
    });

    return this._http
      .get(this.baseUrll + url, { headers: contentHeader })
      .pipe(retry(1), catchError(this.handleError.bind(this)));
  }

  getHeaders() {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        access_token: sessionStorage.getItem("access token"),
      }),
    };
    return httpOptions;
  }

  PostService(Url, body, params): Observable<any> {
    const httpOptions = this.getHeaders();
    this.spinnerService.display(true);
    let request = "";
    if (body !== "") {
      request = JSON.stringify(body);
    }
    this.loading = false;

    return this._http
      .post(this.baseUrll + Url + params, body, httpOptions)
      .pipe(retry(1), catchError(this.handleError.bind(this)));
  }

  icaRegistrationService(Url, body, params): Observable<any> {
    this.spinnerService.display(true);
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: params,
      }),
    };

    let request = "";
    if (body !== undefined) {
      request = JSON.stringify(body);
    }

    return this._http
      .post(Url, body, httpOptions)
      .pipe(retry(1), catchError(this.handleICAError.bind(this)));
  }

  exportService(Url, body, params): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        accept: "application/zip",
        access_token: sessionStorage.getItem("access token"),
      }),
      responseType: "blob" as "blob",
    };
    let request = "";
    if (body !== "") {
      request = JSON.stringify(body);
    }
    this.loading = false;
    return this._http
      .post(this.baseUrll + Url + params, body, httpOptions)
      .pipe(retry(1), catchError(this.handleError.bind(this)));
  }

  // GetService(Url, prams): Observable<any> {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       accept: "application/zip",
  //       access_token: sessionStorage.getItem("access token")
  //     }),
  //     responseType: "blob" as "blob"
  //   };

  //   return this._http
  //     .get<any>(Url + prams, httpOptions)
  //     .pipe(retry(1), catchError(this.handleError.bind(this)));
  // }

  GetService(Url, prams): Observable<any> {
    const httpOptions = this.getHeaders();
    this.spinnerService.display(true);

    return this._http
      .get<any>(this.baseUrll + Url + prams, httpOptions)
      .pipe(retry(1), catchError(this.handleError.bind(this)));
  }

  PutService(body, Url): Observable<any> {
    const httpOptions = this.getHeaders();
    this.loading = false;
    let request = "";
    if (body !== "") {
      request = JSON.stringify(body);
    }
    return this._http
      .put(this.baseUrll + Url, request, httpOptions)
      .pipe(retry(1), catchError(this.handleError.bind(this)));
  }

  DeleteService(url, params): Observable<any> {
    const httpOptions = this.getHeaders();
    return this._http
      .delete(this.baseUrll + url + params, httpOptions)
      .pipe(retry(1), catchError(this.handleError.bind(this)));
  }

  showSuccessMessage(message) {
    // this.toastr.success(message || 'success', 'Success!');
    alert(message || "success");
  }
  showErrorMessage(message) {
    // this.toastr.error(message || 'Error', 'Error!!');
    alert(message || "Error Occured");
  }
  showWarning(message) {
    // this.toastr.warning(message, 'Alert!');
    swal.fire({
      width: 400,
      title: this.translate.instant("Alert"),
      text: this.translate.instant(message),
      icon: "warning",
      heightAuto: false,
    });
  }

  showInfo(message) {
    // this.toastr.info(message);
    swal.fire({
      width: 400,
      title: this.translate.instant("Alert"),
      text: this.translate.instant(message),
      icon: "warning",
      heightAuto: false,
    });
  }

  setUserData(user) {
    this.userProfile = user;
    sessionStorage.setItem("userProfile", JSON.stringify(user));
  }

  setActivities(activities) {
    this.activities = activities;
    sessionStorage.setItem("activities", JSON.stringify(activities));
  }

  getActivities() {
    this.spinnerService.display(true);
    if (this.activities) {
      return this.activities;
    } else {
      return JSON.parse(sessionStorage.getItem("activities"));
    }
  }

  getUserData() {
    if (this.userProfile) {
      return this.userProfile;
    } else {
      return JSON.parse(sessionStorage.getItem("userProfile"));
    }
  }
  handleError(error: any) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      this.spinnerService.display(false);
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      this.showHttpErrorAlert(error.status);
      this.spinnerService.display(false);
    }
    this.spinnerService.display(false);
    return throwError(errorMessage);
  }

  showHttpErrorAlert(code: any) {
    if (code === 0) {
      swal.fire({
        width: 400,
        title: this.translate.instant("Alert"),
        text: this.translate.instant("Internet connection failed:" + code),
        icon: "warning",
        heightAuto: false,
      });
    } else if (code === 400) {
      swal.fire({
        width: 400,
        title: this.translate.instant("Alert"),
        text: this.translate.instant("Bad Request"),
        icon: "error",
        heightAuto: false,
      });
    } else if (code === 401) {
      swal.fire({
        width: 400,
        title: this.translate.instant("Alert"),
        text: this.translate.instant("Unauthorized"),
        icon: "warning",
        heightAuto: false,
      });
    } else if (code === 403) {
      swal.fire({
        width: 400,
        title: this.translate.instant("Alert"),
        text: this.translate.instant("Forbidden"),
        icon: "warning",
        heightAuto: false,
      });
    } else if (code === 404) {
      swal.fire({
        width: 400,
        title: this.translate.instant("Alert"),
        text: this.translate.instant("Not Found"),
        icon: "warning",
        heightAuto: false,
      });
    } else if (code === 500) {
      swal.fire({
        width: 400,
        title: this.translate.instant("Alert"),
        text: this.translate.instant("Internal Server Error"),
        icon: "warning",
        heightAuto: false,
      });
    } else if (code === 502) {
      swal.fire({
        width: 400,
        title: this.translate.instant("Alert"),
        text: this.translate.instant("Bad Gateway"),
        icon: "warning",
        heightAuto: false,
      });
    } else if (code === 503) {
      swal.fire({
        width: 400,
        title: this.translate.instant("Alert"),
        text: this.translate.instant("Service Unavailable"),
        icon: "warning",
        heightAuto: false,
      });
    } else if (code === 504) {
      swal.fire({
        width: 400,
        title: this.translate.instant("Alert"),
        text: this.translate.instant("Gateway Timeout"),
        icon: "warning",
        heightAuto: false,
      });
    } else if (code === 409) {
      swal.fire({
        width: 400,
        title: this.translate.instant("Alert"),
        text: this.translate.instant(""),
        icon: "warning",
        heightAuto: false,
      });
    } else {
      swal
        .fire({
          width: 400,
          title: this.translate.instant("Alert"),
          text: this.translate.instant("Connection Error:" + code),
          icon: "warning",
          heightAuto: false,
        })
        .then((data) => {
          this.spinnerService.display(false);
        });
    }
  }

  handleICAError(error: any) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      this.spinnerService.display(false);
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      this.showHttpICAErrorAlert(error.status);
      this.spinnerService.display(false);
    }
    this.spinnerService.display(false);
    return throwError(errorMessage);
  }

  showHttpICAErrorAlert(code: any) {
    if (code === 0) {
      swal.fire({
        width: 400,
        title: this.translate.instant("Alert"),
        text: this.translate.instant("Unknown Error:" + code),
        icon: "warning",
        heightAuto: false,
      });
    } else if (code === 400) {
      swal.fire({
        width: 400,
        title: this.translate.instant("Alert"),
        text: this.translate.instant("Bad Request"),
        icon: "error",
        heightAuto: false,
      });
    } else if (code === 401) {
      swal.fire({
        width: 400,
        title: this.translate.instant("Alert"),
        text: this.translate.instant("Unauthorized"),
        icon: "warning",
        heightAuto: false,
      });
    } else if (code === 403) {
      swal.fire({
        width: 400,
        title: this.translate.instant("Alert"),
        text: this.translate.instant("Forbidden"),
        icon: "warning",
        heightAuto: false,
      });
    } else if (code === 404) {
      swal.fire({
        width: 400,
        title: this.translate.instant("Alert"),
        text: this.translate.instant("Not Found"),
        icon: "warning",
        heightAuto: false,
      });
    } else if (code === 500) {
      swal.fire({
        width: 400,
        title: this.translate.instant("Alert"),
        text: this.translate.instant("Internal Server Error"),
        icon: "warning",
        heightAuto: false,
      });
    } else if (code === 502) {
      swal.fire({
        width: 400,
        title: this.translate.instant("Alert"),
        text: this.translate.instant("Bad Gateway"),
        icon: "warning",
        heightAuto: false,
      });
    } else if (code === 503) {
      swal.fire({
        width: 400,
        title: this.translate.instant("Alert"),
        text: this.translate.instant("Service Unavailable"),
        icon: "warning",
        heightAuto: false,
      });
    } else if (code === 504) {
      swal.fire({
        width: 400,
        title: this.translate.instant("Alert"),
        text: this.translate.instant("Gateway Timeout"),
        icon: "warning",
        heightAuto: false,
      });
    } else if (code === 409) {
      swal.fire({
        width: 400,
        title: this.translate.instant("Alert"),
        text: this.translate.instant("Device Already Registered"),
        icon: "warning",
        heightAuto: false,
      });
    } else {
      swal.fire({
        width: 400,
        title: this.translate.instant("Alert"),
        text: this.translate.instant("Connection Error:" + code),
        icon: "warning",
        heightAuto: false,
      });
    }
  }
}
