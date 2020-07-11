import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KycDataComponent } from './kyc-data.component';

describe('KycDataComponent', () => {
  let component: KycDataComponent;
  let fixture: ComponentFixture<KycDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KycDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KycDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
