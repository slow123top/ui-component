import { Component, Input, ContentChild, TemplateRef, Optional, OnInit } from '@angular/core';
import { dropAnimation } from '../util/drop.animation';
import { FoldPanelComponent } from '../panel/panel-item-list.component';
@Component({
    selector: 'fold-panel-item',
    templateUrl: './panel-item.component.html',
    styleUrls: ['./panel-item.component.css'],
    animations: [dropAnimation]
})


export class FoldPanelItemComponent implements OnInit {
    // 设置panel大小
    _width: any;
    _height: any;
    @Input()
    get width() {
        return (typeof this._width) === 'string' ? `${parseInt(this._width, 10)}px` : `${this._width}px`;
    }
    set width(width) {
        this._width = width;
    }
    @Input()
    get height() {
        return (typeof this._height) === 'string' ? `${parseInt(this._height, 10)}px` : `${this._height}px`;
    }
    set height(height) {
        this._height = height;
    }
    @Input() fold = true;
    @Input() value: string | number;
    // 标识最后一个元素

    // 默认tab 标题 或者是选中标题
    @Input('title') tabTitle: string;
    // 设置标签页是否可以点击
    @Input() disabled: boolean;

    // 头部模板
    @ContentChild('headTempl') headRef: TemplateRef<any>;
    // 工具按钮模板
    @ContentChild('toolTempl') toolTempl: TemplateRef<any>;
    // 内容
    @ContentChild('contentTempl') contentRef: TemplateRef<any>;
    // 默认panel 处于非激活状态
    active = false;
    // 单个panel样式
    single = false;
    constructor(
        // 可选根组件引用
        @Optional() private foldPanel: FoldPanelComponent
    ) {
    }
    ngOnInit() {
        // 如果多个panel排列
        if (this.foldPanel) {
            const updateHandle: Function = () => this.isActive();
            this.foldPanel.subscriber.push(updateHandle);
            return;
        }
        // 如果设置panel不折叠  并处于永远激活状态
        if (!this.fold) {
            this.active = true;
        }
        //   设置单个panel样式
        this.single = true;


    }
    /*
     */
    isActive() {
        this.active = this.foldPanel.model.some(val => this.value === val);

    }
    /**
     * TODO 禁止事件捕获  不够完善
     * 激活 失去焦点 面板
     * @param event 事件对象
     */
    selectPanelItem(e) {
        // 禁止事件捕获
        if (e.target.nodeName === 'BUTTON') {
            return;
        }

        // value 若为空  初始化随机数字符串
        if (this.foldPanel) {
            if (this.value === null || this.value === undefined) {
                this.value = Math.random().toString(16).substring(2, 10);
            }
            this.foldPanel.updateModel(this.value);
            return;
        }
        if (!this.fold) {
            this.active = true;
            return;
        }
        this.active = !this.active;

    }



}
