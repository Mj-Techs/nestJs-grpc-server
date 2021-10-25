import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  IStudentResponse,
  studentById,
  UpdateStudent,
} from './interface/students.interface';
import { students } from './db';
import { v4 as uuid } from 'uuid';

@Controller()
export class AppController {
  private students = students;
  @GrpcMethod('StudentController', 'GetStudent')
  getStudent(data: studentById): IStudentResponse {
    return students.find((student) => student.id === data.id);
  }

  @GrpcMethod('StudentController', 'CreateStudent')
  createStudent(body: IStudentResponse): IStudentResponse {
    const newStudent = {
      id: uuid(),
      ...body,
    };

    this.students.push(newStudent);
    return newStudent;
  }

  @GrpcMethod('StudentController', 'UpdateStudent')
  updateStudent(body: UpdateStudent): IStudentResponse {
    let updatedStudent: IStudentResponse;
    const updatedStudentList = students.map((student) => {
      if (student.id === body.id) {
        updatedStudent = {
          id: body.id,
          ...body,
        };
        return updatedStudent;
      } else {
        return student;
      }
    });
    this.students = updatedStudentList;
    return updatedStudent;
  }

  @GrpcMethod('StudentController', 'RemoveStudent')
  removeStudent(data: studentById): IStudentResponse {
    const studentIndex = students.findIndex(
      (student) => student.id === data.id,
    );
    const student = students[studentIndex];
    students.splice(studentIndex);
    return student;
  }
}
