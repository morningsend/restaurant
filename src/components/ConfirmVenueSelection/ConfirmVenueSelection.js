import React from 'react'
import PropTypes from 'prop-types'
import './ConfirmVenueSelection.css'

export class ConfirmVenueSelection extends React.Component {
    static propTypes = {
        venue: PropTypes.object,
        onCancel: PropTypes.func,
        onConfirm: PropTypes.func
    }
    static defaultProps = {
        onCancel: () => {},
        onConfirm: () => {}
    }
    constructor(props) {
        super(props)
    }

    render() {
        const { venue } = this.props
        return (
            <div className='confirmation-container'>
                <p>{venue ? venue.name : 'lalala'}</p>
                <button onClick={this.props.onConfirm}>Pick This One?</button>
                <button onClick={this.props.onCancel}>Cancel</button>
            </div>
        )
    }
}