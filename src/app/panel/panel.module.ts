import { NgModule } from '@angular/core';
import { BrowserModule, } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

import { FoldPanelComponent } from './panel/panel-item-list.component';
import { FoldPanelItemComponent } from './panel-item/panel-item.component';
import { ButtonModule } from '@progress/kendo-angular-buttons';
@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        ButtonModule,
        BrowserAnimationsModule
    ],
    declarations: [
        FoldPanelComponent,
        FoldPanelItemComponent,
    ],
    exports: [
        FoldPanelComponent,
        FoldPanelItemComponent
    ],
})
export class PanelModule {

}
