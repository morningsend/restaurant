import React from 'react'
import PropTypes from 'prop-types'

import * as d3 from 'd3'
import * as d3Scale from 'd3-scale'
import * as d3Geo from 'd3-geo'
import * as d3GeoProjection from 'd3-geo-projection'
import * as topojson from 'topojson'

import './Graph.css'

export class Graph extends React.Component{
    static propTypes = {
        nodes: PropTypes.object,
        size: PropTypes.shape({
            width: PropTypes.number,
            height: PropTypes.number
        })
    }

    static defaultProps = {
        nodes: []
    }
    constructor(props){
        super(props)
        this.state = {

        }
        this.createGraph = this.createGraph.bind(this)
        this.state = {
            zoomScale: 1,
            translateX: 0,
            translateY: 0,
            translateDeltaX: 0,
            translateDeltaY: 0,
            dragStartX: 0,
            dragStartY: 0,
            dragging: false,
            displayNode: null
        }
        this.handleWheel = this.handleWheel.bind(this)
        this.handleZoomIn = this.handleZoomIn.bind(this)
        this.handleZoomOut = this.handleZoomOut.bind(this)
        this.handleSelect = this.handleSelect.bind(this)
    }

    createGraph() {

        const { width, height } = this.props.size
        const colour = d3.scaleOrdinal(d3.schemeCategory10);
        const graph = d3.select(this.graphNode)
        const nodeData = d3.entries(this.props.nodes)

        if(nodeData.length < 1) {
            return
        }
        const edges = []
        for(let i = 0; i < nodeData.length; i++) {
            const nodeId = nodeData[i].key
            const node = nodeData[i].value
            const neighbours = nodeData[i].value.neighbours
            for(let key in neighbours){
                const neighbourNode = this.props.nodes[key]
                edges.push({
                    source: nodeId,
                    sourceCoord: {
                        x: node.venue.location.lng,
                        y: node.venue.location.lat,
                    },
                    target: key,
                    targetCoord: {
                        x: neighbourNode.venue.location.lng,
                        y: neighbourNode.venue.location.lat,
                    }
                })
            }
        }
        let minX = 99999999, maxX = - 9999999, minY = 9999999, maxY = -9999999
        for(let i = 0; i < nodeData.length; i++) {
            const x = nodeData[i].value.venue.location.lng
            const y = nodeData[i].value.venue.location.lat
            if(x < minX) {
                minX = x
            }
            if(x > maxX) {
                maxX = x
            }
            if(y < minY){
                minY = y
            }
            if(y > maxY) {
                maxY = y
            }
        }
        console.log(minX, maxX, minY, maxY)
        const deltaX = maxX - minX
        const deltaY = maxY - minY

        const xScale = d3.scaleLinear()
                        .domain([minX, maxX])
                        .range([0, width])

        const yScale = d3.scaleLinear()
                        .domain([minY, maxY])
                        .range([0, height])
        graph.selectAll('*').remove()

        graph.selectAll('line')
            .data(edges)
            .enter()
            .append('line')
            .attr('class', d => {
                if(!this.state.displayNode || d.source != this.state.displayNode.id) {
                    return 'edge'
                } else {
                    return 'edge selected'
                }
            })
            .attr('x1', d => {
                return xScale(d.sourceCoord.x)
            })
            .attr('y1', d => {
                return yScale(d.sourceCoord.y)
            })
            .attr('x2', d => {
                return xScale(d.targetCoord.x)
            })
            .attr('y2', d => {
                return yScale(d.targetCoord.y)
            })

        graph.selectAll('circle')
            .data(nodeData)
            .enter()
            .append('circle')
            .attr('class', 'node')
            .attr('r', 10)
            .attr('cx', d => {
                const { lng } = d.value.venue.location
                return xScale(lng)
            })
            .attr('cy', d => {
                const { lat } = d.value.venue.location
                return yScale(lat)
            })
            .on('click', this.handleSelect)
    }
    handleSelect(d, i) {
        this.setState({
            displayNode: d.value
        })
        console.log(d.value)
    }
    componentDidMount() {
        this.createGraph()
    }
    componentDidUpdate() {
        console.log(this.props.size)
        this.createGraph()
    }
    handleWheel(event) {
        if(event.deltaY < -8) {
            this.handleZoomOut()
        } else if(event.deltaY > 8) {
            this.handleZoomIn()
        }
    }

    handleZoomIn() {
        const zoomScale = Math.min(this.state.zoomScale * 1.33333, 400)
        this.setState({
            zoomScale,
        })
    }
    handleZoomOut() {
        const newZoomScale = Math.max(this.state.zoomScale * 0.75, .5)
        this.setState({
            zoomScale: newZoomScale,
        })
    }
    render() {
        const { width, height } = this.props.size
        const transform = {
            transform: `scale(${this.state.zoomScale})`
        }
        const { displayNode } = this.state
        return (
            <div onWheel={this.handleWheel} className='graph-wrapper'>
                <div className='help'>
                    <p>Mouse wheel to Zoom.</p>
                    <p>Click on a node to view details.</p>
                </div>
                {
                    displayNode ?
                    <div className='summary'>
                        <p>{displayNode.venue.name}</p>
                        <p>{displayNode.venue.location.address}</p>
                        {
                            displayNode.venue.url
                            ? <a href={displayNode.venue.url} target='_blank'>Visit Website</a>
                            : null
                        }
                    </div> 
                    : null
                }
                <svg className='graph-container' width={width} height={height}>
                    <g
                        className='graph'
                        ref={ node => this.graphNode = node }
                        style={transform}></g>
                </svg>
            </div>
        )
    }
}