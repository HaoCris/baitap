/**
 * Bài 5.1: Data Transformation
 * 
 * Các bài tập về xử lý và biến đổi dữ liệu với Array Methods nâng cao
 */

/**
 * Lấy array tên sản phẩm
 * 
 * @param {Object[]} products - Mảng các sản phẩm
 * @returns {string[]} Mảng tên sản phẩm
 * @throws {Error} Nếu products không phải array
 * 
 * @example
 * const products = [
 *   { id: 1, name: 'Laptop', price: 1000 },
 *   { id: 2, name: 'Phone', price: 500 }
 * ];
 * getProductNames(products); // ['Laptop', 'Phone']
 */
function getProductNames(products) {
  if (!Array.isArray(products)) {
    throw new Error('products phải là một array');
  }

  return products.map(product => product.name);
}

/**
 * Lấy sản phẩm còn hàng (inStock === true)
 * 
 * @param {Object[]} products - Mảng các sản phẩm
 * @returns {Object[]} Mảng sản phẩm còn hàng
 * @throws {Error} Nếu products không phải array
 * 
 * @example
 * const products = [
 *   { id: 1, name: 'Laptop', inStock: true },
 *   { id: 2, name: 'Phone', inStock: false }
 * ];
 * getInStockProducts(products); // [{ id: 1, name: 'Laptop', inStock: true }]
 */
function getInStockProducts(products) {
  if (!Array.isArray(products)) {
    throw new Error('products phải là một array');
  }

  return products.filter(product => product.inStock === true);
}

/**
 * Tính tổng giá trị của tất cả sản phẩm
 * 
 * @param {Object[]} products - Mảng các sản phẩm
 * @returns {number} Tổng giá trị
 * @throws {Error} Nếu products không phải array
 * 
 * @example
 * const products = [
 *   { id: 1, name: 'Laptop', price: 1000 },
 *   { id: 2, name: 'Phone', price: 500 }
 * ];
 * getTotalValue(products); // 1500
 */
function getTotalValue(products) {
  if (!Array.isArray(products)) {
    throw new Error('products phải là một array');
  }

  return products.reduce((total, product) => total + product.price, 0);
}

/**
 * Nhóm sản phẩm theo category
 * 
 * @param {Object[]} products - Mảng các sản phẩm
 * @returns {Object} Object với key là category, value là array sản phẩm
 * @throws {Error} Nếu products không phải array
 * 
 * @example
 * const products = [
 *   { id: 1, name: 'Laptop', category: 'Electronics' },
 *   { id: 2, name: 'Phone', category: 'Electronics' },
 *   { id: 3, name: 'Shirt', category: 'Clothing' }
 * ];
 * groupByCategory(products);
 * // {
 * //   Electronics: [{ id: 1, ... }, { id: 2, ... }],
 * //   Clothing: [{ id: 3, ... }]
 * // }
 */
function groupByCategory(products) {
  if (!Array.isArray(products)) {
    throw new Error('products phải là một array');
  }

  return products.reduce((grouped, product) => {
    const category = product.category;
    
    if (!grouped[category]) {
      grouped[category] = [];
    }
    
    grouped[category].push(product);
    return grouped;
  }, {});
}

/**
 * Sắp xếp sản phẩm theo giá
 * 
 * @param {Object[]} products - Mảng các sản phẩm
 * @param {string} order - Thứ tự sắp xếp ('asc' hoặc 'desc')
 * @returns {Object[]} Mảng sản phẩm đã được sắp xếp (array mới)
 * @throws {Error} Nếu products không phải array hoặc order không hợp lệ
 * 
 * @example
 * const products = [
 *   { id: 1, name: 'Laptop', price: 1000 },
 *   { id: 2, name: 'Phone', price: 500 },
 *   { id: 3, name: 'Mouse', price: 50 }
 * ];
 * sortByPrice(products, 'asc'); // Mouse, Phone, Laptop
 * sortByPrice(products, 'desc'); // Laptop, Phone, Mouse
 */
function sortByPrice(products, order = 'asc') {
  if (!Array.isArray(products)) {
    throw new Error('products phải là một array');
  }

  if (order !== 'asc' && order !== 'desc') {
    throw new Error("order phải là 'asc' hoặc 'desc'");
  }

  // Tạo shallow copy để không mutate array gốc
  const sorted = [...products];

  return sorted.sort((a, b) => {
    if (order === 'asc') {
      return a.price - b.price;
    } else {
      return b.price - a.price;
    }
  });
}

