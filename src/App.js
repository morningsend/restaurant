import React, { Component } from 'react';
import './App.css';
import {
    Sidebar,
    WorldMap,
    SearchForm,
    VenueList,
    Loading,
    Measure,
    ConfirmVenueSelection,
    Graph
} from './components'

import { Venues, VenueGraph } from './api'
import { FourSquareApiBaseUrl } from './config'

const cities = ['london', 'new york', 'paris']

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchingVenue: false,
            venues: [],
            selectedVenue: null,
            exploring: false,
            error: null,
            pins: [],
            city: cities[0],
            oauthToken: null,
            nodes: null
        }
        this.handleSearch = this.handleSearch.bind(this)
        this.venueApi = new Venues(FourSquareApiBaseUrl)
        this.handleGraphUpdate = this.handleGraphUpdate.bind(this)
        this.isExploring = this.isExploring.bind(this)
    }
    mapVenueToMapPin(venues) {
        return venues.map(venue => ({
            id: venue.id,
            lat: venue.location.lat,
            long: venue.location.lng,
            data: {
                name: venue.name,
                address: venue.location.address,
                url: venue.url
            }
        }))
    }
    handleGraphUpdate(nodes, done) {
        
        if(done) {
            console.log('done')
            this.setState({
                nodes,
                exploring: false
            })
        } else {
            this.setState({
                nodes
            })
        }
    }
    isExploring() {
        return this.state.exploring
    }
    handleSearch(params) {
        console.log(params)
        this.setState({
            searchingVenue: true
        })
        this.venueApi
            .search(params.authToken, params.near || 'new york', params.query)
            .then(venues => {
                
                this.setState({
                    venues: venues,
                    pins: this.mapVenueToMapPin(venues),
                    searchingVenue: false,
                    selectedVenue: null,
                    oauthToken: params.authToken,
                    near: params.near
                })
            })
            .catch(error => {
                this.setState({
                    error: 'Error happened while requesting venue information.'
                })
            })
    }

    handleVenueSelect(venue) {
        this.setState({
            selectedVenue: venue
        })
    }
    handleVenueSelectCancel() {
        this.setState({
            selectedVenue: null
        })
    }
    handleVenueSelectConfirm() {
        this.setState({
            exploring: true
        },
        () => {
                const venueGraph = new VenueGraph(this.venueApi)
                venueGraph.exploreSimilar(
                this.state.oauthToken,
                this.state.selectedVenue,
                this.isExploring,
                this.handleGraphUpdate
                )
            }
        )
        
    }
    handleStop() {
        this.setState({
            exploring: false,
        })
    }
    render() {
        return (
            <div className="App">
                <Sidebar>
                    {
                        this.state.exploring ?
                        <div className="overlay">
                            <Loading />
                            <button onClick={this.handleStop.bind(this)}>Stop</button>
                        </div>
                        : null
                    }
                    <div>
                        <SearchForm
                            onSubmit={this.handleSearch}
                            disabled={this.state.searchingVenue}
                            locations={cities}
                            />
                        {
                            this.state.searchingVenue
                            ? <Loading />
                            : <VenueList
                                venues={this.state.venues}
                                onSelectVenue={this.handleVenueSelect.bind(this)}
                                selectedVenue={this.state.selectedVenue}
                                />
                        }
                    </div>
                    {
                        this.state.selectedVenue && !this.state.exploring
                        ? <ConfirmVenueSelection
                            venue={this.state.selectedVenue}
                            onCancel={this.handleVenueSelectCancel.bind(this)}
                            onConfirm={this.handleVenueSelectConfirm.bind(this)}
                            />
                        : null
                    }
                </Sidebar>
                <main className='content'>
                    <Measure>
                        { 
                            (this.state.exploring || this.state.nodes) 
                            ? <Graph nodes={this.state.nodes} />
                            : <WorldMap pins={this.state.pins}/>
                        }
                    </Measure>
                </main>
            </div>
            );

            //{ 
            //    (this.state.exploring || this.state.nodes.length > 0 ) 
            //    ? 
            //    : <WorldMap pins={this.state.pins}/>
            //}
    }
}

export default App;
