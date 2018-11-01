import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InputsModule } from '@progress/kendo-angular-inputs';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { IntlModule } from '@progress/kendo-angular-intl';
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
import { FarrisHoverDirective } from './utils/datatable-hover.directive';
import { FarrisEditFocusDirective } from './utils/datatable-edit-focus.directive';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PerfectScrollbarModule,
        PaginationModule,
        FarrisCommonModule,
        InputsModule,
        DateInputsModule,
        IntlModule
    ],
    exports: [DataTableComponent, DataTableHeaderComponent, ColumnDirective, DataTableBodyComponent,
        FarrisCommonModule, DatatableFooterComponent, SlotDirective,
        RowDirective, DragColumnDirective, FarrisColumnResDirective, FarrisHoverDirective, FarrisEditFocusDirective],
    declarations: [DataTableComponent, DataTableHeaderComponent, ColumnDirective, DragColumnDirective,
        DataTableBodyComponent, DTCheckboxComponent, DatatableFooterComponent,
        SlotDirective, RowDirective, FarrisColumnResDirective, FarrisHoverDirective, FarrisEditFocusDirective],
    providers: [DataTableService]
})
export class DataTableModule { }
