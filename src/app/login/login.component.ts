import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const username = this.username!.value;
      const password = this.password!.value;
  
      this.httpService.getUserByUsernameAndPassword(username, password).subscribe(
        (user) => {
          if (user) {
            this.loginError = false;
  
            if (user.rank === 'admin') {
              this.authService.setLoggedInUser(user);
              this.router.navigate(['/admin']);
            } else if (user.rank === 'employee') {
              this.authService.setLoggedInUser(user);
              this.router.navigate(['/employee']);
            }
  
            this.loginForm.reset();
          } else {
            this.loginError = true;
          }
        },
        (error) => {
          console.error('Error in login:', error);
          this.loginError = true;
        }
      );
    }
  }
  
}