/**
 * Áp dụng giảm giá cho tất cả sản phẩm
 * 
 * @param {Object[]} products - Mảng các sản phẩm
 * @param {number} percent - Phần trăm giảm giá (0-100)
 * @returns {Object[]} Mảng sản phẩm mới với giá đã giảm
 * @throws {Error} Nếu products không phải array hoặc percent không hợp lệ
 * 
 * @example
 * const products = [
 *   { id: 1, name: 'Laptop', price: 1000 },
 *   { id: 2, name: 'Phone', price: 500 }
 * ];
 * applyDiscount(products, 10);
 * // [
 * //   { id: 1, name: 'Laptop', price: 900, originalPrice: 1000, discount: 10 },
 * //   { id: 2, name: 'Phone', price: 450, originalPrice: 500, discount: 10 }
 * // ]
 */
function applyDiscount(products, percent) {
  if (!Array.isArray(products)) {
    throw new Error('products phải là một array');
  }

  if (typeof percent !== 'number' || percent < 0 || percent > 100) {
    throw new Error('percent phải là số từ 0 đến 100');
  }

  return products.map(product => {
    const discountedPrice = product.price * (1 - percent / 100);
    
    return {
      ...product,
      originalPrice: product.price,
      price: parseFloat(discountedPrice.toFixed(2)),
      discount: percent
    };
  });
}

/**
 * Lấy sản phẩm đắt nhất
 * 
 * @param {Object[]} products - Mảng các sản phẩm
 * @returns {Object|null} Sản phẩm đắt nhất hoặc null nếu mảng rỗng
 * @throws {Error} Nếu products không phải array
 * 
 * @example
 * const products = [
 *   { id: 1, name: 'Laptop', price: 1000 },
 *   { id: 2, name: 'Phone', price: 500 }
 * ];
 * getMostExpensiveProduct(products); // { id: 1, name: 'Laptop', price: 1000 }
 */
function getMostExpensiveProduct(products) {
  if (!Array.isArray(products)) {
    throw new Error('products phải là một array');
  }

  if (products.length === 0) {
    return null;
  }

  return products.reduce((max, product) => {
    return product.price > max.price ? product : max;
  });
}

/**
 * Lấy sản phẩm rẻ nhất
 * 
 * @param {Object[]} products - Mảng các sản phẩm
 * @returns {Object|null} Sản phẩm rẻ nhất hoặc null nếu mảng rỗng
 * @throws {Error} Nếu products không phải array
 * 
 * @example
 * const products = [
 *   { id: 1, name: 'Laptop', price: 1000 },
 *   { id: 2, name: 'Mouse', price: 50 }
 * ];
 * getCheapestProduct(products); // { id: 2, name: 'Mouse', price: 50 }
 */
function getCheapestProduct(products) {
  if (!Array.isArray(products)) {
    throw new Error('products phải là một array');
  }

  if (products.length === 0) {
    return null;
  }

  return products.reduce((min, product) => {
    return product.price < min.price ? product : min;
  });
}

/**
 * Tính giá trung bình của các sản phẩm
 * 
 * @param {Object[]} products - Mảng các sản phẩm
 * @returns {number} Giá trung bình (làm tròn 2 số thập phân)
 * @throws {Error} Nếu products không phải array
 * 
 * @example
 * const products = [
 *   { id: 1, name: 'Laptop', price: 1000 },
 *   { id: 2, name: 'Phone', price: 500 },
 *   { id: 3, name: 'Mouse', price: 50 }
 * ];
 * getAveragePrice(products); // 516.67
 */
function getAveragePrice(products) {
  if (!Array.isArray(products)) {
    throw new Error('products phải là một array');
  }

  if (products.length === 0) {
    return 0;
  }

  const total = getTotalValue(products);
  const average = total / products.length;
  
  return parseFloat(average.toFixed(2));
}

