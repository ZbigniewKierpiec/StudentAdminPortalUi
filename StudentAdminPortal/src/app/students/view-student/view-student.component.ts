import { MatSnackBar } from '@angular/material/snack-bar';
import { Gender } from './../../models/ui-models/gender.model';
import { GenderService } from './../../services/gender.service';
import { Student } from './../../models/ui-models/student.model';
import { StudentService } from './../student.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.scss'],
})
export class ViewStudentComponent implements OnInit {
  studentId: string | null | undefined;

  student: Student = {
    id: '',
    firstName: '',
    lastName: '',
    dateofBirth: '',
    email: '',
    mobile: 0,
    genderId: '',
    profileImageUrl: '',
    gender: {
      id: '',
      description: '',
    },
    address: {
      id: '',
      physicalAddress: '',
      postalAddress: '',
    },
  };
  isNewStudent = false;
  header = '';
  displayProfileImageUrl = ' ';
  genderList: Gender[] = [];

  @ViewChild('studentDetailForm') studentDetailForm?: NgForm;

  constructor(
    private readonly studentService: StudentService,
    private readonly route: ActivatedRoute,
    private readonly genderService: GenderService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.studentId = params.get('id');
      if (this.studentId) {
        if (this.studentId.toLowerCase() === 'Add'.toLowerCase()) {
          // If the route contains the 'Add'
          // -> new Student Functionality
          // New Student Functionality
          this.isNewStudent = true;
          this.header = 'Add New Student';
          this.setImage();
        } else {
          // Othervise
          //-> Existing Student Functionality

          this.isNewStudent = false;
          this.header = 'Edit Student';

          this.studentService.getStudent(this.studentId).subscribe(
            (successResponse) => {
              console.log(successResponse);
              this.student = successResponse;
              this.setImage();
            },
            (errorResponse) => {
              this.setImage();
            }
          );
        }
      }

      this.genderService.getGenderList().subscribe((successResponse) => {
        console.log(successResponse);
        this.genderList = successResponse;
      });
    });
  }

  onUpdate(): void {
    // Call Student Service to Update Student
    if (this.studentDetailForm?.form.valid) {
      this.studentService
        .updateStudent(this.student.id, this.student)
        .subscribe(
          (successResponse) => {
            // Show a notification
            this.snackbar.open('Student updated successfuly', undefined, {
              duration: 3000,
            });
          },
          (errorResponse) => {
            console.log(errorResponse)
          }
        );
    }
  }

  onDelete(): void {
    // student service to delete

    this.studentService.deleteStudent(this.student.id).subscribe(
      (successResponse) => {
        this.snackbar.open('Student delete successfully', undefined, {
          duration: 2000,
        });

        setTimeout(() => {
          this.router.navigateByUrl('students');
        }, 2000);
      },
      (errorResponse) => {
        console.log(errorResponse);
      }
    );
  }

  onAdd(): void {
    if (this.studentDetailForm?.form.valid) {
      // Submit Form date to api

      this.studentService.addStudent(this.student).subscribe(
        (successResponse) => {
          console.log(successResponse);

          this.snackbar.open('Student added successfully', undefined, {
            duration: 2000,
          });

          setTimeout(() => {
            this.router.navigateByUrl(`students/${successResponse.id}`);
          }, 2000);
        },
        (errorResponse) => {
          console.log(errorResponse);
        }
      );
    }
  }

  uploadImage(event: any): void {
    if (this.studentId) {
      const file: File = event.target.files[0];
      this.studentService.uploadImage(this.student.id, file).subscribe(
        (successResponse) => {
          this.student.profileImageUrl = successResponse;
          this.setImage();

          this.snackbar.open('Profile Image Updated', undefined, {
            duration: 2000,
          });
        },
        (errorResponse) => {}
      );
    }
  }

  private setImage(): void {
    if (this.student.profileImageUrl) {
      // Fetch the Image by url
      this.displayProfileImageUrl = this.studentService.getImagePath(
        this.student.profileImageUrl
      );
    } else {
      // Display a default
      this.displayProfileImageUrl = '/assets/profile.png';
    }
  }
}
