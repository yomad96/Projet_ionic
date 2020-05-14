import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuizzPageRoutingModule } from './quizz-routing.module';

import { QuizzPage } from './quizz.page';
import {MapPageModule} from "../map/map.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        QuizzPageRoutingModule,
        MapPageModule
    ],
  declarations: [QuizzPage]
})
export class QuizzPageModule {}
