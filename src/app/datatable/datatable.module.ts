import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DataTableComponent } from './datatable.component';
import { PerfectScrollbarModule } from '../../perfect-scorll';
import { DataTableHeaderComponent } from './table/datatable-header.component';
import { ColumnDirective } from './datatable-column.component';
import { DataTableBodyComponent } from './table/datatable-body.component';

import { DataTableService } from './datatable.service';
import { PaginationModule } from '../pagination/pagination.module';
import { FarrisCommonModule } from '../../common';
import { DTCheckboxComponent } from './datatable-checkbox.component';

import { DatatableFooterComponent } from './table/datatable-footer.component';
import { SlotDirective } from './datatable-slot.directive';
import { RowDirective } from './datatable-row.component';

import { DragColumnDirective } from './utils/drag.directive';
import { FarrisColumnResDirective } from './utils/datatable-responsive.directive';

import { DatatableFixedComponent, DatatableFixedRightComponent } from './fixed/datatable-fixed.component';
import { DataTableFixedRightHeaderComponent, DataTableFixedHeaderComponent } from './fixed/datatable-fixed-header.component';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PerfectScrollbarModule,
        PaginationModule,
        FarrisCommonModule
    ],
    exports: [DataTableComponent, DataTableHeaderComponent, ColumnDirective, DataTableBodyComponent, DatatableFixedRightComponent,
        FarrisCommonModule, DatatableFooterComponent, SlotDirective, RowDirective, DragColumnDirective, DatatableFixedComponent,
        DataTableFixedRightHeaderComponent, DataTableFixedHeaderComponent, FarrisColumnResDirective],
    declarations: [DataTableComponent, DataTableHeaderComponent, ColumnDirective, DragColumnDirective, DatatableFixedRightComponent,
        DataTableBodyComponent, DTCheckboxComponent, DatatableFooterComponent, SlotDirective, RowDirective, DatatableFixedComponent,
        DataTableFixedRightHeaderComponent, DataTableFixedHeaderComponent, FarrisColumnResDirective],
    providers: [DataTableService]
})
export class DataTableModule { }
