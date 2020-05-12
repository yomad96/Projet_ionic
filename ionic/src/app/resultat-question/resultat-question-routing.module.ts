import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResultatQuestionPage } from './resultat-question.page';

const routes: Routes = [
  {
    path: '',
    component: ResultatQuestionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResultatQuestionPageRoutingModule {}
