import { RowDirective } from './datatable-row.component';
import {
    Component, OnInit, ViewChild, ElementRef, OnChanges, Input, SimpleChanges, ContentChild, TemplateRef,
    QueryList, AfterContentInit, AfterViewInit, ContentChildren, Output, EventEmitter, ViewEncapsulation, OnDestroy
} from '@angular/core';
import { PerfectScrollbarComponent } from '../../perfect-scorll';
import PerfectScrollbar from '../../../node_modules/perfect-scrollbar';
import { DataTableColumn } from './datatable-column';
import { ColumnDirective } from './datatable-column.component';
import { DataTableService } from './datatable.service';
import { PaginationInstance } from '../pagination/pagination-instance';
import { IdService } from '../../common';
import { DataTableHeaderComponent } from './table/datatable-header.component';
import { DataTableBodyComponent } from './table/datatable-body.component';
import { deepCopy } from './datatable-column';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { throttleTime } from 'rxjs/operators/throttleTime';
import { size } from './utils/datatable-responsive-size';
import { Subscription } from 'rxjs/Subscription';
@Component({
    selector: 'farris-datatable',
    templateUrl: './datatable.component.html',
    styleUrls: ['./datatable.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DataTableComponent implements OnInit, OnChanges, OnDestroy, AfterContentInit, AfterViewInit {

    @Input() id: string;
    @Input() size: string;
    // table 尺寸
    @Input() width;
    @Input() height;
    // 是否填充
    @Input() fill = false;
    // 默认分页
    @Input() pagination = true;
    @Input() pageSize = 10;
    @Input() pageIndex = 1;
    @Input() pageList = [10, 20, 30, 50, 100];
    @Input() total = 0;
    // 列 数据
    @Input() columns: DataTableColumn[];
    // 可筛选
    @Input() showFilterBar = false;
    // table  数据
    _data = [];
    @Input()
    get data() {
        return this._data;
    }
    set data(data: Array<any>) {
        this._data = data;
    }
    // 深拷贝data 数据
    copyData: any;
    //
    @Input() remote = 'client';
    // 多选  单选
    @Input() singleSelect = true;
    @Input() idField = 'id';
    // 显示鼠标悬停高亮
    @Input() hover: boolean;
    // 斑马线
    @Input() striped: boolean;
    // 边框
    @Input() bordered: boolean;
    // 支持添加行 单元格 类样式
    @Input() rowClassName: (row: any, index: number) => string;
    @Input() cellClassName: (value: any, col: any) => string;
    // 滚动条引用
    @ViewChild('scorllableBody') scorllableBody: ElementRef;
    @ViewChild('tableHeader') tableHeader: ElementRef;
    @ViewChild('tablePager') tablePager: ElementRef;
    @ViewChild('dtHeader') dtHeader: DataTableHeaderComponent;
    @ViewChild('dtBody') dtBody: DataTableBodyComponent;
    @ViewChild('dtLeftBody') dtLeftBody: DataTableBodyComponent;
    @ViewChild('dtRightBody') dtRightBody: DataTableBodyComponent;
    @ViewChild('dtLeftFixed') dtLeftFixed: ElementRef;
    @ViewChild('dtRightFixed') dtRightFixed: ElementRef;
    // 分页事件
    @Output() pageChanged = new EventEmitter();
    @Output() pageSizeChanged = new EventEmitter();
    @Output() search = new EventEmitter<{ field: string, value: string }>();
    @Output() sortChange = new EventEmitter<any>();
    @ContentChildren(RowDirective) rowsRef: QueryList<RowDirective>;
    @ContentChildren(ColumnDirective) columnsRef: QueryList<ColumnDirective>;
    // 表尾
    @ContentChild('footer') footer: TemplateRef<any>;
    // 表格可拖拽宽度系列
    // 拖拽线
    @ViewChild('dragLine') dragLine: ElementRef;
    // 是否可拖拽  默认可以
    @Input() dragable = false;
    // 是否有行模板
    hasRowTepml = false;
    // 用户获取表头+表格内容的高度  宽度  等
    datatableContainer: HTMLDivElement;
    // 拖拽线初始化位置
    dragLineX: number;
    // 设置拖拽停止器
    moveable = false;
    //
    currentColumn: any;
    // 设置左固定列
    hasFixed: boolean;
    fixedLeftWidth: string;
    // 设置右固定列
    fixedRightWidth: string;
    searchData = { field: '*', value: '' };
    // 事件订阅存储  便于销毁
    subscription: Subscription[] = [];
    // 固定列时  同一行的tr hover事件
    headerTr: any;
    leftFixedHeaderTr: any;
    rightFixedHeaderTr: any;
    public filter = '';
    public maxSize = 7;
    public directionLinks = true;
    public autoHide = false;
    public responsive = true;
    public paginationOptions: PaginationInstance = {
        id: 'Farris-DataTable-Pagination',
        itemsPerPage: this.pageSize,
        currentPage: this.pageIndex,
        pageList: this.pageList,
        totalItems: this.total
    };
    public labels: any = {
        previousLabel: ' ',
        nextLabel: ' ',
        screenReaderPaginationLabel: 'Pagination',
        screenReaderPageLabel: 'page',
        screenReaderCurrentLabel: `You're on page`
    };

    private _currentRowIndex = -1;
    get currentRowIndex(): number {
        return this._currentRowIndex;
    }

    private _currentRow = undefined;
    get currentRow() {
        return this._currentRow;
    }

    get selections() {
        return this.dtBody.selections;
    }

    @ViewChild('perfectScrollbar') perfectScrollbar: PerfectScrollbarComponent;

    scorllableBodyHeight: number;
    constructor(private dataService: DataTableService, private idService: IdService, private el: ElementRef) {

        this.dataService.selectedRow.subscribe((e: any) => {
            if (this.singleSelect) {
                this._currentRowIndex = e.rowIndex;
                this._currentRow = e.rowData;
            } else {
                if (this.selections) {
                    this.dtHeader.isCheckAll = Object.keys(this.selections).length === this.data.length;
                }
            }
        });

        this.dataService.unSelectedRow.subscribe((e: any) => {
            if (this.singleSelect) {
                this._currentRow = undefined;
                this._currentRowIndex = -1;
            } else {
                this.dtHeader.isCheckAll = false;
            }
        });
    }

    private ps: PerfectScrollbar;

    ngOnInit() {
        setTimeout(() => {
            this.setBodyHeight();
            this.ps = this.perfectScrollbar.directiveRef.ps();
        });

        if (!this.id) {
            this.id = this.idService.uuid(8, 16);
        }

        this.paginationOptions.id = this.paginationOptions.id + this.id;

        if (this.remote === 'server') {
            this.paginationOptions['totalItems'] = 1;
        }
    }

    private setBodyHeight() {
        if (this.showFilterBar) {
            this.height = this.height - 58;
        }
        this.scorllableBodyHeight = this.height - this.tableHeader.nativeElement.clientHeight;

        if (this.pagination) {
            this.scorllableBodyHeight = this.scorllableBodyHeight - 50;
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.height && !changes.height.isFirstChange()) {
            this.setBodyHeight();
        }

        if (changes.total && !changes.total.isFirstChange()) {
            this.paginationOptions.totalItems = changes.total.currentValue;
        }

        if (changes.pageSize) {
            this.paginationOptions.itemsPerPage = changes.pageSize.currentValue;
        }

        if (changes.data && !changes.data.isFirstChange()) {
            const rows = changes.data.currentValue;
            if (rows) {
                if (this.selections) {
                    const keys = Object.keys(this.selections);
                    if (keys.length) {
                        let count = 0;
                        const ids = rows.map((row: any) => {
                            return row[this.idField].toString();
                        });
                        keys.forEach(id => {
                            if (ids.indexOf(id) > -1) {
                                count++;
                            }
                        });
                        this.dtHeader.isCheckAll = ids.length === count;
                    } else {
                        this.dtHeader.isCheckAll = false;
                    }
                } else {
                    this.dtHeader.isCheckAll = false;
                }
            }
            this.dataService.loadSuccess.next(changes.data.currentValue);
        }
    }

    ngAfterContentInit() {
        // 支持行模板
        if (this.rowsRef && this.rowsRef.length) {
            this.data = this.rowsRef.map(row => {
                return {
                    rowTempl: row.rowTempl
                };
            });
            return;
        }
        // 支持列组件写入
        if (!this.columns) {
            if (this.columnsRef && this.columnsRef.length) {
                this.columns = this.columnsRef.map(col => {
                    return {
                        width: col.width,
                        title: col.title,
                        field: col.field,
                        align: col.align,
                        fixed: col.fixed,
                        className: col.className,
                        media: col.media,
                        sortable: col.sortable,
                        edit: col.edit,
                        // 单元格模板
                        cellTempl: col.cellTempl
                    };
                });
            }
        }
        this.fixColByResolution();
    }
    ngOnDestroy() {
        this.subscription.forEach(sub => {
            sub.unsubscribe();
        });
        this.subscription = [];
    }
    ngAfterViewInit() {
        // 获取表格容器  即表格
        this.datatableContainer = this.el.nativeElement.querySelector('.farris-datatable');
        // this.headerTr = this.tableHeader.nativeElement.querySelectorAll('tr');
        setTimeout(() => {
            this.setFixed(window.innerWidth);
        }, 0);
    }
    /**
     *tr hover事件
     */
    hoverTr(tr, color) {
        const headerTrs = this.dtBody.el.nativeElement.querySelectorAll('tr');
        let leftBodyTrs, rightBodyTrs;
        if (this.dtLeftFixed) {
            leftBodyTrs = this.dtLeftFixed.nativeElement.querySelectorAll('tr');
        }
        if (this.dtRightFixed) {
            rightBodyTrs = this.dtRightFixed.nativeElement.querySelectorAll('tr');
        }
        for (let i = 0; i < headerTrs.length; i++) {
            if (tr === headerTrs[i] || (leftBodyTrs && tr === leftBodyTrs[i]) || (rightBodyTrs && tr === rightBodyTrs[i])) {
                headerTrs[i].style.backgroundColor = color;
                // tslint:disable-next-line:no-unused-expression
                leftBodyTrs && (leftBodyTrs[i].style.backgroundColor = color);
                // tslint:disable-next-line:no-unused-expression
                rightBodyTrs && (rightBodyTrs[i].style.backgroundColor = color);
            }
        }
    }
    /**
    *tr hover事件
    */
    clickTr(tr) {
        let leftBodyTrs, rightBodyTrs;
        if (this.dtLeftFixed) {
            leftBodyTrs = this.dtLeftFixed.nativeElement.querySelectorAll('tr');
        }
        if (this.dtRightFixed) {
            rightBodyTrs = this.dtRightFixed.nativeElement.querySelectorAll('tr');
        }
        const bodyTrs = this.dtBody.el.nativeElement.querySelectorAll('tr');
        for (let i = 0; i < bodyTrs.length; i++) {
            if (tr === bodyTrs[i] || (leftBodyTrs && tr === leftBodyTrs[i]) || (rightBodyTrs && tr === rightBodyTrs[i])) {
                this.dtBody.selectedRow(i, this.dtBody.rows[i]);
                if (this.dtLeftBody) {
                    this.dtLeftBody.selectedRow(i, this.dtLeftBody.rows[i]);
                }
                if (this.dtRightBody) {
                    this.dtRightBody.selectedRow(i, this.dtRightBody.rows[i]);
                }
            }
        }
    }
    /**
     * 排序弹出事件
     */
    headerSortChange(event) {
        this.sortChange.emit(event);
    }
    /**
     * 获取表格容器的位置  距离左边视口和上边视口的距离  如果页面有滚动条  需要加上滚动条滚动的数值
     */
    getContainerOffset() {
        const rect = this.datatableContainer.getBoundingClientRect();
        return {
            left: rect.left + document.body.scrollLeft,
            top: rect.top + document.body.scrollTop,
            right: rect.right,
            bottom: rect.bottom,
        };
    }
    /**
     *  鼠标按下  开始记录拖拽线的位置  拖拽线到达当前鼠标位置
     * @param {MouseEvent} 鼠标对象
     */
    beginDrag(e) {
        this.dragLineX = e.pageX;
        event.preventDefault();
    }
    /**
     * 鼠标移动 移动拖拽线位置变动
     * @param {MouseEvent} 鼠标对象
     */
    moveDrag(e) {
        // 获取表格的左边距离
        const containerLeft = this.getContainerOffset().left;
        // 设置拖拽线的高度  即获取表头+表内容+表尾的高度  此表格结构包含了分页  因此要去掉分页的高度
        if (this.tablePager) {
            this.dragLine.nativeElement.style.height = this.datatableContainer.offsetHeight -
                this.tablePager.nativeElement.offsetHeight + 'px';
        } else {
            const headerHeight = this.el.nativeElement.querySelector('.farris-table-header');
            const bodyHeight = this.el.nativeElement.querySelector('.ps-content');
            this.dragLine.nativeElement.style.height = headerHeight.offsetHeight +
                bodyHeight.offsetHeight + 'px';
        }
        // 设置拖拽线的高度 拖拽线相对于表格relative定位是absolute，因此是0
        this.dragLine.nativeElement.style.top = 0 + 'px';
        // 鼠标移动时，拖拽线相对于表格的位置
        this.dragLine.nativeElement.style.left = (e.pageX - containerLeft) + 'px';
        // 鼠标移动  设置拖拽线总是可见
        this.dragLine.nativeElement.style.display = 'block';
    }
    // 重新计算表格宽度
    /**
     * 鼠标抬起 重新计算单元格宽度
     * @param {MouseEvent} 鼠标对象
     * @param {Element} 要重新计算宽度的DOM对象
     */
    stopDrag(e, column) {
        this.resizeColumn(e, column);
    }
    resizeColumn(e, column) {
        // 偏移量
        const delta = e.pageX - this.dragLineX;
        // 拖拽前列宽
        const columnWidth = column.offsetWidth;
        // 拖拽后列宽
        const newColumnWidth = columnWidth + delta;
        // 最小宽度
        const minWidth = column.style.minWidth || 15;
        // 新宽度大于最小宽度时  重新设置宽度
        if (newColumnWidth > parseInt(minWidth, 10)) {
            let colIndex = -1;
            const cols = this.tableHeader.nativeElement.querySelectorAll('th');
            for (let i = 0; i < cols.length; i++) {
                if (cols[i] === column) {
                    colIndex = i;
                }
            }
            // 设置后一个单元格宽度
            const nextColumn = column.nextElementSibling;
            if (nextColumn) {
                // 下一个单元格的最新宽度
                const nextColumnWidth = nextColumn.offsetWidth - delta;
                const nextColumnMinWidth = nextColumn.style.minWidth || 15;
                if (newColumnWidth > 15 && nextColumnWidth > parseInt(nextColumnMinWidth, 10)) {
                    this.resizeColGroup(this.dtHeader.el.nativeElement, colIndex, newColumnWidth, nextColumnWidth);
                    this.resizeColGroup(this.dtBody.el.nativeElement, colIndex, newColumnWidth, nextColumnWidth);
                }
            }
        }
        // 计算宽度完毕  设置拖拽线隐藏
        this.dragLine.nativeElement.style.display = 'none';
    }
    resizeColGroup(table, resizeColumnIndex, newColumnWidth, nextColumnWidth) {
        if (table) {
            // 此处要视不同的表格结构来确定 本组件中  header和body结构相同
            const colGroup = table.childNodes[1].children[0].nodeName === 'COLGROUP' ?
                table.childNodes[1].children[0] : null;
            if (colGroup) {
                const col = colGroup.children[resizeColumnIndex];
                const nextCol = col.nextElementSibling;
                col.style.width = newColumnWidth + 'px';

                if (nextCol && nextColumnWidth) {
                    nextCol.style.width = nextColumnWidth + 'px';
                }
            } else {
                throw new Error('Scrollable tables require a colgroup to support resizable columns');
            }
        }
    }
    onScrollX(e: any) {
        // 横向滚动 非固定表头滚动
        const x = e.srcElement.scrollLeft;
        this.tableHeader.nativeElement.scrollTo(x, 0);
    }
    /**
     * 滚动条纵向滚动
     */
    onScrollY(e: any) {
        if (!this.hasFixed) {
            return;
        }
        const y = e.srcElement.scrollTop;
        this.dtLeftFixed.nativeElement.style.top = -y + 'px';
        this.dtRightFixed.nativeElement.style.top = -y + 'px';

    }

    onPageChange(page: { pageIndex: number, pageSize: number }) {
        this.pageIndex = page.pageIndex;
        this.paginationOptions.currentPage = page.pageIndex;
        this.pageChanged.emit({ pageInfo: page, search: this.searchData });
    }

    onPageSizeChange(pageSize: number) {
        this.pageSize = pageSize;
        this.paginationOptions.itemsPerPage = pageSize;
        this.pageSizeChanged.emit({ pageInfo: { pageIndex: this.pageIndex, pageSize: pageSize }, search: this.searchData });
    }

    onSearch() {
        this.search.emit(this.searchData);
    }

    onCheckAll(state: boolean) {
        this.dataService.selectedAll.next(state);
    }

    selectRow(row: any) { }

    // tslint:disable-next-line:no-shadowed-variable
    resize(size: { width: number, height: number }) {
        this.width = size.width;
        this.height = size.height;

        this.setBodyHeight();
    }

    loadData(data: { pageSize: number, total: number, data: any, pageIndex: number }) {
        this.data = data.data;
        if (this.pagination) {
            this.paginationOptions.totalItems = data.total;
            this.paginationOptions.itemsPerPage = data.pageSize;
            this.total = data.total;
            this.pageSize = data.pageSize;
            this.pageIndex = data.pageIndex;
        }
    }

    // 根据分辨率  设置固定列
    fixColByResolution() {
        this.subscription.push(fromEvent(window, 'resize')
            .pipe(throttleTime(80))
            .subscribe((e: any) => {
                this.setFixed(e.srcElement.innerWidth);
            }));
    }
    // 如果columns存在数据  进行固定列的设置
    setFixed(currentWidth) {
        if (!this.columns) {
            return;
        }
        this.hasFixed = this.columns.some(ele => {
            return ele.hasOwnProperty('fixed') && ele.fixed;
        });
        if (this.hasFixed) {
            const fixedArr = this.columns.filter(ele => {
                return ele.hasOwnProperty('fixed');
            });
            const dtHeaderTh = this.dtHeader.el.nativeElement.querySelectorAll('th');
            // let resWidth = 0;
            // 初始化就已经固定列
            let leftWidth = 0;
            leftWidth += fixedArr.filter(element => {
                return element.fixed === 'left';
            }).reduce((pre, current) => {
                return pre + current.width;
            }, 0);
            // 暂存此时固定列宽度
            if (leftWidth) {
                if (!this.singleSelect) {
                    // 若为多选  则首先固定住
                    leftWidth += dtHeaderTh[0].clientWidth;
                }
            }
            const tempLeftWidth = leftWidth;
            // 响应式固定列  每增加一个固定列  固定列宽度就会增加
            const responsiveLeftFixed = fixedArr.filter(ele => {
                return typeof ele.fixed === 'object' && ele.fixed.type === 'left';
            });
            let count = 0;
            responsiveLeftFixed.forEach(element => {
                if (element.fixed.type === 'left') {
                    if (currentWidth <= size[element.fixed.media][1]) {
                        if (!this.singleSelect) {
                            // 若为多选  则首先固定住
                            leftWidth += dtHeaderTh[0].clientWidth;
                        }
                        leftWidth += element.width;
                        count++;
                    }
                }
            });
            if (!tempLeftWidth) {
                if (leftWidth > tempLeftWidth) {
                    leftWidth -= dtHeaderTh[0].clientWidth * (count - 1);
                } else {
                    leftWidth -= dtHeaderTh[0].clientWidth * count;
                }
            } else {
                if (leftWidth > tempLeftWidth) {
                    leftWidth -= dtHeaderTh[0].clientWidth * count;
                }
            }
            this.fixedLeftWidth = leftWidth + 'px';
            // 右固定列设置
            let rightWidth = fixedArr.filter(element => {
                return element.fixed === 'right';
            }).reduce((pre, current) => {
                return pre + current.width;
            }, 0);
            // 响应式固定列  每增加一个固定列  固定列宽度就会增加
            const responsiveRightFixed = fixedArr.filter(ele => {
                return typeof ele.fixed === 'object' && ele.fixed.type === 'right';
            });

            responsiveRightFixed.forEach(element => {
                if (element.fixed.type === 'right') {
                    if (currentWidth <= size[element.fixed.media][1]) {
                        rightWidth += element.width;
                    }
                }
            });
            this.fixedRightWidth = rightWidth + 'px';
        }
    }

}

