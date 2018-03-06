import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import * as d3Scale from 'd3-scale'
import * as d3Geo from 'd3-geo'
import * as d3GeoProjection from 'd3-geo-projection'
import * as topojson from 'topojson'
import './WorldMap.css'
const mapData = require('./world.json')
export class WorldMap extends React.Component {
    static propTypes = {
        size: PropTypes.shape({
            width: PropTypes.number,
            height: PropTypes.number,
        }),
        pins: PropTypes.array
    }

    static defaultProps = {
        pins: []
    }
    constructor(props) {
        super(props)
        this.state = {
            zoomScale: 1,
            translateX: 0,
            translateY: 0,
            translateDeltaX: 0,
            translateDeltaY: 0,
            dragStartX: 0,
            dragStartY: 0,
            dragging: false
        }
        this.svgMap = <g />
        this.mouseDown = false

        this.handleMouseDown = this.handleMouseDown.bind(this)
        this.handleMouseMove = this.handleMouseMove.bind(this)
        this.handleMouseUp = this.handleMouseUp.bind(this)
        this.handleZoomIn = this.handleZoomIn.bind(this)
        this.handleZoomOut = this.handleZoomOut.bind(this)
        this.resetTransform = this.resetTransform.bind(this)
        this.createMap = this.createMap.bind(this)
        this.createMapPins = this.createMapPins.bind(this)
        this.handleWheel = this.handleWheel.bind(this)
        this.handleLocate = this.handleLocate.bind(this)
        this.data = mapData

        this.projection = d3Geo.geoEquirectangular()
        .scale(150)
        .center([0, 0])
    }
    
    componentDidMount() {
        this.createMap()
        this.createMapPins([])
    }

    componentDidUpdate(nextProps, nextState) {
        this.createMap()
        console.log(this.props.pins.length, nextProps.pins.length)
        //if(this.props.pins.length != nextProps.pins.length) {
            this.createMapPins(nextProps.pins)
        //}
    }
    createMap() {
        const { width, height } = this.props.size

        var container = d3.select(this.mapContainer)
                    .attr('width', width)
                    .attr('height', height)
                
                
        var map = d3.select(this.mapNode)
        map.selectAll('*').remove()
        var path = d3.geoPath(this.projection);
        
        map.insert("path", ".circle")
            .datum(topojson.feature(this.data, this.data.objects.land))
            .attr("class", "land")
            .attr("d", path);
    }
    createMapPins(pins) {
        if(!pins || pins.length < 1) {
            return
        }
        const { width, height } = this.props.size

        const mapPins = d3.select(this.mapPins)
        const projection = this.projection
        mapPins.selectAll('*').remove()
        mapPins
            .selectAll('circle')
            .data(pins)
            .enter()
            .append("circle", ".map-pins")
                .attr('class', 'pin')
                .attr('r', 4 / this.state.zoomScale)
                .attr('transform', (d) => {
                    const dp = projection([d.long, d.lat])
                    return `translate(${dp[0]} ${dp[1]})`
                })

    }
    handleMouseDown(event) {
        this.setState({
            dragging: true,
            dragStartX: event.clientX,
            dragStartY: event.clientY,
        })
    }
    
    handleMouseMove(event) {
        if(!this.state.dragging) {
            return
        }

        const x = event.clientX
        const y = event.clientY

        this.setState({
            translateDeltaX: x - this.state.dragStartX,
            translateDeltaY: y - this.state.dragStartY
        })

    }
    handleMouseUp() {
        if(!this.state.dragging) {
            return
        }
        let { translateX, translateY } = this.state
        translateX += this.state.translateDeltaX
        translateY += this.state.translateDeltaY
        this.setState({
            dragging: false,
            translateX,
            translateY,
            translateDeltaX: 0,
            translateDeltaY: 0
        })
    }
    handleLocate() {
        const { pins } = this.props
        if(!pins || pins.length < 1) {
            return
        }
        const { width, height } = this.props.size
        let minX = 99999999, maxX = - 9999999, minY = 9999999, maxY = -9999999
        for(let i = 0; i < pins.length; i++) {
            const [x,y] = this.projection([pins[i].long, pins[i].lat])
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

        const deltaX = maxX - minX
        const deltaY = maxY - minY

        const zoomScale = Math.min(width / deltaX, height / deltaY ) * 0.8
        const translateX = -(minX + 0.5 * (deltaX) - width / 2) * zoomScale
        const translateY = -(minY + 0.5 * (deltaY) - height / 2) * zoomScale
        console.log(zoomScale, translateX, translateY)
        this.setState({
            zoomScale,
            translateX,
            translateY
        })
    }
    resetTransform() {
        this.setState({
            translateX: 0,
            translateY: 0,
            zoomScale: 1,
            translateDeltaX: 0,
            translateDeltaY: 0,
            dragging: false
        })
    }
    handleZoomIn() {
        console.log('zoom in', this.state.zoomScale)
        let { width, height } = this.props.size
        const zoomScale = Math.min(this.state.zoomScale * 1.33333, 400)
        width *= this.state.zoomScale
        height *= this.state.zoomScale
        const translateX = -0.5 * width * 0.33333 + this.state.translateX
        const translateY = -0.5 * height * 0.33333 + this.state.translateY
        console.log(translateX, translateY, zoomScale)
        this.setState({
            zoomScale,
        })
    }
    handleZoomOut() {
        console.log('zoom out', this.state.zoomScale)
        let { width, height } = this.props.size
        let { zoomScale } = this.state
        const newZoomScale = Math.max(zoomScale * 0.75, 1)
        width *= this.state.zoomScale
        height *= this.state.zoomScale
        const translateX = (this.state.translateX * (zoomScale - newZoomScale)) 
        const translateY = (this.state.translateY * (zoomScale - newZoomScale))
        console.log(translateX, translateY, newZoomScale)
        this.setState({
            zoomScale: newZoomScale,
        })
    }
    handleWheel(event) {
        if(event.deltaY < -8) {
            this.handleZoomOut()
        } else if(event.deltaY > 8) {
            this.handleZoomIn()
        }
    }
    render() {
        const {width, height } = this.props.size 
        const { translateX, translateY, translateDeltaX, translateDeltaY, zoomScale} = this.state
        const transform = {
            transform: `translate(${translateX + translateDeltaX}px, ${translateY + translateDeltaY}px) scale(${zoomScale}, ${zoomScale})`,
        }
        return (
            <div className='map-container' onWheel={this.handleWheel}>
                <svg
                    onMouseDown={this.handleMouseDown}
                    onMouseMove={this.handleMouseMove}
                    onMouseUp={this.handleMouseUp}
                    className='world-map'
                    ref={ node => this.mapContainer = node }
                >
                <g style={transform} className='map-layers'>
                    <g ref={ node => this.mapNode = node } />
                    <g ref={ node => this.mapPins = node } />
                </g>
                </svg>
                <div className='controls'>
                    <button onClick={this.resetTransform}>Reset</button>
                    <button onClick={this.handleZoomIn}>+</button>
                    <button onClick={this.handleZoomOut}>-</button>
                    <button onClick={this.handleLocate}>Locate</button>
                    <span>Drag anywhere to move the map, mouse wheel to zoom.</span>
                </div>
            </div>
        )
    }
}
