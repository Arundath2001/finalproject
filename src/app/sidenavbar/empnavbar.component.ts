import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-empnavbar',
  templateUrl: './empnavbar.component.html',
  styleUrls: ['./empnavbar.component.scss']
})
export class EmpnavbarComponent implements OnInit {
  loggedInUser: any;
  dashboardLink!: string;
  isMobileContentVisible: boolean = false;


  constructor(private authService: AuthService, private router: Router) {
    this.loggedInUser = this.authService.getLoggedInUser();
    this.dashboardLink = this.loggedInUser.rank === 'admin' ? '/admin' : '/employee';
  }

  toggleMobileContent() {
    this.isMobileContentVisible = !this.isMobileContentVisible;
  }

  ngOnInit(): void {}

  openChat(): void {
    if (this.loggedInUser.rank === 'employee') {
      Swal.fire({
        icon: 'info',
        title: 'Message From HR:',
        text: this.loggedInUser.message,
        confirmButtonText: 'OK'
      });
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Admin Message',
        text: 'Admins do not have messages.',
        confirmButtonText: 'OK'
      });
    }
  }

  navigateToDashboard(): void {
    if (this.loggedInUser.rank === 'employee') {
      this.router.navigate(['/employee']); 
    } else if (this.loggedInUser.rank === 'admin') {
      this.router.navigate(['/admin']); 
    }
  }

  navigateToEmpApplyLeave(): void {
    this.router.navigate(['/empapplyleave']);
  }

  navigateToDetails(): void {
    const detailsLink = this.loggedInUser.rank === 'admin' ? '/admindetails' : '/empdetails';
    this.router.navigate([detailsLink, this.loggedInUser.id]);
  }

  navigateToEmployeeCreate(): void {
    // Navigate to /empcreate for admins
    this.router.navigate(['/empcreate']);
  }

  navigateToEmployeeTable(): void {
    // Navigate to /emptable for admins
    this.router.navigate(['/emptable']);
  }

  logout(): void {
    this.authService.logout();
  }
}
