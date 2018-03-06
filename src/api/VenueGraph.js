export class Node {
    constructor(id, neighbours, venue) {
        this.id = id
        this.neighbours = neighbours
        this.venue = venue
    }
    addNeighboour(id) {
        this.neighbours[id] = true
    }
}
export class VenueGraph {
    /**
     * constructor
     * @param {Venues} venues 
     */
    constructor(venues) {
        // id, node 
        this.venues = venues
    }

    /**
     * use breadth first search to explore similar
     * @param {callback} shouldContinue 
     * @param {callback} update 
     */
    exploreSimilar(oauthToken, seed, shouldContinue, update) {
        console.log('explorer similar')
        let nodes = {}
        nodes[seed.id] = new Node(seed.id, {}, seed)
        const visited = {}
        const queue = [seed.id]
        // Mutual recursion to handle chained asynchronous REST calls.
        const condition = (queue, shouldContinue, nodes, visited, update) => {
            update(nodes, false)
            if(queue.length > 0 && shouldContinue()) {
                let venueId = queue.shift()
                let currentNode = nodes[venueId]
                if(!visited[venueId]) {
                    return traverseSimilar(queue, shouldContinue, currentNode, nodes, visited, update)
                } else {
                    return condition(queue, shouldContinue, nodes, visited, update)
                }
            } else {
                // all of the nodes in the graph have been visited.
                update(nodes, true)
            }
        }
        const traverseSimilar = (queue, shouldContinue, currentNode, nodes, visited, update) => {
            return this.venues
                        .findSimilar(oauthToken, currentNode.id)
                        .then((similarVenues) => {
                            console.log(similarVenues)
                            similarVenues = similarVenues.items
                            visited[currentNode.id] = true

                            for(let i = 0; i < similarVenues.length; i++) {
                                const neighbourVenue = similarVenues[i]
                                if(!nodes[neighbourVenue.id]) {
                                    nodes[neighbourVenue.id] = new Node(neighbourVenue.id, {}, neighbourVenue)
                                }
                                currentNode.addNeighboour(neighbourVenue.id)
                                nodes[neighbourVenue.id].addNeighboour(currentNode.id)
                                queue.push(neighbourVenue.id)
                            }
                        })
                        .then(() => (condition(queue, shouldContinue, nodes, visited, update)))
            }

        return condition(queue, shouldContinue, nodes, visited, update)
    }
}