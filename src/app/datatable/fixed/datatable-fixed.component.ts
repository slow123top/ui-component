import { Component, OnInit, Input, Inject, forwardRef, Optional, SkipSelf, ElementRef } from '@angular/core';
import { DataTableColumn, convertColumns } from '../datatable-column';
import { DataTableService } from '../datatable.service';
import { DataTableComponent } from '../datatable.component';

@Component({
    selector: 'datatable-fixed',
    template:
        `
    <table  class="table table-hover"
    [class.table-hover]="hover"
    [class.table-striped]="striped"
    [class.table-bordered]="bordered">
        <colgroup>
            <col class="dt-checkbox-cell" *ngIf="!dt.singleSelect"/>
            <col *ngFor="let col of columns" [style.width]="col.width + 'px'" />
        </colgroup>
        <tbody class="ui-table-tbody">
            <tr [ngClass]="createRowClassName(row,i)"
            *ngFor="let row of rows ; let i=index" (click)="selectedRow($event,i, row)" [class.selected]="isSelected(row)">
                <td class="dt-checkbox-cell" *ngIf="!dt.singleSelect">
                    <dt-checkbox [checked]="isSelected(row)" (checkedChange)="onChecked($event, i, row)"></dt-checkbox>
                </td>
                <td [ngClass]="getTdClassName(row[col.field],col)" *ngFor="let col of columns">
                    <ng-container *ngIf="!col.gridTempl; else cellTemp">
                        <span *ngIf="col.formatter" [innerHtml]=" formatData( row[col.field], col.formatter)">
                        </span>
                        <span *ngIf="!col.formatter">{{ row[col.field] }}</span>
                    </ng-container>
                    <ng-template #cellTemp [ngTemplateOutlet]="col.gridTempl"></ng-template>
                </td>
            </tr>
        </tbody>
    </table>
    `
})
export class DatatableFixedComponent implements OnInit {
    @Input() hover: boolean;
    @Input() bordered: boolean;
    @Input() striped: boolean;
    @Input() columns: DataTableColumn[];
    @Input() rows: any[] = [];
    @Input() rowClassName: (row: any, index: number) => string;
    @Input() cellClassName: (value: any, col: any) => string;
    isRowTempl = false;
    selectedRowIndex = -1;
    _selections = {};
    get selections() {
        const keys = Object.keys(this._selections);
        if (keys.length) {
            if (this.dt.singleSelect) {
                return this._selections;
            } else {
                return keys.map((k) => this._selections[k]);
            }
        }

        return undefined;
    }

    constructor(public el: ElementRef, private dataService: DataTableService,
        @Optional() public dt: DataTableComponent) { }

    ngOnInit() {
        this.dataService.selectedAll.subscribe(allChecked => {
            const idfield = this.idField();
            this.rows.forEach(row => {
                if (allChecked) {
                    this._selections[row[idfield]] = row;
                } else {
                    delete this._selections[row[idfield]];
                }
            });
        });
        this.isRowTempl = this.rows.some(row => {
            return row.hasOwnProperty('rowTempl');
        });
        // 左固定调整列顺序
        this.columns = convertColumns(this.columns, 'left');
    }
    selectedRow(event: any, index: number, data: any) {
        if (this.dt.singleSelect) {
            if (this.selectedRowIndex !== index) {
                this.selectedRowIndex = index;
                this._selections = data;
                this.dataService.selectedRow.next({ rowIndex: index, rowData: data });
            } else {
                this.selectedRowIndex = -1;
                this._selections = undefined;
                this.dataService.unSelectedRow.next({ rowIndex: index, rowData: data });
            }
        } else {
            const idfield = this.idField();
            if (this.isSelected(data)) {
                delete this._selections[data[idfield]];
                this.dataService.unSelectedRow.next({ rowIndex: index, rowData: data });
            } else {
                this._selections[data[this.idField()]] = data;
                this.dataService.selectedRow.next({ rowIndex: index, rowData: data });
            }
        }
        event.stopPropagation();
    }

