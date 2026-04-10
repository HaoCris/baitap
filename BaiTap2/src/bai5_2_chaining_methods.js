/**
 * Bài 5.2: Chaining Methods
 * 
 * Sử dụng method chaining để viết các queries phức tạp
 */

/**
 * Lấy sản phẩm Electronics còn hàng với giá > 200
 * Demo: filter() -> filter() -> sort() chaining
 * 
 * @param {Object[]} products - Mảng các sản phẩm
 * @returns {Object[]} Mảng sản phẩm đã lọc và sắp xếp
 * @throws {Error} Nếu products không phải array
 * 
 * @example
 * const products = [
 *   { id: 1, name: 'Laptop', price: 1000, category: 'Electronics', inStock: true },
 *   { id: 2, name: 'Phone', price: 500, category: 'Electronics', inStock: false }
 * ];
 * getExpensiveInStockElectronics(products);
 * // [{ id: 1, name: 'Laptop', price: 1000, category: 'Electronics', inStock: true }]
 */
function getExpensiveInStockElectronics(products) {
  if (!Array.isArray(products)) {
    throw new Error('products phải là một array');
  }

  return products
    .filter(product => product.category === 'Electronics')
    .filter(product => product.inStock === true)
    .filter(product => product.price > 200)
    .sort((a, b) => b.price - a.price); // Sắp xếp giảm dần theo giá
}

/**
 * Lấy sản phẩm rẻ nhất trong mỗi category
 * Demo: reduce() with complex logic
 * 
 * @param {Object[]} products - Mảng các sản phẩm
 * @returns {Object} Object với key là category, value là sản phẩm rẻ nhất
 * @throws {Error} Nếu products không phải array
 * 
 * @example
 * const products = [
 *   { id: 1, name: 'Laptop', price: 1000, category: 'Electronics' },
 *   { id: 2, name: 'Phone', price: 500, category: 'Electronics' },
 *   { id: 3, name: 'Shirt', price: 50, category: 'Clothing' }
 * ];
 * getCheapestProductPerCategory(products);
 * // {
 * //   Electronics: { id: 2, name: 'Phone', price: 500, category: 'Electronics' },
 * //   Clothing: { id: 3, name: 'Shirt', price: 50, category: 'Clothing' }
 * // }
 */
function getCheapestProductPerCategory(products) {
  if (!Array.isArray(products)) {
    throw new Error('products phải là một array');
  }

  return products.reduce((result, product) => {
    const category = product.category;
    
    if (!result[category] || product.price < result[category].price) {
      result[category] = product;
    }
    
    return result;
  }, {});
}

/**
 * Tính thống kê (count, total, average) cho mỗi category
 * Demo: reduce() với accumulator phức tạp + map() để format
 * 
 * @param {Object[]} products - Mảng các sản phẩm
 * @returns {Object} Object với key là category, value là stats
 * @throws {Error} Nếu products không phải array
 * 
 * @example
 * const products = [
 *   { id: 1, name: 'Laptop', price: 1000, category: 'Electronics' },
 *   { id: 2, name: 'Phone', price: 500, category: 'Electronics' }
 * ];
 * calculateCategoryStats(products);
 * // {
 * //   Electronics: { count: 2, total: 1500, average: 750 }
 * // }
 */
function calculateCategoryStats(products) {
  if (!Array.isArray(products)) {
    throw new Error('products phải là một array');
  }

  const stats = products.reduce((result, product) => {
    const category = product.category;
    
    if (!result[category]) {
      result[category] = {
        count: 0,
        total: 0,
        average: 0
      };
    }
    
    result[category].count++;
    result[category].total += product.price;
    
    return result;
  }, {});

  // Tính average cho mỗi category
  Object.keys(stats).forEach(category => {
    stats[category].average = parseFloat(
      (stats[category].total / stats[category].count).toFixed(2)
    );
  });

  return stats;
}

