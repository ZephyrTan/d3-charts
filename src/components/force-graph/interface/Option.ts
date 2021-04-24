export interface Option {
    // 绘制的domElement的id
    selector: string,
    // 初始节点
    nodes?: object[],
    nodeAttr: NodeAttr,
    // 初始链路
    links?: object[],
    // 自定义节点颜色配置回调函数，参数为当前节点
    setNodeColorCallback?: Function,
    // 默认所有节点的颜色
    color: string,
    // 若使用随机节点颜色配置，则提供数组的长度
    colorListLength?: number,
    // 与节点颜色数组搭配使用，通过哪个属性来按颜色分类
    colorKey: string,
    // 是否可拖拽
    canDrag?: boolean,
    // 是否可移动
    canRoam?: boolean,
    // 拖拽开始的回调函数
    dragStartedCallback?: Function,
    // 拖拽过程中的回调函数
    draggedCallback?: Function,
    // 拖拽接收的回调函数
    dragEndedCallback?: Function,
    // 设置默认缩放比例
    scaleExtent: [number, number],
    // 缩放的回调
    zoomCallback: Function
}

interface NodeAttr {
    stroke: string,
    strokeWidth: number,
    radius: number,
    clickEvent: Function,
    rightClickEvent: Function,
    dblClickEvent: Function
}

interface LinkAttr {
    stroke: string
}
