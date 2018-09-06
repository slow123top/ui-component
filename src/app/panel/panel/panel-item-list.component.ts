import {
    Component, Input, AfterViewInit,
    ViewEncapsulation, Output, EventEmitter
} from '@angular/core';
@Component({
    selector: 'fold-panel',
    templateUrl: './panel-item-list.component.html',
    styleUrls: ['./panel-item-list.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class FoldPanelComponent implements AfterViewInit {
    // 可设置flex布局 主轴方向  默认纵向  从上到下
    @Input() title: string;
    // 设置手风琴模式  至多只有一个panel可以被选中
    @Input() accordion = false;
    // 面板宽度sdds
    _width: any;
    _height: any;
    subscriber: Function[] = [];
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

    // 双向绑定 用于存取active状态的panel
    modelValue: Array<string | number> = [];
    @Input()
    get model() {
        return this.modelValue;
    }
    set model(modelValue) {
        // 获取用户输入的值
        this.modelValue = modelValue;
        this.updateSubscriber();
    }
    // 双向绑定  当model数组改变时，相应的active状态的panel也要改变 从而改变视图

    @Output() modelChange: EventEmitter<Array<string | number>> = new EventEmitter<Array<string | number>>();

    ngAfterViewInit(): void {
        const timer: number = window.setTimeout(() => {
            this.updateSubscriber();
            window.clearTimeout(timer);
        }, 0);

    }
    /**
     * 通过改变model从而间接改变active

     * @param {string|number} value panel存储激活值

     */
    updateModel(value) {
        const index = this.modelValue.findIndex(val => val === value);
        // 如果没有匹配到点击的panel值  可能model里面不存在 可能model为空
        if (index < 0) {
            // 若是手风琴模式  先把所有panel处于未激活状态
            if (this.accordion) {
                this.model = [];
            }
            // 如果不是手风琴模式  直接激活即可
            this.modelValue.push(value);
            this.updateSubscriber();
            return this.modelChange.emit(this.modelValue);
        }
        // 如果index不为-1
        // 手风琴模式  关闭所有激活状态
        if (this.accordion) {
            this.model = [];
        } else {
            // 非手风琴模式 直接关闭当前panel即可
            this.modelValue.splice(index, 1);
        }
        this.updateSubscriber();
        this.modelChange.emit(this.modelValue);
    }
    private updateSubscriber(): void {
        this.subscriber.forEach(handle => handle());
    }
}