/**
 * Lấy top N sản phẩm đắt nhất
 * Demo: sort() -> slice() chaining
 * 
 * @param {Object[]} products - Mảng các sản phẩm
 * @param {number} n - Số lượng sản phẩm cần lấy
 * @returns {Object[]} Mảng top N sản phẩm đắt nhất
 * @throws {Error} Nếu products không phải array hoặc n không hợp lệ
 * 
 * @example
 * getTopExpensiveProducts(products, 3);
 * // Trả về 3 sản phẩm đắt nhất
 */
function getTopExpensiveProducts(products, n = 5) {
  if (!Array.isArray(products)) {
    throw new Error('products phải là một array');
  }

  if (typeof n !== 'number' || n < 1) {
    throw new Error('n phải là số dương');
  }

  return products
    .slice() // Clone để không mutate array gốc
    .sort((a, b) => b.price - a.price)
    .slice(0, n);
}

/**
 * Lấy sản phẩm trong khoảng giá và sắp xếp theo tên
 * Demo: filter() -> sort() chaining với custom comparator
 * 
 * @param {Object[]} products - Mảng các sản phẩm
 * @param {number} minPrice - Giá tối thiểu
 * @param {number} maxPrice - Giá tối đa
 * @returns {Object[]} Mảng sản phẩm đã lọc và sắp xếp theo tên
 * @throws {Error} Nếu products không phải array hoặc giá không hợp lệ
 * 
 * @example
 * getProductsInPriceRangeSorted(products, 100, 500);
 */
function getProductsInPriceRangeSorted(products, minPrice, maxPrice) {
  if (!Array.isArray(products)) {
    throw new Error('products phải là một array');
  }

  if (typeof minPrice !== 'number' || typeof maxPrice !== 'number') {
    throw new Error('minPrice và maxPrice phải là số');
  }

  if (minPrice > maxPrice) {
    throw new Error('minPrice không thể lớn hơn maxPrice');
  }

  return products
    .filter(product => product.price >= minPrice && product.price <= maxPrice)
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Lấy tên các category có ít nhất minCount sản phẩm
 * Demo: reduce() -> Object.entries() -> filter() -> map() chaining
 * 
 * @param {Object[]} products - Mảng các sản phẩm
 * @param {number} minCount - Số lượng sản phẩm tối thiểu
 * @returns {string[]} Mảng tên category
 * @throws {Error} Nếu products không phải array hoặc minCount không hợp lệ
 * 
 * @example
 * getPopularCategories(products, 3);
 * // ['Electronics'] (nếu Electronics có >= 3 sản phẩm)
 */
function getPopularCategories(products, minCount = 2) {
  if (!Array.isArray(products)) {
    throw new Error('products phải là một array');
  }

  if (typeof minCount !== 'number' || minCount < 1) {
    throw new Error('minCount phải là số dương');
  }

  const counts = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .filter(([_, count]) => count >= minCount)
    .map(([category, _]) => category)
    .sort();
}

/**
 * Transform và enrich product data
 * Demo: map() với transformation phức tạp
 * 
 * @param {Object[]} products - Mảng các sản phẩm
 * @param {number} taxRate - Thuế suất (%)
 * @returns {Object[]} Mảng sản phẩm đã được enrich với thông tin thuế
 * @throws {Error} Nếu products không phải array hoặc taxRate không hợp lệ
 * 
 * @example
 * enrichProductsWithTax(products, 10);
 * // Mỗi product sẽ có thêm: taxAmount, priceWithTax
 */
function enrichProductsWithTax(products, taxRate = 10) {
  if (!Array.isArray(products)) {
    throw new Error('products phải là một array');
  }

  if (typeof taxRate !== 'number' || taxRate < 0 || taxRate > 100) {
    throw new Error('taxRate phải là số từ 0 đến 100');
  }

  return products.map(product => {
    const taxAmount = parseFloat((product.price * taxRate / 100).toFixed(2));
    const priceWithTax = parseFloat((product.price + taxAmount).toFixed(2));
    
    return {
      ...product,
      taxRate,
      taxAmount,
      priceWithTax
    };
  });
}

/**
 * Tìm duplicates theo một property
 * Demo: reduce() -> filter() -> map() chaining để tìm duplicates
 * 
 * @param {Object[]} products - Mảng các sản phẩm
 * @param {string} property - Property cần check duplicate
 * @returns {any[]} Mảng các giá trị bị duplicate
 * @throws {Error} Nếu products không phải array hoặc property không hợp lệ
 * 
 * @example
 * findDuplicates(products, 'category');
 * // ['Electronics'] (nếu có nhiều sản phẩm Electronics)
 */
function findDuplicates(products, property) {
  if (!Array.isArray(products)) {
    throw new Error('products phải là một array');
  }

  if (typeof property !== 'string' || !property) {
    throw new Error('property phải là string không rỗng');
  }

  const counts = products.reduce((acc, product) => {
    const value = product[property];
    const key = JSON.stringify(value);
    if (!acc[key]) {
      acc[key] = { value, count: 0 };
    }
    acc[key].count++;
    return acc;
  }, {});

  return Object.values(counts)
    .filter(item => item.count > 1)
    .map(item => item.value);
}

/**
 * Complex query: Lấy sản phẩm còn hàng, giá từ 100-1000, sắp xếp theo giá, lấy top 5
 * Demo: nhiều array methods chained lại
 * 
 * @param {Object[]} products - Mảng các sản phẩm
 * @returns {Object[]} Mảng sản phẩm đã lọc và transform
 * @throws {Error} Nếu products không phải array
 * 
 * @example
 * getAffordableBestSellers(products);
 */
function getAffordableBestSellers(products) {
  if (!Array.isArray(products)) {
    throw new Error('products phải là một array');
  }

  return products
    .filter(product => product.inStock === true)
    .filter(product => product.price >= 100 && product.price <= 1000)
    .sort((a, b) => b.price - a.price)
    .slice(0, 5)
    .map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      displayName: `${product.name} - $${product.price}`,
      isAffordable: product.price < 500
    }));
}

