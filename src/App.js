import React, { Component } from 'react';
import './App.css';
import {
    Sidebar,
    WorldMap,
    SearchForm,
    VenueList,
    Loading
} from './components'

import { Venues } from './api'
import { FourSquareApiBaseUrl } from './config'

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchingVenue: false,
            venues: []
        }
        this.handleSearch = this.handleSearch.bind(this)
        this.venueApi = new Venues(FourSquareApiBaseUrl, true)
    }
    handleSearch(params) {
        console.log(params)
        this.setState({
            searchingVenue: true
        })
        this.venueApi
            .search(params.authToken, 'london', params.query)
            .then(venues => {
                console.log(venues)
                this.setState({
                    venues: venues,
                    searchingVenue: false
                })
            })
    }
    render() {
        return (
            <div className="App">
                <Sidebar>
                    <SearchForm onSubmit={this.handleSearch} disabled={this.state.searchingVenue}/>
                    {
                        this.state.searchingVenue
                        ? <Loading />
                        : <VenueList venues={this.state.venues} />
                    }
                </Sidebar>
                <main>
                    <WorldMap />
                </main>
            </div>
            );
    }
}

export default App;
