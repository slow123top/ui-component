import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppTabItemListComponent } from './tab-item-list/tab-item-list.component';
import { AppTabItemComponent } from './tab-item/tab-item.component';
import { CloseableDirective } from './tab-item-list/close.directive';
import { ElDialogModule } from 'element-angular/release/dialog/module';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { ButtonModule } from '@progress/kendo-angular-buttons';
// import { ButtonModule } from '@progress/kendo-';
@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        ElDialogModule,
        DialogModule,
        ButtonModule
    ],
    declarations: [
        AppTabItemComponent,
        AppTabItemListComponent,
        CloseableDirective
    ],
    exports: [
        AppTabItemComponent,
        AppTabItemListComponent,
        CloseableDirective
    ],
})
export class TabModule {

}
