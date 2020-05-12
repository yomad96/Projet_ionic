import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ResultatQuestionPage } from './resultat-question.page';

describe('ResultatQuestionPage', () => {
  let component: ResultatQuestionPage;
  let fixture: ComponentFixture<ResultatQuestionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultatQuestionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ResultatQuestionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
