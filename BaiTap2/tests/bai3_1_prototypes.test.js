/**
 * Unit Tests cho Bài 3.1: Prototypes
 */

const { Person, Student } = require('../src/bai3_1_prototypes');

describe('Bài 3.1: Prototypes', () => {

  describe('Person', () => {
    
    test('khởi tạo Person với name và age', () => {
      const person = new Person('Alice', 25);
      
      expect(person.name).toBe('Alice');
      expect(person.age).toBe(25);
    });

    test('introduce() trả về lời giới thiệu đúng format', () => {
      const person = new Person('Bob', 30);
      
      expect(person.introduce()).toBe('Xin chào, tôi là Bob, 30 tuổi');
    });

    test('haveBirthday() tăng tuổi lên 1', () => {
      const person = new Person('Charlie', 20);
      
      person.haveBirthday();
      expect(person.age).toBe(21);
      
      person.haveBirthday();
      expect(person.age).toBe(22);
    });

    test('nhiều Person instances độc lập', () => {
      const person1 = new Person('Alice', 25);
      const person2 = new Person('Bob', 30);
      
      person1.haveBirthday();
      
      expect(person1.age).toBe(26);
      expect(person2.age).toBe(30);
    });

    test('methods nằm trên prototype, không phải instance', () => {
      const person = new Person('Test', 20);
      
      expect(person.hasOwnProperty('introduce')).toBe(false);
      expect(person.hasOwnProperty('haveBirthday')).toBe(false);
      expect(Person.prototype.hasOwnProperty('introduce')).toBe(true);
      expect(Person.prototype.hasOwnProperty('haveBirthday')).toBe(true);
    });

    test('instanceof hoạt động đúng', () => {
      const person = new Person('Test', 20);
      
      expect(person instanceof Person).toBe(true);
      expect(person instanceof Object).toBe(true);
    });
  });

  describe('Student', () => {
    
    test('khởi tạo Student với name, age, school', () => {
      const student = new Student('David', 18, 'MIT');
      
      expect(student.name).toBe('David');
      expect(student.age).toBe(18);
      expect(student.school).toBe('MIT');
    });

    test('Student kế thừa methods từ Person', () => {
      const student = new Student('Eve', 19, 'Harvard');
      
      expect(student.introduce()).toBe('Xin chào, tôi là Eve, 19 tuổi');
    });

    test('Student có thể gọi haveBirthday()', () => {
      const student = new Student('Frank', 17, 'Stanford');
      
      student.haveBirthday();
      expect(student.age).toBe(18);
    });

    test('study() trả về thông tin học tập', () => {
      const student = new Student('Grace', 20, 'Oxford');
      
      expect(student.study()).toBe('Grace đang học tại Oxford');
    });

    test('Student method không ảnh hưởng Person', () => {
      const person = new Person('John', 30);
      
      expect(person.study).toBeUndefined();
    });

    test('instanceof hoạt động đúng với inheritance', () => {
      const student = new Student('Test', 20, 'School');
      
      expect(student instanceof Student).toBe(true);
      expect(student instanceof Person).toBe(true);
      expect(student instanceof Object).toBe(true);
    });

    test('constructor được set đúng', () => {
      const student = new Student('Test', 20, 'School');
      
      expect(student.constructor).toBe(Student);
      expect(student.constructor).not.toBe(Person);
    });

    test('Student và Person có prototype chain riêng', () => {
      const person = new Person('Alice', 25);
      const student = new Student('Bob', 20, 'MIT');
      
      expect(Object.getPrototypeOf(student)).toBe(Student.prototype);
      expect(Object.getPrototypeOf(Object.getPrototypeOf(student))).toBe(Person.prototype);
    });
  });

  describe('Prototype Chain', () => {
    
    test('Student.prototype kế thừa từ Person.prototype', () => {
      expect(Object.getPrototypeOf(Student.prototype)).toBe(Person.prototype);
    });

    test('có thể thêm methods mới vào Student không ảnh hưởng Person', () => {
      Student.prototype.graduate = function() {
        return `${this.name} đã tốt nghiệp`;
      };
      
      const student = new Student('Test', 22, 'School');
      const person = new Person('Test2', 30);
      
      expect(student.graduate()).toBe('Test đã tốt nghiệp');
      expect(person.graduate).toBeUndefined();
      
      // Cleanup
      delete Student.prototype.graduate;
    });

    test('có thể override methods từ parent', () => {
      // Tạo class mới để test
      function SpecialStudent(name, age, school) {
        Student.call(this, name, age, school);
      }
      SpecialStudent.prototype = Object.create(Student.prototype);
      SpecialStudent.prototype.constructor = SpecialStudent;
      
      // Override introduce
      SpecialStudent.prototype.introduce = function() {
        return `Hi, I'm ${this.name}`;
      };
      
      const special = new SpecialStudent('Test', 20, 'School');
      expect(special.introduce()).toBe('Hi, I\'m Test');
    });
  });

  describe('Integration Tests', () => {
    
    test('kịch bản thực tế với Person', () => {
      const person = new Person('Alice', 25);
      
      expect(person.introduce()).toBe('Xin chào, tôi là Alice, 25 tuổi');
      
      person.haveBirthday();
      expect(person.introduce()).toBe('Xin chào, tôi là Alice, 26 tuổi');
      
      person.haveBirthday();
      person.haveBirthday();
      expect(person.age).toBe(28);
    });

    test('kịch bản thực tế với Student', () => {
      const student = new Student('Bob', 18, 'MIT');
      
      expect(student.introduce()).toBe('Xin chào, tôi là Bob, 18 tuổi');
      expect(student.study()).toBe('Bob đang học tại MIT');
      
      student.haveBirthday();
      expect(student.introduce()).toBe('Xin chào, tôi là Bob, 19 tuổi');
    });

    test('nhiều students độc lập', () => {
      const student1 = new Student('Alice', 18, 'MIT');
      const student2 = new Student('Bob', 19, 'Harvard');
      const student3 = new Student('Charlie', 20, 'Stanford');
      
      student1.haveBirthday();
      
      expect(student1.age).toBe(19);
      expect(student2.age).toBe(19);
      expect(student3.age).toBe(20);
      
      expect(student1.study()).toBe('Alice đang học tại MIT');
      expect(student2.study()).toBe('Bob đang học tại Harvard');
      expect(student3.study()).toBe('Charlie đang học tại Stanford');
    });
  });
});
