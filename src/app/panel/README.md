# PanelModule说明
*更新日期：2018-09-05 21:40*

*__author__*: Yuyang Hu 实现Panel，特性-支持标题、支持头部模板、支持内容模板、支持工具按钮、手风琴模式（至多打开一个Panel）、支持单个Panel或者多个Panel使用。

***
### 使用示例
#### 在模块中引用
```
@NgModule({
  imports: [
    PanelModule
  ],
  declarations: [
   XXX
  ]
})
```
#### 在组件内部使用  单个panel使用  可折叠或不折叠
```
  <fold-panel-item [title]="'面板一'" [width]="500">
  <ng-template #toolTempl>
    <button>确定</button>
    <button>确定</button>
    <button>确定</button>
  </ng-template>
  <ng-template #contentTempl>
    <div>
      面板一内容面板一内容面板一内容面板一内容面板一内容面板一内容面板一内容面板一内容面板一内容面板一内容面板一内容 面板一内容面板一内容面板一内容面板一内容面板一内容面板一内容面板一内容面板一内容面板一内容面板一内容面板一内容 面板一内容面板一内容面板一内容面板一内容面板一内容面板一内容面板一内容面板一内容面板一内容面板一内容面板一内容
    </div>
  </ng-template>
</fold-panel-item>
```
#### 在组件内部使用  多个panel使用  可折叠或不折叠
```
<fold-panel style="margin: 5rem" [(model)]="model">
  <fold-panel-item [title]="'面板一'" [value]="1">
    <ng-template #headTempl>
      <h1>面板一</h1>
    </ng-template>
    <ng-template #toolTempl>
      <button>确定</button>
      <button>确定</button>
      <button>确定</button>
    </ng-template>
    <ng-template #contentTempl>
      <div>
        面板一内容面板一内容面板一内容面板一内容面板一内容面板一内容面板一内容面板一内容面板一内容面板一内容面板一内容
        面板一内容面板一内容面板一内容面板一内容面板一内容面板一内容面板一内容面板一内容面板一内容面板一内容面板一内容
        面板一内容面板一内容面板一内容面板一内容面板一内容面板一内容面板一内容面板一内容面板一内容面板一内容面板一内容
      </div>
    </ng-template>
  </fold-panel-item>
  <fold-panel-item [title]="'面板二'" [value]="2">
    <ng-template #contentTempl>
      <div>
        面板二内容 面板二内容 面板二内容 面板二内容 面板二内容
      </div>
    </ng-template>
  </fold-panel-item>
  <fold-panel-item [title]="'面板三'" [value]="3">
    <ng-template #contentTempl>
      <div>
        面板二内容 面板二内容 面板二内容 面板二内容 面板二内容
      </div>
    </ng-template>
  </fold-panel-item>
  <fold-panel-item [title]="'面板四'" [disabled]="true">
    <ng-template #contentTempl>
      <div>
        面板二内容
      </div>
    </ng-template>
  </fold-panel-item>
</fold-panel>
```
### 一、配置

**1. 属性说明:**

| 属性名 | 类型 | 默认值 |说明 |
| ------ | ------ | ------ |------ |
| title | `string` | 无 | 面板标题|
| value | `string` | 无 | 面板值  用于和容器value匹配  匹配成功就处于展开状态|
| width | `string|number` | 100%撑起整个父元素  | 面板宽度|
| height |`string|number` |  无 默认跟整个面板包含的所有内容高度有关 | 面板高度|
| fold | `boolean` |  true面板可以折叠  | 面板是否折叠  单个使用时可能会用到|
| disabled | `boolean` |  false 不可点击 | 面板是否可以点击 |
| headTempl | `TemplateRef<any>` |  无  | 头部模板  和title只能存在一个|
| contentTempl | `TemplateRef<any>` |  内容模板  | 面板内容区域  支持内容模板|
| toolTempl | `TemplateRef<any>` |  工具按钮 |可以放置按钮工具|
