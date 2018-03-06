import React from 'react'
import PropTypes from 'prop-types'
import './SearchForm.css'

export class SearchForm extends React.Component {

    static propTypes = {
        onSubmit: PropTypes.func,
        disabled: PropTypes.bool,
        locations: PropTypes.arrayOf(PropTypes.string)
    }
    constructor(props) {
        super(props)
        this.state = {
            authToken: 'X2IY3ITHMO35CE5AX2E5DWZXHWRTBS2HOTIPVOTRGFDXHVJP',
            searchTerm: 'sushi',
            location: this.props.locations ? this.props.locations[0] : 'london',
        }

        this.handleFormSubmit = this.handleFormSubmit.bind(this)
        this.handleAuthTokenTyping = this.handleAuthTokenTyping.bind(this)
        this.handleSearchTermTyping = this.handleSearchTermTyping.bind(this)
        this.handleSelectLocation = this.handleSelectLocation.bind(this)
    }
    handleSelectLocation(event) {
        this.setState({
            location: event.target.value
        })
    }
    handleFormSubmit(e) {
        e.preventDefault()

        if(typeof this.props.onSubmit === 'function') {
            this.props.onSubmit({
                authToken: this.state.authToken,
                query: this.state.searchTerm,
                near: this.state.location
            })
        }
    }
    handleAuthTokenTyping(e) {
        this.setState({
            authToken: e.target.value || ''
        })
    }
    handleSearchTermTyping(e) {
        this.setState({
            searchTerm: e.target.value || ''
        })
    }

    render() {
        const isFormValid = this.state.searchTerm && this.state.authToken
        const disabled = !isFormValid || this.props.disabled
        return (
            <form className='search-form' onSubmit={this.handleFormSubmit}>
                <label htmlFor='auth-token'>Authentication Token</label>
                <input
                    id='auth-token'
                    placeholder='Your token'
                    value={this.state.authToken}
                    onChange={this.handleAuthTokenTyping}
                    required
                    />
                <hr />
                <label htmlFor='search-term'>Search Restaurant</label>
                
                <input
                    id='search-term'
                    placeholder='key words'
                    value={this.state.searchTerm}
                    onChange={this.handleSearchTermTyping}
                    required
                    />
                <label htmlFor='location-near'>Near</label>
                <select
                    id='location-near'
                    disabled={!this.props.locations}
                    onChange={this.handleSelectLocation}
                    value={this.state.location}
                    >
                    {
                        this.props.locations.map(l => <option value={l} key={l}>{l}</option>)
                    }
                </select>
                <button type='submit' disabled={disabled}>Go</button>
            </form>
        )
    }
}