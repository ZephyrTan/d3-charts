import * as d3 from "d3";

export interface Option {
    selector: string,
    nodes?: object[],
    links?: object[],
    color?: Function,
    colorListLength?: number,
    canDrag?: boolean,
    canRoam?: boolean,
    dragstarted?: Function,
    dragged?: Function,
    dragended?: Function,
}

export class ForceGraph {
    // 选择的元素，即创建力导向图的div
    private selector: any
    // 初始化的配置项
    private option: Option
    // 创建的链路对象
    private link: any
    // 创建的节点对象
    private node: any
    // 创建的d3模拟仿真实例
    private simulation: any
    // 创建的svg画布实例
    private svg: any
    // 画布的宽高
    private width: number
    private height: number

    constructor(option) {
        this.option = option
        this.selector = document.getElementById(option.selector)
    }

    init() {
        this.createSimulation(this.option?.nodes ? this.option.nodes : [], this.option?.links ? this.option.links : [])
        this.createSvg()
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
        this.svg = d3.select('#graph').append("svg")
            .attr("viewBox", [0, 0, this.width / 2, this.height / 2]);
    }

    private drag = simulation => {

        let option = this.option

        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            if (typeof option.dragstarted == 'function') {

            }
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    addNodes(nodes) {
        let node = this.node
        let svg = this.svg
        let simulation = this.simulation
        let color = this.option?.color ? this.option.color :

            node = svg.append("g")
                .attr("stroke", "#fff")
                .attr("stroke-width", 1.5)
                .selectAll("circle")
                .data(nodes)
                .join("circle")
                .attr("r", 10)
                .attr("fill", color)
                .call(drag(simulation));
        node.append("title")
            .text(d => d.id);
        node.append("text")
            .attr("dy", "10px")
            .attr("text-anchor", "middle") //在圆圈中加上数据
            .style('fill', "#FFFFFF")
            .attr('x', function (d) {
                appendCircleText(d, this);
            });
    }
}
