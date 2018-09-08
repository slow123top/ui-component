import { Directive, Input, HostBinding, OnInit, ElementRef, Renderer2 } from '@angular/core';
@Directive({
    selector: '[flexLayout]'
})
export class FlexLayoutDirective implements OnInit {
    // 设置显示 flex
    @Input() type: string = 'flex';
    // 设置flex相关属性
    @Input('direction') flexDirection: string = 'row';
    @Input() wrap: string = 'nowrap';
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
        return this.getFlexStyle();
    }
    // 设置 display flex
    @HostBinding('class.d-flex') displayFlex: boolean = this.type === 'flex';
    @HostBinding('class.d-inline-flex') displayInlineFlex: boolean = this.type === 'inline-flex';
    constructor(private el: ElementRef, private render: Renderer2) {
    }
    ngOnInit(): void {
        // 宽高  赋值
        this.render.setStyle(this.el.nativeElement, 'width', this.width);
        this.render.setStyle(this.el.nativeElement, 'height', this.height);
    }
    getFlexStyle() {
        return `${this.getDirectionClass()} ${this.getWrapClass()} ${this.getJsutifyClass()} ${this.getAlignClass()}`;
    }
    /*宽高类型是 string或者number 解析宽高  尺寸 */
    resolveSize(size) {
        const regex = /px|em|rem|pt|%/;
        // 说明是字符串
        return regex.test(size) ? `${parseInt(size, 10)}${size.match(regex)[0]}` : `${size}px`;
    }
    /* 获取flex方向类*/
    getDirectionClass() {
        const isDirection = this.flexDirection !== 'row';
        return isDirection ? `flex-${this.flexDirection}` : '';
    }
    /* 获取flex 换行类 */
    getWrapClass() {
        const isWrap = this.wrap !== 'nowrap';
        return isWrap ? `flex-${this.wrap}` : '';
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
