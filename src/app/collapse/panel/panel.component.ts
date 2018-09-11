import { Component, Input, Output, EventEmitter, Optional, OnChanges, OnInit, AfterViewInit } from '@angular/core';
import { CollapsePanelItemComponent } from '../panel-item/panel-item.component';
@Component({
    selector: 'collapse-panel',
    templateUrl: './panel.component.html',
    styleUrls: ['./panel.component.css']
})
export class CollapsePanelComponent implements OnInit, AfterViewInit {
    @Input() accordion: boolean = false;
    // 双向绑定展开panel的value
    _value: string[] = [];
    @Input()
    get value() {
        return this._value;
    }
    set value(value: string[]) {
        this._value = value;
        this.updateActive();
    }
    @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();
    //
    panels: CollapsePanelItemComponent[] = [];
    constructor() {
    }
    ngOnInit() {
    }
    ngAfterViewInit() {
        console.log(this.value);
        this.updateActive();
    }
    updateModel(value) {
        const index = this.value.findIndex(val => val === value);
        // 如果没有匹配到点击的panel值  可能model里面不存在 可能model为空
        if (index < 0) {
            // 若是手风琴模式  先把所有panel处于未激活状态
            if (this.accordion) {
                this.value = [];
            }
            // 如果不是手风琴模式  直接激活即可
            this.value.push(value);
            this.updateActive();
            return this.valueChange.emit({
                value: this.value,
                index: this.index()
            });
        }
        // 如果index不为-1
        // 手风琴模式  关闭所有激活状态
        if (this.accordion) {
            this.value = [];
        } else {
            // 非手风琴模式 直接关闭当前panel即可
            this._value.splice(index, 1);
        }
        this.updateActive();
        this.valueChange.emit({
            value: this.value,
            index: this.index()
        });
    }
    /* 所有组件进行 active更新 */
    updateActive() {
        console.log(this.panels);
        this.panels.forEach(item => {
            item.isActive();
        });
    }
    index() {
        const indexArr = [];
        this.panels.forEach((item, index) => {
            if (item.active === true) {
                indexArr.push(index);
            }
        });
        return indexArr;
    }

}
