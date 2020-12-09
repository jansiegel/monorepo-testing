const randomstring = require('randomstring');
const { getTestValue } = require('lib1');

console.log(getTestValue() + randomstring.generate());
