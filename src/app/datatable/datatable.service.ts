import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export interface SelectRowArgs {
    rowIndex: number;
    rowData: any;
}

@Injectable()
export class DataTableService {

    loadSuccess = new Subject();

    /**
     * 选中行事件
     */
    selectedRow = new Subject<SelectRowArgs>();

    unSelectedRow = new Subject<SelectRowArgs>();

    selectedAll = new Subject();

    dblClickRow = new Subject();

    constructor() { }
}
