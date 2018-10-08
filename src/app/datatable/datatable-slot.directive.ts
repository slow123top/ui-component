import { Directive, TemplateRef } from '@angular/core';
@Directive({
    selector: '[slot]'
})
export class SlotDirective {
    constructor(public templateRef: TemplateRef<any>) {
    }
}
