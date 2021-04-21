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

    /**
     * 构造函数
     * @param option 初始化配置项
     */
    constructor(option: Option) {
        this.option = option
        this.selector = document.getElementById(option.selector)
        this.width = this.selector.clientWidth
        this.height = this.selector.clientHeight
    }

    init() {
        this.createSimulation(this.option && this.option.nodes ? this.option.nodes : [], this.option && this.option.nodes ? this.option.links : [])
        this.createSvg()
        if (this.option && this.option.links) {
            this.addLinks(this.option.links)
        }
        if (this.option && this.option.nodes) {
            this.addNodes(this.option.nodes)
        }
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
        this.svg.call(d3.zoom().extent([[0, 0], [this.width, this.height]]).scaleExtent([0.2, 8]).on("zoom", this.zoomed));
    }

    private zoomed = ({transform}) => {
        this.node.attr("transform", transform);
        this.link.attr("transform", transform);
    }
    private drag = simulation => {

        let option = this.option

        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            if (typeof option.dragstarted == 'function') {
                option.dragstarted.call(this, event)
            }
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            if (typeof option.dragged == 'function') {
                option.dragged.call(this, event)
            }
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            if (typeof option.dragended == 'function') {
                option.dragended.call(this, event)
            }
            event.subject.fx = null;
            event.subject.fy = null;
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
        let color = this.option?.color ? this.option.color : this.getNodeColor
        this.node = svg.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("r", 10)
            .attr("fill", color)
            .call(this.drag(simulation));
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
        let colorList = Color.getColorList(20)
        return colorList[this.option && this.option.colorKey ? d[this.option.colorKey] : d.group]
    }
}
