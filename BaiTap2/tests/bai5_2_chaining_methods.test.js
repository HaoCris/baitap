/**
 * Test suite cho Bài 5.2: Chaining Methods
 */

const {
  getExpensiveInStockElectronics,
  getCheapestProductPerCategory,
  calculateCategoryStats,
  getTopExpensiveProducts,
  getProductsInPriceRangeSorted,
  getPopularCategories,
  enrichProductsWithTax,
  findDuplicates,
  getAffordableBestSellers,
  getCategorySummary,
  getProductsWithDiscountTier
} = require('../src/bai5_2_chaining_methods');

// Sample data
const sampleProducts = [
  { id: 1, name: 'Laptop', price: 1000, category: 'Electronics', inStock: true },
  { id: 2, name: 'Phone', price: 500, category: 'Electronics', inStock: false },
  { id: 3, name: 'Shirt', price: 50, category: 'Clothing', inStock: true },
  { id: 4, name: 'Headphones', price: 150, category: 'Electronics', inStock: true },
  { id: 5, name: 'Pants', price: 80, category: 'Clothing', inStock: false },
  { id: 6, name: 'Watch', price: 200, category: 'Accessories', inStock: true },
  { id: 7, name: 'Tablet', price: 300, category: 'Electronics', inStock: true },
  { id: 8, name: 'Jacket', price: 120, category: 'Clothing', inStock: true }
];

