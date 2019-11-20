const db = require('../database/dbConfig')

module.exports = {
    findGraphs,
    findGraphById,
    addGraph,
    editGraph,
    removeGraph,
//
    findLines,
    findLineById,
    addLine,
//
    findAreas,
    findAreaById,
    addArea,
    editArea,
//
    findPoints,
    findPointsByAreaId,
    addPoint,
    editPoint
};
// Graphs
function findGraphs(username) {
    return db('graphs as g')
    .join('users as u', 'u.id', 'g.user_id')
    .select('g.*', 'g.id')
    .where({ 'u.username': username })
}
function findGraphById(graphId, username) {
    // return db('graphs as g')
    // .join('users as u', 'u.id', 'g.user_id')
    // .select('g.*', 'u.username', 'g.id')
    // .where({ 'u.username': username })
    // .where({ 'g.id': graphId })
    return db('graphs')
    .where({ "graphs.id": graphId })
    .first();
}
async function addGraph(graph, username) {
    const {area, points, ...newGraph} = graph
    const [id] = await db('graphs')
    .insert({
        ...newGraph,
        user_id: db
            .select('id')
            .from('users')
            .where({ username })
    })
    const [areaId] = await db('areas')
    .insert({
        ...area,
        graph_id: id
    })
    console.log(points)
    points.map(async e => {
    await db('points')
    .insert({
        ...e,
        area_id: areaId
        })
    })
    return findGraphById(id);
}
function editGraph(graph, id) {
}
async function findLines(graphId, username) {
    async function verify() {
        const results = await db('graphs as g')
        .join('users as u', 'u.id', 'g.user_id')
        .select('g.*', 'u.id', 'g.id')
        .where({ 'u.username': username })
        .where({ 'g.id': graphId })
        if(!results.length){
            return "This graph does not belong to the logged user"
        } else {
            return db('lines as l')
            .join('graphs as g', 'g.id', 'l.graph_id')
            .join('users as u', 'u.id', 'g.user_id')
            .select('l.*', 'g.title as graph_title', 'l.id')
            .where({ 'u.username': username })
            .where({ 'g.id': graphId })
        }
    }
        return await verify();
}
async function findLineById( { graphId, lineId }, username) {
    async function verify() {
        const results = await db('graphs as g')
        .join('users as u', 'u.id', 'g.user_id')
        .select('g.*', 'u.id', 'g.id')
        .where({ 'u.username': username })
        .where({ 'g.id': graphId })
        if(!results.length){
            return "This graph or area do not belong to the logged user"
        } else {
            return db('lines as l')
            .join('graphs as g', 'g.id', 'l.graph_id')
            .join('users as u', 'u.id', 'g.user_id')
            .select('l.*', 'g.title as graph_title', 'l.id')
            .where({ 'u.username': username })
            .where({ 'l.id': lineId })
            .where({ 'g.id': graphId })
        }
    }
        return await verify()
}
async function addLine(line, graphId, username) {
    async function verify() {
    const results = await db('graphs as g')
    .join('users as u', 'u.id', 'g.user_id')
    .select('g.*', 'u.id', 'g.id')
    .where({ 'u.username': username })
    .where({ 'g.id': graphId })
    if(!results.length){
        return "This graph does not belong to the logged user"
    } else {
        const [id] = await db('lines')
        .insert({
            ...line,
            graph_id: graphId
        })
        return await findLineById(id);
        }
    }
    return await verify()
}

