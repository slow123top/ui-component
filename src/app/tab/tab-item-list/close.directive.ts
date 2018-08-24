import { Directive, ElementRef, AfterViewInit, Renderer2, ViewChild, AfterContentInit, ContentChild } from '@angular/core';
import { AppTabItemListComponent } from './tab-item-list.component';
@Directive({
    selector: '[appCloseable]'

})
export class CloseableDirective implements AfterViewInit, AfterContentInit {

    // @ViewChild(AppTabItemListComponent)
    @ContentChild(AppTabItemListComponent)
    private appTabItemList: AppTabItemListComponent;
    constructor(private el: ElementRef, private render: Renderer2) {
        // el.nativeElement.style.backgroundColor = 'red';
        // el.nativeElement.style.backgroundColor = 'red';

    }
    ngAfterViewInit(): void {
        // this.appTabItemList.close = true;
        // const lis = this.el.nativeElement.querySelectorAll('li');
        // const tabButton = `<button kendoButton [icon]="'close'"
        // [look]="'flat'" (click)="closeTab(i)"></button>`;
        // for (let i = 0; i < lis.length; i++) {
        //     const button = this.render.createElement('button', tabButton);
        //     this.render.appendChild(lis[i], button);
        // }
    }
    ngAfterContentInit(): void {
        // console.log(this.appTabItemList);
        this.appTabItemList.close = true;
    }

}
