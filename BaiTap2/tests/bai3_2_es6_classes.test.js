/**
 * Unit Tests cho Bài 3.2: ES6 Classes
 */

const { Book, Library, Member } = require('../src/bai3_2_es6_classes');

describe('Bài 3.2: ES6 Classes - Library Management System', () => {

  describe('Book Class', () => {
    
    test('khởi tạo Book với đầy đủ thông tin', () => {
      const book = new Book('Clean Code', 'Robert Martin', '978-0132350884', true);
      
      expect(book.title).toBe('Clean Code');
      expect(book.author).toBe('Robert Martin');
      expect(book.isbn).toBe('978-0132350884');
      expect(book.isAvailable).toBe(true);
    });

    test('Book mặc định isAvailable = true', () => {
      const book = new Book('Book Title', 'Author', '123');
      expect(book.isAvailable).toBe(true);
    });

    test('getInfo() trả về thông tin sách', () => {
      const book = new Book('JavaScript', 'Douglas Crockford', '978-0596517748');
      
      expect(book.getInfo()).toBe('JavaScript by Douglas Crockford (ISBN: 978-0596517748)');
    });

    test('borrow() thành công khi sách available', () => {
      const book = new Book('Test Book', 'Author', '123');
      
      expect(book.borrow()).toBe(true);
      expect(book.isAvailable).toBe(false);
    });

    test('borrow() thất bại khi sách đã được mượn', () => {
      const book = new Book('Test Book', 'Author', '123');
      
      book.borrow(); // Lần 1 thành công
      expect(book.borrow()).toBe(false); // Lần 2 thất bại
      expect(book.isAvailable).toBe(false);
    });

    test('returnBook() trả sách thành công', () => {
      const book = new Book('Test Book', 'Author', '123');
      
      book.borrow();
      expect(book.isAvailable).toBe(false);
      
      book.returnBook();
      expect(book.isAvailable).toBe(true);
    });

    test('có thể mượn lại sau khi trả', () => {
      const book = new Book('Test Book', 'Author', '123');
      
      book.borrow();
      book.returnBook();
      expect(book.borrow()).toBe(true);
    });
  });

  describe('Library Class', () => {
    
    test('khởi tạo Library với tên', () => {
      const library = new Library('City Library');
      
      expect(library.name).toBe('City Library');
      expect(library.books).toEqual([]);
    });

    test('khởi tạo Library với sách ban đầu', () => {
      const book1 = new Book('Book 1', 'Author 1', '111');
      const book2 = new Book('Book 2', 'Author 2', '222');
      
      const library = new Library('Library', [book1, book2]);
      
      expect(library.books).toHaveLength(2);
    });

    test('addBook() thêm sách thành công', () => {
      const library = new Library('Test Library');
      const book = new Book('New Book', 'Author', '123');
      
      expect(library.addBook(book)).toBe(true);
      expect(library.books).toHaveLength(1);
      expect(library.books[0]).toBe(book);
    });

    test('addBook() không cho trùng ISBN', () => {
      const library = new Library('Test Library');
      const book1 = new Book('Book 1', 'Author 1', '123');
      const book2 = new Book('Book 2', 'Author 2', '123'); // Cùng ISBN
      
      library.addBook(book1);
      expect(library.addBook(book2)).toBe(false);
      expect(library.books).toHaveLength(1);
    });

    test('addBook() throw error nếu không phải Book instance', () => {
      const library = new Library('Test Library');
      
      expect(() => library.addBook({})).toThrow(TypeError);
      expect(() => library.addBook('not a book')).toThrow(TypeError);
    });

    test('removeBook() xóa sách thành công', () => {
      const library = new Library('Test Library');
      const book = new Book('Test Book', 'Author', '123');
      
      library.addBook(book);
      expect(library.removeBook('123')).toBe(true);
      expect(library.books).toHaveLength(0);
    });

    test('removeBook() trả về false nếu không tìm thấy', () => {
      const library = new Library('Test Library');
      
      expect(library.removeBook('999')).toBe(false);
    });

    test('findBook() tìm sách theo ISBN', () => {
      const library = new Library('Test Library');
      const book1 = new Book('Book 1', 'Author 1', '111');
      const book2 = new Book('Book 2', 'Author 2', '222');
      
      library.addBook(book1);
      library.addBook(book2);
      
      const found = library.findBook('222');
      expect(found).toBe(book2);
      expect(found.title).toBe('Book 2');
    });

    test('findBook() trả về undefined nếu không tìm thấy', () => {
      const library = new Library('Test Library');
      
      expect(library.findBook('999')).toBeUndefined();
    });

    test('getAvailableBooks() trả về sách còn có sẵn', () => {
      const library = new Library('Test Library');
      const book1 = new Book('Book 1', 'Author 1', '111');
      const book2 = new Book('Book 2', 'Author 2', '222');
      const book3 = new Book('Book 3', 'Author 3', '333');
      
      library.addBook(book1);
      library.addBook(book2);
      library.addBook(book3);
      
      book2.borrow(); // Book 2 đã được mượn
      
      const available = library.getAvailableBooks();
      expect(available).toHaveLength(2);
      expect(available).toContain(book1);
      expect(available).toContain(book3);
      expect(available).not.toContain(book2);
    });

    test('searchByTitle() tìm sách theo tên', () => {
      const library = new Library('Test Library');
      library.addBook(new Book('JavaScript Guide', 'Author 1', '111'));
      library.addBook(new Book('Python Basics', 'Author 2', '222'));
      library.addBook(new Book('Advanced JavaScript', 'Author 3', '333'));
      
      const results = library.searchByTitle('javascript');
      expect(results).toHaveLength(2);
      expect(results[0].title).toContain('JavaScript');
    });

    test('searchByAuthor() tìm sách theo tác giả', () => {
      const library = new Library('Test Library');
      library.addBook(new Book('Book 1', 'Robert Martin', '111'));
      library.addBook(new Book('Book 2', 'Robert C. Martin', '222'));
      library.addBook(new Book('Book 3', 'John Doe', '333'));
      
      const results = library.searchByAuthor('robert');
      expect(results).toHaveLength(2);
    });

    test('getTotalBooks() trả về tổng số sách', () => {
      const library = new Library('Test Library');
      
      expect(library.getTotalBooks()).toBe(0);
      
      library.addBook(new Book('Book 1', 'Author 1', '111'));
      library.addBook(new Book('Book 2', 'Author 2', '222'));
      
      expect(library.getTotalBooks()).toBe(2);
    });
  });

  describe('Member Class', () => {
    
    test('khởi tạo Member với thông tin', () => {
      const member = new Member('John Doe', 'M001');
      
      expect(member.name).toBe('John Doe');
      expect(member.memberId).toBe('M001');
      expect(member.borrowedBooks).toEqual([]);
    });

    test('borrowBook() mượn sách thành công', () => {
      const member = new Member('Alice', 'M001');
      const book = new Book('Test Book', 'Author', '123');
      
      expect(member.borrowBook(book)).toBe(true);
      expect(member.borrowedBooks).toHaveLength(1);
      expect(book.isAvailable).toBe(false);
    });

    test('borrowBook() thất bại nếu sách đã được mượn', () => {
      const member = new Member('Alice', 'M001');
      const book = new Book('Test Book', 'Author', '123');
      
      book.borrow(); // Đã được mượn bởi người khác
      expect(member.borrowBook(book)).toBe(false);
    });

    test('borrowBook() không cho mượn trùng sách', () => {
      const member = new Member('Alice', 'M001');
      const book = new Book('Test Book', 'Author', '123');
      
      member.borrowBook(book);
      expect(member.borrowBook(book)).toBe(false);
      expect(member.borrowedBooks).toHaveLength(1);
    });

    test('borrowBook() throw error nếu không phải Book', () => {
      const member = new Member('Alice', 'M001');
      
      expect(() => member.borrowBook({})).toThrow(TypeError);
    });

    test('returnBook() trả sách thành công', () => {
      const member = new Member('Alice', 'M001');
      const book = new Book('Test Book', 'Author', '123');
      
      member.borrowBook(book);
      expect(member.returnBook(book)).toBe(true);
      expect(member.borrowedBooks).toHaveLength(0);
      expect(book.isAvailable).toBe(true);
    });

    test('returnBook() thất bại nếu chưa mượn sách đó', () => {
      const member = new Member('Alice', 'M001');
      const book = new Book('Test Book', 'Author', '123');
      
      expect(member.returnBook(book)).toBe(false);
    });

    test('getBorrowedBooks() trả về danh sách sách đã mượn', () => {
      const member = new Member('Alice', 'M001');
      const book1 = new Book('Book 1', 'Author 1', '111');
      const book2 = new Book('Book 2', 'Author 2', '222');
      
      member.borrowBook(book1);
      member.borrowBook(book2);
      
      const borrowed = member.getBorrowedBooks();
      expect(borrowed).toHaveLength(2);
      expect(borrowed).toContain(book1);
      expect(borrowed).toContain(book2);
    });

    test('getBorrowedBooks() trả về copy, không phải reference', () => {
      const member = new Member('Alice', 'M001');
      const book = new Book('Book', 'Author', '123');
      
      member.borrowBook(book);
      
      const borrowed1 = member.getBorrowedBooks();
      const borrowed2 = member.getBorrowedBooks();
      
      expect(borrowed1).not.toBe(borrowed2);
    });

    test('getBorrowedCount() trả về số sách đang mượn', () => {
      const member = new Member('Alice', 'M001');
      
      expect(member.getBorrowedCount()).toBe(0);
      
      member.borrowBook(new Book('Book 1', 'Author 1', '111'));
      expect(member.getBorrowedCount()).toBe(1);
      
      member.borrowBook(new Book('Book 2', 'Author 2', '222'));
      expect(member.getBorrowedCount()).toBe(2);
    });
  });

  describe('Integration Tests - Library System', () => {
    
    test('kịch bản hoàn chỉnh: thêm sách, member mượn và trả', () => {
      // Tạo thư viện
      const library = new Library('City Library');
      
      // Thêm sách
      const book1 = new Book('Clean Code', 'Robert Martin', '111');
      const book2 = new Book('JavaScript', 'Douglas Crockford', '222');
      library.addBook(book1);
      library.addBook(book2);
      
      expect(library.getTotalBooks()).toBe(2);
      expect(library.getAvailableBooks()).toHaveLength(2);
      
      // Tạo member
      const member = new Member('Alice', 'M001');
      
      // Member mượn sách
      expect(member.borrowBook(book1)).toBe(true);
      expect(library.getAvailableBooks()).toHaveLength(1);
      expect(member.getBorrowedCount()).toBe(1);
      
      // Member trả sách
      expect(member.returnBook(book1)).toBe(true);
      expect(library.getAvailableBooks()).toHaveLength(2);
      expect(member.getBorrowedCount()).toBe(0);
    });

    test('nhiều members mượn sách khác nhau', () => {
      const library = new Library('Library');
      const book1 = new Book('Book 1', 'Author 1', '111');
      const book2 = new Book('Book 2', 'Author 2', '222');
      const book3 = new Book('Book 3', 'Author 3', '333');
      
      library.addBook(book1);
      library.addBook(book2);
      library.addBook(book3);
      
      const member1 = new Member('Alice', 'M001');
      const member2 = new Member('Bob', 'M002');
      
      member1.borrowBook(book1);
      member2.borrowBook(book2);
      
      expect(library.getAvailableBooks()).toHaveLength(1);
      expect(member1.getBorrowedCount()).toBe(1);
      expect(member2.getBorrowedCount()).toBe(1);
    });

    test('không thể mượn sách đã được member khác mượn', () => {
      const book = new Book('Popular Book', 'Author', '123');
      const member1 = new Member('Alice', 'M001');
      const member2 = new Member('Bob', 'M002');
      
      member1.borrowBook(book);
      expect(member2.borrowBook(book)).toBe(false);
    });

    test('có thể mượn lại sau khi member khác trả', () => {
      const book = new Book('Book', 'Author', '123');
      const member1 = new Member('Alice', 'M001');
      const member2 = new Member('Bob', 'M002');
      
      member1.borrowBook(book);
      member1.returnBook(book);
      
      expect(member2.borrowBook(book)).toBe(true);
    });

    test('tìm và mượn sách từ thư viện', () => {
      const library = new Library('Library');
      const book = new Book('JavaScript Guide', 'Author', '123');
      library.addBook(book);
      
      const member = new Member('Alice', 'M001');
      const found = library.findBook('123');
      
      expect(found).toBe(book);
      expect(member.borrowBook(found)).toBe(true);
    });
  });
});
