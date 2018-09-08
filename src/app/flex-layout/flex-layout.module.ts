import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutComponent } from './flex-layout.component';
import { FlexLayoutDirective } from './flex-directive/flex-directive';
import { FlexItemDirective } from './flex-directive/flex-item.directive';
@NgModule({
    imports: [
        BrowserModule
    ],
    declarations: [
        FlexLayoutComponent,
        FlexLayoutDirective,
        FlexItemDirective
    ],
    exports: [
        FlexLayoutComponent,
        FlexLayoutDirective,
        FlexItemDirective
    ]
})
export class FlexLayoutMoudle {

}
