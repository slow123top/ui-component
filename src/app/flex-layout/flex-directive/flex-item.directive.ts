import { Directive, Input, HostBinding, OnInit, ElementRef, Renderer2 } from '@angular/core';
@Directive({
    selector: '[flexItem]'
})
export class FlexItemDirective implements OnInit {
    // 设置显示 order flex align-self(可以覆盖align-items)
    @Input() order: number = 0;
    @Input() flex: string | number = 'auto';
    @Input('align') alignSelf: string = 'auto';
    @HostBinding(`class`)
    get currentStyle() {
        return this.getFlexItemStyle();
    }
    constructor(el: ElementRef, private render: Renderer2) {
    }
    ngOnInit(): void {

    }
    /* 获取flex item类名 */
    getFlexItemStyle() {
        const pres = [
            { 'order': this.order },
            { 'flex': this.flex },
            { 'align-self': this.alignSelf }
        ];
        let classes = '';
        pres.forEach(item => {
            classes += `${this.createClass(Object.keys(item)[0], item[Object.keys(item)[0]])} `;
        });
        return classes.substring(0, classes.length - 1);
    }
    /**
     * 组合类名
     *@param {string} pre 类名前缀
     *@param {string} prop 要输入的属性值
    */
    createClass(pre, prop) {
        return `${pre}-${prop}`;
    }
}
