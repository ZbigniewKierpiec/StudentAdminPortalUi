import { Student } from './../models/ui-models/student.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentService } from './student.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];

  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'dateofBirth',
    'email',
    'mobile',
    'gender',
    'edit',
  ];

  dataSource: MatTableDataSource<Student> = new MatTableDataSource<Student>();
  @ViewChild(MatPaginator) matPaginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;
  filterString = '';
  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.studentService.getStudents().subscribe(
      (success) => {
        this.students = success;

        this.dataSource = new MatTableDataSource<Student>(this.students);
        if (this.matPaginator) {
          this.dataSource.paginator = this.matPaginator;
        }
        if (this.matSort) {
          this.dataSource.sort = this.matSort;
        }
      },
      (errorResponse) => {
        console.log(errorResponse);
      }
    );
  }

  filterStudents() {
    this.dataSource.filter = this.filterString.trim().toLocaleLowerCase();
  }
}
