import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventlogAssessmentDetailsComponent } from './eventlog-assessment-details.component';

describe('EventlogAssessmentDetailsComponent', () => {
  let component: EventlogAssessmentDetailsComponent;
  let fixture: ComponentFixture<EventlogAssessmentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventlogAssessmentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventlogAssessmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
