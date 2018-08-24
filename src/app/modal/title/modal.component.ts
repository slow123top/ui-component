import {
    Component, Input, Output, EventEmitter,
    OnInit, OnChanges, SimpleChanges, ContentChild, TemplateRef, DoCheck, Renderer2
} from '@angular/core';
import { ElementDef } from '@angular/core/src/view';
@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.css']
})

export class AppModalComponent implements OnInit, OnChanges {
    /* dialog props */
    // 模态框标题
    @Input() title: string;
    /* 头部模板 内容模板和尾部模板 */
    @ContentChild('header') headerTmp: TemplateRef<any>;
    @ContentChild('bodyer') bodyTmp: TemplateRef<any>;
    @ContentChild('footer') footerTmp: TemplateRef<any>;
    // 模态框弹出 通过opened判断设置modalVisible 隐藏与否

    modalVisible: string;
    /* 距离浏览器上端和左端的像素大小  确定模态框的位置 */
    @Input() top = '15%';
    @Input() left = '25%';
    /* 可以设置模态框的大小 宽 高 */
    @Input() dialogWidth = 500;
    dialogHeight: number;
    moveTargetHeight: number;

    /* 关闭模态框按钮 */
    @Output() openedChange = new EventEmitter<boolean>();
    // 获取全屏分辨率   这个做法不大妥当
    screenWidth = window.screen.width;
    screenHeight = window.screen.height;
    bodyClientWidth = document.body.clientWidth;
    bodyClientHeight = document.body.clientHeight;
    // 记录当前模态框的大小  以及位置 用于再次弹出为缩小状态
    currentHeight: number;
    currentTop: string;
    currentWidth: number;
    currentLeft: string;
    // 是否最大化
    maxFlag = false;
    // 记录模态框拖拽时指针的位置
    leftDis = 0;
    topDis = 0;
    // 开始鼠标位置  元素位置
    startMouseX = 0;
    startMouseY = 0;
    startLeft = 0;
    startTop = 0;
    leng: number;
    // 设置拖拽标记
    moveFlag = false;
    // 拖拽 设置鼠标样式
    cursorStyle: string;
    // 记录上一次模态框弹出位置
    lastTop: number;
    lastLeft: number;
    /* 设置模态框字体位置*/
    _position = 'left';
    _size = '1rem';
    _opened = false;
    @Input()
    set position(position: string) {
        this._position = position;
    }
    get position() {
        return this._position;
    }
    /* 设置模态框字体大小 */
    @Input()
    set size(size: string) {
        this._size = size;
    }
    get size() {
        return this._size;
    }
    @Input()
    set opened(opened: boolean) {
        if (opened) {
            if (this.maxFlag) {
                this.dialogInit();
                this.maxFlag = false;
            }
            // this.modalVisible = 'visible';
        }
        this._opened = opened;
        this.modalVisible = this._opened ? 'visible' : 'hidden';
    }
    get opened() {
        return this._opened;
    }
    constructor() {

    }
    /* 组件初始化 */
    ngOnInit() {
    }
    /* 输入属性发生变化  模态框变化 */
    ngOnChanges(changes: SimpleChanges) {
        // console.log(changes);
        // if (this.opened) {
        //     if (this.maxFlag) {
        //         this.dialogInit();
        //         this.maxFlag = false;
        //     }
        //     this.modalVisible = 'visible';
        //     console.log(this.modalVisible);
        // } else {
        //     this.modalVisible = 'hidden';
        //     console.log(this.modalVisible);
        // }
    }
    /* 关闭模态框 */
    closeModal(e) {
        this.opened = false;
        this.openedChange.emit(this.opened);
        // this.modalVisible = 'hidden';
    }
    /* 最大化模态框 */
    maxModal(e) {
        // 获取模态框初始高度
        // 最大化记录模态框的大小  最大化标记为true
        this.currentHeight = e.path[4].clientHeight;
        this.currentTop = this.top;
        this.currentWidth = this.dialogWidth;
        this.currentLeft = this.left;
        // 最大化到可见区域
        this.dialogWidth = this.screenWidth;
        this.dialogHeight = this.screenHeight;
        this.top = '0px';
        this.left = '0px';
        this.maxFlag = true;
    }
    /* 最小化模态框  赋值模态框的原始位置  最大化标记尾false */
    minModal() {
        this.dialogInit();
        this.maxFlag = false;
    }
    /* 用于初始化模态框大小 */
    dialogInit() {
        this.dialogHeight = this.currentHeight;
        this.top = this.currentTop;
        this.dialogWidth = this.currentWidth;
        this.left = this.currentLeft;
    }
    /* 模态框拖拽  鼠标按下 */
    mousedownDialog(e: any) {
        this.leng = e.screenY - e.pageY;
        // 当点击最大化  最小化 关闭时  不触发mousedown事件
        const hasMax = e.target.classList.contains('k-i-window-maximize');
        const hasClose = e.target.classList.contains('k-i-close-outline');
        const hasMin = e.target.classList.contains('k-i-window-restore');
        if (hasMax || hasMin || hasClose) {
            return;
        }
        // 记录开始拖拽时鼠标的位置  以及拖拽对象的位置  设置拖拽标记true
        this.startMouseX = e.clientX;
        this.startMouseY = e.clientY;
        this.startLeft = e.target.offsetParent.offsetLeft;
        this.startTop = e.target.offsetParent.offsetTop;
        this.moveTargetHeight = e.target.offsetParent.clientHeight;
        this.moveFlag = true;
    }
    /* 模态框拖拽 鼠标移动 */
    mousemoveDialog(e: any) {
        // 如果拖拽标记尾false 不能拖拽
        if (!this.moveFlag) {
            return false;
        }
        // 记录拖拽时鼠标的位置  用于计算拖拽过程中拖拽对象的位置
        this.leftDis = e.clientX;
        this.topDis = e.clientY;
        if (this.leftDis < 0) { this.leftDis = 0; }
        if (this.topDis < 0) { this.topDis = 25; }
        // 如果拖拽到最左边  最右边  分别做相应的范围限制
        if (this.leftDis - this.startMouseX + this.startLeft < 0) {
            this.leftDis = 16;
        } else if (this.leftDis - this.startMouseX + this.startLeft >= this.screenWidth - this.dialogWidth) {
            this.leftDis = this.screenWidth - this.dialogWidth;
        } else {
            this.leftDis = this.leftDis - this.startMouseX + this.startLeft;
        }
        if (this.topDis - this.startMouseY + this.startTop < 0) {
            this.topDis = 16;
        } else if (this.topDis - this.startMouseY + this.startTop >= this.screenHeight - this.leng - this.moveTargetHeight) {
            this.topDis = this.screenHeight - this.moveTargetHeight - this.leng - 50;
        } else {
            this.topDis = this.topDis - this.startMouseY + this.startTop;
        }
        // 拖拽过程中  模态框持续定位   才能形成连续状态
        this.left = `${this.leftDis}px`;
        this.top = `${this.topDis}px`;
    }
    /* 模态框拖拽  鼠标抬起时 拖拽标记false*/
    mouseupDialog(e: any) {
        this.moveFlag = false;
    }
    /* 设置拖拽鼠标样式 */
    mouseoverDialog() {
        this.cursorStyle = 'move';
    }
    /* 鼠标移出时  恢复指针样式 */
    mouseoutDialog() {
        this.cursorStyle = 'default';
    }
    /* 记录保存上次模态框的弹出位置 */
    getLastPosition() {
        this.left = `${this.lastLeft}px`;
        this.top = `${this.lastTop}px`;
    }
}
