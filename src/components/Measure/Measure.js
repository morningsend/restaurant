import React from 'react'
import './Measure.css'

export class Measure extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight
        }
        this.handleResize = this.handleResize.bind(this)
    }

    handleResize() {

        this.setState({
            width: this.node.offsetWidth,
            height: this.node.offsetHeight
        })
    }
    componentDidMount() {
        window.addEventListener('resize', this.handleResize)
        this.setState({
            width: this.node.offsetWidth,
            height: this.node.offsetHeight
        })
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize)
    }
    render() {
        const size = {
            width: this.state.width,
            height: this.state.height
        }
        const children = React.cloneElement(this.props.children, { size, ...this.props})
        return (
            <div className='measure' ref={node => this.node = node}>
                {children}
            </div>
        )
    }
}