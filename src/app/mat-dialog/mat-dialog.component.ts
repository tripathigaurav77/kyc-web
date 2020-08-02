import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../template-load/template-load.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { SpinnerService } from '../spinner.service';
import { LoggerService } from '../logger.service';
import { TranslateService } from '@ngx-translate/core';
import swal from "sweetalert2";

declare var Toolkit: any;

@Component({
  selector: 'app-mat-dialog',
  templateUrl: './mat-dialog.component.html',
  styleUrls: ['./mat-dialog.component.css']
})
export class MatDialogComponent implements OnInit {

  userName: string;
  userId;
  cro: FormGroup;
  verifyBioBool = false;
  fingerIndexObject = ["--select--"];
  self = this;
  enable = false;
  IsNfc = false;
  ToolkitOB = null;
  javaService = "";
  readerClass = null;
  options = {
    jnlp_address: this.javaService + "IDCardToolkitService.jnlp",
    debugEnabled: true,
    agent_tls_enabled: false,
    agent_host_name: "toolkitagent.emiratesid.ae",
    toolkitConfig: ""
  };
  IsSam = {
    sam_secure_messaging: false
  };
  isCardValid = false;
  shouldProceed = false;
  bioMetricVerified = false;
  cardResponse: any;
  kycData: any;
  selectedFinger: any;
  userDisplayName: any;
  viewMode = 'vid';
  ChannelName;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
  private _fb: FormBuilder,
  private router: Router,
  private activeRoute: ActivatedRoute,
  private _service: ApiService,
  private spinnerService: SpinnerService,
  private loggerService: LoggerService,
  private translate: TranslateService) { }

  ngOnInit(): void {
    this.ChannelName = sessionStorage.getItem("ChannelName");
    this.spinnerService.display(true);
    this.activeRoute.paramMap.subscribe(params => {
      this.userName = params.get("userName");
      this.loggerService.log(this.userName);
    });

    // this.getUserdata();
    this.options.toolkitConfig =
      "vg_url = http://appshield.digitaltrusttech.com/VGPreProd/ValidationGatewayService\n";
    this.options.toolkitConfig += "vg_connection_timeout = 60 \n";
    // options.toolkitConfig += 'config_url =' + localAddress + 'config \n';
    // options.toolkitConfig += 'environment = dev \n';
    this.options.toolkitConfig += 'log_level = "INFO" \n';
    this.options.toolkitConfig += "log_performance_time = true \n";
    this.options.toolkitConfig += "read_publicdata_offline = true \n";

    // this.cro = this._fb.group({
    //   user: [this.userId, Validators.required],
    //   authData: ["", Validators.required],
    //   authScheme: ["EIDACARD", Validators.required]
    // });
    this.Initialize();
  }

  // getUserdata() {
  //   this._service.GetService("/user/get/", this.userName).subscribe(
  //     (data: any) => {
  //       this.loggerService.log("sddsf");
  //       this.loggerService.log(data.result);
  //       if (data.success) {
  //         this.userId = data.result.userId;
  //         this.userDisplayName = data.result.userDisplayName;
  //       }
  //       this.spinnerService.display(false);
  //     },
  //     error => {
  //       this.loggerService.log(error);
  //     }
  //   );
  // }

  Initialize() {
    try {
      // showLoader();
      /* Ensures only one connection is open at a time */
      if (this.ToolkitOB !== null) {
        return "WebSocket is already active...";
      }
      /*  if
       provide the call backs */
      this.ToolkitOB = new Toolkit(
        this.onOpenHandlerCB.bind(
          this
        ) /* reference to onOpen call back function */,
        this.closeHandlerCB.bind(
          this
        ) /* reference to onClose call back function */,
        this.errorHandlerCB.bind(
          this
        ) /* reference to onError call back function */,
        this.options /* options */
      );
      this.loggerService.log("inside try");
      // displayProgress('Initializing web socket ...');
    } catch (e) {
      // hideLoader();
      this.spinnerService.display(false);
      this.loggerService.log("inside catch");
      swal.fire({
        width: 400,
        title: this.translate.instant("Alert"),
        text: this.translate.instant(
          "Webcomponent Initialization Failed, Details:" + e
        ),
        icon: "warning",
        heightAuto: false
      });
    }
  }

  onOpenHandlerCB = function (response, error) {
    // hideLoader();
    this.loggerService.log("error : " + error);
    this.loggerService.log("response : " + response);
    if (error === null) {
      /**
       * call the list reader function and pass listReaderCB to be executed
       * after the response is received from server
       */
      this.loggerService.log(this.IsSam);

      if (this.IsSam.sam_secure_messaging) {
        this.ToolkitOB.getReaderWithEmiratesId(this.listReaderCB.bind(this));
      } else {
        this.ToolkitOB.listReaders(this.listReaderCB.bind(this));
      }
    } else {
      this.spinnerService.display(false);
      this.ToolkitOB = null;
    }
  };

  closeHandlerCB = function (response) {
    // hideLoader();
    this.loggerService.log("Inside Cro Provisioning :: closeHandler()");
    this.ToolkitOB = null;
    this.readerClass = null;
    if (null !== response && undefined == response) {
    }
  };

  errorHandlerCB = function (err) {
    this.readerClass = null;
    this.ToolkitOB = null;
    if (null !== err) {
      // hideLoader();
      this.spinnerService.display(false);
      swal.fire({
        width: 400,
        title: this.translate.instant("Alert"),
        text: this.translate.instant("errorHandler ERROR :" + err),
        icon: "warning",
        heightAuto: false
      });
    }
  };

  listReaderCB(response, error) {
    if (error !== null) {
      this.spinnerService.display(false);
      swal.fire({
        width: 400,
        title: this.translate.instant("Alert"),
        text: error.message || error.description,
        icon: "warning",
        heightAuto: false
      });

      this.ToolkitOB = null;
    } else {
      let readerName = null;
      let readerList = response;
      if (this.IsSam.sam_secure_messaging) {
        this.readerClass = readerList;
      } else {
        if (readerList && 0 < readerList.length) {
          this.readerClass = readerList[0];
        } else {
          return "No readers found";
        }
      }

      let ret = this.readerClass.connect(this.connectReaderCB.bind(this));
      if ("" !== ret) {
      }
    }
  }

  connectReaderCB(response, error) {
    if (null !== error) {
      this.spinnerService.display(false);
      swal.fire({
        width: 400,
        title: this.translate.instant("Alert"),
        text: error.code + " : " + error.message,
        icon: "warning",
        heightAuto: false
      });
      this.ToolkitOB = null;
      return;
    }
    this.readerClass.getInterfaceType(this.getInterfaceCB.bind(this));
  }

  getInterfaceCB(response, error) {
    if (null !== error) {
      this.spinnerService.display(false);
      alert(error.code + " : " + error.message);
      this.ToolkitOB = null;
      return;
    }
    if (response === 2) {
      this.self.IsNfc = true;
    } else {
      this.self.IsNfc = false;
    }

    if (this.ToolkitOB !== null) {
      this.CheckCardStatus();
    }
  }

  CheckCardStatus() {
    if (null === this.readerClass || undefined === this.readerClass) {
      // alert('ERROR : Reader is not initiaized.');
      this.spinnerService.display(false);
      return;
    }
    let randomStr = this.generateRandomString(40);
    let requestId = btoa(randomStr);
    this.readerClass.checkCardStatus(
      requestId,
      this.CheckCardStatusCB.bind(this)
    );
  }
  CheckCardStatusCB(response, error) {
    if (error !== null) {
      this.spinnerService.display(false);
      // alert("InValid :" + error.message || 'card');
      alert(error.message);
      this.isCardValid = false;
      this.enable = true;
      return;
    }

    // alert('Card Is Valid: ' + response.xmlString);
    this.isCardValid = true;
    this.verifyBioBool = true;
    this.spinnerService.display(false);
    if (response.xmlString !== null && response.xmlString !== undefined) {
      // setVerifyXml('cardStatusDiv', response.xmlString);
    }
    this.enable = true;
  }

  generateRandomString(length) {
    let text = "";
    let possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  readPublicDataCB(response, error) {
    if (error !== null) {
      this.spinnerService.display(false);
      this.loggerService.log("ReadcardError :: " + error);
    }

    this.cardResponse = response;
    console.log(response);
    console.log(this.cardResponse.tooklitResponse);
    this.loggerService.log(
      "ToolkitResponse :: " + this.cardResponse.tooklitResponse
    );
    this.cro.patchValue({
      authData: this.cardResponse.tooklitResponse
    });
    this.spinnerService.display(false);
  }

  readCardData() {
    this.spinnerService.display(true);
    if (null === this.readerClass || undefined === this.readerClass) {
      this.spinnerService.display(false);
      alert("ERROR : Reader is not initiaized.");
      return;
    }

    const randomStr = this.generateRandomString(40);
    /* convert randomString to base64 */
    const requestId = btoa(randomStr);

    let address = true;
    if (this.self.IsNfc) {
      address = false;
    }

    this.readerClass.readPublicData(
      requestId,
      true,
      true,
      true,
      true,
      address,
      this.readPublicDataCB.bind(this)
    );
  }

  VerifyBioSubmit() {
    this.spinnerService.display(true);
    if (null === this.readerClass || undefined === this.readerClass) {
      alert("ERROR : Websocket is not initilaized.");
      this.spinnerService.display(false);
      return;
    }
    if ("" == this.selectedFinger || undefined == this.selectedFinger) {
      this.shouldProceed = false;
      this.spinnerService.display(false);
      alert("Please select a finger.");
      return;
    }

    var sensor_timeout = 30; /* seconds */
    var randomStr = this.generateRandomString(40);
    var requestId = btoa(randomStr);
    this.readerClass.authenticateBiometricOnServer(
      requestId,
      this.selectedFinger,
      sensor_timeout,
      this.VerifyBioCB.bind(this)
    );
  }

  VerifyBioCB(response, error) {
    //hideLoader();
    this.loggerService.log(response);
    if (null !== error) {
      this.spinnerService.display(false);
      this.bioMetricVerified = false;
      alert(error.message);
      if (
        error.toolkit_response !== null &&
        error.toolkit_response !== undefined
      ) {
        //setVerifyXml('verifyBioDiv', error.toolkit_response);
      }
      return;
    }
    // biometric match success
    alert("biometric match success");
    this.bioMetricVerified = true;
    this.verifyBioBool = false;
    this.spinnerService.display(false);
    this.closeModal();
  }

  GetFingerIndex() {
    if (null === this.readerClass || undefined === this.readerClass) {
      alert("ERROR : Reader is not initiaized.");
      return;
    }

    this.readerClass.getFingerData(this.GetFingerIndexCB.bind(this));
    //changeButtonState(true);
    return;
  }

  GetFingerIndexCB(response, error) {
    //hideLoader();
    if (null !== error) {
      alert(error.message);
      var modal = document.getElementById("biometric");
      modal.style.display = "none";
      this.spinnerService.display(false);
      return;
    }
    //this.fingerIndexObject = response[0].fingerIndex + "\n" + response[1].fingerIndex;
    response.forEach(element => {
      this.fingerIndexObject.push(element.fingerIndex);
    });
  }

  openModal() {
    this.GetFingerIndex();
  }

  closeModal() {
    this.fingerIndexObject = ["--select--"];
  }

  biometric() {
    this.VerifyBioSubmit();
  }

  selectedIndex() {
    const e = document.getElementById("fingerID") as HTMLSelectElement;
    this.selectedFinger = e.options[e.selectedIndex].value;
    this.loggerService.log(this.selectedFinger);
  }

  onSubmit() {
    this._service
    .GetService("/kyctemplate/get/template-new/Empay", "")
    .subscribe(
      (data: any) => {
        console.log(data.result);
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
  this.router.navigate(['kyc-data']).then(nav => {
    console.log(nav); // true if navigation is successful
  }, err => {
    console.log(err) // when there's an error
  });
  }
}
