import React from 'react'
import PropTypes from 'prop-types'
import './VenueList.css'

export class VenueItem extends React.PureComponent {
    static defaultProps = {
        onSelect: () => {}
    }
    static propTypes = {
        onSelect: PropTypes.func,
        selected: PropTypes.bool
    }
    handleClick() {
        this.props.onSelect(this.props.venue)
    }
    render() {
        const { venue } = this.props
        const className = (this.props.className || '') + (this.props.selected ? 'selected' : '')
        return (
            <li className={ `venue-item ${className}` }onClick={this.handleClick.bind(this)} role="button">
                <a role='button'>
                <p>{ venue.name }</p>
                <p>{ venue.location.address }</p>
                </a>
            </li>
        )
    }
}

export class VenueList extends React.Component {
    static propTypes = {
        venues: PropTypes.array,
        enabled: PropTypes.bool,
        onSelectVenue: PropTypes.func,
        selectedVenue: PropTypes.object
    }

    static defaultProps = {
        venues: [],
        enabled: true,
        onSelectVenue: () => {},
        selectedVenue: null
    }
    constructor(props) {
        super(props)
    }

    render() {
        const { venues } = this.props
        console.log(this.props.selectedVenue)
        return (
            <ul className='venue-list'>
                {
                    venues.map( v => <VenueItem
                                        venue={v}
                                        key={v.id}
                                        selected={this.props.selectedVenue 
                                            && this.props.selectedVenue.id == v.id}
                                        onSelect={this.props.onSelectVenue}
                                        enabled={!this.props.enabled}
                                        />)
                }
            </ul>
        )
    }
}