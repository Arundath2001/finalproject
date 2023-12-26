import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-logincount',
  templateUrl: './logincount.component.html',
  styleUrls: ['./logincount.component.scss']
})
export class LogincountComponent {
  loggedInUserCount: number = 0;
  totalEmployeeCount: number = 0;

  constructor(private authService: AuthService, private httpService: HttpService) {}

  ngOnInit(): void {
    this.updateLoggedInUserCount();
    this.updateTotalEmployeeCount();

    this.authService.loggedInUserCount$.subscribe(() => {
      this.updateLoggedInUserCount();
    });
  }

  private updateLoggedInUserCount(): void {
    this.loggedInUserCount = this.authService.getLoggedInUsers();
  }

  private updateTotalEmployeeCount(): void {
    this.httpService.getTotalUsersCount().subscribe(
      (totalEmployees) => (this.totalEmployeeCount = totalEmployees),
      (error) => console.error('Error fetching total employee count:', error)
    );
  }
}
