/**
 * Unit Tests cho Bài 2.1: Custom Array Methods
 */

const {
  customMap,
  customFilter,
  customReduce,
  customFind,
  customEvery,
  customSome,
  customFindIndex,
  customForEach
} = require('../src/bai2_1_custom_array_methods');

describe('Bài 2.1: Custom Array Methods', () => {

  // Test data
  const numbers = [1, 2, 3, 4, 5];
  const objects = [
    { id: 1, name: 'Alice', age: 25 },
    { id: 2, name: 'Bob', age: 30 },
    { id: 3, name: 'Charlie', age: 35 }
  ];

  describe('customMap()', () => {
    test('nhân đôi các phần tử', () => {
      const result = customMap(numbers, x => x * 2);
      expect(result).toEqual([2, 4, 6, 8, 10]);
    });

    test('không thay đổi mảng gốc', () => {
      const original = [1, 2, 3];
      customMap(original, x => x * 2);
      expect(original).toEqual([1, 2, 3]);
    });

    test('callback nhận đúng các tham số', () => {
      const args = [];
      customMap([10, 20], (element, index, array) => {
        args.push({ element, index, array });
        return element;
      });
      
      expect(args[0].element).toBe(10);
      expect(args[0].index).toBe(0);
      expect(args[1].element).toBe(20);
      expect(args[1].index).toBe(1);
    });

    test('hoạt động với mảng objects', () => {
      const result = customMap(objects, obj => obj.name);
      expect(result).toEqual(['Alice', 'Bob', 'Charlie']);
    });

    test('hoạt động với mảng rỗng', () => {
      const result = customMap([], x => x * 2);
      expect(result).toEqual([]);
    });

    test('throw error nếu không phải array', () => {
      expect(() => customMap('string', x => x)).toThrow(TypeError);
      expect(() => customMap(null, x => x)).toThrow(TypeError);
    });

    test('throw error nếu callback không phải function', () => {
      expect(() => customMap([1, 2, 3], 'not a function')).toThrow(TypeError);
    });
  });

  describe('customFilter()', () => {
    test('lọc số chẵn', () => {
      const result = customFilter(numbers, x => x % 2 === 0);
      expect(result).toEqual([2, 4]);
    });

    test('lọc theo điều kiện phức tạp', () => {
      const result = customFilter(objects, obj => obj.age > 25);
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Bob');
    });

    test('không thay đổi mảng gốc', () => {
      const original = [1, 2, 3, 4];
      customFilter(original, x => x > 2);
      expect(original).toEqual([1, 2, 3, 4]);
    });

    test('trả về mảng rỗng nếu không có phần tử nào thỏa điều kiện', () => {
      const result = customFilter(numbers, x => x > 10);
      expect(result).toEqual([]);
    });

    test('hoạt động với mảng rỗng', () => {
      const result = customFilter([], x => x > 0);
      expect(result).toEqual([]);
    });

    test('throw error nếu không phải array', () => {
      expect(() => customFilter(123, x => x)).toThrow(TypeError);
    });
  });

  describe('customReduce()', () => {
    test('tính tổng các phần tử', () => {
      const result = customReduce(numbers, (acc, cur) => acc + cur, 0);
      expect(result).toBe(15);
    });

    test('hoạt động không có initialValue', () => {
      const result = customReduce(numbers, (acc, cur) => acc + cur);
      expect(result).toBe(15);
    });

    test('tính tích các phần tử', () => {
      const result = customReduce([1, 2, 3, 4], (acc, cur) => acc * cur, 1);
      expect(result).toBe(24);
    });

    test('flatten array', () => {
      const nested = [[1, 2], [3, 4], [5]];
      const result = customReduce(nested, (acc, cur) => acc.concat(cur), []);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    test('đếm số lần xuất hiện', () => {
      const items = ['a', 'b', 'a', 'c', 'a', 'b'];
      const result = customReduce(items, (acc, cur) => {
        acc[cur] = (acc[cur] || 0) + 1;
        return acc;
      }, {});
      expect(result).toEqual({ a: 3, b: 2, c: 1 });
    });

    test('callback nhận đúng 4 tham số', () => {
      const args = [];
      customReduce([10, 20, 30], (acc, cur, index, array) => {
        args.push({ acc, cur, index, array });
        return acc + cur;
      }, 0);
      
      expect(args[0]).toMatchObject({ acc: 0, cur: 10, index: 0 });
      expect(args[1]).toMatchObject({ acc: 10, cur: 20, index: 1 });
    });

    test('throw error nếu mảng rỗng và không có initialValue', () => {
      expect(() => customReduce([], (acc, cur) => acc + cur)).toThrow(TypeError);
    });

    test('hoạt động với mảng một phần tử và không có initialValue', () => {
      const result = customReduce([5], (acc, cur) => acc + cur);
      expect(result).toBe(5);
    });
  });

  describe('customFind()', () => {
    test('tìm phần tử đầu tiên thỏa điều kiện', () => {
      const result = customFind(numbers, x => x > 3);
      expect(result).toBe(4);
    });

    test('trả về undefined nếu không tìm thấy', () => {
      const result = customFind(numbers, x => x > 10);
      expect(result).toBeUndefined();
    });

    test('tìm object theo điều kiện', () => {
      const result = customFind(objects, obj => obj.name === 'Bob');
      expect(result).toEqual({ id: 2, name: 'Bob', age: 30 });
    });

    test('chỉ trả về phần tử đầu tiên', () => {
      const result = customFind([1, 2, 3, 4], x => x > 1);
      expect(result).toBe(2);
    });

    test('hoạt động với mảng rỗng', () => {
      const result = customFind([], x => x > 0);
      expect(result).toBeUndefined();
    });
  });

  describe('customEvery()', () => {
    test('trả về true nếu tất cả thỏa điều kiện', () => {
      const result = customEvery([2, 4, 6, 8], x => x % 2 === 0);
      expect(result).toBe(true);
    });

    test('trả về false nếu có phần tử không thỏa điều kiện', () => {
      const result = customEvery([2, 4, 5, 8], x => x % 2 === 0);
      expect(result).toBe(false);
    });

    test('trả về true cho mảng rỗng', () => {
      const result = customEvery([], x => x > 0);
      expect(result).toBe(true);
    });

    test('dừng ngay khi gặp phần tử không thỏa', () => {
      let count = 0;
      customEvery([1, 2, 3, 4, 5], x => {
        count++;
        return x < 3;
      });
      expect(count).toBe(3); // Dừng tại phần tử thứ 3
    });
  });

  describe('customSome()', () => {
    test('trả về true nếu có ít nhất một phần tử thỏa điều kiện', () => {
      const result = customSome([1, 3, 5, 6], x => x % 2 === 0);
      expect(result).toBe(true);
    });

    test('trả về false nếu không có phần tử nào thỏa điều kiện', () => {
      const result = customSome([1, 3, 5, 7], x => x % 2 === 0);
      expect(result).toBe(false);
    });

    test('trả về false cho mảng rỗng', () => {
      const result = customSome([], x => x > 0);
      expect(result).toBe(false);
    });

    test('dừng ngay khi tìm thấy phần tử thỏa', () => {
      let count = 0;
      customSome([1, 2, 3, 4, 5], x => {
        count++;
        return x === 2;
      });
      expect(count).toBe(2); // Dừng tại phần tử thứ 2
    });
  });

  describe('customFindIndex()', () => {
    test('trả về index của phần tử đầu tiên thỏa điều kiện', () => {
      const result = customFindIndex(numbers, x => x > 3);
      expect(result).toBe(3); // index của số 4
    });

    test('trả về -1 nếu không tìm thấy', () => {
      const result = customFindIndex(numbers, x => x > 10);
      expect(result).toBe(-1);
    });

    test('hoạt động với objects', () => {
      const result = customFindIndex(objects, obj => obj.name === 'Charlie');
      expect(result).toBe(2);
    });
  });

  describe('customForEach()', () => {
    test('gọi callback cho mỗi phần tử', () => {
      const results = [];
      customForEach([1, 2, 3], x => results.push(x * 2));
      expect(results).toEqual([2, 4, 6]);
    });

    test('callback nhận đúng các tham số', () => {
      const args = [];
      customForEach(['a', 'b'], (element, index, array) => {
        args.push({ element, index });
      });
      
      expect(args[0]).toEqual({ element: 'a', index: 0 });
      expect(args[1]).toEqual({ element: 'b', index: 1 });
    });

    test('không trả về giá trị', () => {
      const result = customForEach([1, 2, 3], x => x * 2);
      expect(result).toBeUndefined();
    });
  });
});