/**
 * Group và transform products
 * Demo: reduce() với nested operations
 * 
 * @param {Object[]} products - Mảng các sản phẩm
 * @returns {Object[]} Mảng category với thông tin tổng hợp
 * @throws {Error} Nếu products không phải array
 * 
 * @example
 * getCategorySummary(products);
 * // [
 * //   { category: 'Electronics', count: 3, totalValue: 1650, products: [...] },
 * //   { category: 'Clothing', count: 2, totalValue: 130, products: [...] }
 * // ]
 */
function getCategorySummary(products) {
  if (!Array.isArray(products)) {
    throw new Error('products phải là một array');
  }

  const grouped = products.reduce((acc, product) => {
    const category = product.category;
    
    if (!acc[category]) {
      acc[category] = {
        category,
        count: 0,
        totalValue: 0,
        products: []
      };
    }
    
    acc[category].count++;
    acc[category].totalValue += product.price;
    acc[category].products.push(product);
    
    return acc;
  }, {});

  return Object.values(grouped)
    .sort((a, b) => b.totalValue - a.totalValue);
}

/**
 * Tính discount tiers và format output
 * Demo: map() với conditional logic + chaining
 * 
 * @param {Object[]} products - Mảng các sản phẩm
 * @returns {Object[]} Mảng sản phẩm với discount tier
 * @throws {Error} Nếu products không phải array
 * 
 * @example
 * getProductsWithDiscountTier(products);
 */
function getProductsWithDiscountTier(products) {
  if (!Array.isArray(products)) {
    throw new Error('products phải là một array');
  }

  return products
    .map(product => {
      let discountPercent = 0;
      let tier = 'standard';
      
      if (product.price >= 1000) {
        discountPercent = 20;
        tier = 'premium';
      } else if (product.price >= 500) {
        discountPercent = 15;
        tier = 'gold';
      } else if (product.price >= 200) {
        discountPercent = 10;
        tier = 'silver';
      } else if (product.price >= 100) {
        discountPercent = 5;
        tier = 'bronze';
      }
      
      const discountedPrice = parseFloat(
        (product.price * (1 - discountPercent / 100)).toFixed(2)
      );
      
      return {
        ...product,
        tier,
        discountPercent,
        originalPrice: product.price,
        discountedPrice,
        savings: parseFloat((product.price - discountedPrice).toFixed(2))
      };
    })
    .sort((a, b) => b.savings - a.savings);
}

module.exports = {
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
};
