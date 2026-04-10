/**
 * Bài 9.1: Fetch Wrapper
 *
 * Tạo module HttpClient với:
 * - get/post/put/delete
 * - tự động xử lý JSON
 * - error handling với custom errors
 * - request/response interceptors
 */

/**
 * Base error cho HttpClient
 * @extends Error
 */
class HttpClientError extends Error {
  /**
   * @param {string} message - Error message
   * @param {Object} details - Thông tin bổ sung
   */
  constructor(message, details = {}) {
    super(message);
    this.name = 'HttpClientError';
    this.details = details;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpClientError);
    }
  }
}

/**
 * Error khi input không hợp lệ
 * @extends HttpClientError
 */
class HttpValidationError extends HttpClientError {
  /**
   * @param {string} message - Error message
   * @param {string} field - Field lỗi
   */
  constructor(message, field = null) {
    super(message, { field });
    this.name = 'HttpValidationError';
    this.field = field;
  }
}

/**
 * Error khi request trả về status không thành công
 * @extends HttpClientError
 */
class HttpResponseError extends HttpClientError {
  /**
   * @param {string} message - Error message
   * @param {number} status - HTTP status
   * @param {string} statusText - HTTP status text
   * @param {any} data - Parsed response data
   * @param {string} url - Request URL
   * @param {string} method - HTTP method
   */
  constructor(message, status, statusText, data, url, method) {
    super(message, { status, statusText, data, url, method });
    this.name = 'HttpResponseError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
    this.url = url;
    this.method = method;
  }
}

/**
 * Error khi request bị lỗi network
 * @extends HttpClientError
 */
class HttpNetworkError extends HttpClientError {
  /**
   * @param {string} message - Error message
   * @param {string} url - Request URL
   * @param {string} method - HTTP method
   * @param {Error} originalError - Error gốc từ fetch
   */
  constructor(message, url, method, originalError = null) {
    super(message, { url, method, originalError });
    this.name = 'HttpNetworkError';
    this.url = url;
    this.method = method;
    this.originalError = originalError;
  }
}

/**
 * Kiểm tra có phải object thông thường để JSON serialize
 * @param {any} value - Giá trị cần kiểm tra
 * @returns {boolean}
 */
function isJsonSerializableObject(value) {
  if (value === null || typeof value !== 'object') {
    return false;
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return false;
  }

  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView && ArrayBuffer.isView(value)) {
    return false;
  }

  if (typeof URLSearchParams !== 'undefined' && value instanceof URLSearchParams) {
    return false;
  }

  if (typeof FormData !== 'undefined' && value instanceof FormData) {
    return false;
  }

  return true;
}

/**
 * HttpClient class
 */
class HttpClientCore {
  constructor() {
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }

  /**
   * Thêm request interceptor
   * @param {Function} interceptor - (context) => context | Promise<context>
   * @returns {number} index của interceptor
   */
  addRequestInterceptor(interceptor) {
    if (typeof interceptor !== 'function') {
      throw new HttpValidationError('Request interceptor must be a function', 'interceptor');
    }

    this.requestInterceptors.push(interceptor);
    return this.requestInterceptors.length - 1;
  }

  /**
   * Thêm response interceptor
   * @param {Function} interceptor - (data, meta) => transformedData
   * @returns {number} index của interceptor
   */
  addResponseInterceptor(interceptor) {
    if (typeof interceptor !== 'function') {
      throw new HttpValidationError('Response interceptor must be a function', 'interceptor');
    }

    this.responseInterceptors.push(interceptor);
    return this.responseInterceptors.length - 1;
  }

  /**
   * Xóa toàn bộ interceptors
   */
  clearInterceptors() {
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }

  /**
   * GET request
   * @param {string} url - Request URL
   * @param {Object} options - Fetch options
   * @returns {Promise<any>}
   */
  async get(url, options = {}) {
    return this.request('GET', url, undefined, options);
  }

  /**
   * POST request
   * @param {string} url - Request URL
   * @param {any} data - Request body
   * @param {Object} options - Fetch options
   * @returns {Promise<any>}
   */
  async post(url, data, options = {}) {
    return this.request('POST', url, data, options);
  }

  /**
   * PUT request
   * @param {string} url - Request URL
   * @param {any} data - Request body
   * @param {Object} options - Fetch options
   * @returns {Promise<any>}
   */
  async put(url, data, options = {}) {
    return this.request('PUT', url, data, options);
  }

  /**
   * DELETE request
   * @param {string} url - Request URL
   * @param {Object} options - Fetch options
   * @returns {Promise<any>}
   */
  async delete(url, options = {}) {
    return this.request('DELETE', url, undefined, options);
  }

