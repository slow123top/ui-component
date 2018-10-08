import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'dt-checkbox',
    template: `
        <div class="custom-control custom-checkbox  custom-control-inline dt-checkbox">
            <input type="checkbox" class="custom-control-input"  [checked]="checked">
            <label class="custom-control-label" (click)="handleClick($event)"></label>
        </div>
    `
})
export class DTCheckboxComponent implements OnInit {
    @Input() checked: boolean;
    @Input() id: string;
    @Input() disabled: boolean;

    @Output() checkedChange = new EventEmitter();

    constructor() { }

    ngOnInit() { }

    handleClick(event) {
        if (!this.disabled) {
            this.checkedChange.emit({originalEvent: event, checked: !this.checked});
        }
    }
}
