import { Component, OnInit, Input, EventEmitter, AfterViewInit, Output, ElementRef } from '@angular/core';
import { DataTableColumn, convertColumns } from '../datatable-column';

@Component({
    selector: 'datatable-fixed-header',
    template: `
    <table class="table table-hover">
        <colgroup>
            <col class="dt-checkbox-cell" *ngIf="!singleSelect"/>
            <col *ngFor="let col of columns" [style.width]="col.width + 'px'"/>
        </colgroup>
        <thead>
            <tr>
                <th class="dt-checkbox-cell" *ngIf="!singleSelect">
                    <dt-checkbox [checked]="isCheckAll" (checkedChange)="onCheckedChange($event)"></dt-checkbox>
                </th>
                <th [ngClass]="getFixedClassName(col)" *ngFor="let col of columns" [attr.align]="col.align" >{{ col.title }}</th>
            </tr>
        </thead>
    </table>
    `
})

export class DataTableFixedHeaderComponent implements OnInit, AfterViewInit {
    @Input() hover: boolean;
    @Input() columns: DataTableColumn[];
    @Input() singleSelect = true;
    @Output() checkedAll = new EventEmitter();
    isCheckAll = false;
    constructor(public el: ElementRef) { }

    ngOnInit() {
        this.columns = convertColumns(this.columns, 'left');
    }

    ngAfterViewInit() {
    }

    onCheckedChange($event) {
        this.isCheckAll = $event.checked;
        this.checkedAll.emit($event.checked);
    }
    getFixedClassName(col) {
        const tempClassName = {};
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
    selector: 'datatable-fixed-right-header',
    template: `
    <table class="table table-hover">
        <colgroup>
            <col class="dt-checkbox-cell" *ngIf="!singleSelect"/>
            <col *ngFor="let col of columns" [style.width]="col.width + 'px'"/>
        </colgroup>
        <thead>
            <tr>
                <th class="dt-checkbox-cell" *ngIf="!singleSelect">
                    <dt-checkbox [checked]="isCheckAll" (checkedChange)="onCheckedChange($event)"></dt-checkbox>
                </th>
                <th [ngClass]="getFixedClassName(col)" *ngFor="let col of columns" [attr.align]="col.align" >{{ col.title }}</th>
            </tr>
        </thead>
    </table>
    `
})

export class DataTableFixedRightHeaderComponent implements OnInit, AfterViewInit {
    @Input() columns: DataTableColumn[];
    @Input() singleSelect = true;

    @Output() checkedAll = new EventEmitter();
    isCheckAll = false;
    constructor(public el: ElementRef) { }

    ngOnInit() {
        this.columns = convertColumns(this.columns, 'right');
    }

    ngAfterViewInit() {
    }

    onCheckedChange($event) {
        this.isCheckAll = $event.checked;
        this.checkedAll.emit($event.checked);
    }
    getFixedClassName(col) {
        const tempClassName = {};
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
