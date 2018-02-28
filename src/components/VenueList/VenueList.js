import React from 'react'
import './VenueList.css'

export class VenueItem extends React.PureComponent {
    render() {
        return (
            <li className='venue-item'></li>
        )
    }
}

export class VenueList extends React.Component {
    render() {
        return (
            <ul className='venue-list'>
                <VenueItem />
            </ul>
        )
    }
}