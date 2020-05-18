import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResultatQuestionPageRoutingModule } from './resultat-question-routing.module';

import { ResultatQuestionPage } from './resultat-question.page';
import {ModalPage} from '../modal/modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResultatQuestionPageRoutingModule
  ],
  declarations: [ResultatQuestionPage, ModalPage],
  entryComponents: [ModalPage]

})
export class ResultatQuestionPageModule {}
