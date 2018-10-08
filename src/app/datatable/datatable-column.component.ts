import { Directive, OnInit, Input, ContentChild, TemplateRef, ElementRef, HostBinding } from '@angular/core';
import { SlotDirective } from './datatable-slot.directive';
@Directive({
    selector: 'data-column, [data-column]',
})
export class ColumnDirective implements OnInit {

    @Input() title: string;
    @Input() field: string;
    @Input() width: number;
    @Input() align: 'left' | 'center' | 'right' = 'left';
    @Input() fixed: 'left' | 'right';
    @Input() className: string;
    @Input() media: object;
    @HostBinding('class.fixed') fixedClass = this.fixed === 'left';
    //    指定模板
    @Input()
    @ContentChild(SlotDirective, { read: TemplateRef }) cellTempl: TemplateRef<any>;

    constructor(private el: ElementRef) {

    }

    ngOnInit() { }
}
