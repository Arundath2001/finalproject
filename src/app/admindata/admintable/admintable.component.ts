import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { HttpService } from '../../http.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

interface LeaveDetail {
  Lid?: number;
  startDate: string;
  endDate: string;
  status: string;
  reason: string;
  leaveType?: string;
}
@Component({
  selector: 'app-admintable',
  templateUrl: './admintable.component.html',
  styleUrls: ['./admintable.component.scss']
})
export class AdmintableComponent {

  loggedInUser: any;
  users: any[] = [];
  leaveData: any[] = []; 
  private data: any[] = [];
  private svg: any;
  private xScale: any;
  private yScale: any;
  public selectedMonth: string = '';
  public selectedUser: string = '';
  searchTerm: string = '';
  public leaveTypes: string[] = ['sick', 'casual', 'earned'];


  constructor(private httpService: HttpService,private router: Router,private authService: AuthService) {
    this.refreshTable();

  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login'], { skipLocationChange: true });
  }

  ngOnInit(): void {
    const loggedInUsername = 'user1'; 
  
    this.httpService.getUsers().subscribe(
      (data) => {
        console.log('Fetched data:', data);
  
        const loggedInUser = data.find((user: any) => user.username === loggedInUsername);
  
        this.data = data.filter((userData: any) => userData.username !== loggedInUsername);
  
        this.users = this.data; 
        this.loggedInUser = loggedInUser; 

      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }
  

  ngAfterViewInit() {
    this.httpService.getUsers().subscribe(users => {
      const userData = users.filter((user: { rank: string; }) => user.rank !== 'hr');

      const activeUsers = users.filter((user: { rank: string; active: any; }) => user.rank !== 'hr' && user.active).length;
      const inactiveUsers = users.filter((user: { rank: string; active: any; }) => user.rank !== 'hr' && !user.active).length;

    });
  }

  updateLeaveStatusWithLeaveType(user: any, leaveDetail: LeaveDetail): void {
    leaveDetail.leaveType = leaveDetail.leaveType || 'sick';  
  
    this.httpService.updateUser(user).subscribe(() => {
      console.log('Leave status and type updated!');
    });
  }


approveLeave(user: any, leaveDetail: any): void {
  if (!leaveDetail.leaveType) {
    Swal.fire({
      title: 'Error!',
      text: 'Please select a leave type before approving the leave.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
    return; 
  }

  Swal.fire({
    title: 'Approve Leave',
    text: 'Are you sure you want to approve this leave?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, approve it!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      leaveDetail.status = 'Approved';
      this.updateLeaveStatus(user);

      this.updateMonthlyLeaveCount(user, leaveDetail);

      Swal.fire({
        title: 'Leave Approved!',
        text: 'Leave has been approved successfully.',
        icon: 'success',
        html: 'To view full leave details, <a href="/view-leave-details">click here</a>',
        confirmButtonText: 'OK'
      });
    }
  });
}


private updateMonthlyLeaveCount(user: any, leaveDetail: any): void {
  const startDate = new Date(leaveDetail.startDate);
  const endDate = new Date(leaveDetail.endDate);
  const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
  const leaveDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

  const months = [];
  let currentDate = startDate;
  while (currentDate <= endDate) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    
    const monthKey = `${month}-${year}`;

    months.push(monthKey);
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  months.forEach((monthKey) => {
    if (user.leaves && user.leaves[monthKey] !== undefined) {
      user.leaves[monthKey] += leaveDays;
    } else {
      user.leaves = { ...user.leaves, [monthKey]: leaveDays };
    }
  });

  this.httpService.updateUser(user).subscribe(() => {
    console.log('Monthly leave count updated for approved leave!');
  });
}


private getMonthName(month: number): string {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return monthNames[month - 1];
}



rejectLeave(user: any, leaveDetail: any): void {
  Swal.fire({
    title: 'Reject Leave',
    text: 'Are you sure you want to reject this leave?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, reject it!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      leaveDetail.status = 'Rejected';
      this.updateLeaveStatus(user);

      Swal.fire({
        title: 'Leave Rejected!',
        text: 'Leave has been rejected.',
        icon: 'success',
        html: 'To view full leave details, <a href="/view-leave-details">click here</a>',
        confirmButtonText: 'OK'
      });
    }
  });
}

  private updateLeaveStatus(user: any): void {
    this.httpService.updateUser(user).subscribe(() => {
      console.log('Leave status updated!');
    });
  }

  private refreshTable(): void {

    this.httpService.getUsers().subscribe(
      (data) => {
        this.leaveData = data;
        console.log('Table data refreshed successfully');
      },
      (error) => {
        console.error('Error refreshing table data', error);
      }
    );
  }

  get filteredLeaveData(): any[] {
    const term = this.searchTerm.toLowerCase();
    const filteredData = this.leaveData.filter((user) =>
      (user.username.toLowerCase().includes(term) || user.id.toString().includes(term)) &&
      user.rank !== 'hr' &&
      user.leaveDetails.some((leave: any) => leave.status === 'Pending')
    );
  
    return filteredData;
  }
  
  
  

  getTotalLeavesStyle(totalLeaves: number): any {
    if (totalLeaves >= 10) {
      return { 'color': 'red' };
    } else if (totalLeaves >= 5 && totalLeaves < 10) {
      return { 'color': 'yellow' };
    } else {
      return { 'color': 'green' };
    }
  }
  
  calculateTotalLeaves(user: any): number {
    if (user && user.leaveDetails) {
      return user.leaveDetails.reduce((totalLeaves: number, leave: any) => {
        const startDate = new Date(leave.startDate);
        const endDate = new Date(leave.endDate);
        const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
        const leaveDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
        return totalLeaves + leaveDays;
      }, 0);
    }
    return 0;
  }

calculateRowTotalLeaves(leave: any): number {
  if (!leave || !leave.leaveDetails || !Array.isArray(leave.leaveDetails)) {
    console.error('Invalid leave object:', leave);
    return 0; 
  }

  const totalLeaveDays = leave.leaveDetails.reduce((total: number, detail: { startDate: string | number | Date; endDate: string | number | Date; }) => {
    if (detail.startDate && detail.endDate) {
      const startDate = new Date(detail.startDate);
      const endDate = new Date(detail.endDate);
      const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
      const leaveDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
      return total + leaveDays;
    }
    return total;
  }, 0);


  return totalLeaveDays;
}



  
  updateMessage(employeeId: number): void {
    Swal.fire({
      title: 'Enter new message',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const newMessage = result.value;
        this.httpService.updateMessage(employeeId, newMessage).subscribe(
          () => {
            console.log('Message updated in db.json');
          },
          (error) => {
            console.error('Error updating message:', error);
          }
        );
      }
    });
  }
  
  isButtonActive(totalLeaves: number): boolean {
    return totalLeaves >= 10;
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
  


  
}
