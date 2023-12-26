import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../auth.service';
import { HttpService } from '../http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls : ['./changepassword.component.scss'],
})
export class ChangepasswordComponent implements OnInit {
  userId!: number;
  changePasswordForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private httpService: HttpService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.changePasswordForm = this.formBuilder.group({
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          this.passwordFormatValidator(),
        ],
      ],
    });
  }

  ngOnInit() {
    const loggedInUser = this.authService.getLoggedInUser();

    this.userId = loggedInUser ? loggedInUser.id : null;
  }

  navigateToHome() {
    const loggedInUser = this.authService.getLoggedInUser();

    if (loggedInUser && loggedInUser.rank === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/employee']);
    }
  }

  private passwordFormatValidator() {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: string = control.value;

      if (!/[a-zA-Z]/.test(value) || !/\d/.test(value)) {
        return { 'invalidPasswordFormat': true };
      }

      return null;
    };
  }

  updatePassword() {
    if (this.changePasswordForm.valid && this.userId) {
      const phoneNumber = this.changePasswordForm.get('phoneNumber')!.value;
      const newPassword = this.changePasswordForm.get('newPassword')!.value;

      if (/^\d{10}$/.test(phoneNumber)) {
        this.httpService.checkPhoneNumber(this.userId, phoneNumber).subscribe(
          (isMatch) => {
            if (isMatch) {
              this.httpService.updatePassword(this.userId, newPassword).subscribe(
                (updatedUser) => {
                  if (updatedUser) {
                    Swal.fire({
                      icon: 'success',
                      title: 'Password Updated!',
                      text: 'Your password has been successfully updated.',
                    });

                    this.router.navigate(['/login']);
                  } else {
                    Swal.fire({
                      icon: 'error',
                      title: 'Failed to Update Password',
                      text: 'There was an error updating your password. Please try again.',
                    });
                  }
                },
                (error) => {
                  console.error('Error updating password:', error);
                  Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An error occurred. Please try again later.',
                  });
                }
              );
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Invalid Phone Number',
                text: 'The provided phone number does not match the one on record.',
              });
            }
          },
          (error) => {
            console.error('Error checking phone number:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'An error occurred while checking the phone number. Please try again later.',
            });
          }
        );
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Phone Number',
          text: 'Please provide a valid phone number.',
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Input',
        text: 'Please provide valid input for the phone number and new password.',
      });
    }
  }
}
