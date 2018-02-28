export class Node {
    constructor(id, neighbours = {}, data = {}) {
        this.id = id
        this.neighbours = neighbours
        this.data = data
    }

}

export class Graph {
    constructor(nodes = []) {
        this.nodes = {}
    }
}