
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function reverse(str) {
    return str.split('').reverse().join('');
}
function countWords(str) {
    return str.split(' ').length;
}
function isPalindrome(str) {
    return str === str.split('').reverse().join('');
}
function slugify(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
}
function camelCase(str) {
    return str.replace(/[^a-zA-Z0-9]+/g, ' ').replace(/\s+/g, ' ').replace(/\s/g, '');
}
function snakeCase(str) {
    return str.replace(/[^a-zA-Z0-9]+/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');
}

module.exports = {
    capitalize,
    reverse,
    countWords,
    isPalindrome,
    slugify,
    camelCase,
    snakeCase
}