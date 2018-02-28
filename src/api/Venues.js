import { venuesSearchResponse } from './data'

export class Venues {

    constructor(baseUrl, mock) {
        this.baseUrl = baseUrl
        this.mock = mock
    }

    search(oauthToken, near, query) {
        const url = `${this.baseUrl}venues/search?v=20180101&oauth_token=${oauthToken}&near=${near}&query=${query}`
        if(!oauthToken) {
            return Promise.reject({ message: 'OAuth token is required'})
        }
        if(!query) {
            return Promise.reject({ message: 'query keywords are required'})
        }
        if(this.mock) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(venuesSearchResponse.response.venues)
                }, 300)
            })
        } else {
            return fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        return data.response.venues
                    })
        }
    }

    findSimilar(oauthToken, venueId) {
        if(!oauthToken) {
            return Promise.reject({ message: 'OAuth token is required.' })
        }
        const url = `${this.baseUrl}/venues/${venueId}/similar`
        return fetch(url)
                .then(response => response.json())
    }
}