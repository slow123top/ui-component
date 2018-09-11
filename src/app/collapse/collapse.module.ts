import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CollapsePanelComponent } from './panel/panel.component';
import { CollapsePanelItemComponent } from './panel-item/panel-item.component';
@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule
    ],
    declarations: [CollapsePanelComponent, CollapsePanelItemComponent],
    exports: [CollapsePanelComponent, CollapsePanelItemComponent]
})
export class CollapsePanelModule {
}
