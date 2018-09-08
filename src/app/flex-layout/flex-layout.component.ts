import { Component, Input, AfterContentInit } from '@angular/core';
@Component({
    selector: 'flex-layout',
    templateUrl: './flex-layout.component.html',
    styleUrls: ['./flex-layout.component.css']
})
export class FlexLayoutComponent implements AfterContentInit {
    // display flex
    @Input() type: string = 'flex';
    // 绑定class flex多个属性
    @Input() direction: string = 'row';
    @Input() wrap: string = 'nowrap';
    @Input() justify: string = 'start';
    @Input() align: string = 'start';
    _currentClass = {};
    // 设置宽 高属性
    _width: string;
    _height: string;
    @Input()
    get width() {
        // 对各个单位进行处理
        return this._width;
    }
    set width(width: any) {
        this._width = this.resolveSize(width);
    }
    @Input()
    get height() {
        return this._height;
    }
    set height(height: any) {
        this._height = this.resolveSize(height);
    }
    // flex 方向 主轴排列方式  交叉轴排列方式
    /*
    内容映射完成后 添加相关flex样式
     */
    ngAfterContentInit() {
        this.getFlexClass();
        console.log(this.direction);
        console.log(this._currentClass);
    }
    /* 解析宽高  尺寸 */
    resolveSize(size) {
        const regex = /px|em|rem|pt|%/;
        // 说明是字符串
        return regex.test(size) ? `${parseInt(size, 10)}${size.match(regex)[0]}` : `${size}px`;
    }
    /* 获取flex属性值的方法 */
    getFlexClass() {
        this._currentClass[`flex-${this.direction}`] = this.direction !== 'row';
        this._currentClass[`flex-${this.wrap}`] = this.wrap !== 'nowrap';
        this._currentClass[`justify-content-${this.justify}`] = this.justify !== 'start';
        this._currentClass[`align-items-${this.align}`] = this.align !== 'start';
    }
}
