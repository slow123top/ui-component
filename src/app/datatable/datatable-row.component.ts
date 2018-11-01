import { Directive, OnInit, Input, ContentChild, TemplateRef } from '@angular/core';
import { SlotDirective } from './datatable-slot.directive';
@Directive({
    selector: 'data-row'
})
export class RowDirective implements OnInit {
    //    指定模板
    @Input()
    @ContentChild(SlotDirective, { read: TemplateRef }) rowTempl: TemplateRef<any>;
    constructor() {
    }
    ngOnInit() {
    }
}
