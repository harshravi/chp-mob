import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitePatientModalComponent } from './invite-patient-modal.component';

describe('InvitePatientModalComponent', () => {
  let component: InvitePatientModalComponent;
  let fixture: ComponentFixture<InvitePatientModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitePatientModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitePatientModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
