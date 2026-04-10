# Bài Tập 3: Node.js Cơ Bản

## Mục Tiêu
Hoàn thành các bài tập thực hành để nắm vững kiến thức Node.js cơ bản.

## Yêu Cầu Chung
- Mỗi bài tập được viết trong một file `.js` riêng biệt
- Tất cả các bài tập phải có unit test với Jest
- Code phải tuân thủ ES6+ syntax và Node.js best practices
- Sử dụng JSDoc comments để document các functions
- Xử lý errors đầy đủ với try/catch

---

## Phần 1: Custom Modules

### Bài 1.1: Math Module (`bai1_1_math_module.js`)
**Yêu cầu:**
Tạo module `mathOperations` với các functions:
- `add(a, b)`: cộng hai số
- `subtract(a, b)`: trừ hai số
- `multiply(a, b)`: nhân hai số
- `divide(a, b)`: chia hai số (throw error nếu chia cho 0)
- `power(base, exponent)`: lũy thừa
- `factorial(n)`: tính giai thừa
- `isPrime(n)`: kiểm tra số nguyên tố
- `fibonacci(n)`: trả về n số Fibonacci đầu tiên

**Ví dụ:**
```javascript
const math = require('./bai1_1_math_module');
console.log(math.add(5, 3)); // 8
console.log(math.factorial(5)); // 120
console.log(math.fibonacci(10)); // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

### Bài 1.2: String Utils Module (`bai1_2_string_utils_module.js`)
**Yêu cầu:**
Tạo module xử lý chuỗi với các functions:
- `capitalize(str)`: viết hoa chữ cái đầu
- `reverse(str)`: đảo ngược chuỗi
- `countWords(str)`: đếm số từ
- `isPalindrome(str)`: kiểm tra palindrome
- `truncate(str, maxLength)`: cắt ngắn chuỗi
- `slugify(str)`: chuyển thành slug URL-friendly
- `camelCase(str)`: chuyển thành camelCase
- `snakeCase(str)`: chuyển thành snake_case

### Bài 1.3: Validator Module (`bai1_3_validator_module.js`)
**Yêu cầu:**
Tạo module validation với các functions:
- `isEmail(str)`: validate email
- `isURL(str)`: validate URL
- `isPhoneVN(str)`: validate số điện thoại Việt Nam
- `isStrongPassword(str)`: validate password mạnh
- `isCreditCard(str)`: validate credit card (Luhn algorithm)
- `isDate(str, format)`: validate date với format

---

## Phần 2: File System (fs module)

### Bài 2.1: File Operations (`bai2_1_file_operations.js`)
**Yêu cầu:**
Tạo module xử lý file với các functions (async):
- `readFileAsync(filePath)`: đọc file
- `writeFileAsync(filePath, content)`: ghi file
- `appendFileAsync(filePath, content)`: thêm vào cuối file
- `deleteFileAsync(filePath)`: xóa file
- `copyFileAsync(src, dest)`: copy file
- `moveFileAsync(src, dest)`: di chuyển file
- `fileExistsAsync(filePath)`: kiểm tra file tồn tại
- `getFileStatsAsync(filePath)`: lấy thông tin file

**Ví dụ:**
```javascript
const fileOps = require('./bai2_1_file_operations');

