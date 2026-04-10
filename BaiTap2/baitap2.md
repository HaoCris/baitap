# Bài Tập 2: JavaScript Nâng Cao (Advanced JavaScript)

## Mục Tiêu

Hoàn thành các bài tập thực hành để nắm vững toàn bộ kiến thức JavaScript.

## Yêu Cầu Chung

- Mỗi bài tập được viết trong một file `.js` riêng biệt
- Tất cả các bài tập phải có unit test với Jest
- Code phải tuân thủ ES6+ syntax
- Sử dụng JSDoc comments để document các functions

---

## Phần 1: Closures & Scope

### Bài 1.1: Counter với Closure (`bai1_1_closure_counter.js`)

**Yêu cầu:**

- Tạo function `createCounter()` trả về một object với các methods:
  - `increment()`: tăng giá trị lên 1
  - `decrement()`: giảm giá trị xuống 1
  - `getValue()`: lấy giá trị hiện tại
  - `reset()`: đặt lại về 0
- Giá trị counter phải được bảo vệ (không thể truy cập trực tiếp từ bên ngoài)

**Ví dụ:**

```javascript
const counter = createCounter();
counter.increment();
counter.increment();
console.log(counter.getValue()); // 2
counter.decrement();
console.log(counter.getValue()); // 1
counter.reset();
console.log(counter.getValue()); // 0
```

### Bài 1.2: Private Variables (`bai1_2_private_variables.js`)

**Yêu cầu:**

- Tạo function `createBankAccount(initialBalance)` sử dụng closure để tạo tài khoản ngân hàng với:
  - `deposit(amount)`: gửi tiền (chỉ chấp nhận số dương)
  - `withdraw(amount)`: rút tiền (không cho phép rút quá số dư)
  - `getBalance()`: xem số dư
  - `getTransactionHistory()`: lấy lịch sử giao dịch

---

## Phần 2: Higher-Order Functions

### Bài 2.1: Custom Array Methods (`bai2_1_custom_array_methods.js`)

**Yêu cầu:**
Implement các higher-order functions không sử dụng built-in methods:

- `customMap(array, callback)`: hoạt động như `Array.prototype.map`
- `customFilter(array, callback)`: hoạt động như `Array.prototype.filter`
- `customReduce(array, callback, initialValue)`: hoạt động như `Array.prototype.reduce`
- `customFind(array, callback)`: hoạt động như `Array.prototype.find`
- `customEvery(array, callback)`: hoạt động như `Array.prototype.every`
- `customSome(array, callback)`: hoạt động như `Array.prototype.some`

### Bài 2.2: Function Composition (`bai2_2_function_composition.js`)

**Yêu cầu:**

- `compose(...fns)`: nhận nhiều functions và trả về function mới thực hiện từ phải sang trái
- `pipe(...fns)`: nhận nhiều functions và trả về function mới thực hiện từ trái sang phải
- `curry(fn)`: chuyển đổi function nhiều tham số thành chuỗi functions một tham số
- `partial(fn, ...args)`: tạo function mới với một số tham số đã được cố định

**Ví dụ:**

```javascript
const add = (a, b) => a + b;
const multiply = (a, b) => a * b;
const square = (x) => x * x;

const composed = compose(square, add);
console.log(composed(2, 3)); // 25 (square(add(2,3)) = square(5) = 25)

const curriedAdd = curry(add);
console.log(curriedAdd(2)(3)); // 5
```

---

## Phần 3: OOP - Object-Oriented Programming

### Bài 3.1: Prototypes (`bai3_1_prototypes.js`)

**Yêu cầu:**
Sử dụng prototype pattern để tạo:

- Constructor function `Person(name, age)` với:
  - Method `introduce()`: trả về "Xin chào, tôi là [name], [age] tuổi"
  - Method `haveBirthday()`: tăng tuổi lên 1
- Constructor function `Student(name, age, school)` kế thừa từ `Person` với:
  - Method `study()`: trả về "[name] đang học tại [school]"

