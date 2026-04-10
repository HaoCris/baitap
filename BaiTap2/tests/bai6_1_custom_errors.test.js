/**
 * Test suite cho Bài 6.1: Custom Errors
 */

const {
  ValidationError,
  NetworkError,
  AuthenticationError,
  DatabaseError,
  NotFoundError,
  validateUser,
  handleError,
  asyncErrorHandler,
  tryCatch,
  assert,
  guard,
  logError
} = require('../src/bai6_1_custom_errors');

describe('Bài 6.1: Custom Errors', () => {
  
  describe('ValidationError', () => {
    test('tạo ValidationError với message', () => {
      const error = new ValidationError('Invalid input');
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.name).toBe('ValidationError');
      expect(error.message).toBe('Invalid input');
      expect(error.statusCode).toBe(400);
    });

    test('tạo ValidationError với field', () => {
      const error = new ValidationError('Email không hợp lệ', 'email');
      
      expect(error.field).toBe('email');
      expect(error.message).toBe('Email không hợp lệ');
    });

    test('có stack trace', () => {
      const error = new ValidationError('Test error');
      expect(error.stack).toBeDefined();
    });

    test('instanceof Error works', () => {
      const error = new ValidationError('Test');
      expect(error instanceof Error).toBe(true);
    });
  });

  describe('NetworkError', () => {
    test('tạo NetworkError với message', () => {
      const error = new NetworkError('Connection failed');
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(NetworkError);
      expect(error.name).toBe('NetworkError');
      expect(error.message).toBe('Connection failed');
      expect(error.statusCode).toBe(500);
    });

    test('tạo NetworkError với custom statusCode', () => {
      const error = new NetworkError('Not found', 404);
      
      expect(error.statusCode).toBe(404);
    });

    test('có stack trace', () => {
      const error = new NetworkError('Test error');
      expect(error.stack).toBeDefined();
    });
  });

  describe('AuthenticationError', () => {
    test('tạo AuthenticationError với message', () => {
      const error = new AuthenticationError('Unauthorized');
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AuthenticationError);
      expect(error.name).toBe('AuthenticationError');
      expect(error.message).toBe('Unauthorized');
      expect(error.statusCode).toBe(401);
    });

    test('tạo AuthenticationError với reason', () => {
      const error = new AuthenticationError('Login failed', 'Invalid password');
      
      expect(error.reason).toBe('Invalid password');
    });

    test('có stack trace', () => {
      const error = new AuthenticationError('Test error');
      expect(error.stack).toBeDefined();
    });
  });

  describe('DatabaseError', () => {
    test('tạo DatabaseError với message', () => {
      const error = new DatabaseError('Query failed');
      
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('DatabaseError');
      expect(error.statusCode).toBe(500);
    });

    test('tạo DatabaseError với query', () => {
      const error = new DatabaseError('Syntax error', 'SELECT * FROM users');
      
      expect(error.query).toBe('SELECT * FROM users');
    });
  });

  describe('NotFoundError', () => {
    test('tạo NotFoundError với message', () => {
      const error = new NotFoundError('User not found');
      
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('NotFoundError');
      expect(error.statusCode).toBe(404);
    });

    test('tạo NotFoundError với resource', () => {
      const error = new NotFoundError('Not found', 'User:123');
      
      expect(error.resource).toBe('User:123');
    });
  });

  describe('validateUser()', () => {
    const validUser = {
      username: 'john_doe',
      email: 'john@example.com',
      password: 'password123',
      age: 25
    };

    test('pass với valid user', () => {
      expect(() => validateUser(validUser)).not.toThrow();
      expect(validateUser(validUser)).toBe(true);
    });

    test('throw error nếu user không phải object', () => {
      expect(() => validateUser(null)).toThrow(ValidationError);
      expect(() => validateUser('string')).toThrow('User phải là một object');
    });

    test('throw error nếu username rỗng', () => {
      const user = { ...validUser, username: '' };
      expect(() => validateUser(user)).toThrow(ValidationError);
      
      try {
        validateUser(user);
      } catch (error) {
        expect(error.field).toBe('username');
      }
    });

    test('throw error nếu username quá ngắn', () => {
      const user = { ...validUser, username: 'ab' };
      expect(() => validateUser(user)).toThrow('Username phải có ít nhất 3 ký tự');
    });

    test('throw error nếu username quá dài', () => {
      const user = { ...validUser, username: 'a'.repeat(21) };
      expect(() => validateUser(user)).toThrow('Username không được quá 20 ký tự');
    });

    test('throw error nếu email rỗng', () => {
      const user = { ...validUser, email: '' };
      expect(() => validateUser(user)).toThrow(ValidationError);
    });

    test('throw error nếu email không hợp lệ', () => {
      const invalidEmails = ['invalid', 'test@', '@example.com', 'test@.com'];
      
      invalidEmails.forEach(email => {
        const user = { ...validUser, email };
        expect(() => validateUser(user)).toThrow('Email không hợp lệ');
      });
    });

    test('accept valid emails', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.com'
      ];
      
      validEmails.forEach(email => {
        const user = { ...validUser, email };
        expect(() => validateUser(user)).not.toThrow();
      });
    });

    test('throw error nếu password rỗng', () => {
      const user = { ...validUser, password: '' };
      expect(() => validateUser(user)).toThrow(ValidationError);
    });

    test('throw error nếu password quá ngắn', () => {
      const user = { ...validUser, password: '12345' };
      expect(() => validateUser(user)).toThrow('Password phải có ít nhất 6 ký tự');
    });

    test('throw error nếu password quá dài', () => {
      const user = { ...validUser, password: 'a'.repeat(51) };
      expect(() => validateUser(user)).toThrow('Password không được quá 50 ký tự');
    });

    test('throw error nếu age không phải số', () => {
      const user = { ...validUser, age: '25' };
      expect(() => validateUser(user)).toThrow('Age phải là số');
    });

    test('throw error nếu age < 18', () => {
      const user = { ...validUser, age: 17 };
      expect(() => validateUser(user)).toThrow('Age phải từ 18 tuổi trở lên');
    });

    test('throw error nếu age > 120', () => {
      const user = { ...validUser, age: 121 };
      expect(() => validateUser(user)).toThrow('Age không hợp lệ');
    });

    test('age là optional', () => {
      const user = {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password123'
      };
      expect(() => validateUser(user)).not.toThrow();
    });

    test('accept age = 18', () => {
      const user = { ...validUser, age: 18 };
      expect(() => validateUser(user)).not.toThrow();
    });

    test('accept age = 120', () => {
      const user = { ...validUser, age: 120 };
      expect(() => validateUser(user)).not.toThrow();
    });
  });

  describe('handleError()', () => {
    test('xử lý ValidationError', () => {
      const error = new ValidationError('Email không hợp lệ', 'email');
      const result = handleError(error);
      
      expect(result).toEqual({
        success: false,
        message: 'Email không hợp lệ',
        statusCode: 400,
        type: 'ValidationError',
        field: 'email'
      });
    });

    test('xử lý NetworkError', () => {
      const error = new NetworkError('Connection failed', 503);
      const result = handleError(error);
      
      expect(result.success).toBe(false);
      expect(result.type).toBe('NetworkError');
      expect(result.statusCode).toBe(503);
      expect(result.retryable).toBe(true); // 503 >= 500
    });

    test('NetworkError với 4xx không retryable', () => {
      const error = new NetworkError('Bad request', 400);
      const result = handleError(error);
      
      expect(result.retryable).toBe(false);
    });

    test('xử lý AuthenticationError', () => {
      const error = new AuthenticationError('Invalid token', 'Token expired');
      const result = handleError(error);
      
      expect(result.success).toBe(false);
      expect(result.type).toBe('AuthenticationError');
      expect(result.statusCode).toBe(401);
      expect(result.reason).toBe('Token expired');
      expect(result.action).toBe('Please login again');
    });

    test('xử lý DatabaseError', () => {
      const error = new DatabaseError('Connection lost', 'SELECT * FROM users');
      const result = handleError(error);
      
      expect(result.success).toBe(false);
      expect(result.type).toBe('DatabaseError');
      expect(result.message).toBe('Database error occurred');
      expect(result.details).toBe('Connection lost');
      expect(result.query).toBeUndefined(); // Không expose query
    });

    test('xử lý NotFoundError', () => {
      const error = new NotFoundError('User not found', 'User:123');
      const result = handleError(error);
      
      expect(result.success).toBe(false);
      expect(result.type).toBe('NotFoundError');
      expect(result.statusCode).toBe(404);
      expect(result.resource).toBe('User:123');
    });

    test('xử lý generic Error', () => {
      const error = new Error('Unknown error');
      const result = handleError(error);
      
      expect(result.success).toBe(false);
      expect(result.type).toBe('Error');
      expect(result.statusCode).toBe(500);
      expect(result.message).toBe('Unknown error');
    });

    test('xử lý error không có message', () => {
      const error = new Error();
      const result = handleError(error);
      
      expect(result.message).toBe('An unexpected error occurred');
    });
  });

  describe('asyncErrorHandler()', () => {
    test('wrap async function thành công', async () => {
      const fn = async (x) => x * 2;
      const wrapped = asyncErrorHandler(fn);
      
      const result = await wrapped(5);
      
      expect(result.success).toBe(true);
      expect(result.data).toBe(10);
    });

    test('catch error và trả về error object', async () => {
      const fn = async () => {
        throw new ValidationError('Invalid input');
      };
      const wrapped = asyncErrorHandler(fn);
      
      const result = await wrapped();
      
      expect(result.success).toBe(false);
      expect(result.error.type).toBe('ValidationError');
    });

    test('xử lý NetworkError', async () => {
      const fn = async () => {
        throw new NetworkError('Connection failed', 503);
      };
      const wrapped = asyncErrorHandler(fn);
      
      const result = await wrapped();
      
      expect(result.success).toBe(false);
      expect(result.error.statusCode).toBe(503);
      expect(result.error.retryable).toBe(true);
    });

    test('pass arguments đúng', async () => {
      const fn = async (a, b, c) => a + b + c;
      const wrapped = asyncErrorHandler(fn);
      
      const result = await wrapped(1, 2, 3);
      
      expect(result.data).toBe(6);
    });
  });

  describe('tryCatch()', () => {
    test('trả về kết quả nếu không có error', () => {
      const fn = (x) => x * 2;
      const safe = tryCatch(fn, 0);
      
      expect(safe(5)).toBe(10);
    });

    test('trả về defaultValue nếu có error', () => {
      const fn = () => {
        throw new Error('Fail');
      };
      const safe = tryCatch(fn, 'default');
      
      expect(safe()).toBe('default');
    });

    test('defaultValue = null nếu không specify', () => {
      const fn = () => {
        throw new Error('Fail');
      };
      const safe = tryCatch(fn);
      
      expect(safe()).toBeNull();
    });

    test('log error message', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      const fn = () => {
        throw new Error('Test error');
      };
      const safe = tryCatch(fn, 0);
      
      safe();
      
      expect(consoleError).toHaveBeenCalledWith('Error caught:', 'Test error');
      consoleError.mockRestore();
    });

    test('pass arguments đúng', () => {
      const fn = (a, b) => a + b;
      const safe = tryCatch(fn, 0);
      
      expect(safe(3, 4)).toBe(7);
    });
  });

  describe('assert()', () => {
    test('không throw nếu condition true', () => {
      expect(() => assert(true, 'Should not throw')).not.toThrow();
      expect(() => assert(1 === 1, 'Equal')).not.toThrow();
    });

    test('throw Error nếu condition false', () => {
      expect(() => assert(false, 'Should throw')).toThrow(Error);
      expect(() => assert(false, 'Should throw')).toThrow('Should throw');
    });

    test('throw custom ErrorClass', () => {
      expect(() => assert(false, 'Invalid', ValidationError)).toThrow(ValidationError);
    });

    test('xử lý truthy/falsy values', () => {
      expect(() => assert(1, 'OK')).not.toThrow();
      expect(() => assert('hello', 'OK')).not.toThrow();
      expect(() => assert(0, 'Fail')).toThrow();
      expect(() => assert('', 'Fail')).toThrow();
      expect(() => assert(null, 'Fail')).toThrow();
    });
  });

  describe('guard()', () => {
    test('trả về value nếu pass validation', () => {
      const result = guard('test@example.com', (v) => v.includes('@'), 'Invalid email');
      expect(result).toBe('test@example.com');
    });

    test('throw ValidationError nếu fail', () => {
      expect(() => {
        guard('invalid', (v) => v.includes('@'), 'Invalid email');
      }).toThrow(ValidationError);
    });

    test('hoạt động với validators phức tạp', () => {
      const isPositive = (v) => typeof v === 'number' && v > 0;
      
      expect(guard(5, isPositive, 'Must be positive')).toBe(5);
      expect(() => guard(-5, isPositive, 'Must be positive')).toThrow();
      expect(() => guard('5', isPositive, 'Must be positive')).toThrow();
    });

    test('có thể chain guards', () => {
      const value = guard(
        guard('test@example.com', (v) => typeof v === 'string', 'Must be string'),
        (v) => v.includes('@'),
        'Must be email'
      );
      expect(value).toBe('test@example.com');
    });
  });

  describe('logError()', () => {
    test('log error với đầy đủ thông tin', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      const error = new ValidationError('Test error');
      
      const result = logError(error);
      
      expect(result.name).toBe('ValidationError');
      expect(result.message).toBe('Test error');
      expect(result.stack).toBeDefined();
      expect(result.statusCode).toBe(400);
      expect(result.timestamp).toBeDefined();
      
      consoleError.mockRestore();
    });

    test('log error với context', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      const error = new NetworkError('Connection failed');
      
      const result = logError(error, { userId: 123, action: 'fetchData' });
      
      expect(result.context).toEqual({ userId: 123, action: 'fetchData' });
      
      consoleError.mockRestore();
    });

    test('timestamp là ISO format', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      const error = new Error('Test');
      
      const result = logError(error);
      
      expect(() => new Date(result.timestamp)).not.toThrow();
      expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
      
      consoleError.mockRestore();
    });
  });

  // Integration tests
  describe('Integration Tests', () => {
    test('validateUser + handleError', () => {
      const invalidUser = { username: 'ab', email: 'test@example.com', password: '123456' };
      
      try {
        validateUser(invalidUser);
      } catch (error) {
        const response = handleError(error);
        expect(response.type).toBe('ValidationError');
        expect(response.field).toBe('username');
      }
    });

    test('asyncErrorHandler + validateUser', async () => {
      const validateUserAsync = asyncErrorHandler(async (user) => {
        validateUser(user);
        return { id: 1, ...user };
      });
      
      const result = await validateUserAsync({ username: 'ab', email: 'test@example.com', password: '123456' });
      
      expect(result.success).toBe(false);
      expect(result.error.type).toBe('ValidationError');
    });

    test('guard + assert combination', () => {
      const validateAge = (age) => {
        const validAge = guard(age, (v) => typeof v === 'number', 'Age must be number');
        assert(validAge >= 18, 'Must be 18+', ValidationError);
        return validAge;
      };
      
      expect(validateAge(25)).toBe(25);
      expect(() => validateAge('25')).toThrow(ValidationError);
      expect(() => validateAge(15)).toThrow('Must be 18+');
    });

    test('error handling pipeline', async () => {
      const pipeline = asyncErrorHandler(async (user) => {
        // Validate
        validateUser(user);
        
        // Guard
        guard(user.email, (v) => v.endsWith('@company.com'), 'Must use company email');
        
        // Assert
        assert(user.age >= 21, 'Must be 21+', ValidationError);
        
        return { success: true, user };
      });
      
      const result = await pipeline({
        username: 'john',
        email: 'john@gmail.com',
        password: '123456',
        age: 25
      });
      
      expect(result.success).toBe(false);
      expect(result.error.message).toBe('Must use company email');
    });
  });
});