await fileOps.writeFileAsync('test.txt', 'Hello World');
const content = await fileOps.readFileAsync('test.txt');
console.log(content); // 'Hello World'
```

### Bài 2.2: Directory Operations (`bai2_2_directory_operations.js`)
**Yêu cầu:**
Tạo module xử lý thư mục:
- `createDirAsync(dirPath)`: tạo thư mục (recursive)
- `removeDirAsync(dirPath)`: xóa thư mục (recursive)
- `listFilesAsync(dirPath)`: liệt kê files trong thư mục
- `listFilesRecursiveAsync(dirPath)`: liệt kê files đệ quy
- `findFilesAsync(dirPath, pattern)`: tìm files theo pattern
- `getDirSizeAsync(dirPath)`: tính tổng size thư mục
- `watchDirAsync(dirPath, callback)`: theo dõi thay đổi

### Bài 2.3: JSON File Handler (`bai2_3_json_file_handler.js`)
**Yêu cầu:**
Tạo module xử lý JSON files:
- `readJsonAsync(filePath)`: đọc và parse JSON
- `writeJsonAsync(filePath, data, pretty)`: ghi JSON với format
- `updateJsonAsync(filePath, updates)`: cập nhật JSON
- `mergeJsonFilesAsync(files, outputPath)`: merge nhiều JSON files
- `queryJsonAsync(filePath, query)`: query dữ liệu trong JSON

---

## Phần 3: Streams & Buffers

### Bài 3.1: Buffer Operations (`bai3_1_buffer_operations.js`)
**Yêu cầu:**
Tạo module làm việc với Buffer:
- `createBuffer(size)`: tạo buffer với size
- `fromString(str, encoding)`: tạo buffer từ string
- `toString(buffer, encoding)`: chuyển buffer thành string
- `concat(buffers)`: nối nhiều buffers
- `compare(buf1, buf2)`: so sánh buffers
- `copy(source, target)`: copy buffer
- `slice(buffer, start, end)`: cắt buffer

### Bài 3.2: Stream Utilities (`bai3_2_stream_utilities.js`)
**Yêu cầu:**
Tạo module làm việc với Streams:
- `copyFileWithStream(src, dest)`: copy file bằng stream
- `readLargeFile(filePath, onChunk)`: đọc file lớn từng chunk
- `writeLargeFile(filePath, dataGenerator)`: ghi file lớn
- `transformStream(input, transformFn)`: transform data
- `pipelineAsync(streams)`: kết nối nhiều streams
- `compressFile(src, dest)`: nén file với gzip
- `decompressFile(src, dest)`: giải nén file

### Bài 3.3: CSV Stream Processor (`bai3_3_csv_stream_processor.js`)
**Yêu cầu:**
Tạo module xử lý CSV với streams:
- `parseCSVStream(filePath)`: parse CSV thành objects
- `writeCSVStream(filePath, data, headers)`: ghi CSV
- `filterCSV(inputPath, outputPath, filterFn)`: lọc CSV
- `transformCSV(inputPath, outputPath, transformFn)`: transform CSV
- `aggregateCSV(filePath, groupBy, aggregations)`: aggregate data

---

## Phần 4: Events & EventEmitter

### Bài 4.1: Custom EventEmitter (`bai4_1_custom_event_emitter.js`)
**Yêu cầu:**
Tạo custom EventEmitter class từ đầu (không dùng built-in):
- `on(event, listener)`: đăng ký listener
- `once(event, listener)`: đăng ký listener chạy một lần
- `off(event, listener)`: hủy đăng ký listener
- `emit(event, ...args)`: phát sự kiện
- `listenerCount(event)`: đếm số listeners
- `removeAllListeners(event)`: xóa tất cả listeners

**Ví dụ:**
```javascript
const emitter = new CustomEventEmitter();
emitter.on('data', (msg) => console.log(msg));
emitter.emit('data', 'Hello!'); // 'Hello!'
```

### Bài 4.2: Task Queue (`bai4_2_task_queue.js`)
**Yêu cầu:**
Tạo Task Queue sử dụng EventEmitter:
- `addTask(task)`: thêm task vào queue
- `processQueue()`: xử lý queue
- `pause()`: tạm dừng
- `resume()`: tiếp tục
- `clear()`: xóa tất cả tasks
- Events: `taskAdded`, `taskCompleted`, `taskFailed`, `queueEmpty`

### Bài 4.3: Logger System (`bai4_3_logger_system.js`)
**Yêu cầu:**
Tạo Logger system sử dụng EventEmitter:
- Log levels: `debug`, `info`, `warn`, `error`
- `log(level, message, meta)`: ghi log
- `setLevel(level)`: set minimum log level
- Transports: console, file
- Format: timestamp, level, message, metadata
- Events cho mỗi log level

---

## Phần 5: Path & OS Modules

### Bài 5.1: Path Utilities (`bai5_1_path_utilities.js`)
**Yêu cầu:**
Tạo module xử lý đường dẫn:
- `normalizePath(p)`: chuẩn hóa path
- `joinPaths(...paths)`: nối paths
- `resolvePath(...paths)`: resolve path tuyệt đối
- `getExtension(filePath)`: lấy extension
- `getBasename(filePath)`: lấy tên file
- `getDirname(filePath)`: lấy thư mục cha
- `isAbsolute(p)`: kiểm tra path tuyệt đối
- `relativePath(from, to)`: tính relative path

### Bài 5.2: System Info (`bai5_2_system_info.js`)
**Yêu cầu:**
Tạo module lấy thông tin hệ thống:
- `getCPUInfo()`: thông tin CPU
- `getMemoryInfo()`: thông tin memory
- `getOSInfo()`: thông tin OS
- `getNetworkInterfaces()`: thông tin network
- `getUptime()`: thời gian hoạt động
- `getUserInfo()`: thông tin user
- `getDiskUsage()`: dung lượng disk (nếu có thể)

---

## Phần 6: Process & Child Process

### Bài 6.1: Process Manager (`bai6_1_process_manager.js`)
**Yêu cầu:**
Tạo module quản lý process:
- `getProcessInfo()`: thông tin process hiện tại
- `getMemoryUsage()`: memory usage
- `getCPUUsage()`: CPU usage
- `getEnvVariable(key)`: lấy environment variable
- `setEnvVariable(key, value)`: set environment variable
- `onExit(callback)`: handle process exit
- `onUncaughtException(callback)`: handle uncaught exceptions

### Bài 6.2: Command Executor (`bai6_2_command_executor.js`)
**Yêu cầu:**
Tạo module thực thi commands:
- `execAsync(command)`: thực thi command và trả về output
- `execWithTimeout(command, timeout)`: thực thi với timeout
- `spawn(command, args)`: spawn child process
- `runScript(scriptPath)`: chạy script file
- `parallelExec(commands)`: chạy nhiều commands song song
- `pipeCommands(commands)`: pipe output qua các commands

---

## Phần 7: HTTP Client

### Bài 7.1: HTTP Client Module (`bai7_1_http_client.js`)
**Yêu cầu:**
Tạo HTTP client (sử dụng built-in http/https modules):
- `get(url, options)`: GET request
- `post(url, data, options)`: POST request
- `put(url, data, options)`: PUT request
- `delete(url, options)`: DELETE request
- `download(url, destPath)`: download file
- Hỗ trợ: headers, query params, timeout, redirects

**Ví dụ:**
```javascript
const http = require('./bai7_1_http_client');
const response = await http.get('https://api.github.com/users/octocat');
console.log(response.data);
```

### Bài 7.2: API Wrapper (`bai7_2_api_wrapper.js`)
**Yêu cầu:**
Tạo wrapper cho JSONPlaceholder API:
- `getUsers()`: lấy tất cả users
- `getUserById(id)`: lấy user theo id
- `getUserPosts(userId)`: lấy posts của user
- `createPost(postData)`: tạo post mới
- `updatePost(id, data)`: cập nhật post
- `deletePost(id)`: xóa post
- `searchPosts(query)`: tìm kiếm posts

---

## Phần 8: HTTP Server

### Bài 8.1: Basic HTTP Server (`bai8_1_basic_http_server.js`)
**Yêu cầu:**
Tạo HTTP server cơ bản (không dùng Express):
- Handle các HTTP methods: GET, POST, PUT, DELETE
- Parse URL và query parameters
- Parse request body (JSON, form-urlencoded)
- Set response headers
- Handle errors (404, 500)
- Serve static files

**Ví dụ:**
```javascript
const server = createServer();
server.get('/api/users', (req, res) => {
  res.json([{ id: 1, name: 'John' }]);
});
server.listen(3000);
```

### Bài 8.2: Router Module (`bai8_2_router_module.js`)
**Yêu cầu:**
Tạo Router module:
- `addRoute(method, path, handler)`: thêm route
- `get(path, handler)`: shorthand cho GET
- `post(path, handler)`: shorthand cho POST
- `match(method, path)`: tìm route phù hợp
- Hỗ trợ route parameters (`:id`)
- Hỗ trợ middleware pattern

### Bài 8.3: REST API Server (`bai8_3_rest_api_server.js`)
**Yêu cầu:**
Tạo REST API server cho quản lý tasks:
```
GET    /api/tasks        - Lấy tất cả tasks
GET    /api/tasks/:id    - Lấy task theo id
POST   /api/tasks        - Tạo task mới
PUT    /api/tasks/:id    - Cập nhật task
DELETE /api/tasks/:id    - Xóa task
GET    /api/tasks/search - Tìm kiếm tasks
```
- Validation cho request body
- Error handling với status codes
- Lưu trữ in-memory

---

## Phần 9: Timers & Scheduling

### Bài 9.1: Timer Utilities (`bai9_1_timer_utilities.js`)
**Yêu cầu:**
Tạo module timer utilities:
- `delay(ms)`: Promise-based delay
- `timeout(promise, ms)`: add timeout cho promise
- `debounce(fn, wait)`: debounce function
- `throttle(fn, limit)`: throttle function
- `retry(fn, options)`: retry với exponential backoff
- `poll(fn, interval, condition)`: polling until condition

### Bài 9.2: Scheduler (`bai9_2_scheduler.js`)
**Yêu cầu:**
Tạo task scheduler:
- `schedule(task, time)`: schedule task tại thời điểm
- `scheduleInterval(task, interval)`: schedule recurring task
- `scheduleCron(task, cronExpression)`: schedule với cron syntax
- `cancel(taskId)`: hủy scheduled task
- `getScheduledTasks()`: lấy danh sách tasks
- `pause(taskId)` / `resume(taskId)`: pause/resume task

---

## Phần 10: Crypto & Security

### Bài 10.1: Crypto Utilities (`bai10_1_crypto_utilities.js`)
**Yêu cầu:**
Tạo module crypto utilities:
- `hash(data, algorithm)`: hash data (md5, sha256, sha512)
- `hashPassword(password)`: hash password với salt
- `verifyPassword(password, hash)`: verify password
- `encrypt(data, key)`: encrypt data (AES)
- `decrypt(data, key)`: decrypt data
- `generateRandomBytes(size)`: tạo random bytes
- `generateUUID()`: tạo UUID v4

### Bài 10.2: Token Manager (`bai10_2_token_manager.js`)
**Yêu cầu:**
Tạo module quản lý tokens:
- `generateToken(payload, secret, options)`: tạo JWT-like token
- `verifyToken(token, secret)`: verify token
- `decodeToken(token)`: decode không verify
- `refreshToken(token, secret)`: refresh token
- `isExpired(token)`: kiểm tra token hết hạn

---

## Phần 11: Data Structures

### Bài 11.1: LinkedList (`bai11_1_linked_list.js`)
**Yêu cầu:**
Implement LinkedList:
- `append(value)`: thêm vào cuối
- `prepend(value)`: thêm vào đầu
- `insert(index, value)`: chèn tại vị trí
- `remove(value)`: xóa node
- `find(value)`: tìm node
- `toArray()`: chuyển thành array
- `reverse()`: đảo ngược list
- `size`: getter cho số phần tử

### Bài 11.2: Queue & Stack (`bai11_2_queue_stack.js`)
**Yêu cầu:**
Implement Queue và Stack:

**Queue:**
- `enqueue(item)`: thêm vào cuối
- `dequeue()`: lấy từ đầu
- `peek()`: xem phần tử đầu
- `isEmpty()`: kiểm tra rỗng
- `size`: số phần tử

**Stack:**
- `push(item)`: thêm vào đỉnh
- `pop()`: lấy từ đỉnh
- `peek()`: xem phần tử đỉnh
- `isEmpty()`: kiểm tra rỗng
- `size`: số phần tử

### Bài 11.3: LRU Cache (`bai11_3_lru_cache.js`)
**Yêu cầu:**
Implement LRU (Least Recently Used) Cache:
- `constructor(capacity)`: khởi tạo với capacity
- `get(key)`: lấy value
- `put(key, value)`: lưu key-value
- `delete(key)`: xóa key
- `clear()`: xóa tất cả
- `size`: số phần tử hiện tại
- `keys()`: lấy tất cả keys (theo thứ tự sử dụng)

---

## Phần 12: Utilities

### Bài 12.1: Object Utilities (`bai12_1_object_utilities.js`)
**Yêu cầu:**
- `deepClone(obj)`: deep clone object
- `deepMerge(...objects)`: deep merge objects
- `get(obj, path, defaultValue)`: get nested value
- `set(obj, path, value)`: set nested value
- `pick(obj, keys)`: pick specific keys
- `omit(obj, keys)`: omit specific keys
- `flatten(obj)`: flatten nested object
- `unflatten(obj)`: unflatten object

### Bài 12.2: Array Utilities (`bai12_2_array_utilities.js`)
**Yêu cầu:**
- `chunk(array, size)`: chia array thành chunks
- `flatten(array, depth)`: flatten nested array
- `unique(array)`: loại bỏ duplicates
- `intersection(...arrays)`: giao của arrays
- `difference(arr1, arr2)`: hiệu của arrays
- `shuffle(array)`: xáo trộn array
- `groupBy(array, key)`: nhóm theo key
- `sortBy(array, key, order)`: sắp xếp theo key

### Bài 12.3: Date Utilities (`bai12_3_date_utilities.js`)
**Yêu cầu:**
- `format(date, formatStr)`: format date
- `parse(dateStr, formatStr)`: parse date string
- `addDays(date, days)`: thêm ngày
- `subtractDays(date, days)`: trừ ngày
- `diffInDays(date1, date2)`: khoảng cách ngày
- `isLeapYear(year)`: kiểm tra năm nhuận
- `getWeekNumber(date)`: lấy số tuần
- `startOf(date, unit)` / `endOf(date, unit)`: start/end of day/week/month

---

## Cấu Trúc Thư Mục

```
BaiTap3/
├── baitap3.md                    # File yêu cầu này
├── package.json                  # Dependencies và scripts
├── jest.config.js               # Jest configuration
├── .gitignore                   # Git ignore
├── src/
│   ├── bai1_1_math_module.js
│   ├── bai1_2_string_utils_module.js
│   ├── bai1_3_validator_module.js
│   ├── bai2_1_file_operations.js
│   ├── bai2_2_directory_operations.js
│   ├── bai2_3_json_file_handler.js
│   ├── bai3_1_buffer_operations.js
│   ├── bai3_2_stream_utilities.js
│   ├── bai3_3_csv_stream_processor.js
│   ├── bai4_1_custom_event_emitter.js
│   ├── bai4_2_task_queue.js
│   ├── bai4_3_logger_system.js
│   ├── bai5_1_path_utilities.js
│   ├── bai5_2_system_info.js
│   ├── bai6_1_process_manager.js
│   ├── bai6_2_command_executor.js
│   ├── bai7_1_http_client.js
│   ├── bai7_2_api_wrapper.js
│   ├── bai8_1_basic_http_server.js
│   ├── bai8_2_router_module.js
│   ├── bai8_3_rest_api_server.js
│   ├── bai9_1_timer_utilities.js
│   ├── bai9_2_scheduler.js
│   ├── bai10_1_crypto_utilities.js
│   ├── bai10_2_token_manager.js
│   ├── bai11_1_linked_list.js
│   ├── bai11_2_queue_stack.js
│   ├── bai11_3_lru_cache.js
│   ├── bai12_1_object_utilities.js
│   ├── bai12_2_array_utilities.js
│   └── bai12_3_date_utilities.js
└── tests/
    ├── bai1_1_math_module.test.js
    ├── bai1_2_string_utils_module.test.js
    ├── bai1_3_validator_module.test.js
    ├── bai2_1_file_operations.test.js
    ├── bai2_2_directory_operations.test.js
    ├── bai2_3_json_file_handler.test.js
    ├── bai3_1_buffer_operations.test.js
    ├── bai3_2_stream_utilities.test.js
    ├── bai3_3_csv_stream_processor.test.js
    ├── bai4_1_custom_event_emitter.test.js
    ├── bai4_2_task_queue.test.js
    ├── bai4_3_logger_system.test.js
    ├── bai5_1_path_utilities.test.js
    ├── bai5_2_system_info.test.js
    ├── bai6_1_process_manager.test.js
    ├── bai6_2_command_executor.test.js
    ├── bai7_1_http_client.test.js
    ├── bai7_2_api_wrapper.test.js
    ├── bai8_1_basic_http_server.test.js
    ├── bai8_2_router_module.test.js
    ├── bai8_3_rest_api_server.test.js
    ├── bai9_1_timer_utilities.test.js
    ├── bai9_2_scheduler.test.js
    ├── bai10_1_crypto_utilities.test.js
    ├── bai10_2_token_manager.test.js
    ├── bai11_1_linked_list.test.js
    ├── bai11_2_queue_stack.test.js
    ├── bai11_3_lru_cache.test.js
    ├── bai12_1_object_utilities.test.js
    ├── bai12_2_array_utilities.test.js
    └── bai12_3_date_utilities.test.js