  /**
   * Hàm request tổng quát
   * @param {string} method - HTTP method
   * @param {string} url - Request URL
   * @param {any} data - Request body
   * @param {Object} options - Fetch options
   * @returns {Promise<any>}
   */
  async request(method, url, data, options = {}) {
    this._validateUrl(url);
    this._validateOptions(options);

    const requestContext = this._buildRequestContext(method, url, data, options);
    const finalContext = await this._applyRequestInterceptors(requestContext);

    let response;
    try {
      response = await fetch(finalContext.url, finalContext.options);
    } catch (error) {
      throw new HttpNetworkError(error.message, finalContext.url, finalContext.options.method, error);
    }

    const parsedData = await this._parseResponseData(response, finalContext);

    if (!response.ok) {
      throw new HttpResponseError(
        `Request failed with status ${response.status}`,
        response.status,
        response.statusText,
        parsedData,
        finalContext.url,
        finalContext.options.method
      );
    }

    const responseMeta = {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      url: finalContext.url,
      method: finalContext.options.method,
      rawResponse: response
    };

    return this._applyResponseInterceptors(parsedData, responseMeta);
  }

  /**
   * Validate URL
   * @param {string} url - URL cần validate
   * @private
   */
  _validateUrl(url) {
    if (typeof url !== 'string' || url.trim() === '') {
      throw new HttpValidationError('URL must be a non-empty string', 'url');
    }
  }

  /**
   * Validate options
   * @param {Object} options - Options cần validate
   * @private
   */
  _validateOptions(options) {
    if (options === null || typeof options !== 'object' || Array.isArray(options)) {
      throw new HttpValidationError('Options must be an object', 'options');
    }
  }

  /**
   * Build request context trước khi gọi fetch
   * @param {string} method - HTTP method
   * @param {string} url - URL
   * @param {any} data - body data
   * @param {Object} options - options
   * @returns {{url: string, options: Object}}
   * @private
   */
  _buildRequestContext(method, url, data, options) {
    const requestOptions = {
      ...options,
      method,
      headers: {
        ...(options.headers || {})
      }
    };

    if (data !== undefined && method !== 'GET' && method !== 'DELETE') {
      if (isJsonSerializableObject(data)) {
        requestOptions.body = JSON.stringify(data);

        if (!requestOptions.headers['Content-Type'] && !requestOptions.headers['content-type']) {
          requestOptions.headers['Content-Type'] = 'application/json';
        }
      } else {
        requestOptions.body = data;
      }
    }

    return {
      url,
      options: requestOptions
    };
  }

  /**
   * Chạy request interceptors theo thứ tự
   * @param {{url: string, options: Object}} initialContext - context ban đầu
   * @returns {Promise<{url: string, options: Object}>}
   * @private
   */
  async _applyRequestInterceptors(initialContext) {
    let currentContext = initialContext;

    for (const interceptor of this.requestInterceptors) {
      const nextContext = await interceptor({
        url: currentContext.url,
        options: {
          ...currentContext.options,
          headers: {
            ...(currentContext.options.headers || {})
          }
        }
      });

      if (nextContext === undefined) {
        continue;
      }

      if (
        !nextContext ||
        typeof nextContext !== 'object' ||
        typeof nextContext.url !== 'string' ||
        !nextContext.options ||
        typeof nextContext.options !== 'object'
      ) {
        throw new HttpValidationError(
          'Request interceptor must return { url, options } object',
          'requestInterceptorReturn'
        );
      }

      currentContext = {
        url: nextContext.url,
        options: nextContext.options
      };
    }

    return currentContext;
  }

  /**
   * Chạy response interceptors theo thứ tự
   * @param {any} data - parsed response data
   * @param {Object} meta - response metadata
   * @returns {Promise<any>}
   * @private
   */
  async _applyResponseInterceptors(data, meta) {
    let currentData = data;

    for (const interceptor of this.responseInterceptors) {
      const transformedData = await interceptor(currentData, meta);
      if (transformedData !== undefined) {
        currentData = transformedData;
      }
    }

    return currentData;
  }

  /**
   * Parse response body
   * @param {Object} response - Fetch response
   * @param {{url: string, options: Object}} context - request context
   * @returns {Promise<any>}
   * @private
   */
  async _parseResponseData(response, context) {
    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers && typeof response.headers.get === 'function'
      ? (response.headers.get('content-type') || '')
      : '';

    if (contentType.includes('application/json')) {
      try {
        return await response.json();
      } catch (error) {
        throw new HttpClientError('Failed to parse JSON response', {
          url: context.url,
          method: context.options.method,
          status: response.status,
          originalError: error
        });
      }
    }

    if (typeof response.text === 'function') {
      const text = await response.text();
      return text === '' ? null : text;
    }

    return null;
  }
}

const HttpClient = new HttpClientCore();

module.exports = {
  HttpClient,
  HttpClientCore,
  HttpClientError,
  HttpValidationError,
  HttpResponseError,
  HttpNetworkError
};

