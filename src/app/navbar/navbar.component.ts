import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  logoMain: any;
  logoSecondary: any;

  constructor(private sanitizer: DomSanitizer,
    private _router: Router) { }

  ngOnInit(): void {
    this.getLogo();
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getLogo() {
    this.logoMain = this.sanitize(
      "data:image/png;base64, " + sessionStorage.getItem("logoMain")
    );
    this.logoSecondary = this.sanitize(
      "data:image/png;base64, " + sessionStorage.getItem("logoSecondary")
    );
  }

  logout() {
    sessionStorage.clear();
    this._router.navigate([""]);
  }
}
