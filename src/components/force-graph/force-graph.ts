import * as d3 from "d3";
import Color from '../../utils/color.js'
import {Option} from "./interface/Option";


export class ForceGraph {
    // 选择的元素，即创建力导向图的div
    private selector: any
    // 初始化的配置项
    private readonly option: Option
    // 创建的链路对象
    private link: any
    // 创建的节点对象
    private node: any
    // 创建的d3模拟仿真实例
    private simulation: any
    // 创建的svg画布实例
    private svg: any
    // 画布的宽高
    private readonly width: number
    private readonly height: number

    // 默认配置项
    private readonly defaultOption: Option = {
        color: null,
        nodeAttr: {
            stroke: '#fff',
            strokeWidth: 1.5,
            radius: 10,
            clickEvent: ({event, node}) => {
                console.log("node-click", node)
            },
            rightClickEvent: ({event, node}) => {
                console.log("node-right-click", node)
            },
            dblClickEvent: ({event, node}) => {
                console.log("node-dblclick", node)
            }
        },
        canDrag: true,
        canRoam: true,
        colorKey: "type",
        colorListLength: 20,
        dragEndedCallback: ({event, simulation}) => {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        },
        dragStartedCallback: ({event, simulation}) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        },
        draggedCallback: ({event, simulation}) => {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        },
        links: [],
        nodes: [],
        scaleExtent: [0.2, 8],
        selector: "",
        setNodeColorCallback: ({d, colorKey, colorListLength}) => {
            let colorList = Color.getColorList(colorListLength ? colorListLength : 20)
            return colorList[colorKey ? d[colorKey] : (d.type ? d.type : '#000')]
        },
        zoomCallback: ({event, svg, node, link}) => {
            node.attr("transform", event.transform);
            link.attr("transform", event.transform);
        }
    }

    /**
     * 构造函数
     * @param option 初始化配置项
     */
    constructor(option: Option) {
        option.colorKey = 'group'
        this.option = Object.assign(this.defaultOption, option)
        this.selector = document.getElementById(option.selector)
        this.width = this.selector.clientWidth
        this.height = this.selector.clientHeight
    }

    init() {
        this.createSimulation(this.option.nodes, this.option.links)
        this.createSvg()
        this.addLinks(this.option.links)
        this.addNodes(this.option.nodes)
    }

    private createSimulation = (nodes, links) => {
        this.simulation = d3.forceSimulation(nodes)
            .force("links", d3.forceLink(links).id(d => d.id))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(400, 200))
            .force("charge", d3.forceManyBody().strength(-400))
            // 碰撞力 防止节点重叠
            .force('collide', d3.forceCollide(15));
        this.simulation.on("tick", () => {
            this.link.attr("x1", d => d.source.x).attr("y1", d => d.source.y).attr("x2", d => d.target.x).attr("y2", d => d.target.y);
            this.node.attr("cx", d => d.x).attr("cy", d => d.y);
        });
    }
    private createSvg = () => {
        this.svg = d3.select('#' + this.option.selector).append("svg")
            .attr("viewBox", [0, 0, this.width / 2, this.height / 2]);
        this.svg.call(d3.zoom().extent([[0, 0], [this.width, this.height]]).scaleExtent(this.option.scaleExtent).on("zoom", this.zoomed));
    }

    private zoomed = (event) => {
        let params = {
            event, svg: this.svg, node: this.node, link: this.link
        }
        this.option.zoomCallback(params)
    }
    private drag = simulation => {

        let option = this.option

        function dragstarted(event) {
            option.dragStartedCallback({event, simulation})
        }

        function dragged(event) {
            option.draggedCallback({event, simulation})
        }

        function dragended(event) {
            option.dragEndedCallback({event, simulation})
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    /**
     * 添加节点
     * @param nodes
     */
    addNodes(nodes) {
        let _this = this
        let svg = this.svg
        let simulation = this.simulation
        let color = this.option.color ? this.option.color : this.getNodeColor
        this.node = svg.append("g")
            .attr("stroke", this.option.nodeAttr.stroke)
            .attr("stroke-width", this.option.nodeAttr.strokeWidth)
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("r", this.option.nodeAttr.radius)
            .attr("fill", color)
            .call(this.drag(simulation))
            .on('click', function (event, node) {
                _this.option.nodeAttr.clickEvent({event, node})
            })
            .on('contextmenu', function (event, node) {
                _this.option.nodeAttr.rightClickEvent({event, node})
            })
        this.node.append("title")
            .text(d => d.id);
        this.node.append("text")
            .attr("dy", "10px")
            .attr("text-anchor", "middle") //在圆圈中加上数据
            .style('fill', "#FFFFFF")
            .attr('x', function (d) {
                _this.appendCircleText(d, this);
            });

    }

    private appendCircleText = (d, _this) => {
        let circleText = d.name;
        //如果小于四个字符，不换行
        if (circleText && circleText.length > 12) {
            // circleText = circleText.substring(0, 4) + "...";
            let preCircleText = circleText.slice(0, 12);
            let endCircleText = circleText.slice(12, circleText.length);
            circleText = preCircleText + "\n" + endCircleText;
            // d3.select(_this).text(function () {
            //   return '';
            // });
        }
        d3.select(_this).append('tspan').attr('x', 0).attr('y', 0).attr("font-size", 12)
            .text(function () {
                return circleText;
            });
    }

    private addLinks = (links) => {
        let svg = this.svg
        this.link = svg.append("g")
            .attr("stroke", "#999")
            // .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("stroke-width", d => Math.sqrt(d.value));
    }

    private getNodeColor = (d) => {
        let params = {d, colorKey: this.option.colorKey, colorListLength: this.option.colorListLength}
        return this.option.setNodeColorCallback(params)
    }
}
