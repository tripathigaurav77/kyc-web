import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'kyc-data',
  templateUrl: './kyc-data.component.html',
  styleUrls: ['./kyc-data.component.css']
})
export class KycDataComponent implements OnInit {

  panelOpenState = false;
  
  constructor() { }

  ngOnInit(): void {
  }
}
