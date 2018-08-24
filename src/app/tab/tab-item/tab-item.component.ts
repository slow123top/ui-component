import { Component, Input, TemplateRef, ContentChild } from '@angular/core';
@Component({
    selector: 'app-tab-item',
    templateUrl: './tab-item.component.html',
    styleUrls: ['./tab-item.component.css']
})

export class AppTabItemComponent {
    // 默认tab 标题 或者是选中标题
    @Input() tabTitle: string;
    // 设置标签页是否可以点击
    @Input() disabled: boolean;
    select = false;
    // @ContentChild('tabContent') tabContent: TemplateRef<any>;
    // title = 'this.tabTitle';
    constructor() {

    }



}
