import { Directive, Input, ElementRef, NgZone, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { DataTableComponent } from '../datatable.component';
@Directive({
    selector: '[farris-hover]'
})
export class FarrisHoverDirective implements OnInit, AfterViewInit {
    trMouseEnterEvent: any;
    constructor(public dt: DataTableComponent, private el: ElementRef, public ngZone: NgZone) {
    }
    // 获取组件本身存在的类
    ngOnInit() {
    }
    @HostListener('mouseenter') onMouseEnter() {
        if (this.enableHover()) {
            this.dt.hoverTr(this.el.nativeElement, '#f3f8f9');
        }
    }
    @HostListener('mouseleave') onMouseLeave() {
        if (this.enableHover()) {
            this.dt.hoverTr(this.el.nativeElement, '#fff');
        }
    }
    @HostListener('click') onClick() {
        this.dt.clickTr(this.el.nativeElement);
    }
    enableHover() {
        return this.dt.hover;
    }
    ngAfterViewInit(): void {
    }
    hoverTr(e: any) {
    }

}
