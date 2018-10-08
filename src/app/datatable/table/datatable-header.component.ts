import { DataTableComponent } from './../datatable.component';
import { Component, OnInit, Input, EventEmitter, AfterViewInit, Output, ElementRef, ViewEncapsulation } from '@angular/core';
import { DataTableColumn, deepCopy } from '../datatable-column';

@Component({
    selector: 'datatable-header',
    template: `
    <table class="table"
    [class.table-hover]="hover">
        <colgroup>
            <col class="dt-checkbox-cell" *ngIf="!singleSelect"/>
            <col *ngFor="let col of columns" [style.width]="col.width + 'px'"/>
        </colgroup>
        <thead>
            <tr>
                <th drag-column class="dt-checkbox-cell" *ngIf="!singleSelect">
                    <dt-checkbox [checked]="isCheckAll" (checkedChange)="onCheckedChange($event)"></dt-checkbox>
                </th>
                <th
                farris-column-res
                [media]="col.media"
                [class.td-hidden]="col.fixed==='left'||col.fixed==='right'"
                drag-column *ngFor="let col of columns;let i=index" [attr.align]="col.align">
                    <div>
                        <span>{{ col.title }}</span>
                        <span class="sort-container" *ngIf="col.sortable">
                            <span [class.clicked]="this.copyColumns[i].sortType&&this.copyColumns[i].sortType==='asc'"
                            class="k-icon k-i-arrow-60-up" (click)="sortData(col,i,'asc')"></span>
                            <span [class.clicked]="this.copyColumns[i].sortType&&this.copyColumns[i].sortType==='desc'"
                            class="k-icon k-i-arrow-60-down" (click)="sortData(col,i,'desc')"></span>
                        </span>
                    </div>
                </th>
            </tr>
        </thead>
    </table>
    `,
    styleUrls: ['./datatable-header.component.scss']
})

export class DataTableHeaderComponent implements OnInit, AfterViewInit {
    @Input() hover: boolean;
    @Input() columns: DataTableColumn[];
    @Input() singleSelect = true;
    // 数据排序使用
    @Input() rows: any;
    // 恢复源数据使用
    @Input() data: any;
    @Input() rowClassName: (row: any, index: number) => string;

    @Output() checkedAll = new EventEmitter();
    @Output() sortChange = new EventEmitter();
    @Output() rowsChange = new EventEmitter<any>();
    clickedUp = false;
    clickedDown = false;
    copyColumns: any;
    copyRows: any;
    originRows: any;
    isCheckAll = false;
    allClass = ' ';
    constructor(public el: ElementRef) {
        this.allClass += this.el.nativeElement.classList.value;
    }
    width = '100%';
    ngOnInit() {
        // this.allClass+=
        this.copyColumns = this.deepCopyData().copyColumns;
        this.copyRows = this.deepCopyData().copyRows;
        this.originRows = deepCopy(this.rows);
        // this.copyRows = deep
    }
    ngAfterViewInit() {
    }

    onCheckedChange($event) {
        this.isCheckAll = $event.checked;
        this.checkedAll.emit($event.checked);
    }
    createRowClassName(row, index) {
        return this.rowClassName ? this.rowClassName(row, index) : '';
    }
    /**
     * 升序 降序
     */
    sortData(col, index, sortType) {
        const copyColumn = this.copyColumns[index];
        if (copyColumn && copyColumn.sortType !== 'normal') {
            if (copyColumn.sortType === sortType) {
                // 还原数据
                this.originRows = deepCopy(this.data);
                this.rowsChange.emit(this.originRows);
                copyColumn.sortType = 'normal';
            } else {
                const field = copyColumn.field;
                this.copyColumns[index].sortType = sortType;
                if (sortType === 'asc') {
                    this.rows = this.rows.sort((pre, next) => {
                        return pre[field] - next[field];
                    });
                } else if (sortType === 'desc') {
                    this.rows = this.rows.sort((pre, next) => {
                        return next[field] - pre[field];
                    });
                } else {
                    return;
                }
            }
        } else {
            // 排序
            const field = copyColumn.field;
            this.copyColumns[index].sortType = sortType;
            if (sortType === 'asc') {
                this.rows = this.rows.sort((pre, next) => {
                    return pre[field] - next[field];
                });
            } else if (sortType === 'desc') {
                this.rows = this.rows.sort((pre, next) => {
                    return next[field] - pre[field];
                });
            } else {
                return;
            }
        }
        this.sortChange.emit({
            key: copyColumn.field,
            type: copyColumn.sortType,
            data: copyColumn,
        });

    }

    deepCopyData() {
        const copyColumns = deepCopy(this.columns);
        const copyRows = deepCopy(this.rows);
        copyColumns.forEach(element => {
            element.sortType = 'normal';
        });
        return {
            copyColumns: copyColumns,
            copyRows: copyRows
        };
    }

}
