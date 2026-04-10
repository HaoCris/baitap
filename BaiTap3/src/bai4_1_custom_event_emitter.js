/**
 * Bài 4.1: Custom EventEmitter
 * 
 * Tự implement EventEmitter class từ đầu (không dùng built-in)
 * @module CustomEventEmitter
 */

/**
 * Custom EventEmitter class
 * @class
 */
class CustomEventEmitter {
  /**
   * Khởi tạo EventEmitter
   */
  constructor() {
    /** @private */
    this._events = new Map();
    /** @private */
    this._onceEvents = new Set();
  }

  /**
   * Đăng ký listener cho event
   * @param {string} event - Tên event
   * @param {Function} listener - Callback function
   * @returns {CustomEventEmitter} this (cho method chaining)
   */
  on(event, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }

    if (!this._events.has(event)) {
      this._events.set(event, []);
    }
    this._events.get(event).push(listener);

    return this;
  }

  /**
   * Đăng ký listener chạy một lần
   * @param {string} event - Tên event
   * @param {Function} listener - Callback function
   * @returns {CustomEventEmitter} this
   */
  once(event, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }

    // Wrap listener để tự xóa sau khi chạy
    const onceWrapper = (...args) => {
      this.off(event, onceWrapper);
      listener.apply(this, args);
    };

    // Lưu reference để có thể remove bằng listener gốc
    onceWrapper._originalListener = listener;
    this._onceEvents.add(onceWrapper);

    return this.on(event, onceWrapper);
  }

  /**
   * Hủy đăng ký listener
   * @param {string} event - Tên event
   * @param {Function} listener - Callback function cần xóa
   * @returns {CustomEventEmitter} this
   */
  off(event, listener) {
    if (!this._events.has(event)) {
      return this;
    }

    const listeners = this._events.get(event);
    const index = listeners.findIndex(l => 
      l === listener || l._originalListener === listener
    );

    if (index !== -1) {
      listeners.splice(index, 1);
    }

    // Cleanup nếu không còn listeners
    if (listeners.length === 0) {
      this._events.delete(event);
    }

    return this;
  }

  /**
   * Phát sự kiện
   * @param {string} event - Tên event
   * @param {...*} args - Arguments truyền cho listeners
   * @returns {boolean} true nếu có listeners được gọi
   */
  emit(event, ...args) {
    if (!this._events.has(event)) {
      return false;
    }

    // Copy listeners array để tránh vấn đề khi listener tự remove
    const listeners = [...this._events.get(event)];
    
    for (const listener of listeners) {
      try {
        listener.apply(this, args);
      } catch (error) {
        // Emit error event nếu listener throw
        if (event !== 'error') {
          this.emit('error', error);
        }
      }
    }

    return true;
  }

  /**
   * Đếm số listeners cho event
   * @param {string} event - Tên event
   * @returns {number} Số lượng listeners
   */
  listenerCount(event) {
    if (!this._events.has(event)) {
      return 0;
    }
    return this._events.get(event).length;
  }

  /**
   * Lấy danh sách listeners cho event
   * @param {string} event - Tên event
   * @returns {Function[]} Array of listeners
   */
  listeners(event) {
    if (!this._events.has(event)) {
      return [];
    }
    return [...this._events.get(event)];
  }

  /**
   * Lấy danh sách tên các events đã đăng ký
   * @returns {string[]} Array of event names
   */
  eventNames() {
    return [...this._events.keys()];
  }

  /**
   * Xóa tất cả listeners của một event hoặc tất cả events
   * @param {string} [event] - Tên event (nếu không truyền sẽ xóa tất cả)
   * @returns {CustomEventEmitter} this
   */
  removeAllListeners(event) {
    if (event !== undefined) {
      this._events.delete(event);
    } else {
      this._events.clear();
    }
    return this;
  }

  /**
   * Thêm listener vào đầu danh sách
   * @param {string} event - Tên event
   * @param {Function} listener - Callback function
   * @returns {CustomEventEmitter} this
   */
  prependListener(event, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }

    if (!this._events.has(event)) {
      this._events.set(event, []);
    }
    this._events.get(event).unshift(listener);

    return this;
  }

  /**
   * Thêm once listener vào đầu danh sách
   * @param {string} event - Tên event
   * @param {Function} listener - Callback function
   * @returns {CustomEventEmitter} this
   */
  prependOnceListener(event, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }

    const onceWrapper = (...args) => {
      this.off(event, onceWrapper);
      listener.apply(this, args);
    };

    onceWrapper._originalListener = listener;
    this._onceEvents.add(onceWrapper);

    return this.prependListener(event, onceWrapper);
  }
}

module.exports = CustomEventEmitter;
