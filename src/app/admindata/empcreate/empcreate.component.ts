import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-empcreate',
  templateUrl: './empcreate.component.html',
  styleUrls: ['./empcreate.component.scss']
})
export class EmpcreateComponent implements OnInit {
  userForm!: FormGroup;

  constructor(private fb: FormBuilder, private httpService: HttpService, private router: Router) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      rank: this.fb.group({
        admin: [false],
        employee: [false],
      }, { validators: this.rankCheckboxValidator }),
      password: ['', Validators.required],
      active: [true, Validators.required],
      role: ['', Validators.required],
      age: [0, Validators.required],
      dob: ['', Validators.required],
      image: [''],
      bloodGroup: [''],
      gender: [''],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: [''],
    });
  }
  

  onSubmit(): void {
    if (this.userForm.valid) {
      const newUser = this.userForm.value;

      if (newUser.rank.admin) {
        newUser.rank = 'admin';
      } else if (newUser.rank.employee) {
        newUser.rank = 'employee';
      }

      this.checkForDuplicates(newUser).then((isDuplicate) => {
        if (!isDuplicate) {
          newUser.totalNumberOfLeaves = 0;
          newUser.leaves = [];

          this.httpService.addEmployee(newUser).subscribe(
            () => {
              console.log('User added successfully');
              Swal.fire('Success', 'User added successfully', 'success').then(() => {
                this.router.navigate(['/emptable']); 
              });
            },
            (error) => {
              console.error('Error adding user:', error);
              Swal.fire('Error', 'Unable to add user. Please try again.', 'error');
            }
          );
        } else {
          Swal.fire('Error', 'Duplicate entry found. Please check username, email, and phone number.', 'error');
        }
      });
    }
  }

  rankCheckboxValidator(group: FormGroup | null): { [key: string]: boolean } | null {
    if (!group) {
      return { invalidFormGroup: true };
    }

    const admin = group.get('admin');
    const employee = group.get('employee');

    if (!admin || !employee) {
      return { invalidFormControl: true };
    }

    const adminValue = admin.value;
    const employeeValue = employee.value;

    return adminValue || employeeValue ? null : { rankInvalid: true };
  }

  onImageFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.userForm.patchValue({
          image: e.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
  }

private async checkForDuplicates(user: any): Promise<boolean> {
  const isUsernameDuplicate = await this.httpService.isDuplicate(user.username, 'username').toPromise() || false;
  const isEmailDuplicate = await this.httpService.isDuplicate(user.email, 'email').toPromise() || false;
  const isPhoneNumberDuplicate = await this.httpService.isDuplicate(user.mobileNumber, 'mobileNumber').toPromise() || false;

  return isUsernameDuplicate || isEmailDuplicate || isPhoneNumberDuplicate;
}

}
