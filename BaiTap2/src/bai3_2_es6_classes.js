/**
 * Bài 3.2: ES6 Classes
 * 
 * Hệ thống quản lý thư viện với Book, Library, và Member
 */

/**
 * Class Book đại diện cho một cuốn sách
 */
class Book {
  /**
   * @param {string} title - Tên sách
   * @param {string} author - Tác giả
   * @param {string} isbn - Mã ISBN
   * @param {boolean} [isAvailable=true] - Trạng thái sẵn có
   */
  constructor(title, author, isbn, isAvailable = true) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.isAvailable = isAvailable;
  }

  /**
   * Lấy thông tin sách
   * @returns {string} Thông tin sách
   */
  getInfo() {
    return `${this.title} by ${this.author} (ISBN: ${this.isbn})`;
  }

  /**
   * Mượn sách
   * @returns {boolean} true nếu mượn thành công, false nếu đã được mượn
   */
  borrow() {
    if (this.isAvailable) {
      this.isAvailable = false;
      return true;
    }
    return false;
  }

  /**
   * Trả sách
   * @returns {boolean} true nếu trả thành công
   */
  returnBook() {
    this.isAvailable = true;
    return true;
  }
}

/**
 * Class Library quản lý các sách
 */
class Library {
  /**
   * @param {string} name - Tên thư viện
   * @param {Book[]} [books=[]] - Danh sách sách ban đầu
   */
  constructor(name, books = []) {
    this.name = name;
    this.books = books;
  }

  /**
   * Thêm sách vào thư viện
   * @param {Book} book - Sách cần thêm
   * @returns {boolean} true nếu thêm thành công
   */
  addBook(book) {
    if (!(book instanceof Book)) {
      throw new TypeError('Only Book instances can be added');
    }
    
    // Kiểm tra trùng ISBN
    if (this.findBook(book.isbn)) {
      return false;
    }
    
    this.books.push(book);
    return true;
  }

  /**
   * Xóa sách khỏi thư viện
   * @param {string} isbn - ISBN của sách cần xóa
   * @returns {boolean} true nếu xóa thành công
   */
  removeBook(isbn) {
    const index = this.books.findIndex(book => book.isbn === isbn);
    
    if (index === -1) {
      return false;
    }
    
    this.books.splice(index, 1);
    return true;
  }

  /**
   * Tìm sách theo ISBN
   * @param {string} isbn - ISBN cần tìm
   * @returns {Book|undefined} Sách tìm được hoặc undefined
   */
  findBook(isbn) {
    return this.books.find(book => book.isbn === isbn);
  }

  /**
   * Lấy danh sách sách còn có sẵn
   * @returns {Book[]} Mảng các sách còn có thể mượn
   */
  getAvailableBooks() {
    return this.books.filter(book => book.isAvailable);
  }

  /**
   * Tìm sách theo tên (không phân biệt hoa thường)
   * @param {string} title - Tên sách cần tìm
   * @returns {Book[]} Mảng các sách tìm được
   */
  searchByTitle(title) {
    const searchTerm = title.toLowerCase();
    return this.books.filter(book => 
      book.title.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Tìm sách theo tác giả
   * @param {string} author - Tên tác giả
   * @returns {Book[]} Mảng các sách của tác giả
   */
  searchByAuthor(author) {
    const searchTerm = author.toLowerCase();
    return this.books.filter(book => 
      book.author.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Lấy tổng số sách trong thư viện
   * @returns {number} Số lượng sách
   */
  getTotalBooks() {
    return this.books.length;
  }
}

/**
 * Class Member đại diện cho thành viên thư viện
 */
class Member {
  /**
   * @param {string} name - Tên thành viên
   * @param {string} memberId - Mã thành viên
   * @param {Book[]} [borrowedBooks=[]] - Danh sách sách đã mượn
   */
  constructor(name, memberId, borrowedBooks = []) {
    this.name = name;
    this.memberId = memberId;
    this.borrowedBooks = borrowedBooks;
  }

  /**
   * Mượn sách từ thư viện
   * @param {Book} book - Sách cần mượn
   * @returns {boolean} true nếu mượn thành công
   */
  borrowBook(book) {
    if (!(book instanceof Book)) {
      throw new TypeError('Can only borrow Book instances');
    }

    // Kiểm tra sách có sẵn không
    if (!book.isAvailable) {
      return false;
    }

    // Kiểm tra đã mượn sách này chưa
    if (this.borrowedBooks.some(b => b.isbn === book.isbn)) {
      return false;
    }

    // Mượn sách
    if (book.borrow()) {
      this.borrowedBooks.push(book);
      return true;
    }

    return false;
  }

  /**
   * Trả sách
   * @param {Book} book - Sách cần trả
   * @returns {boolean} true nếu trả thành công
   */
  returnBook(book) {
    const index = this.borrowedBooks.findIndex(b => b.isbn === book.isbn);
    
    if (index === -1) {
      return false;
    }

    // Trả sách
    book.returnBook();
    this.borrowedBooks.splice(index, 1);
    return true;
  }

  /**
   * Lấy danh sách sách đã mượn
   * @returns {Book[]} Mảng các sách đã mượn
   */
  getBorrowedBooks() {
    return [...this.borrowedBooks]; // Trả về copy
  }

  /**
   * Lấy số lượng sách đang mượn
   * @returns {number} Số sách đang mượn
   */
  getBorrowedCount() {
    return this.borrowedBooks.length;
  }
}

// Export
module.exports = {
  Book,
  Library,
  Member
};