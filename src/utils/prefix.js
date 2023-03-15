function prefix(namespace, routes) {
    return routes.map((r) => {
        r.path = namespace + r.path;
        return r;
    });
}

module.exports = prefix;