import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { HttpService } from '../../http.service';
import { Router } from '@angular/router';
import * as d3 from 'd3';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-empleavetable',
  templateUrl: './empleavetable.component.html',
  styleUrls: ['./empleavetable.component.scss']
})
export class EmpleavetableComponent implements OnInit {
  loggedInUser: any;
  userId: number | null = null;
  monthlyLeaveDetails: any[] = []; 
  leaveDetails: any[] = []; 
  totalLeaves!: number;
  filteredLeaveDetails: any[] = [];

  constructor(private authService: AuthService, private httpService: HttpService, private router: Router) {}

  ngOnInit(): void {
    this.loggedInUser = this.authService.getLoggedInUser();

    if (this.loggedInUser) {
      this.userId = this.loggedInUser.id;
      this.fetchMonthlyLeaveDetails(); 
    } else {
      console.error('User not logged in');
    }
  }

  ngAfterViewInit(): void {
    console.log('Calling fetchMonthlyLeaveDetails...');
    this.fetchMonthlyLeaveDetails();
  }

  getLeaveCountStyle(totalLeaves: number): any {
    if (totalLeaves >= 10) {
      return { 'color': 'red' };
    } else if (totalLeaves >= 5 && totalLeaves < 10) {
      return { 'color': 'yellow' };
    } else if (totalLeaves < 5) {
      return { 'color': 'green' };
    } else {
      return { 'color': 'black' }; 
    }
  }

  getMonthName(month: number): string {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return monthNames[month - 1];
  }

  fetchMonthlyLeaveDetails(): void {
    if (this.userId) {
      this.httpService.getUser(this.userId).subscribe(
        (userData: any) => {
          console.log('User Data:', userData);

          if (userData) {
            this.leaveDetails = userData.leaveDetails || [];
            console.log('Leave Details:', this.leaveDetails);

            this.renderLeaveDetailsTable(this.leaveDetails);

            const leavesArray = Object.entries(userData.leaves).map(([month, value]) => ({ month, value }));

            this.monthlyLeaveDetails = leavesArray || [];
            console.log('Monthly Leave Details:', this.monthlyLeaveDetails);

            this.totalLeaves = this.calculateTotalLeaves(this.monthlyLeaveDetails);

            this.leaveDetails.forEach(leave => {
              leave.totalLeaves = userData.leaves[this.getMonthName(new Date(leave.startDate).getMonth() + 1)] || 0;
            });
          } else {
            console.error('User not found');
          }
        },
        (error: any) => {
          console.error('Error fetching user details:', error);
        }
      );
    } else {
      console.error('User ID is not available');
    }
  }

  calculateLeaveForRow(leave: any): number {
    const startDate = new Date(leave.startDate);
    const endDate = new Date(leave.endDate);
    const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    const leaveDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    return leaveDays;
  }

  renderLeaveDetailsTable(leaveDetails: any[]): void {
    this.leaveDetails = leaveDetails.map(leave => {
      if (leave.status === 'Rejected') {
        return { ...leave, totalLeaves: 0 };
      } else {
        return leave;
      }
    });
  }
  

  calculateTotalLeaves(leaveDetails: any[]): number {
    const approvedLeaves = leaveDetails.filter(leave => leave.status !== 'Rejected');
    return approvedLeaves.reduce((total, leave) => total + leave.value, 0);
  }
  

  flattenLeaveDetails(users: any[]): any[] {
    const result: any[] = [];
    users.forEach(user => {
      const userLeaves = user.leaves || {};
      Object.entries(userLeaves).forEach(([month, value]) => {
        result.push({ username: user.username, month, value });
      });
    });
    return result;
  }
}
