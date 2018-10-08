import { Component, OnInit, Input, Inject, forwardRef, Optional, SkipSelf, ElementRef, Output, EventEmitter } from '@angular/core';
import { DataTableColumn, convertColumns } from '../datatable-column';
import { DataTableService } from '../datatable.service';
import { DataTableComponent } from '../datatable.component';

@Component({
    selector: 'datatable-body',
    template: `
    <table class="table"
    [class.table-hover]="hover"
    [class.table-striped]="striped"
    [class.table-bordered]="bordered">
        <colgroup>
            <col class="dt-checkbox-cell" *ngIf="!dt.singleSelect"/>
            <col *ngFor="let col of columns" [style.width]="col.width + 'px'" />
        </colgroup>
        <tbody class="ui-table-tbody">
            <ng-container *ngIf="!isRowTempl">
                <tr [ngClass]="createRowClassName(row,i)"
                *ngFor="let row of rows ; let i=index" (click)="selectedRow($event,i, row)"
                 [class.selected]="isSelected(row)">
                    <td class="dt-checkbox-cell" *ngIf="!dt.singleSelect">
                        <dt-checkbox [checked]="isSelected(row)" (checkedChange)="onChecked($event, i, row)"></dt-checkbox>
                    </td>
                    <td
                    farris-column-res
                    [media]="col.media"
                    [ngClass]="getTdClassName(row[col.field],col)"
                    *ngFor="let col of columns">
                        <ng-container *ngIf="!col.cellTempl; else cellTemp">
                            <span *ngIf="col.formatter" [innerHtml]=" formatData( row[col.field], col.formatter)">
                            </span>
                            <span *ngIf="!col.formatter">{{ row[col.field] }}</span>
                        </ng-container>
                        <ng-template #cellTemp [ngTemplateOutlet]="col.cellTempl"></ng-template>
                    </td>
                </tr>
            </ng-container>
            <ng-container *ngIf="isRowTempl">
                <tr *ngFor="let row of rows ; let i=index">
                    <td style="width:100%">
                        <ng-template [ngTemplateOutlet]="row.rowTempl"></ng-template>
                    </td>
                </tr>
            </ng-container>
        </tbody>
    </table>
    `
})
export class DataTableBodyComponent implements OnInit {
    @Input() hover: boolean;
    @Input() bordered: boolean;
    @Input() striped: boolean;
    @Input() columns: DataTableColumn[];
    @Input() rows: any[] = [];
    @Input() rowClassName: (row: any, index: number) => string;
    @Input() cellClassName: (value: any, col: any) => string;
    className = {};
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

        // 设置column列 类
        // this
        // this.columns = convertColumns(this.columns, 'left');
        // this.columns = convertColumns(this.columns, 'right');
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
    // 添加自定义设置列 单元格类样式
    getTdClassName(value, col) {
        const tempClassName = {};
        // 列类的样式
        if (col.className && Object.prototype.toString.call(col.className) === '[object String]') {
            tempClassName[col.className] = true;
        }
        // 行类的样式
        if (this.cellClassName && this.cellClassName(value, col)) {
            tempClassName[this.cellClassName(value, col)] = true;
        }
        // 定义是否有固定列
        // if (col.hasOwbProperty('fixed')) {
        //     if (col.fixed === 'left' || col.fixed === 'right') {
        //         tempClassName[`td-hidden`] = true;
        //     } else if (col.fixed.type && col.fixed.media) {
        //         tempClassName[`td-${col.fixed.media}-hidden`] = true;
        //     } else {
        //         tempClassName[`td-hidden`] = false;
        //     }
        // }
        return tempClassName;
    }
    createRowClassName(row, index) {
        return this.rowClassName ? this.rowClassName(row, index) : '';
    }
}
