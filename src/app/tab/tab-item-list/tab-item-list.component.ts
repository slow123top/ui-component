import {
    Component, ContentChildren, QueryList, AfterContentInit, Input
} from '@angular/core';
import { CloseableDirective } from './close.directive';
import { AppTabItemComponent } from '../tab-item/tab-item.component';
@Component({
    selector: 'app-tab-item-list',
    templateUrl: './tab-item-list.component.html',
    styleUrls: ['./tab-item-list.component.css']
})

export class AppTabItemListComponent implements AfterContentInit {

    // 标签页关闭事件
    // 设置默认打开标签
    @Input() title: string;
    _width = '100%';
    overflowWidth = false;
    // @Input()
    // set width(width: string) {
    //     this._width = width;
    // }
    // get width() {
    //     return this._width;
    // }
    /* 和子组件content交互 */
    @ContentChildren(AppTabItemComponent)
    // 所有的组件列表  是一个QueryList类型
    tabItemList: QueryList<AppTabItemComponent>;
    tabItemListResults: AppTabItemComponent[];
    close = false;
    // 设定一个变量用于存储选中组件
    selectTabItem: any;
    constructor() {
    }
    /* 当嵌套内容渲染完毕  执行 */
    ngAfterContentInit() {
        this.tabItemListResults = this.tabItemList.toArray();
        this.selectTab(this.filteTabItemList()[0]);
    }
    selectTab(tab) {
        // QueryList里面只有第一个和最后一个，_results是所有的子组件列表
        // 首先所有内容不显示
        this.tabItemListResults.forEach((item) => {
            item.select = false;
        });
        this.selectTabItem = tab;
        this.selectTabItem.select = true;
    }
    /* 获取选中标签对应的序号 */
    filteTabItemList() {
        return this.tabItemListResults.filter((item) => {
            return item.tabTitle === this.title;
        });
    }
    /* 标签页关闭 */
    closeTab(index) {
        this.tabItemListResults[index].select = false;
        if ((index === this.tabItemListResults.length - 1) && this.tabItemListResults.length !== 1) {
            this.selectTab(this.tabItemListResults[0]);
            this.tabItemListResults.splice(index, 1);
        } else if (this.tabItemListResults.length === 1) {
            this.tabItemListResults.splice(index, 1);
        } else {
            this.selectTab(this.tabItemListResults[index + 1]);
            this.tabItemListResults.splice(index, 1);
        }


    }

}
