import { Directive, HostListener, ElementRef, NgZone, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';
import { DataTableComponent } from '../datatable.component';
@Directive({
    selector: '[drag-column]'
})
export class DragColumnDirective implements AfterViewInit, OnDestroy {
    resizer: HTMLSpanElement;

    resizerMouseDownListener: any;

    documentMouseMoveListener: any;

    documentMouseUpListener: any;

    constructor(public dt: DataTableComponent, public ngzone: NgZone,
        public el: ElementRef, public render: Renderer2) {

    }

    ngAfterViewInit() {
        if (this.isEnable()) {
            this.render.addClass(this.el.nativeElement, 'resizable-column');

            this.resizer = document.createElement('span');
            this.resizer.className = 'column-resizer';
            this.el.nativeElement.appendChild(this.resizer);

            this.ngzone.runOutsideAngular(() => {
                this.resizerMouseDownListener = this.onMouseDown.bind(this);
                this.resizer.addEventListener('mousedown', this.resizerMouseDownListener);
            });
        }
    }

    isEnable() {
        return this.dt.dragable;
    }

    bindDocumentEvents() {
        this.ngzone.runOutsideAngular(() => {
            this.documentMouseMoveListener = this.onMouseMove.bind(this);
            document.addEventListener('mousemove', this.documentMouseMoveListener);

            this.documentMouseUpListener = this.onMouseUp.bind(this);
            document.addEventListener('mouseup', this.documentMouseUpListener);
        });
    }

    unbindDocumentEvents() {
        if (this.documentMouseMoveListener) {
            document.removeEventListener('mousemove', this.documentMouseMoveListener);
            this.documentMouseMoveListener = null;
        }

        if (this.documentMouseUpListener) {
            document.removeEventListener('mouseup', this.documentMouseUpListener);
            this.documentMouseUpListener = null;
        }
    }

    onMouseDown(event: Event) {
        this.dt.beginDrag(event);
        this.bindDocumentEvents();

    }

    onMouseMove(event: Event) {
        this.dt.moveDrag(event);
    }

    onMouseUp(event: Event) {
        this.dt.stopDrag(event, this.el.nativeElement);
        this.unbindDocumentEvents();
    }

    ngOnDestroy() {
        if (this.resizerMouseDownListener) {
            this.resizer.removeEventListener('mousedown', this.resizerMouseDownListener);
        }

        this.unbindDocumentEvents();
    }

}
