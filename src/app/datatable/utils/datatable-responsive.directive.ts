import { FarrisColDirective } from './../../../responsive/col/res-col.directive';
import { Directive, Input, ElementRef, HostBinding, OnInit } from '@angular/core';
@Directive({
    selector: '[farris-column-res]'
})
export class FarrisColumnResDirective implements OnInit {
    @Input() show: string;
    @Input() media: object;
    className = ' ';
    @HostBinding('class')
    get columnResClassName() {
        return `${this.getCellClassName()} ${this.getResCellClassName()}`;
    }
    constructor(private el: ElementRef) {
    }
    // 获取组件本身存在的类
    ngOnInit() {
        if (this.el.nativeElement.classList.value) {
            this.className += this.el.nativeElement.classList.value;
        }
    }
    getCellClassName() {
        return `${this.className}${this.show === 'cell' ? ' d-table-cell' : this.show === 'none' ? 'd-none' : ''}`;
    }
    getResCellClassName() {
        if (!this.media) {
            return '';
        }
        return Object.keys(this.media).reduce((pre, current) => {
            return `${pre} ${this.media[current] === 'cell' ? 'd-' + current + '-table-cell' :
                this.media[current] === 'none' ? 'd-' + current + '-none' : ''}`;
        }, '');
    }
}
