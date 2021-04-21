export interface Option {
    selector: string,
    nodes?: object[],
    links?: object[],
    color?: Function,
    colorListLength?: number,
    colorKey: string,
    canDrag?: boolean,
    canRoam?: boolean,
    dragstarted?: Function,
    dragged?: Function,
    dragended?: Function,
}