### Bài 3.2: ES6 Classes (`bai3_2_es6_classes.js`)

**Yêu cầu:**
Tạo hệ thống quản lý thư viện với các class:

```javascript
class Book {
  // Properties: title, author, isbn, isAvailable
  // Methods: getInfo(), borrow(), return()
}

class Library {
  // Properties: name, books (array)
  // Methods: addBook(), removeBook(), findBook(), getAvailableBooks()
}

class Member {
  // Properties: name, memberId, borrowedBooks (array)
  // Methods: borrowBook(book), returnBook(book), getBorrowedBooks()
}
```

---

## Phần 4: Asynchronous Programming

### Bài 4.1: Callbacks (`bai4_1_callbacks.js`)

**Yêu cầu:**

- `delayedGreeting(name, delay, callback)`: sau `delay` ms, gọi callback với lời chào
- `readFileSimulation(filename, callback)`: mô phỏng đọc file với callback(error, data)
- `callbackHell(callback)`: mô phỏng callback hell với 3 async operations liên tiếp

### Bài 4.2: Promises (`bai4_2_promises.js`)

**Yêu cầu:**

- `wait(ms)`: trả về Promise resolve sau ms milliseconds
- `fetchUserData(userId)`: mô phỏng fetch user data, trả về Promise
- `fetchMultipleUsers(userIds)`: sử dụng Promise.all để fetch nhiều users
- `fetchFirstUser(userIds)`: sử dụng Promise.race để lấy user đầu tiên resolve
- `retryOperation(operation, maxRetries)`: thử lại operation nếu fail, tối đa maxRetries lần

### Bài 4.3: Async/Await (`bai4_3_async_await.js`)

**Yêu cầu:**

- `asyncFetchUser(userId)`: viết lại fetchUserData sử dụng async/await
- `sequentialFetch(urls)`: fetch các URLs theo thứ tự
- `parallelFetch(urls)`: fetch các URLs song song
- `handleErrors()`: xử lý errors với try/catch trong async function

---

## Phần 5: Array Methods Nâng Cao

### Bài 5.1: Data Transformation (`bai5_1_data_transformation.js`)

**Yêu cầu:**
Cho array products:

```javascript
const products = [
  {
    id: 1,
    name: "Laptop",
    price: 1000,
    category: "Electronics",
    inStock: true,
  },
  { id: 2, name: "Phone", price: 500, category: "Electronics", inStock: false },
  { id: 3, name: "Shirt", price: 50, category: "Clothing", inStock: true },
  // ...
];
```

Implement các functions:

- `getProductNames(products)`: lấy array tên sản phẩm
- `getInStockProducts(products)`: lấy sản phẩm còn hàng
- `getTotalValue(products)`: tính tổng giá trị sản phẩm
- `groupByCategory(products)`: nhóm sản phẩm theo category
- `sortByPrice(products, order)`: sắp xếp theo giá (asc/desc)
- `applyDiscount(products, percent)`: áp dụng giảm giá cho tất cả

### Bài 5.2: Chaining Methods (`bai5_2_chaining_methods.js`)

**Yêu cầu:**

- Viết các queries phức tạp sử dụng method chaining
- `getExpensiveInStockElectronics(products)`: lấy electronics còn hàng giá > 200
- `getCheapestProductPerCategory(products)`: lấy sản phẩm rẻ nhất mỗi category
- `calculateCategoryStats(products)`: tính count, total, average cho mỗi category

---

## Phần 6: Error Handling

### Bài 6.1: Custom Errors (`bai6_1_custom_errors.js`)

**Yêu cầu:**

- Tạo class `ValidationError` extends Error
- Tạo class `NetworkError` extends Error
- Tạo class `AuthenticationError` extends Error
- Function `validateUser(user)`: throw appropriate error nếu validation fail
- Function `handleError(error)`: xử lý error dựa trên loại error

### Bài 6.2: Error Handling Patterns (`bai6_2_error_handling_patterns.js`)

**Yêu cầu:**

