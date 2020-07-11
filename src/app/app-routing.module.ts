import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { UserVerificationComponent } from './user-verification/user-verification.component';
import { SearchCustomerComponent } from './search-customer/search-customer.component';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { TemplateLoadComponent } from './template-load/template-load.component';
import { KycDataComponent } from './kyc-data/kyc-data.component';

const routes: Routes = [
  { path: "", component: LoginFormComponent },
  { path: "login", component: LoginFormComponent },
  { path: "verification", component: UserVerificationComponent },
  { path: "searchCustomer", component: SearchCustomerComponent },
  { path: "details", component: TransactionDetailsComponent },
  { path: "template-load", component: TemplateLoadComponent },
  { path: "kyc-data", component: KycDataComponent },


  { path: "home", component: HomePageComponent }, //Enter channel info
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: "reload",
    useHash: true,
  }),],
  exports: [RouterModule]
})
export class AppRoutingModule { }
