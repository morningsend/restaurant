import React from 'react'

export class WorldMap extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            center: {
                latitude: '0',
                
            }
        }
    }

    render() {
        return (
            <svg width="100" height="100">
                <circle cx="50" cy="50" r="40" stroke="green" strokeWidth="4" fill="yellow" />
            </svg>
        )
    }
}