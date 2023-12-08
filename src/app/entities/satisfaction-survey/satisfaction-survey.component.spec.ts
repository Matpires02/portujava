import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SatisfactionSurveyComponent } from './satisfaction-survey.component';

describe('SatisfactionSurveyComponent', () => {
  let component: SatisfactionSurveyComponent;
  let fixture: ComponentFixture<SatisfactionSurveyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SatisfactionSurveyComponent]
    });
    fixture = TestBed.createComponent(SatisfactionSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
