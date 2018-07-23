import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentDetailModalComponent } from './assessment-detail-modal.component';

describe('AssessmentDetailModalComponent', () => {
  let component: AssessmentDetailModalComponent;
  let fixture: ComponentFixture<AssessmentDetailModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentDetailModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
