import React, { Component } from 'react'
import './Sidebar.css'

export class Sidebar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            expanded: true
        }
    }

    render() {
        return (
            <aside className='sidebar'>
                {this.props.children}
            </aside>
        )
    }
} 