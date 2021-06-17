function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function wildcardToRegExp(s) {
    return new RegExp(s.split(/\*+/).map(escapeRegExp).join('.*'));
}
