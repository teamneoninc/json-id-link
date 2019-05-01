// @flow

export default function link (data : Object) : Object{
    let idMap = getIdsFromObject(data);
    return linkReferences(data, idMap);
}

function linkReferences(object: Object, idMap: {[string] : Object}) {
    if(object === null) return null;
    let keys = Object.keys(object);
    keys.forEach(key => {
        if (typeof object[key] === "string" && key !== "id" &&  idMap[object[key]] !== undefined && idMap[object[key]] !== null) object[key] = idMap[object[key]];
        else if (typeof object[key] === typeof {}) object[key] = linkReferences(object[key], idMap);
        else if (typeof object[key] === typeof []) object[key].forEach((child, index) => {
            if (typeof child === typeof {}) object[index] = linkReferences(child, idMap);
            else if (typeof child === "string" && idMap[child] !== null) object[index] = idMap[child];
        })});
    return object;
}

function getIdsFromObject(object : Object) : {[string] : Object} {
    let idMap : {[string] : Object} = {};
    if(object === null) return idMap;
    let keys = Object.keys(object);
    keys.forEach(key => {
        if (key === "id") idMap[object[key]] = object;
        else if (typeof object[key] === typeof {}) idMap = Object.assign(idMap, (getIdsFromObject(object[key])));
        else if (typeof object[key] === typeof []) object[key].forEach((child) => {
            if (typeof child === typeof {}) idMap = Object.assign(idMap, (getIdsFromObject(child[key])))
        })});
    return idMap;
}