/**
 * Lọc sản phẩm theo khoảng giá
 * 
 * @param {Object[]} products - Mảng các sản phẩm
 * @param {number} minPrice - Giá tối thiểu
 * @param {number} maxPrice - Giá tối đa
 * @returns {Object[]} Mảng sản phẩm trong khoảng giá
 * @throws {Error} Nếu products không phải array hoặc giá không hợp lệ
 * 
 * @example
 * const products = [
 *   { id: 1, name: 'Laptop', price: 1000 },
 *   { id: 2, name: 'Phone', price: 500 },
 *   { id: 3, name: 'Mouse', price: 50 }
 * ];
 * filterByPriceRange(products, 100, 600); // [{ id: 2, name: 'Phone', price: 500 }]
 */
function filterByPriceRange(products, minPrice, maxPrice) {
  if (!Array.isArray(products)) {
    throw new Error('products phải là một array');
  }

  if (typeof minPrice !== 'number' || typeof maxPrice !== 'number') {
    throw new Error('minPrice và maxPrice phải là số');
  }

  if (minPrice < 0 || maxPrice < 0) {
    throw new Error('Giá không thể âm');
  }

  if (minPrice > maxPrice) {
    throw new Error('minPrice không thể lớn hơn maxPrice');
  }

  return products.filter(product => {
    return product.price >= minPrice && product.price <= maxPrice;
  });
}

/**
 * Đếm số lượng sản phẩm theo category
 * 
 * @param {Object[]} products - Mảng các sản phẩm
 * @returns {Object} Object với key là category, value là số lượng
 * @throws {Error} Nếu products không phải array
 * 
 * @example
 * const products = [
 *   { id: 1, category: 'Electronics' },
 *   { id: 2, category: 'Electronics' },
 *   { id: 3, category: 'Clothing' }
 * ];
 * countByCategory(products); // { Electronics: 2, Clothing: 1 }
 */
function countByCategory(products) {
  if (!Array.isArray(products)) {
    throw new Error('products phải là một array');
  }

  return products.reduce((counts, product) => {
    const category = product.category;
    counts[category] = (counts[category] || 0) + 1;
    return counts;
  }, {});
}

/**
 * Tìm sản phẩm theo ID
 * 
 * @param {Object[]} products - Mảng các sản phẩm
 * @param {number} id - ID cần tìm
 * @returns {Object|undefined} Sản phẩm tìm được hoặc undefined
 * @throws {Error} Nếu products không phải array hoặc id không hợp lệ
 * 
 * @example
 * const products = [
 *   { id: 1, name: 'Laptop' },
 *   { id: 2, name: 'Phone' }
 * ];
 * findProductById(products, 1); // { id: 1, name: 'Laptop' }
 */
function findProductById(products, id) {
  if (!Array.isArray(products)) {
    throw new Error('products phải là một array');
  }

  if (typeof id !== 'number') {
    throw new Error('id phải là một số');
  }

  return products.find(product => product.id === id);
}

/**
 * Cập nhật giá sản phẩm theo ID
 * 
 * @param {Object[]} products - Mảng các sản phẩm
 * @param {number} id - ID sản phẩm cần cập nhật
 * @param {number} newPrice - Giá mới
 * @returns {Object[]} Mảng sản phẩm mới với giá đã cập nhật
 * @throws {Error} Nếu products không phải array, id/price không hợp lệ, hoặc không tìm thấy sản phẩm
 * 
 * @example
 * const products = [
 *   { id: 1, name: 'Laptop', price: 1000 },
 *   { id: 2, name: 'Phone', price: 500 }
 * ];
 * updateProductPrice(products, 1, 900);
 * // [
 * //   { id: 1, name: 'Laptop', price: 900 },
 * //   { id: 2, name: 'Phone', price: 500 }
 * // ]
 */
function updateProductPrice(products, id, newPrice) {
  if (!Array.isArray(products)) {
    throw new Error('products phải là một array');
  }

  if (typeof id !== 'number') {
    throw new Error('id phải là một số');
  }

  if (typeof newPrice !== 'number' || newPrice < 0) {
    throw new Error('newPrice phải là số không âm');
  }

  const productExists = products.some(product => product.id === id);
  if (!productExists) {
    throw new Error(`Không tìm thấy sản phẩm với id ${id}`);
  }

  return products.map(product => {
    if (product.id === id) {
      return { ...product, price: newPrice };
    }
    return product;
  });
}

module.exports = {
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
};