    onChecked(event: any, index: number, row: any) {
        const state = event.checked;
        const idfield = this.dt.idField;
        if (state) {
            this._selections[row[idfield]] = row;
            this.dataService.selectedRow.next({ rowIndex: index, rowData: row });
        } else {
            delete this._selections[row[idfield]];
            this.dataService.unSelectedRow.next({ rowIndex: index, rowData: row });
        }
        event.originalEvent.stopPropagation();
    }

    private idField() {
        return this.dt.idField;
    }

    isSelected(row: any) {
        const idfield = this.idField();

        if (this._selections) {
            if (this.dt.singleSelect) {
                return this._selections === row;
            } else {
                return this._selections[row[idfield]] !== undefined;
            }
        }

        return false;
    }

    formatData(value: any, opts: any) {
        switch (opts.type) {
            case 'image':
                return '<image src="' + value + '" width="' + opts.options.width + '" height = "' + opts.options.height + '">';
        }
    }
    createRowClassName(row, index) {
        return this.rowClassName ? this.rowClassName(row, index) : '';
    }
    getTdClassName(value, col) {
        const tempClassName = {};
        // 列类的样式
        if (col.className) {
            tempClassName[col.className] = true;
        }
        // 行类的样式
        if (this.cellClassName && this.cellClassName(value, col)) {
            tempClassName[this.cellClassName(value, col)] = true;
        }
        // 固定列
        // if (col.hasOwnProperty('fixed')) {
        //     if (Object.prototype.toString.call(col.fixed) === '[object String]') {
        //         if (col.fixed !== 'left') {
        //             tempClassName['td-hidden'] = true;
        //         }
        //     } else {
        //         // fixed是一个对象
        //         if (col.fixed.type !== 'left') {
        //             tempClassName[`td-hidden`] = true;
        //         } else {
        //             tempClassName[`td-${col.fixed.media}-hidden`] = true;
        //         }
        //     }
        // } else {
        //     tempClassName['td-hidden'] = true;
        // }
        return tempClassName;
    }
}
@Component({
    selector: 'datatable-fixed-right',
    template:
        `
    <table class="table"
    [class.table-hover]="hover"
    [class.table-striped]="striped"
    [class.table-bordered]="bordered">
        <colgroup>
            <col class="dt-checkbox-cell" *ngIf="!dt.singleSelect"/>
            <col *ngFor="let col of columns" [style.width]="col.width + 'px'" />
        </colgroup>
        <tbody class="ui-table-tbody">
            <tr [ngClass]="createRowClassName(row,i)"
            *ngFor="let row of rows ; let i=index" (click)="selectedRow($event,i, row)" [class.selected]="isSelected(row)">
                <td class="dt-checkbox-cell" *ngIf="!dt.singleSelect">
                    <dt-checkbox [checked]="isSelected(row)" (checkedChange)="onChecked($event, i, row)"></dt-checkbox>
                </td>
                <td
                [ngClass]="getTdRightClassName(row[col.field],col)"
                *ngFor="let col of columns">
                    <ng-container *ngIf="!col.gridTempl; else cellTemp">
                        <span *ngIf="col.formatter" [innerHtml]=" formatData( row[col.field], col.formatter)">
                        </span>
                        <span *ngIf="!col.formatter">{{ row[col.field] }}</span>
                    </ng-container>
                    <ng-template #cellTemp [ngTemplateOutlet]="col.gridTempl"></ng-template>
                </td>
            </tr>
        </tbody>
    </table>
    `
})
export class DatatableFixedRightComponent implements OnInit {
    @Input() hover: boolean;
    @Input() bordered: boolean;
    @Input() striped: boolean;
    @Input() columns: DataTableColumn[];
    @Input() rows: any[] = [];
    @Input() rowClassName: (row: any, index: number) => string;
    @Input() cellClassName: (value: any, col: any) => string;
    isRowTempl = false;
    selectedRowIndex = -1;
    _selections = {};
    get selections() {
        const keys = Object.keys(this._selections);
        if (keys.length) {
            if (this.dt.singleSelect) {
                return this._selections;
            } else {
                return keys.map((k) => this._selections[k]);
            }
        }

        return undefined;
    }