describe('Bài 5.2: Chaining Methods', () => {
  
  describe('getExpensiveInStockElectronics()', () => {
    test('lấy electronics còn hàng giá > 200', () => {
      const result = getExpensiveInStockElectronics(sampleProducts);
      
      expect(result.every(p => p.category === 'Electronics')).toBe(true);
      expect(result.every(p => p.inStock === true)).toBe(true);
      expect(result.every(p => p.price > 200)).toBe(true);
      
      // Laptop(1000), Tablet(300)
      expect(result).toHaveLength(2);
    });

    test('sắp xếp giảm dần theo giá', () => {
      const result = getExpensiveInStockElectronics(sampleProducts);
      
      expect(result[0].name).toBe('Laptop'); // 1000
      expect(result[1].name).toBe('Tablet'); // 300
    });

    test('không bao gồm sản phẩm hết hàng', () => {
      const result = getExpensiveInStockElectronics(sampleProducts);
      
      expect(result.some(p => p.name === 'Phone')).toBe(false);
    });

    test('không bao gồm sản phẩm giá <= 200', () => {
      const result = getExpensiveInStockElectronics(sampleProducts);
      
      expect(result.some(p => p.name === 'Headphones')).toBe(false); // 150
    });

    test('trả về mảng rỗng nếu không có sản phẩm phù hợp', () => {
      const products = [
        { id: 1, name: 'Mouse', price: 50, category: 'Electronics', inStock: true }
      ];
      const result = getExpensiveInStockElectronics(products);
      expect(result).toEqual([]);
    });

    test('throw error nếu products không phải array', () => {
      expect(() => getExpensiveInStockElectronics('not-array'))
        .toThrow('products phải là một array');
    });

    test('không mutate array gốc', () => {
      const original = [...sampleProducts];
      getExpensiveInStockElectronics(sampleProducts);
      expect(sampleProducts).toEqual(original);
    });
  });

  describe('getCheapestProductPerCategory()', () => {
    test('lấy sản phẩm rẻ nhất mỗi category', () => {
      const result = getCheapestProductPerCategory(sampleProducts);
      
      expect(result.Electronics.name).toBe('Headphones'); // 150
      expect(result.Clothing.name).toBe('Shirt'); // 50
      expect(result.Accessories.name).toBe('Watch'); // 200
    });

    test('trả về object với key là category', () => {
      const result = getCheapestProductPerCategory(sampleProducts);
      
      expect(Object.keys(result).sort()).toEqual(['Accessories', 'Clothing', 'Electronics']);
    });

    test('xử lý category có một sản phẩm', () => {
      const products = [
        { id: 1, name: 'Book', price: 20, category: 'Books' }
      ];
      const result = getCheapestProductPerCategory(products);
      
      expect(result.Books.name).toBe('Book');
    });

    test('xử lý nhiều sản phẩm cùng giá', () => {
      const products = [
        { id: 1, name: 'A', price: 100, category: 'Cat1' },
        { id: 2, name: 'B', price: 100, category: 'Cat1' }
      ];
      const result = getCheapestProductPerCategory(products);
      
      expect(result.Cat1.price).toBe(100);
    });

    test('trả về object rỗng cho mảng rỗng', () => {
      expect(getCheapestProductPerCategory([])).toEqual({});
    });

    test('throw error nếu products không phải array', () => {
      expect(() => getCheapestProductPerCategory('not-array'))
        .toThrow('products phải là một array');
    });
  });

  describe('calculateCategoryStats()', () => {
    test('tính count, total, average cho mỗi category', () => {
      const result = calculateCategoryStats(sampleProducts);
      
      // Electronics: Laptop(1000), Phone(500), Headphones(150), Tablet(300) = 1950
      expect(result.Electronics.count).toBe(4);
      expect(result.Electronics.total).toBe(1950);
      expect(result.Electronics.average).toBe(487.5);
      
      // Clothing: Shirt(50), Pants(80), Jacket(120) = 250
      expect(result.Clothing.count).toBe(3);
      expect(result.Clothing.total).toBe(250);
      expect(result.Clothing.average).toBe(83.33);
      
      // Accessories: Watch(200)
      expect(result.Accessories.count).toBe(1);
      expect(result.Accessories.total).toBe(200);
      expect(result.Accessories.average).toBe(200);
    });

    test('làm tròn average đến 2 chữ số thập phân', () => {
      const products = [
        { id: 1, name: 'A', price: 10, category: 'Test' },
        { id: 2, name: 'B', price: 15, category: 'Test' },
        { id: 3, name: 'C', price: 20, category: 'Test' }
      ];
      const result = calculateCategoryStats(products);
      
      expect(result.Test.average).toBe(15);
    });

    test('xử lý category có một sản phẩm', () => {
      const products = [
        { id: 1, name: 'Book', price: 25, category: 'Books' }
      ];
      const result = calculateCategoryStats(products);
      
      expect(result.Books.count).toBe(1);
      expect(result.Books.total).toBe(25);
      expect(result.Books.average).toBe(25);
    });

    test('trả về object rỗng cho mảng rỗng', () => {
      expect(calculateCategoryStats([])).toEqual({});
    });

    test('throw error nếu products không phải array', () => {
      expect(() => calculateCategoryStats('not-array'))
        .toThrow('products phải là một array');
    });
  });

  describe('getTopExpensiveProducts()', () => {
    test('lấy top N sản phẩm đắt nhất', () => {
      const result = getTopExpensiveProducts(sampleProducts, 3);
      
      expect(result).toHaveLength(3);
      expect(result[0].name).toBe('Laptop'); // 1000
      expect(result[1].name).toBe('Phone'); // 500
      expect(result[2].name).toBe('Tablet'); // 300
    });

    test('mặc định lấy top 5', () => {
      const result = getTopExpensiveProducts(sampleProducts);
      expect(result).toHaveLength(5);
    });

    test('xử lý n lớn hơn số sản phẩm', () => {
      const result = getTopExpensiveProducts(sampleProducts, 100);
      expect(result).toHaveLength(sampleProducts.length);
    });

    test('không mutate array gốc', () => {
      const original = [...sampleProducts];
      getTopExpensiveProducts(sampleProducts, 3);
      expect(sampleProducts).toEqual(original);
    });

    test('throw error nếu n không hợp lệ', () => {
      expect(() => getTopExpensiveProducts(sampleProducts, 0))
        .toThrow('n phải là số dương');
      expect(() => getTopExpensiveProducts(sampleProducts, -5))
        .toThrow('n phải là số dương');
    });

    test('throw error nếu products không phải array', () => {
      expect(() => getTopExpensiveProducts('not-array', 3))
        .toThrow('products phải là một array');
    });
  });

  describe('getProductsInPriceRangeSorted()', () => {
    test('lọc sản phẩm trong khoảng giá và sắp xếp theo tên', () => {
      const result = getProductsInPriceRangeSorted(sampleProducts, 100, 300);
      
      expect(result.every(p => p.price >= 100 && p.price <= 300)).toBe(true);
      
      // Headphones(150), Jacket(120), Tablet(300), Watch(200)
      expect(result).toHaveLength(4);
      
      // Sắp xếp theo tên A-Z
      expect(result[0].name).toBe('Headphones');
      expect(result[1].name).toBe('Jacket');
      expect(result[2].name).toBe('Tablet');
      expect(result[3].name).toBe('Watch');
    });

    test('bao gồm cả min và max price', () => {
      const result = getProductsInPriceRangeSorted(sampleProducts, 150, 200);
      
      expect(result.some(p => p.price === 150)).toBe(true);
      expect(result.some(p => p.price === 200)).toBe(true);
    });

    test('throw error nếu minPrice > maxPrice', () => {
      expect(() => getProductsInPriceRangeSorted(sampleProducts, 500, 100))
        .toThrow('minPrice không thể lớn hơn maxPrice');
    });

    test('throw error nếu giá không phải số', () => {
      expect(() => getProductsInPriceRangeSorted(sampleProducts, 'abc', 500))
        .toThrow('minPrice và maxPrice phải là số');
    });

    test('throw error nếu products không phải array', () => {
      expect(() => getProductsInPriceRangeSorted('not-array', 0, 100))
        .toThrow('products phải là một array');
    });
  });

  describe('getPopularCategories()', () => {
    test('lấy categories có ít nhất minCount sản phẩm', () => {
      const result = getPopularCategories(sampleProducts, 3);
      
      // Electronics(4), Clothing(3)
      expect(result.sort()).toEqual(['Clothing', 'Electronics']);
    });

    test('mặc định minCount = 2', () => {
      const result = getPopularCategories(sampleProducts);
      
      // Electronics(4), Clothing(3)
      expect(result).toHaveLength(2);
    });

    test('sắp xếp kết quả theo alphabet', () => {
      const result = getPopularCategories(sampleProducts, 2);
      
      expect(result[0]).toBe('Clothing');
      expect(result[1]).toBe('Electronics');
    });

    test('trả về mảng rỗng nếu không có category nào đủ điều kiện', () => {
      const result = getPopularCategories(sampleProducts, 10);
      expect(result).toEqual([]);
    });

    test('throw error nếu minCount không hợp lệ', () => {
      expect(() => getPopularCategories(sampleProducts, 0))
        .toThrow('minCount phải là số dương');
    });

    test('throw error nếu products không phải array', () => {
      expect(() => getPopularCategories('not-array', 2))
        .toThrow('products phải là một array');
    });
  });

  describe('enrichProductsWithTax()', () => {
    test('thêm thông tin thuế vào sản phẩm', () => {
      const result = enrichProductsWithTax(sampleProducts, 10);
      
      expect(result[0].taxRate).toBe(10);
      expect(result[0].taxAmount).toBe(100); // 1000 * 0.1
      expect(result[0].priceWithTax).toBe(1100);
    });

    test('mặc định taxRate = 10', () => {
      const result = enrichProductsWithTax(sampleProducts);
      
      expect(result.every(p => p.taxRate === 10)).toBe(true);
    });

    test('giữ nguyên các properties gốc', () => {
      const result = enrichProductsWithTax(sampleProducts, 10);
      
      expect(result[0].id).toBe(1);
      expect(result[0].name).toBe('Laptop');
      expect(result[0].price).toBe(1000);
    });

    test('làm tròn đến 2 chữ số thập phân', () => {
      const products = [
        { id: 1, name: 'Test', price: 99.99, category: 'Test' }
      ];
      const result = enrichProductsWithTax(products, 15);
      
      expect(result[0].taxAmount).toBe(15);
      expect(result[0].priceWithTax).toBe(114.99);
    });

    test('throw error nếu taxRate không hợp lệ', () => {
      expect(() => enrichProductsWithTax(sampleProducts, -10))
        .toThrow('taxRate phải là số từ 0 đến 100');
      expect(() => enrichProductsWithTax(sampleProducts, 110))
        .toThrow('taxRate phải là số từ 0 đến 100');
    });

    test('throw error nếu products không phải array', () => {
      expect(() => enrichProductsWithTax('not-array', 10))
        .toThrow('products phải là một array');
    });
  });

  describe('findDuplicates()', () => {
    test('tìm duplicates theo property', () => {
      const result = findDuplicates(sampleProducts, 'category');
      
      expect(result.sort()).toEqual(['Clothing', 'Electronics']);
    });

    test('trả về mảng rỗng nếu không có duplicates', () => {
      const products = [
        { id: 1, name: 'A', category: 'Cat1' },
        { id: 2, name: 'B', category: 'Cat2' }
      ];
      const result = findDuplicates(products, 'category');
      
      expect(result).toEqual([]);
    });

    test('tìm duplicates theo property khác', () => {
      const products = [
        { id: 1, name: 'A', price: 100 },
        { id: 2, name: 'B', price: 100 },
        { id: 3, name: 'C', price: 200 }
      ];
      const result = findDuplicates(products, 'price');
      
      expect(result).toEqual([100]);
    });

    test('throw error nếu property không hợp lệ', () => {
      expect(() => findDuplicates(sampleProducts, ''))
        .toThrow('property phải là string không rỗng');
      expect(() => findDuplicates(sampleProducts, 123))
        .toThrow('property phải là string không rỗng');
    });

    test('throw error nếu products không phải array', () => {
      expect(() => findDuplicates('not-array', 'category'))
        .toThrow('products phải là một array');
    });
  });

  describe('getAffordableBestSellers()', () => {
    test('lấy sản phẩm còn hàng giá 100-1000, top 5', () => {
      const result = getAffordableBestSellers(sampleProducts);
      
      expect(result.every(p => p.price >= 100 && p.price <= 1000)).toBe(true);
      expect(result.length).toBeLessThanOrEqual(5);
    });

    test('sắp xếp giảm dần theo giá', () => {
      const result = getAffordableBestSellers(sampleProducts);
      
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].price).toBeGreaterThanOrEqual(result[i + 1].price);
      }
    });

    test('thêm displayName và isAffordable', () => {
      const result = getAffordableBestSellers(sampleProducts);
      
      expect(result[0].displayName).toBeDefined();
      expect(result[0].isAffordable).toBeDefined();
      expect(typeof result[0].isAffordable).toBe('boolean');
    });

    test('isAffordable = true nếu giá < 500', () => {
      const result = getAffordableBestSellers(sampleProducts);
      
      result.forEach(product => {
        if (product.price < 500) {
          expect(product.isAffordable).toBe(true);
        } else {
          expect(product.isAffordable).toBe(false);
        }
      });
    });

    test('trả về mảng rỗng nếu không có sản phẩm phù hợp', () => {
      const products = [
        { id: 1, name: 'Cheap', price: 50, inStock: true }
      ];
      const result = getAffordableBestSellers(products);
      expect(result).toEqual([]);
    });

    test('throw error nếu products không phải array', () => {
      expect(() => getAffordableBestSellers('not-array'))
        .toThrow('products phải là một array');
    });
  });

  describe('getCategorySummary()', () => {
    test('nhóm và tính tổng hợp theo category', () => {
      const result = getCategorySummary(sampleProducts);
      
      expect(result).toHaveLength(3);
      
      const electronics = result.find(c => c.category === 'Electronics');
      expect(electronics.count).toBe(4);
      expect(electronics.totalValue).toBe(1950);
      expect(electronics.products).toHaveLength(4);
    });

    test('sắp xếp giảm dần theo totalValue', () => {
      const result = getCategorySummary(sampleProducts);
      
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].totalValue).toBeGreaterThanOrEqual(result[i + 1].totalValue);
      }
    });

    test('bao gồm tất cả sản phẩm trong products array', () => {
      const result = getCategorySummary(sampleProducts);
      
      const electronics = result.find(c => c.category === 'Electronics');
      expect(electronics.products.map(p => p.name)).toContain('Laptop');
      expect(electronics.products.map(p => p.name)).toContain('Phone');
    });

    test('trả về mảng rỗng cho input rỗng', () => {
      expect(getCategorySummary([])).toEqual([]);
    });

    test('throw error nếu products không phải array', () => {
      expect(() => getCategorySummary('not-array'))
        .toThrow('products phải là một array');
    });
  });

  describe('getProductsWithDiscountTier()', () => {
    test('tính discount tier dựa vào giá', () => {
      const result = getProductsWithDiscountTier(sampleProducts);
      
      const laptop = result.find(p => p.name === 'Laptop');
      expect(laptop.tier).toBe('premium'); // >= 1000
      expect(laptop.discountPercent).toBe(20);
      
      const phone = result.find(p => p.name === 'Phone');
      expect(phone.tier).toBe('gold'); // >= 500
      expect(phone.discountPercent).toBe(15);
      
      const watch = result.find(p => p.name === 'Watch');
      expect(watch.tier).toBe('silver'); // >= 200
      expect(watch.discountPercent).toBe(10);
      
      const headphones = result.find(p => p.name === 'Headphones');
      expect(headphones.tier).toBe('bronze'); // >= 100
      expect(headphones.discountPercent).toBe(5);
      
      const shirt = result.find(p => p.name === 'Shirt');
      expect(shirt.tier).toBe('standard'); // < 100
      expect(shirt.discountPercent).toBe(0);
    });

    test('tính discountedPrice và savings', () => {
      const result = getProductsWithDiscountTier(sampleProducts);
      
      const laptop = result.find(p => p.name === 'Laptop');
      expect(laptop.discountedPrice).toBe(800); // 1000 * 0.8
      expect(laptop.savings).toBe(200);
    });

    test('sắp xếp giảm dần theo savings', () => {
      const result = getProductsWithDiscountTier(sampleProducts);
      
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].savings).toBeGreaterThanOrEqual(result[i + 1].savings);
      }
    });

    test('giữ nguyên originalPrice', () => {
      const result = getProductsWithDiscountTier(sampleProducts);
      
      result.forEach(product => {
        expect(product.originalPrice).toBeDefined();
      });
    });

    test('throw error nếu products không phải array', () => {
      expect(() => getProductsWithDiscountTier('not-array'))
        .toThrow('products phải là một array');
    });
  });

  // Integration tests
  describe('Integration Tests', () => {
    test('kết hợp nhiều functions', () => {
      // Lấy electronics đắt -> enrich với tax -> lấy top 2
      const expensive = getExpensiveInStockElectronics(sampleProducts);
      const withTax = enrichProductsWithTax(expensive, 10);
      const top2 = getTopExpensiveProducts(withTax, 2);
      
      expect(top2).toHaveLength(2);
      expect(top2[0].priceWithTax).toBeDefined();
    });

    test('chain multiple transformations', () => {
      // Stats -> filter popular -> transform
      const stats = calculateCategoryStats(sampleProducts);
      const popular = Object.entries(stats)
        .filter(([_, data]) => data.count >= 3)
        .map(([category, data]) => ({ category, ...data }));
      
      expect(popular.length).toBeGreaterThan(0);
      expect(popular.every(c => c.count >= 3)).toBe(true);
    });

    test('complex pipeline', () => {
      // Lấy sản phẩm -> group by category -> lấy summary -> sort
      const summary = getCategorySummary(sampleProducts);
      const topCategory = summary[0];
      
      expect(topCategory.totalValue).toBeGreaterThan(0);
      expect(topCategory.products.length).toBeGreaterThan(0);
    });
  });
});
