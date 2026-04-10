const string = require('../src/bai1_2_string_utils_module');

describe('capitalize()', () => {
    test('capitalize("hello")', () => {
        expect(string.capitalize('hello')).toBe('Hello');
    });
});

describe('reverse()', () => {
    test('reverse("hello")', () => {
        expect(string.reverse('hello')).toBe('olleh');
    });
});
describe('isPalindrome()', () => {
    test('isPalindrome("racecar")', () => {
        expect(string.isPalindrome('racecar')).toBe(true);
    });
});

describe('slugify()', () => {
    test('slugify("hello world")', () => {
        expect(string.slugify('hello world')).toBe('hello-world');
    });
});

describe('camelCase()', () => {
    test('camelCase("hello world")', () => {
        expect(string.camelCase('hello world')).toBe('helloWorld');
    });
});
describe('snakeCase()', () => {
    test('snakeCase("hello world")', () => {
        expect(string.snakeCase('hello world')).toBe('hello_world');
    });
});
