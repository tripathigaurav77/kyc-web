import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppConfig } from "./config";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { ApiService } from "./api.service";
import { SpinnerService } from "./spinner.service";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { TreeviewModule } from "ngx-treeview";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClient } from "@angular/common/http";
import { LoggerService } from "./logger.service";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { MatButtonModule } from "@angular/material/button";
import { MatStepperModule } from "@angular/material/stepper"
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, "./assets/i18n/", ".json");
}

import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { UserVerificationComponent } from './user-verification/user-verification.component';
import { SearchCustomerComponent } from './search-customer/search-customer.component';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TemplateLoadComponent } from './template-load/template-load.component';
import { MatDialogComponent } from './mat-dialog/mat-dialog.component';
import { KycDataComponent } from './kyc-data/kyc-data.component';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';

export function initConfig(config: AppConfig) {
  return () => config.load();
}
@NgModule({
  declarations: [
    LoginFormComponent,
    AppComponent,
    UserVerificationComponent,
    SearchCustomerComponent,
    TransactionDetailsComponent,
    NavbarComponent,
    TemplateLoadComponent,
    MatDialogComponent,
    KycDataComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatExpansionModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatStepperModule,MatDialogModule,
    TreeviewModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],

  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    
    SpinnerService,
    ApiService,
    LoggerService,
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [AppConfig],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}