// Areas
async function findAreas(graphId, username) {
    async function verify() {
        const results = await db('graphs as g')
        .join('users as u', 'u.id', 'g.user_id')
        .select('g.*', 'u.id', 'g.id')
        .where({ 'u.username': username })
        .where({ 'g.id': graphId })
        if(!results.length){
            return "This graph does not belong to the logged user"
        } else {
            return db('areas as a')
            .join('graphs as g', 'g.id', 'a.graph_id')
            .join('users as u', 'u.id', 'g.user_id')
            .select('a.*', 'g.title', 'a.id')
            .where({ 'u.username': username })
            .where({ 'g.id': graphId })
        }
    }
        return await verify()
}
async function findAreaById( { graphId, areaId }, username) {
    async function verify() {
        const results = await db('areas as a')
        .join('graphs as g', 'g.id', 'a.graph_id')
        .join('users as u', 'u.id', 'g.user_id')
        .select('a.*', 'g.title', 'a.id')
        .where({ 'u.username': username })
        .where({ 'a.id': areaId })
        if(!results.length){
            return "This graph or area do not belong to the logged user"
        } else {
            return db('areas as a')
            .join('graphs as g', 'g.id', 'a.graph_id')
            .join('users as u', 'u.id', 'g.user_id')
            .select('a.*', 'g.title', 'a.id')
            .where({ 'u.username': username })
            .where({ 'a.id': areaId })
            .where({ 'g.id': graphId })
        }
    }
        return await verify()
}
async function addArea(area, graphId, username) {
    async function verify() {
    const results = await db('graphs as g')
    .join('users as u', 'u.id', 'g.user_id')
    .select('g.*', 'u.id', 'g.id')
    .where({ 'u.username': username })
    .where({ 'g.id': graphId })
    if(!results.length){
        return "This graph does not belong to the logged user"
    } else {
        const [id] = await db('areas')
        .insert({
            ...area,
            graph_id: graphId
        })
        return findAreaById(id);
        }
    }
    return await verify()
}
function editArea(area, id) {
}
// Points
async function findPoints({ graphId, lineId }, username) {
    async function verify() {
        const results = await db('lines as l')
        .join('graphs as g', 'g.id', 'l.graph_id')
        .join('users as u', 'u.id', 'g.user_id')
        .select('l.*', 'u.username', 'g.id', 'l.id')
        .where({ 'u.username': username })
        .where({ 'g.id': graphId })
        .where({ 'l.id': lineId })
        if(!results.length){
            return "This graph or area does not belong to the logged user"
        } else {
            return db('points as p')
            .join('lines as l', 'l.id', 'p.line_id')
            .join('graphs as g', 'g.id', 'l.graph_id')
            .select('p.*')
            .where({ 'g.id': graphId })
            .where({ 'l.id': lineId })
        }
    }
        return await verify()
}
async function findPointsByAreaId({ graphId, areaId }, username) {
    async function verify() {
        const results = await db('areas as a')
        .join('graphs as g', 'g.id', 'a.graph_id')
        .join('users as u', 'u.id', 'g.user_id')
        .select('a.*', 'u.username', 'g.id', 'a.id')
        .where({ 'u.username': username })
        .where({ 'g.id': graphId })
        .where({ 'a.id': areaId })
        if(!results.length){
            return "This graph and/or area does not belong to the logged user"
        } else {
            return await db('areas_points as ap')
            .join('points as p', 'p.id', 'ap.point_id')
            .join('areas as a', 'a.id', 'ap.area_id')
            .select('ap.*', 'a.title as area_title', 'p.label as point_label', 'p.position', 'p.line_id')
            .where({'ap.area_id': areaId})
        }
    }
    return await verify()
}

async function addPoint(point, { graphId, lineId }, username) {
    async function verify() {
     const results = await db('lines as l')
    .join('graphs as g', 'g.id', 'l.graph_id')
    .join('users as u', 'u.id', 'g.user_id')
    .select('l.*', 'u.username', 'g.id', 'l.id')
    .where({ 'u.username': username })
    .where({ 'g.id': graphId })
    .where({ 'l.id': lineId })
    if(!results.length){
        return "This graph and/or area does not belong to the logged user"
    } else {
        await db('points')
        .insert({
            ...point,
            line_id: lineId
        })
        // return findPointById(id);
        return "Successfully added point! This endpoint will return the point's information when I finish findPointById()"
        }
    }
    return await verify()
}

// async function findPoints({ graphId, lineId }, username) {
//     async function verify() {
//         const results = await db('lines as l')
//         .join('graphs as g', 'g.id', 'l.graph_id')
//         .join('users as u', 'u.id', 'g.user_id')
//         .select('l.*', 'u.username', 'g.id', 'l.id')
//         .where({ 'u.username': username })
//         .where({ 'g.id': graphId })
//         .where({ 'l.id': lineId })
//         if(!results.length){
//             return "This graph or area does not belong to the logged user"
//         } else {
//             return db('points as p')
//             .join('lines as l', 'l.id', 'p.line_id')
//             .join('graphs as g', 'g.id', 'l.graph_id')
//             .select('p.*', 'l.id as line_id')
//             .where({ 'g.id': graphId })
//             .where({ 'l.id': lineId })
//         }
//     }
//         return await verify()
// }

function editPoint(point) {
}

function removeGraph(id) {
    return db('graphs')
    .where({ id })
    .del();
}

// Collapse