- `tryCatch(fn)`: wrapper function bắt và xử lý errors
- `safeJsonParse(jsonString)`: parse JSON an toàn, trả về null nếu fail
- `withRetry(fn, retries, delay)`: retry function với exponential backoff
- `withTimeout(promise, ms)`: wrap promise với timeout

---

## Phần 7: Destructuring & Spread

### Bài 7.1: Destructuring (`bai7_1_destructuring.js`)

**Yêu cầu:**

- `extractUserInfo(user)`: destructure nested object
- `swapValues(a, b)`: hoán đổi giá trị sử dụng destructuring
- `getFirstAndRest(array)`: lấy phần tử đầu và rest của array
- `mergeObjects(...objects)`: merge nhiều objects
- `removeProperty(obj, prop)`: xóa property và trả về object mới

### Bài 7.2: Spread Operator (`bai7_2_spread_operator.js`)

**Yêu cầu:**

- `cloneDeep(obj)`: deep clone object
- `mergeArraysUnique(...arrays)`: merge arrays và loại bỏ duplicates
- `updateNestedObject(obj, path, value)`: cập nhật nested property immutably
- `arrayOperations`: push, pop, shift, unshift immutably

---

## Phần 8: Modules & Imports

### Bài 8.1: Module Pattern (`bai8_1_module_pattern.js`)

**Yêu cầu:**
Tạo module `Calculator` với:

- Private methods: `_validate(num)`
- Public methods: `add`, `subtract`, `multiply`, `divide`
- History tracking: `getHistory()`, `clearHistory()`

### Bài 8.2: ES6 Modules (`bai8_2_es6_modules/`)

**Yêu cầu:**
Tạo folder với cấu trúc:

```
bai8_2_es6_modules/
├── index.js          # Main entry
├── mathUtils.js      # Math utility functions
├── stringUtils.js    # String utility functions
├── arrayUtils.js     # Array utility functions
└── constants.js      # Shared constants
```

---

## Phần 9: Fetch API & Data Handling

### Bài 9.1: Fetch Wrapper (`bai9_1_fetch_wrapper.js`)

**Yêu cầu:**
Tạo module `HttpClient` với các methods:

- `get(url, options)`: GET request
- `post(url, data, options)`: POST request
- `put(url, data, options)`: PUT request
- `delete(url, options)`: DELETE request
- Tự động xử lý JSON
- Error handling với custom errors
- Request/Response interceptors

### Bài 9.2: API Integration (`bai9_2_api_integration.js`)

