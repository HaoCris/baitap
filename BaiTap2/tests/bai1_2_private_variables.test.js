/**
 * Unit Tests cho Bài 1.2: Private Variables
 * 
 * Test các chức năng của bank account được tạo bằng closure
 */

const { createBankAccount, createBankAccountWithLimit } = require('../src/bai1_2_private_variables');

describe('Bài 1.2: Private Variables - Bank Account', () => {

  describe('createBankAccount()', () => {
    
    describe('Initialization (Khởi tạo)', () => {
      test('khởi tạo với số dư mặc định là 0', () => {
        const account = createBankAccount();
        expect(account.getBalance()).toBe(0);
      });

      test('khởi tạo với số dư ban đầu tùy chỉnh', () => {
        const account = createBankAccount(1000);
        expect(account.getBalance()).toBe(1000);
      });

      test('lưu giao dịch INITIAL khi có số dư ban đầu', () => {
        const account = createBankAccount(500);
        const history = account.getTransactionHistory();
        
        expect(history).toHaveLength(1);
        expect(history[0].type).toBe('INITIAL');
        expect(history[0].amount).toBe(500);
      });

      test('không có lịch sử khi số dư ban đầu là 0', () => {
        const account = createBankAccount(0);
        const history = account.getTransactionHistory();
        expect(history).toHaveLength(0);
      });

      test('throw error nếu initial balance là số âm', () => {
        expect(() => createBankAccount(-100)).toThrow('Initial balance cannot be negative');
      });

      test('throw error nếu initial balance không phải số', () => {
        expect(() => createBankAccount('1000')).toThrow('Initial balance must be a valid number');
        expect(() => createBankAccount(null)).toThrow('Initial balance must be a valid number');
        expect(() => createBankAccount({})).toThrow('Initial balance must be a valid number');
        expect(() => createBankAccount([])).toThrow('Initial balance must be a valid number');
      });

      test('chấp nhận undefined và dùng default value 0', () => {
        const account = createBankAccount(undefined);
        expect(account.getBalance()).toBe(0);
      });

      test('throw error nếu initial balance là NaN', () => {
        expect(() => createBankAccount(NaN)).toThrow('Initial balance must be a valid number');
      });
    });

    describe('deposit() - Gửi tiền', () => {
      let account;

      beforeEach(() => {
        account = createBankAccount(1000);
      });

      test('gửi tiền thành công và cập nhật số dư', () => {
        const newBalance = account.deposit(500);
        expect(newBalance).toBe(1500);
        expect(account.getBalance()).toBe(1500);
      });

      test('gửi tiền nhiều lần', () => {
        account.deposit(200);
        account.deposit(300);
        account.deposit(100);
        expect(account.getBalance()).toBe(1600); // 1000 + 200 + 300 + 100
      });

      test('throw error khi gửi số tiền âm', () => {
        expect(() => account.deposit(-100)).toThrow('Deposit amount must be positive');
      });

      test('throw error khi gửi số 0', () => {
        expect(() => account.deposit(0)).toThrow('Deposit amount must be positive');
      });

      test('throw error khi amount không phải số', () => {
        expect(() => account.deposit('500')).toThrow('Deposit amount must be a valid number');
        expect(() => account.deposit(null)).toThrow('Deposit amount must be a valid number');
        expect(() => account.deposit({})).toThrow('Deposit amount must be a valid number');
      });

      test('throw error khi amount là NaN', () => {
        expect(() => account.deposit(NaN)).toThrow('Deposit amount must be a valid number');
      });

      test('lưu giao dịch vào history sau khi deposit', () => {
        account.deposit(300);
        const history = account.getTransactionHistory();
        
        // Có 2 transactions: INITIAL và DEPOSIT
        expect(history.length).toBeGreaterThan(0);
        
        const depositTransaction = history[history.length - 1];
        expect(depositTransaction.type).toBe('DEPOSIT');
        expect(depositTransaction.amount).toBe(300);
        expect(depositTransaction.balance).toBe(1300);
      });

      test('gửi số tiền thập phân', () => {
        const newBalance = account.deposit(123.45);
        expect(newBalance).toBeCloseTo(1123.45, 2);
      });
    });

    describe('withdraw() - Rút tiền', () => {
      let account;

      beforeEach(() => {
        account = createBankAccount(1000);
      });

      test('rút tiền thành công và cập nhật số dư', () => {
        const newBalance = account.withdraw(300);
        expect(newBalance).toBe(700);
        expect(account.getBalance()).toBe(700);
      });

      test('rút tiền nhiều lần', () => {
        account.withdraw(100);
        account.withdraw(200);
        account.withdraw(150);
        expect(account.getBalance()).toBe(550); // 1000 - 100 - 200 - 150
      });

      test('throw error khi rút quá số dư', () => {
        expect(() => account.withdraw(1500)).toThrow('Insufficient balance');
      });

      test('throw error khi rút số tiền âm', () => {
        expect(() => account.withdraw(-100)).toThrow('Withdraw amount must be positive');
      });

      test('throw error khi rút số 0', () => {
        expect(() => account.withdraw(0)).toThrow('Withdraw amount must be positive');
      });

      test('throw error khi amount không phải số', () => {
        expect(() => account.withdraw('300')).toThrow('Withdraw amount must be a valid number');
        expect(() => account.withdraw(undefined)).toThrow('Withdraw amount must be a valid number');
      });

      test('có thể rút toàn bộ số dư', () => {
        const newBalance = account.withdraw(1000);
        expect(newBalance).toBe(0);
        expect(account.getBalance()).toBe(0);
      });

      test('không thể rút khi số dư bằng 0', () => {
        account.withdraw(1000); // Rút hết
        expect(() => account.withdraw(1)).toThrow('Insufficient balance');
      });

      test('lưu giao dịch vào history sau khi withdraw', () => {
        account.withdraw(250);
        const history = account.getTransactionHistory();
        
        const withdrawTransaction = history[history.length - 1];
        expect(withdrawTransaction.type).toBe('WITHDRAW');
        expect(withdrawTransaction.amount).toBe(250);
        expect(withdrawTransaction.balance).toBe(750);
      });

      test('rút số tiền thập phân', () => {
        const newBalance = account.withdraw(123.45);
        expect(newBalance).toBeCloseTo(876.55, 2);
      });
    });

    describe('getBalance() - Xem số dư', () => {
      test('trả về số dư chính xác', () => {
        const account = createBankAccount(500);
        expect(account.getBalance()).toBe(500);
        
        account.deposit(200);
        expect(account.getBalance()).toBe(700);
        
        account.withdraw(150);
        expect(account.getBalance()).toBe(550);
      });

      test('balance không thể bị thay đổi trực tiếp từ bên ngoài', () => {
        const account = createBankAccount(1000);
        const balance = account.getBalance();
        
        // Thử modify balance (không có tác dụng)
        account.balance = 5000;
        
        // Balance vẫn không đổi
        expect(account.getBalance()).toBe(1000);
      });
    });

    describe('getTransactionHistory() - Lịch sử giao dịch', () => {
      let account;

      beforeEach(() => {
        account = createBankAccount(1000);
      });

      test('trả về mảng rỗng khi chưa có giao dịch nào', () => {
        const emptyAccount = createBankAccount();
        expect(emptyAccount.getTransactionHistory()).toEqual([]);
      });

      test('lưu đầy đủ thông tin giao dịch', () => {
        account.deposit(500);
        const history = account.getTransactionHistory();
        const lastTransaction = history[history.length - 1];

        expect(lastTransaction).toHaveProperty('type');
        expect(lastTransaction).toHaveProperty('amount');
        expect(lastTransaction).toHaveProperty('balance');
        expect(lastTransaction).toHaveProperty('timestamp');
        expect(lastTransaction).toHaveProperty('description');
      });

      test('lưu lịch sử theo thứ tự thời gian', () => {
        account.deposit(200);  // Transaction 2
        account.withdraw(100); // Transaction 3
        account.deposit(300);  // Transaction 4

        const history = account.getTransactionHistory();
        
        // Có 4 transactions: INITIAL + 3 operations
        expect(history).toHaveLength(4);
        expect(history[0].type).toBe('INITIAL');
        expect(history[1].type).toBe('DEPOSIT');
        expect(history[2].type).toBe('WITHDRAW');
        expect(history[3].type).toBe('DEPOSIT');
      });

      test('mỗi transaction có timestamp hợp lệ', () => {
        account.deposit(100);
        const history = account.getTransactionHistory();
        const transaction = history[history.length - 1];

        // Check timestamp là ISO string hợp lệ
        expect(new Date(transaction.timestamp).toString()).not.toBe('Invalid Date');
      });

      test('trả về copy của history, không phải reference', () => {
        account.deposit(100);
        const history1 = account.getTransactionHistory();
        const history2 = account.getTransactionHistory();

        // Hai lần gọi trả về hai object khác nhau
        expect(history1).not.toBe(history2);
        
        // Modify history1 không ảnh hưởng đến history2
        history1.push({ fake: 'transaction' });
        expect(history2.length).not.toBe(history1.length);
      });

      test('không thể modify transaction history từ bên ngoài', () => {
        account.deposit(200);
        const history = account.getTransactionHistory();
        const originalLength = history.length;

        // Thử thêm fake transaction
        history.push({ type: 'FAKE', amount: 999 });

        // History thực tế không bị thay đổi
        const actualHistory = account.getTransactionHistory();
        expect(actualHistory).toHaveLength(originalLength);
      });

      test('transaction balance phản ánh đúng số dư tại thời điểm đó', () => {
        account.deposit(500);  // Balance: 1500
        account.withdraw(300); // Balance: 1200

        const history = account.getTransactionHistory();
        expect(history[1].balance).toBe(1500);
        expect(history[2].balance).toBe(1200);
      });
    });

    describe('Integration Tests - Kết hợp nhiều operations', () => {
      test('kịch bản giao dịch thực tế', () => {
        // Tạo tài khoản với số dư ban đầu
        const account = createBankAccount(5000);

        // Thực hiện các giao dịch
        account.deposit(1000);   // +1000 = 6000
        account.withdraw(2000);  // -2000 = 4000
        account.deposit(500);    // +500  = 4500
        account.withdraw(1500);  // -1500 = 3000

        // Kiểm tra số dư cuối
        expect(account.getBalance()).toBe(3000);

        // Kiểm tra history
        const history = account.getTransactionHistory();
        expect(history).toHaveLength(5); // INITIAL + 4 operations
      });

      test('nhiều accounts độc lập với nhau', () => {
        const account1 = createBankAccount(1000);
        const account2 = createBankAccount(2000);

        account1.deposit(500);
        account1.deposit(200); // Thêm giao dịch để khác với account2
        account2.withdraw(500);

        expect(account1.getBalance()).toBe(1700);
        expect(account2.getBalance()).toBe(1500);

        // History của mỗi account riêng biệt
        const history1 = account1.getTransactionHistory();
        const history2 = account2.getTransactionHistory();
        
        expect(history1.length).toBe(3); // INITIAL + 2 deposits
        expect(history2.length).toBe(2); // INITIAL + 1 withdraw
        expect(history1.length).not.toBe(history2.length);
      });
    });

    describe('Edge Cases', () => {
      test('xử lý số thập phân chính xác', () => {
        const account = createBankAccount(100.50);
        account.deposit(50.25);
        account.withdraw(25.30);
        
        expect(account.getBalance()).toBeCloseTo(125.45, 2);
      });

      test('xử lý số rất lớn', () => {
        const account = createBankAccount(999999999);
        account.deposit(1);
        expect(account.getBalance()).toBe(1000000000);
      });

      test('xử lý nhiều giao dịch nhỏ', () => {
        const account = createBankAccount(100);
        
        for (let i = 0; i < 50; i++) {
          account.deposit(1);
        }

        expect(account.getBalance()).toBe(150);
        expect(account.getTransactionHistory()).toHaveLength(51); // INITIAL + 50 deposits
      });
    });
  });

  describe('createBankAccountWithLimit() - Advanced', () => {
    test('tạo account với daily limit mặc định', () => {
      const account = createBankAccountWithLimit(5000);
      expect(account.getBalance()).toBe(5000);
      
      const limitInfo = account.getDailyLimitInfo();
      expect(limitInfo.limit).toBe(1000);
    });

    test('tạo account với daily limit tùy chỉnh', () => {
      const account = createBankAccountWithLimit(5000, 2000);
      const limitInfo = account.getDailyLimitInfo();
      
      expect(limitInfo.limit).toBe(2000);
      expect(limitInfo.remaining).toBe(2000);
    });

    test('throw error khi rút quá daily limit', () => {
      const account = createBankAccountWithLimit(5000, 1000);
      
      account.withdraw(600); // OK
      
      // Rút thêm 500 sẽ vượt limit (600 + 500 > 1000)
      expect(() => account.withdraw(500)).toThrow('Daily withdrawal limit exceeded');
    });

    test('daily limit info được cập nhật sau mỗi lần rút', () => {
      const account = createBankAccountWithLimit(5000, 1000);
      
      account.withdraw(300);
      let info = account.getDailyLimitInfo();
      expect(info.withdrawn).toBe(300);
      expect(info.remaining).toBe(700);

      account.withdraw(200);
      info = account.getDailyLimitInfo();
      expect(info.withdrawn).toBe(500);
      expect(info.remaining).toBe(500);
    });

    test('có thể rút đúng bằng limit', () => {
      const account = createBankAccountWithLimit(5000, 1000);
      
      account.withdraw(1000);
      expect(account.getBalance()).toBe(4000);
      
      const info = account.getDailyLimitInfo();
      expect(info.remaining).toBe(0);
    });
  });
});
