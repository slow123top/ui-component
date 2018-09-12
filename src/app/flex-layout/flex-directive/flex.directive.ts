import { Directive, Input, HostBinding, OnInit, ElementRef, Renderer2 } from '@angular/core';
@Directive({
    selector: '[flex]'
})
export class FlexDirective implements OnInit {
    @Input() fill: boolean = false;
    @Input() direction: string = 'row';
    @Input() type: string = 'flex';
    @Input('justify') justifyContent: string = 'start';
    @Input('align') alignItems: string = 'start';
    // 可以设置宽度和高度
    // 设置宽 高属性
    _width: string | number;
    _height: string | number;
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
    @HostBinding(`class`)
    get currentStyle() {
        return `${this.nativeClass} ${this.getDirection()} ${this.getJsutifyClass()} ${this.getAlignClass()}`;
    }
    @HostBinding('class.flex-fill')
    get flexFill() {
        return this.fill;
    }
    @HostBinding('class.d-flex') displayFlex: boolean = this.type === 'flex';
    nativeClass = ' ';
    constructor(private el: ElementRef, private render: Renderer2) {
        this.nativeClass += this.el.nativeElement.classList.value;
    }
    ngOnInit(): void {
        this.render.setStyle(this.el.nativeElement, 'width', this.width);
        this.render.setStyle(this.el.nativeElement, 'height', this.height);
    }
    /*宽高类型是 string或者number 解析宽高  尺寸 */
    resolveSize(size) {
        const regex = /px|em|rem|pt|%/;
        // 说明是字符串
        return regex.test(size) ? `${parseInt(size, 10)}${size.match(regex)[0]}` : `${size}px`;
    }
    getDirection() {
        return this.direction !== 'row' ? `flex-${this.direction}` : '';
    }
    /* 获取flex 主轴排列方式类 */
    getJsutifyClass() {
        const isJustify = this.justifyContent !== 'start';

        return isJustify ? `justify-content-${this.justifyContent}` : '';
    }
    /* 获取flex交叉轴 排列方式类 */
    getAlignClass() {
        const isAlign = this.alignItems !== 'start';
        return isAlign ? `align-items-${this.alignItems}` : '';
    }
}
