import { Component, Input, ContentChild, TemplateRef, Optional, OnInit } from '@angular/core';
import { CollapsePanelComponent } from '../panel/panel.component';
import { dropAnimation } from '../util/drop.animation';
@Component({
    selector: 'collapse-panel-item',
    templateUrl: './panel-item.component.html',
    styleUrls: ['./panel-item.component.css'],
    animations: [dropAnimation]
})
export class CollapsePanelItemComponent implements OnInit {
    // 与容器value 匹配
    @Input() value: string;
    // 标题
    @Input() title: string;
    // 禁止选中
    @Input() disabled: boolean = false;
    // 头部模板  内容模板 工具按钮模板
    @ContentChild('headTempl') headTempl: TemplateRef<any>;
    @ContentChild('contentTempl') contentTempl: TemplateRef<any>;
    @ContentChild('toolTempl') toolTempl: TemplateRef<any>;
    // active
    active = false;
    // accordion
    accordionTitle: boolean;
    constructor(
        @Optional() private collapsePanel: CollapsePanelComponent
    ) { }
    ngOnInit() {
        this.collapsePanel.panels.push(this);
        this.accordionTitle = true;
    }
    selectPanel(e) {
        this.collapsePanel.updateModel(this.value);
        // this.active = !this.active;
    }
    isActive() {
        this.active = this.collapsePanel.value.some(val => val === this.value);
    }
}
