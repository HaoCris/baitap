/**
 * Bài 1.2: Private Variables với Closure
 * 
 * Sử dụng closure để tạo tài khoản ngân hàng với private state
 * Balance và transaction history không thể truy cập trực tiếp từ bên ngoài
 */

/**
 * Tạo tài khoản ngân hàng với các chức năng cơ bản
 * Sử dụng closure để bảo vệ balance và transaction history
 * 
 * @param {number} [initialBalance=0] - Số dư ban đầu của tài khoản
 * @returns {Object} Object chứa các methods: deposit, withdraw, getBalance, getTransactionHistory
 * 
 * @example
 * const account = createBankAccount(1000);
 * account.deposit(500);          // Gửi 500
 * account.withdraw(200);         // Rút 200
 * console.log(account.getBalance()); // 1300
 * console.log(account.getTransactionHistory()); // Xem lịch sử
 */
function createBankAccount(initialBalance) {
  // Validate initial balance - phải là số và không âm
  // Nếu không truyền tham số hoặc undefined, dùng giá trị mặc định là 0
  if (initialBalance === undefined) {
    initialBalance = 0;
  }
  
  if (typeof initialBalance !== 'number' || isNaN(initialBalance)) {
    throw new Error('Initial balance must be a valid number');
  }
  if (initialBalance < 0) {
    throw new Error('Initial balance cannot be negative');
  }

  // Private variables - chỉ truy cập được thông qua closure
  let balance = initialBalance; // Số dư hiện tại
  let transactionHistory = []; // Mảng lưu lịch sử giao dịch

  // Thêm giao dịch khởi tạo nếu có số dư ban đầu
  if (initialBalance > 0) {
    transactionHistory.push({
      type: 'INITIAL',
      amount: initialBalance,
      balance: balance,
      timestamp: new Date().toISOString(),
      description: 'Initial balance'
    });
  }

  /**
   * Hàm helper để thêm giao dịch vào lịch sử
   * @private
   */
  const addTransaction = (type, amount, description) => {
    transactionHistory.push({
      type,           // Loại giao dịch: DEPOSIT, WITHDRAW
      amount,         // Số tiền giao dịch
      balance,        // Số dư sau giao dịch
      timestamp: new Date().toISOString(), // Thời gian giao dịch
      description     // Mô tả
    });
  };

  // Trả về object chứa các public methods
  return {
    /**
     * Gửi tiền vào tài khoản
     * Chỉ chấp nhận số tiền dương
     * 
     * @param {number} amount - Số tiền muốn gửi
     * @returns {number} Số dư mới sau khi gửi tiền
     * @throws {Error} Nếu amount không hợp lệ
     * 
     * @example
     * account.deposit(500); // Gửi 500 vào tài khoản
     */
    deposit(amount) {
      // Validate amount
      if (typeof amount !== 'number' || isNaN(amount)) {
        throw new Error('Deposit amount must be a valid number');
      }
      
      // Chỉ chấp nhận số dương
      if (amount <= 0) {
        throw new Error('Deposit amount must be positive');
      }

      // Cập nhật balance
      balance += amount;

      // Lưu lại giao dịch vào history
      addTransaction('DEPOSIT', amount, `Deposited ${amount}`);

      // Trả về số dư mới
      return balance;
    },

    /**
     * Rút tiền từ tài khoản
     * Không cho phép rút quá số dư hiện có
     * 
     * @param {number} amount - Số tiền muốn rút
     * @returns {number} Số dư mới sau khi rút tiền
     * @throws {Error} Nếu amount không hợp lệ hoặc vượt quá số dư
     * 
     * @example
     * account.withdraw(200); // Rút 200 từ tài khoản
     */
    withdraw(amount) {
      // Validate amount
      if (typeof amount !== 'number' || isNaN(amount)) {
        throw new Error('Withdraw amount must be a valid number');
      }

      // Chỉ chấp nhận số dương
      if (amount <= 0) {
        throw new Error('Withdraw amount must be positive');
      }

      // Kiểm tra số dư - không cho rút quá số dư hiện có
      if (amount > balance) {
        throw new Error('Insufficient balance');
      }

      // Cập nhật balance
      balance -= amount;

      // Lưu lại giao dịch vào history
      addTransaction('WITHDRAW', amount, `Withdrew ${amount}`);

      // Trả về số dư mới
      return balance;
    },

    /**
     * Xem số dư hiện tại của tài khoản
     * 
     * @returns {number} Số dư hiện tại
     * 
     * @example
     * const currentBalance = account.getBalance();
     * console.log(currentBalance); // 1300
     */
    getBalance() {
      return balance;
    },

    /**
     * Lấy lịch sử giao dịch
     * Trả về bản copy của history để tránh bị modify từ bên ngoài
     * 
     * @returns {Array} Mảng chứa các giao dịch đã thực hiện
     * 
     * @example
     * const history = account.getTransactionHistory();
     * console.log(history);
     * // [
     * //   { type: 'DEPOSIT', amount: 500, balance: 1500, timestamp: '...', description: '...' },
     * //   { type: 'WITHDRAW', amount: 200, balance: 1300, timestamp: '...', description: '...' }
     * // ]
     */
    getTransactionHistory() {
      // Trả về copy của array để bảo vệ private data
      // Sử dụng map để tạo copy của từng object trong array
      return transactionHistory.map(transaction => ({...transaction}));
    }
  };
}

/**
 * Tạo tài khoản ngân hàng có giới hạn rút tiền hàng ngày
 * Advanced version với daily withdrawal limit
 * 
 * @param {number} [initialBalance=0] - Số dư ban đầu
 * @param {number} [dailyLimit=1000] - Giới hạn rút tiền mỗi ngày
 * @returns {Object} Bank account object với daily limit
 */
function createBankAccountWithLimit(initialBalance = 0, dailyLimit = 1000) {
  // Tạo base account
  const baseAccount = createBankAccount(initialBalance);
  
  // Private variables cho daily limit
  let dailyWithdrawn = 0;
  let lastResetDate = new Date().toDateString();

  // Reset daily limit nếu qua ngày mới
  const checkAndResetDailyLimit = () => {
    const today = new Date().toDateString();
    if (today !== lastResetDate) {
      dailyWithdrawn = 0;
      lastResetDate = today;
    }
  };

  // Override withdraw method
  const originalWithdraw = baseAccount.withdraw;
  baseAccount.withdraw = function(amount) {
    checkAndResetDailyLimit();

    // Kiểm tra daily limit
    if (dailyWithdrawn + amount > dailyLimit) {
      throw new Error(`Daily withdrawal limit exceeded. Limit: ${dailyLimit}, Already withdrawn today: ${dailyWithdrawn}`);
    }

    // Gọi original withdraw
    const result = originalWithdraw(amount);

    // Cập nhật daily withdrawn
    dailyWithdrawn += amount;

    return result;
  };

  // Thêm method mới để xem daily limit
  baseAccount.getDailyLimitInfo = function() {
    checkAndResetDailyLimit();
    return {
      limit: dailyLimit,
      withdrawn: dailyWithdrawn,
      remaining: dailyLimit - dailyWithdrawn
    };
  };

  return baseAccount;
}

// Export các functions
module.exports = {
  createBankAccount,
  createBankAccountWithLimit
};
