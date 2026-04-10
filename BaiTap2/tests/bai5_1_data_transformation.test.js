/**
 * Test suite cho Bài 5.1: Data Transformation
 */

const {
  getProductNames,
  getInStockProducts,
  getTotalValue,
  groupByCategory,
  sortByPrice,
  applyDiscount,
  getMostExpensiveProduct,
  getCheapestProduct,
  getAveragePrice,
  filterByPriceRange,
  countByCategory,
  findProductById,
  updateProductPrice
} = require('../src/bai5_1_data_transformation');

// Sample data for testing
const sampleProducts = [
  { id: 1, name: 'Laptop', price: 1000, category: 'Electronics', inStock: true },
  { id: 2, name: 'Phone', price: 500, category: 'Electronics', inStock: false },
  { id: 3, name: 'Shirt', price: 50, category: 'Clothing', inStock: true },
  { id: 4, name: 'Headphones', price: 150, category: 'Electronics', inStock: true },
  { id: 5, name: 'Pants', price: 80, category: 'Clothing', inStock: false },
  { id: 6, name: 'Watch', price: 200, category: 'Accessories', inStock: true }
];

describe('Bài 5.1: Data Transformation', () => {
  
  describe('getProductNames()', () => {
    test('lấy tất cả tên sản phẩm', () => {
      const names = getProductNames(sampleProducts);
      
      expect(names).toEqual([
        'Laptop',
        'Phone',
        'Shirt',
        'Headphones',
        'Pants',
        'Watch'
      ]);
    });

    test('trả về mảng rỗng khi input rỗng', () => {
      expect(getProductNames([])).toEqual([]);
    });

    test('throw error nếu products không phải array', () => {
      expect(() => getProductNames('not-array')).toThrow('products phải là một array');
      expect(() => getProductNames(null)).toThrow('products phải là một array');
    });

    test('không mutate array gốc', () => {
      const original = [...sampleProducts];
      getProductNames(sampleProducts);
      expect(sampleProducts).toEqual(original);
    });
  });

  describe('getInStockProducts()', () => {
    test('lấy sản phẩm còn hàng', () => {
      const inStock = getInStockProducts(sampleProducts);
      
      expect(inStock).toHaveLength(4);
      expect(inStock.every(p => p.inStock === true)).toBe(true);
      expect(inStock.map(p => p.name)).toEqual([
        'Laptop',
        'Shirt',
        'Headphones',
        'Watch'
      ]);
    });

    test('trả về mảng rỗng nếu không có sản phẩm nào còn hàng', () => {
      const products = [
        { id: 1, name: 'A', inStock: false },
        { id: 2, name: 'B', inStock: false }
      ];
      expect(getInStockProducts(products)).toEqual([]);
    });

    test('throw error nếu products không phải array', () => {
      expect(() => getInStockProducts('not-array')).toThrow('products phải là một array');
    });

    test('không mutate array gốc', () => {
      const original = [...sampleProducts];
      getInStockProducts(sampleProducts);
      expect(sampleProducts).toEqual(original);
    });
  });

  describe('getTotalValue()', () => {
    test('tính tổng giá trị sản phẩm', () => {
      const total = getTotalValue(sampleProducts);
      expect(total).toBe(1980); // 1000 + 500 + 50 + 150 + 80 + 200
    });

    test('trả về 0 cho mảng rỗng', () => {
      expect(getTotalValue([])).toBe(0);
    });

    test('tính đúng với một sản phẩm', () => {
      const products = [{ id: 1, name: 'Test', price: 100 }];
      expect(getTotalValue(products)).toBe(100);
    });

    test('throw error nếu products không phải array', () => {
      expect(() => getTotalValue('not-array')).toThrow('products phải là một array');
    });
  });

  describe('groupByCategory()', () => {
    test('nhóm sản phẩm theo category', () => {
      const grouped = groupByCategory(sampleProducts);
      
      expect(Object.keys(grouped)).toEqual(['Electronics', 'Clothing', 'Accessories']);
      expect(grouped.Electronics).toHaveLength(3);
      expect(grouped.Clothing).toHaveLength(2);
      expect(grouped.Accessories).toHaveLength(1);
    });

    test('trả về object rỗng cho mảng rỗng', () => {
      expect(groupByCategory([])).toEqual({});
    });

    test('xử lý một category', () => {
      const products = [
        { id: 1, name: 'A', category: 'Books' },
        { id: 2, name: 'B', category: 'Books' }
      ];
      const grouped = groupByCategory(products);
      expect(Object.keys(grouped)).toEqual(['Books']);
      expect(grouped.Books).toHaveLength(2);
    });

    test('throw error nếu products không phải array', () => {
      expect(() => groupByCategory('not-array')).toThrow('products phải là một array');
    });
  });

  describe('sortByPrice()', () => {
    test('sắp xếp tăng dần (asc)', () => {
      const sorted = sortByPrice(sampleProducts, 'asc');
      
      expect(sorted[0].name).toBe('Shirt'); // 50
      expect(sorted[1].name).toBe('Pants'); // 80
      expect(sorted[5].name).toBe('Laptop'); // 1000
    });

    test('sắp xếp giảm dần (desc)', () => {
      const sorted = sortByPrice(sampleProducts, 'desc');
      
      expect(sorted[0].name).toBe('Laptop'); // 1000
      expect(sorted[1].name).toBe('Phone'); // 500
      expect(sorted[5].name).toBe('Shirt'); // 50
    });

    test('mặc định sắp xếp tăng dần', () => {
      const sorted = sortByPrice(sampleProducts);
      expect(sorted[0].price).toBeLessThan(sorted[1].price);
    });

    test('không mutate array gốc', () => {
      const original = [...sampleProducts];
      sortByPrice(sampleProducts, 'asc');
      expect(sampleProducts).toEqual(original);
    });

    test('throw error nếu order không hợp lệ', () => {
      expect(() => sortByPrice(sampleProducts, 'invalid')).toThrow("order phải là 'asc' hoặc 'desc'");
    });

    test('throw error nếu products không phải array', () => {
      expect(() => sortByPrice('not-array', 'asc')).toThrow('products phải là một array');
    });

    test('xử lý mảng rỗng', () => {
      expect(sortByPrice([], 'asc')).toEqual([]);
    });
  });

  describe('applyDiscount()', () => {
    test('áp dụng giảm giá 10%', () => {
      const discounted = applyDiscount(sampleProducts, 10);
      
      expect(discounted[0].price).toBe(900); // 1000 * 0.9
      expect(discounted[0].originalPrice).toBe(1000);
      expect(discounted[0].discount).toBe(10);
      
      expect(discounted[2].price).toBe(45); // 50 * 0.9
    });

    test('áp dụng giảm giá 50%', () => {
      const products = [{ id: 1, name: 'Test', price: 100 }];
      const discounted = applyDiscount(products, 50);
      
      expect(discounted[0].price).toBe(50);
      expect(discounted[0].originalPrice).toBe(100);
    });

    test('giảm giá 0% không thay đổi giá', () => {
      const products = [{ id: 1, name: 'Test', price: 100 }];
      const discounted = applyDiscount(products, 0);
      
      expect(discounted[0].price).toBe(100);
    });

    test('giảm giá 100%', () => {
      const products = [{ id: 1, name: 'Test', price: 100 }];
      const discounted = applyDiscount(products, 100);
      
      expect(discounted[0].price).toBe(0);
    });

    test('làm tròn giá đến 2 chữ số thập phân', () => {
      const products = [{ id: 1, name: 'Test', price: 99.99 }];
      const discounted = applyDiscount(products, 15);
      
      expect(discounted[0].price).toBe(84.99);
    });

    test('không mutate array gốc', () => {
      const original = [...sampleProducts];
      applyDiscount(sampleProducts, 10);
      expect(sampleProducts).toEqual(original);
    });

    test('giữ nguyên các properties khác', () => {
      const products = [
        { id: 1, name: 'Test', price: 100, category: 'Electronics', inStock: true }
      ];
      const discounted = applyDiscount(products, 10);
      
      expect(discounted[0].id).toBe(1);
      expect(discounted[0].name).toBe('Test');
      expect(discounted[0].category).toBe('Electronics');
      expect(discounted[0].inStock).toBe(true);
    });

    test('throw error nếu percent không hợp lệ', () => {
      expect(() => applyDiscount(sampleProducts, -10)).toThrow('percent phải là số từ 0 đến 100');
      expect(() => applyDiscount(sampleProducts, 110)).toThrow('percent phải là số từ 0 đến 100');
      expect(() => applyDiscount(sampleProducts, 'abc')).toThrow('percent phải là số từ 0 đến 100');
    });

    test('throw error nếu products không phải array', () => {
      expect(() => applyDiscount('not-array', 10)).toThrow('products phải là một array');
    });
  });

  describe('getMostExpensiveProduct()', () => {
    test('lấy sản phẩm đắt nhất', () => {
      const most = getMostExpensiveProduct(sampleProducts);
      expect(most.name).toBe('Laptop');
      expect(most.price).toBe(1000);
    });

    test('trả về null cho mảng rỗng', () => {
      expect(getMostExpensiveProduct([])).toBeNull();
    });

    test('xử lý mảng có một phần tử', () => {
      const products = [{ id: 1, name: 'Test', price: 100 }];
      const most = getMostExpensiveProduct(products);
      expect(most.name).toBe('Test');
    });

    test('throw error nếu products không phải array', () => {
      expect(() => getMostExpensiveProduct('not-array')).toThrow('products phải là một array');
    });
  });

  describe('getCheapestProduct()', () => {
    test('lấy sản phẩm rẻ nhất', () => {
      const cheapest = getCheapestProduct(sampleProducts);
      expect(cheapest.name).toBe('Shirt');
      expect(cheapest.price).toBe(50);
    });

    test('trả về null cho mảng rỗng', () => {
      expect(getCheapestProduct([])).toBeNull();
    });

    test('xử lý mảng có một phần tử', () => {
      const products = [{ id: 1, name: 'Test', price: 100 }];
      const cheapest = getCheapestProduct(products);
      expect(cheapest.name).toBe('Test');
    });

    test('throw error nếu products không phải array', () => {
      expect(() => getCheapestProduct('not-array')).toThrow('products phải là một array');
    });
  });

  describe('getAveragePrice()', () => {
    test('tính giá trung bình', () => {
      const average = getAveragePrice(sampleProducts);
      expect(average).toBe(330); // 1980 / 6
    });

    test('trả về 0 cho mảng rỗng', () => {
      expect(getAveragePrice([])).toBe(0);
    });

    test('làm tròn đến 2 chữ số thập phân', () => {
      const products = [
        { id: 1, name: 'A', price: 10 },
        { id: 2, name: 'B', price: 15 },
        { id: 3, name: 'C', price: 20 }
      ];
      const average = getAveragePrice(products);
      expect(average).toBe(15);
    });

    test('xử lý số thập phân', () => {
      const products = [
        { id: 1, name: 'A', price: 10.50 },
        { id: 2, name: 'B', price: 20.75 }
      ];
      const average = getAveragePrice(products);
      expect(average).toBe(15.63);
    });

    test('throw error nếu products không phải array', () => {
      expect(() => getAveragePrice('not-array')).toThrow('products phải là một array');
    });
  });

  describe('filterByPriceRange()', () => {
    test('lọc sản phẩm trong khoảng giá', () => {
      const filtered = filterByPriceRange(sampleProducts, 100, 500);
      
      expect(filtered).toHaveLength(3);
      expect(filtered.map(p => p.name)).toEqual(['Phone', 'Headphones', 'Watch']);
    });

    test('bao gồm cả giá min và max', () => {
      const filtered = filterByPriceRange(sampleProducts, 50, 200);
      
      expect(filtered).toHaveLength(4); // Shirt(50), Pants(80), Headphones(150), Watch(200)
      expect(filtered.some(p => p.price === 50)).toBe(true);
      expect(filtered.some(p => p.price === 200)).toBe(true);
    });

    test('trả về mảng rỗng nếu không có sản phẩm trong khoảng giá', () => {
      const filtered = filterByPriceRange(sampleProducts, 2000, 3000);
      expect(filtered).toEqual([]);
    });

    test('throw error nếu minPrice > maxPrice', () => {
      expect(() => filterByPriceRange(sampleProducts, 500, 100))
        .toThrow('minPrice không thể lớn hơn maxPrice');
    });

    test('throw error nếu giá âm', () => {
      expect(() => filterByPriceRange(sampleProducts, -100, 500))
        .toThrow('Giá không thể âm');
    });

    test('throw error nếu giá không phải số', () => {
      expect(() => filterByPriceRange(sampleProducts, 'abc', 500))
        .toThrow('minPrice và maxPrice phải là số');
    });

    test('throw error nếu products không phải array', () => {
      expect(() => filterByPriceRange('not-array', 0, 100))
        .toThrow('products phải là một array');
    });
  });

  describe('countByCategory()', () => {
    test('đếm số lượng sản phẩm theo category', () => {
      const counts = countByCategory(sampleProducts);
      
      expect(counts).toEqual({
        Electronics: 3,
        Clothing: 2,
        Accessories: 1
      });
    });

    test('trả về object rỗng cho mảng rỗng', () => {
      expect(countByCategory([])).toEqual({});
    });

    test('xử lý một category', () => {
      const products = [
        { id: 1, category: 'Books' },
        { id: 2, category: 'Books' },
        { id: 3, category: 'Books' }
      ];
      const counts = countByCategory(products);
      expect(counts).toEqual({ Books: 3 });
    });

    test('throw error nếu products không phải array', () => {
      expect(() => countByCategory('not-array')).toThrow('products phải là một array');
    });
  });

  describe('findProductById()', () => {
    test('tìm sản phẩm theo ID', () => {
      const product = findProductById(sampleProducts, 3);
      expect(product).toEqual({
        id: 3,
        name: 'Shirt',
        price: 50,
        category: 'Clothing',
        inStock: true
      });
    });

    test('trả về undefined nếu không tìm thấy', () => {
      const product = findProductById(sampleProducts, 999);
      expect(product).toBeUndefined();
    });

    test('tìm sản phẩm đầu tiên', () => {
      const product = findProductById(sampleProducts, 1);
      expect(product.name).toBe('Laptop');
    });

    test('tìm sản phẩm cuối cùng', () => {
      const product = findProductById(sampleProducts, 6);
      expect(product.name).toBe('Watch');
    });

    test('throw error nếu id không phải số', () => {
      expect(() => findProductById(sampleProducts, 'abc'))
        .toThrow('id phải là một số');
    });

    test('throw error nếu products không phải array', () => {
      expect(() => findProductById('not-array', 1))
        .toThrow('products phải là một array');
    });
  });

  describe('updateProductPrice()', () => {
    test('cập nhật giá sản phẩm', () => {
      const updated = updateProductPrice(sampleProducts, 3, 60);
      
      const shirtIndex = updated.findIndex(p => p.id === 3);
      expect(updated[shirtIndex].price).toBe(60);
    });

    test('không mutate array gốc', () => {
      const original = [...sampleProducts];
      updateProductPrice(sampleProducts, 3, 60);
      expect(sampleProducts).toEqual(original);
    });

    test('chỉ cập nhật sản phẩm có ID tương ứng', () => {
      const updated = updateProductPrice(sampleProducts, 1, 1200);
      
      expect(updated[0].price).toBe(1200); // Laptop updated
      expect(updated[1].price).toBe(500);  // Phone unchanged
      expect(updated[2].price).toBe(50);   // Shirt unchanged
    });

    test('giữ nguyên các properties khác', () => {
      const updated = updateProductPrice(sampleProducts, 3, 60);
      const shirt = updated.find(p => p.id === 3);
      
      expect(shirt.name).toBe('Shirt');
      expect(shirt.category).toBe('Clothing');
      expect(shirt.inStock).toBe(true);
    });

    test('throw error nếu sản phẩm không tồn tại', () => {
      expect(() => updateProductPrice(sampleProducts, 999, 100))
        .toThrow('Không tìm thấy sản phẩm với id 999');
    });

    test('throw error nếu id không phải số', () => {
      expect(() => updateProductPrice(sampleProducts, 'abc', 100))
        .toThrow('id phải là một số');
    });

    test('throw error nếu newPrice không hợp lệ', () => {
      expect(() => updateProductPrice(sampleProducts, 1, -100))
        .toThrow('newPrice phải là số không âm');
      expect(() => updateProductPrice(sampleProducts, 1, 'abc'))
        .toThrow('newPrice phải là số không âm');
    });

    test('throw error nếu products không phải array', () => {
      expect(() => updateProductPrice('not-array', 1, 100))
        .toThrow('products phải là một array');
    });

    test('chấp nhận giá 0', () => {
      const updated = updateProductPrice(sampleProducts, 1, 0);
      expect(updated[0].price).toBe(0);
    });
  });

  // Integration tests
  describe('Integration Tests', () => {
    test('kết hợp nhiều operations', () => {
      // Lấy sản phẩm còn hàng, sắp xếp theo giá, áp dụng giảm giá
      const inStock = getInStockProducts(sampleProducts);
      const sorted = sortByPrice(inStock, 'asc');
      const discounted = applyDiscount(sorted, 20);
      
      expect(discounted[0].name).toBe('Shirt');
      expect(discounted[0].price).toBe(40); // 50 * 0.8
      expect(discounted.every(p => p.inStock)).toBe(true);
    });

    test('lọc theo giá và nhóm theo category', () => {
      const filtered = filterByPriceRange(sampleProducts, 50, 500);
      const grouped = groupByCategory(filtered);
      
      expect(Object.keys(grouped).sort()).toEqual(['Accessories', 'Clothing', 'Electronics']);
      expect(grouped.Electronics).toHaveLength(2); // Phone, Headphones
    });

    test('tính stats cho từng category', () => {
      const grouped = groupByCategory(sampleProducts);
      const stats = {};
      
      for (const [category, products] of Object.entries(grouped)) {
        stats[category] = {
          count: products.length,
          total: getTotalValue(products),
          average: getAveragePrice(products)
        };
      }
      
      expect(stats.Electronics.count).toBe(3);
      expect(stats.Electronics.total).toBe(1650); // 1000 + 500 + 150
      expect(stats.Electronics.average).toBe(550);
    });

    test('xử lý pipeline phức tạp', () => {
      // Pipeline: filter inStock -> price range -> sort -> discount -> get names
      const result = getProductNames(
        applyDiscount(
          sortByPrice(
            filterByPriceRange(
              getInStockProducts(sampleProducts),
              50,
              500
            ),
            'desc'
          ),
          25
        )
      );
      
      expect(result).toEqual(['Watch', 'Headphones', 'Shirt']);
    });
  });
});
