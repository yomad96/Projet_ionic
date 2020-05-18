import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapPageRoutingModule } from './map-routing.module';

import { MapPage } from './map.page';
import {ImageModalPage} from "../image-modal/image-modal.page";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MapPageRoutingModule
    ],
    exports: [
        MapPage
    ],
    declarations: [MapPage, ImageModalPage],
    entryComponents: [ImageModalPage]
})
export class MapPageModule {}