    constructor(public el: ElementRef, private dataService: DataTableService,
        @Optional() public dt: DataTableComponent) { }

    ngOnInit() {
        this.dataService.selectedAll.subscribe(allChecked => {
            const idfield = this.idField();
            this.rows.forEach(row => {
                if (allChecked) {
                    this._selections[row[idfield]] = row;
                } else {
                    delete this._selections[row[idfield]];
                }
            });
        });
        this.isRowTempl = this.rows.some(row => {
            return row.hasOwnProperty('rowTempl');
        });
        // 调整列的顺序
        this.columns = convertColumns(this.columns, 'right');
    }
    selectedRow(event: any, index: number, data: any) {
        if (this.dt.singleSelect) {
            if (this.selectedRowIndex !== index) {
                this.selectedRowIndex = index;
                this._selections = data;
                this.dataService.selectedRow.next({ rowIndex: index, rowData: data });
            } else {
                this.selectedRowIndex = -1;
                this._selections = undefined;
                this.dataService.unSelectedRow.next({ rowIndex: index, rowData: data });
            }
        } else {
            const idfield = this.idField();
            if (this.isSelected(data)) {
                delete this._selections[data[idfield]];
                this.dataService.unSelectedRow.next({ rowIndex: index, rowData: data });
            } else {
                this._selections[data[this.idField()]] = data;
                this.dataService.selectedRow.next({ rowIndex: index, rowData: data });
            }
        }
        event.stopPropagation();
    }

    onChecked(event: any, index: number, row: any) {
        const state = event.checked;
        const idfield = this.dt.idField;
        if (state) {
            this._selections[row[idfield]] = row;
            this.dataService.selectedRow.next({ rowIndex: index, rowData: row });
        } else {
            delete this._selections[row[idfield]];
            this.dataService.unSelectedRow.next({ rowIndex: index, rowData: row });
        }
        event.originalEvent.stopPropagation();
    }

    private idField() {
        return this.dt.idField;
    }

    isSelected(row: any) {
        const idfield = this.idField();

        if (this._selections) {
            if (this.dt.singleSelect) {
                return this._selections === row;
            } else {
                return this._selections[row[idfield]] !== undefined;
            }
        }

        return false;
    }

    formatData(value: any, opts: any) {
        switch (opts.type) {
            case 'image':
                return '<image src="' + value + '" width="' + opts.options.width + '" height = "' + opts.options.height + '">';
        }
    }
    createRowClassName(row, index) {
        return this.rowClassName ? this.rowClassName(row, index) : '';
    }
    getTdRightClassName(value, col) {
        const tempClassName = {};
        // 列类的样式
        if (col.className) {
            tempClassName[col.className] = true;
        }
        // 行类的样式
        if (this.cellClassName && this.cellClassName(value, col)) {
            tempClassName[this.cellClassName(value, col)] = true;
        }
        // 固定列
        // if (col.hasOwnProperty('fixed')) {
        //     if (Object.prototype.toString.call(col.fixed) === '[object String]') {
        //         if (col.fixed !== 'right') {
        //             tempClassName['td-hidden'] = true;
        //         }
        //     } else {
        //         // fixed是一个对象
        //         if (col.fixed.type !== 'right') {
        //             tempClassName[`td-hidden`] = true;
        //         } else {
        //             tempClassName[`td-${col.fixed.media}-hidden`] = true;
        //         }
        //     }
        // } else {
        //     tempClassName['td-hidden'] = true;
        // }
        return tempClassName;
    }
}
