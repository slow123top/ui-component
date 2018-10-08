import { Component, Input, ContentChild, TemplateRef } from '@angular/core';
import { DataTableColumn } from '../datatable-column';
import { SlotDirective } from '../datatable-slot.directive';
@Component({
    selector: 'datatable-footer',
    template:
        `
    <div class="table"
    [class.table-hover]="hover">
        <ng-container *ngIf="!tableFooter">
                <table class="table table-hover">
                        <colgroup>
                            <col class="dt-checkbox-cell" *ngIf="!singleSelect"/>
                            <col *ngFor="let col of columns" [style.width]="col.width + 'px'" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th class="dt-checkbox-cell" *ngIf="!singleSelect">
                                    <dt-checkbox [checked]="isCheckAll" (checkedChange)="onCheckedChange($event)"></dt-checkbox>
                                </th>
                                <th  *ngFor="let col of columns" [attr.align]="col.align" >{{ col.title }}</th>
                            </tr>
                        </thead>
                    </table>
        </ng-container>
        <ng-template *ngIf="tableFooter" [ngTemplateOutlet]="tableFooter"></ng-template>
</div>
    `
})
export class DatatableFooterComponent {
    @Input() hover: boolean;
    @Input() column: DataTableColumn[];
    // 表格 footer 可添加模板
    @Input()
    @ContentChild(SlotDirective, { read: TemplateRef }) tableFooter: TemplateRef<any>;
    constructor() {
    }
}