```

---

## Hướng Dẫn Cài Đặt

### 1. Khởi tạo project
```bash
cd BaiTap3
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

| Tiêu chí | Điểm |
|----------|------|
| Code chạy đúng theo yêu cầu | 40% |
| Unit tests pass với coverage > 80% | 30% |
| Code quality (clean, readable) | 15% |
| Documentation (JSDoc, comments) | 10% |
| Edge cases handling | 5% |

---

## Ghi Chú Quan Trọng

### Node.js Best Practices
1. **Error Handling**: Luôn handle errors trong async operations
2. **Streams**: Sử dụng streams cho file lớn thay vì đọc toàn bộ vào memory
3. **Events**: Sử dụng EventEmitter cho loose coupling
4. **Modules**: Mỗi module chỉ làm một việc (Single Responsibility)
5. **Environment**: Sử dụng environment variables cho configuration

### Testing Notes
- Sử dụng `beforeEach`/`afterEach` để setup/cleanup
- Mock filesystem operations với `jest.mock('fs')`
- Sử dụng `jest.useFakeTimers()` cho timer tests
- Test cả happy path và error cases

### Không được sử dụng
- Thư viện bên ngoài (trừ Jest cho testing)
- Các framework như Express (trừ khi yêu cầu)
- Copy code từ internet mà không hiểu
