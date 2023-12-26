import { Injectable } from '@angular/core';
import { Router } from '@angular/router'; // Import Router here
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly userKey = 'loggedInUser';
  private loggedInUsers: number = 0;
  private loggedInUsersSubject = new BehaviorSubject<number>(0);

  constructor(private router: Router) {}

  setLoggedInUser(user: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getLoggedInUser(): any {
    const userString = localStorage.getItem(this.userKey);
    return userString ? JSON.parse(userString) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getLoggedInUser();
  }

  login(user: any): void {
    this.setLoggedInUser(user);
    this.loggedInUsers++;
    this.loggedInUsersSubject.next(this.loggedInUsers);

  }

  logout(): void {
    this.setLoggedInUser(null);
    this.router.navigate(['/login'], { skipLocationChange: true });
    this.loggedInUsers--;
    this.loggedInUsersSubject.next(this.loggedInUsers);

  }
  loggedInUserCount$ = this.loggedInUsersSubject.asObservable();

  getLoggedInUsers(): number {
    return this.loggedInUsers;
  }
  
}
