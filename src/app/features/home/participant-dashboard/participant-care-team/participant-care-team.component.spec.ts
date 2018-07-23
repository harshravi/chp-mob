import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantCareTeamComponent } from './participant-care-team.component';

describe('ParticipantCareTeamComponent', () => {
  let component: ParticipantCareTeamComponent;
  let fixture: ComponentFixture<ParticipantCareTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipantCareTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantCareTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
