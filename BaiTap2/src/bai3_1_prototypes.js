/**
 * Bài 3.1: Object-Oriented Programming với Prototypes
 * 
 * Tạo các đối tượng Person và Student sử dụng prototype pattern
 */

/**
 * Constructor function Person
 * @param {string} name - Tên của người
 * @param {number} age - Tuổi của người
 */
function Person(name, age) {
  this.name = name;
  this.age = age;
}

/**
 * Giới thiệu bản thân
 * @returns {string} Lời giới thiệu
 */
Person.prototype.introduce = function() {
  return `Xin chào, tôi là ${this.name}, ${this.age} tuổi`;
};

/**
 * Tăng tuổi lên 1
 */
Person.prototype.haveBirthday = function() {
  this.age += 1;
};

/**
 * Constructor function Student kế thừa từ Person
 * @param {string} name - Tên của học sinh
 * @param {number} age - Tuổi của học sinh
 * @param {string} school - Trường học
 */
function Student(name, age, school) {
  // Gọi constructor Person để khởi tạo name và age
  Person.call(this, name, age);
  this.school = school;
}

// Thiết lập kế thừa prototype
Student.prototype = Object.create(Person.prototype);

// Sửa lại constructor
Student.prototype.constructor = Student;

/**
 * Thông tin về việc học
 * @returns {string} Thông tin học tập
 */
Student.prototype.study = function() {
  return `${this.name} đang học tại ${this.school}`;
};

// Export
module.exports = {
  Person,
  Student
};