**Yêu cầu:**
Sử dụng JSONPlaceholder API (https://jsonplaceholder.typicode.com):

- `getAllUsers()`: lấy tất cả users
- `getUserById(id)`: lấy user theo id
- `createUser(userData)`: tạo user mới
- `updateUser(id, userData)`: cập nhật user
- `deleteUser(id)`: xóa user
- `getUserPosts(userId)`: lấy posts của user

---

## Phần 10: Storage APIs

### Bài 10.1: LocalStorage Wrapper (`bai10_1_localstorage_wrapper.js`)

**Yêu cầu:**
Tạo module `StorageManager`:

- `set(key, value, expiresIn)`: lưu data với optional expiry time
- `get(key)`: lấy data (return null nếu expired)
- `remove(key)`: xóa item
- `clear()`: xóa tất cả
- `getAll()`: lấy tất cả items
- Tự động serialize/deserialize objects

### Bài 10.2: Session Management (`bai10_2_session_management.js`)

**Yêu cầu:**

- `createSession(userData)`: tạo session mới
- `getSession()`: lấy session hiện tại
- `updateSession(data)`: cập nhật session
- `destroySession()`: xóa session
- `isSessionValid()`: kiểm tra session còn hiệu lực
- Auto-refresh session token

---

## Phần 11: Event Loop & Concurrency

### Bài 11.1: Event Loop Understanding (`bai11_1_event_loop.js`)

**Yêu cầu:**

- `demonstrateMicrotasks()`: minh họa microtask queue
- `demonstrateMacrotasks()`: minh họa macrotask queue
- `orderOfExecution()`: dự đoán thứ tự execution
- `preventBlockingUI()`: chia nhỏ heavy computation

### Bài 11.2: Debounce & Throttle (`bai11_2_debounce_throttle.js`)

**Yêu cầu:**

- `debounce(fn, delay)`: delay execution cho đến khi user ngừng trigger
- `throttle(fn, limit)`: giới hạn số lần execution trong khoảng thời gian
- `rafThrottle(fn)`: throttle sử dụng requestAnimationFrame
- Test cases minh họa sự khác biệt

---

## Phần 12: Iterators & Generators

### Bài 12.1: Custom Iterators (`bai12_1_custom_iterators.js`)

**Yêu cầu:**

- Tạo class `Range(start, end)` iterable
- Tạo class `LinkedList` iterable
- Function `createIterator(array)`: tạo custom iterator
- Function `infiniteSequence(start)`: tạo infinite iterator

### Bài 12.2: Generators (`bai12_2_generators.js`)

**Yêu cầu:**

- `function* range(start, end, step)`: generate sequence
- `function* fibonacci(n)`: generate Fibonacci numbers
- `function* asyncGenerator()`: async generator pattern
- `function* paginate(items, pageSize)`: pagination generator

---

## Phần 13: Proxy & Reflect

### Bài 13.1: Proxy Patterns (`bai13_1_proxy_patterns.js`)

**Yêu cầu:**

- `createValidatedObject(schema)`: object với validation
- `createLoggingProxy(obj)`: log tất cả property access
- `createCachingProxy(fn)`: cache function results (memoization)
- `createPrivateProxy(obj, privateProps)`: ẩn private properties

### Bài 13.2: Reactive Data (`bai13_2_reactive_data.js`)

**Yêu cầu:**

- `reactive(obj)`: tạo reactive object
- `watch(obj, prop, callback)`: watch property changes
- `computed(dependencies, computeFn)`: computed property
- Simple reactive system như Vue.js

---

## Phần 14: Regular Expressions

### Bài 14.1: Regex Utilities (`bai14_1_regex_utilities.js`)

**Yêu cầu:**

- `validateEmail(email)`: validate email format
- `validatePhone(phone)`: validate phone number (VN format)
- `validatePassword(password)`: validate password strength
- `extractUrls(text)`: extract tất cả URLs từ text
- `highlightMatches(text, pattern)`: wrap matches trong tags

### Bài 14.2: String Parsing (`bai14_2_string_parsing.js`)

**Yêu cầu:**

- `parseQueryString(url)`: parse URL query string thành object
- `buildQueryString(params)`: build query string từ object
- `tokenize(expression)`: tokenize mathematical expression
- `parseTemplate(template, data)`: simple template engine

---

## Phần 15: Design Patterns

### Bài 15.1: Creational Patterns (`bai15_1_creational_patterns.js`)

**Yêu cầu:**
Implement:

- **Singleton**: `DatabaseConnection`
- **Factory**: `UserFactory`, `AdminFactory`
- **Builder**: `QueryBuilder`

### Bài 15.2: Behavioral Patterns (`bai15_2_behavioral_patterns.js`)

**Yêu cầu:**
Implement:

- **Observer**: `EventEmitter`
- **Strategy**: `PaymentStrategy`
- **Command**: `CommandManager` với undo/redo

---

## Cấu Trúc Thư Mục

```
BaiTap2/
├── baitap2.md                    # File yêu cầu này
├── package.json                  # Dependencies và scripts
├── jest.config.js               # Jest configuration
├── src/
│   ├── bai1_1_closure_counter.js
│   ├── bai1_2_private_variables.js
│   ├── bai2_1_custom_array_methods.js
│   ├── bai2_2_function_composition.js
│   ├── bai3_1_prototypes.js
│   ├── bai3_2_es6_classes.js
│   ├── bai4_1_callbacks.js
│   ├── bai4_2_promises.js
│   ├── bai4_3_async_await.js
│   ├── bai5_1_data_transformation.js
│   ├── bai5_2_chaining_methods.js
│   ├── bai6_1_custom_errors.js
│   ├── bai6_2_error_handling_patterns.js
│   ├── bai7_1_destructuring.js
│   ├── bai7_2_spread_operator.js
│   ├── bai8_1_module_pattern.js
│   ├── bai8_2_es6_modules/
│   │   ├── index.js
│   │   ├── mathUtils.js
│   │   ├── stringUtils.js
│   │   ├── arrayUtils.js
│   │   └── constants.js
│   ├── bai9_1_fetch_wrapper.js
│   ├── bai9_2_api_integration.js
│   ├── bai10_1_localstorage_wrapper.js
│   ├── bai10_2_session_management.js
│   ├── bai11_1_event_loop.js
│   ├── bai11_2_debounce_throttle.js
│   ├── bai12_1_custom_iterators.js
│   ├── bai12_2_generators.js
│   ├── bai13_1_proxy_patterns.js
│   ├── bai13_2_reactive_data.js
│   ├── bai14_1_regex_utilities.js
│   ├── bai14_2_string_parsing.js
│   ├── bai15_1_creational_patterns.js
│   └── bai15_2_behavioral_patterns.js
└── tests/
    ├── bai1_1_closure_counter.test.js
    ├── bai1_2_private_variables.test.js
    ├── bai2_1_custom_array_methods.test.js
    ├── bai2_2_function_composition.test.js
    ├── bai3_1_prototypes.test.js
    ├── bai3_2_es6_classes.test.js
    ├── bai4_1_callbacks.test.js
    ├── bai4_2_promises.test.js
    ├── bai4_3_async_await.test.js
    ├── bai5_1_data_transformation.test.js
    ├── bai5_2_chaining_methods.test.js
    ├── bai6_1_custom_errors.test.js
    ├── bai6_2_error_handling_patterns.test.js
    ├── bai7_1_destructuring.test.js
    ├── bai7_2_spread_operator.test.js
    ├── bai8_1_module_pattern.test.js
    ├── bai8_2_es6_modules.test.js
    ├── bai9_1_fetch_wrapper.test.js
    ├── bai9_2_api_integration.test.js
    ├── bai10_1_localstorage_wrapper.test.js
    ├── bai10_2_session_management.test.js
    ├── bai11_1_event_loop.test.js
    ├── bai11_2_debounce_throttle.test.js
    ├── bai12_1_custom_iterators.test.js
    ├── bai12_2_generators.test.js
    ├── bai13_1_proxy_patterns.test.js
    ├── bai13_2_reactive_data.test.js
    ├── bai14_1_regex_utilities.test.js
    ├── bai14_2_string_parsing.test.js
    ├── bai15_1_creational_patterns.test.js
    └── bai15_2_behavioral_patterns.test.js
```

---

## Hướng Dẫn Cài Đặt

### 1. Khởi tạo project

```bash
cd BaiTap2
npm init -y
```

### 2. Cài đặt Jest

```bash
npm install --save-dev jest
```

### 3. Cấu hình package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### 4. Chạy tests

```bash
npm test                    # Chạy tất cả tests
npm test -- bai1_1          # Chạy test cụ thể
npm run test:coverage       # Xem code coverage
```

---

## Tiêu Chí Đánh Giá

| Tiêu chí                           | Điểm |
| ---------------------------------- | ---- |
| Code chạy đúng theo yêu cầu        | 40%  |
| Unit tests pass với coverage > 80% | 30%  |
| Code quality (clean, readable)     | 15%  |
| Documentation (JSDoc, comments)    | 10%  |
| Edge cases handling                | 5%   |

---

## Ghi Chú

- Không sử dụng thư viện bên ngoài (trừ Jest cho testing)
- Tập trung vào hiểu concept, không copy code
- Viết tests trước khi implement (TDD approach)
- Commit thường xuyên với message rõ ràng
