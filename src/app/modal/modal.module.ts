import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppModalComponent } from './title/modal.component';
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
        AppModalComponent
    ],
    exports: [
        AppModalComponent
    ],
})
export class ModalModule {

}
