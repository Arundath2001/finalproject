import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { HttpService } from '../../http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-empapplyleave',
  templateUrl: './empapplyleave.component.html',
  styleUrls: ['./empapplyleave.component.scss']
})
export class EmpapplyleaveComponent {
  newLeave: any = {
    startDate: '',
    endDate: '',
    reason: '',
    status: 'Pending'
  };

  constructor(private authService: AuthService, private httpService: HttpService, private router: Router) {}
  


  
  applyLeave() {
    const loggedInUser = this.authService.getLoggedInUser();
  
    if (loggedInUser) {
      this.httpService.getUser(loggedInUser.id).subscribe(
        (userData) => {
          if (userData) {
            const existingLeaveDetails = [...(userData.leaveDetails || [])];
  
            const newLid = this.generateNewLid(existingLeaveDetails);
  
            this.newLeave.Lid = newLid;
            this.newLeave.status = 'Pending';
  
            existingLeaveDetails.push(this.newLeave);
  
            const updatedUser = { ...userData, leaveDetails: existingLeaveDetails };
  
            this.httpService.updateUser(updatedUser).subscribe(() => {
              console.log('Leave applied successfully');
              this.router.navigate(['/employee']);
            });
          } else {
            console.error('User details not found.');
          }
        },
        (error) => {
          console.error('Error fetching user details:', error);
        }
      );
    } else {
      console.error('Logged-in user not found.');
    }
  }
  
  
  private calculateLeaveCounts(leave: any, userData: any): void {
    const startDate = new Date(leave.startDate);
    const endDate = new Date(leave.endDate);
    const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    const leaveDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    
    const months = [];
    let currentDate = startDate;
    while (currentDate <= endDate) {
      months.push(currentDate.getMonth() + 1); 
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  
    months.forEach((month) => {
      const monthName = this.getMonthName(month);
      if (userData.leaves && userData.leaves[monthName] !== undefined) {
        userData.leaves[monthName] += leaveDays;
      } else {
        userData.leaves = { ...userData.leaves, [monthName]: leaveDays };
      }
    });
  }
  
  private getMonthName(month: number): string {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return monthNames[month - 1];
  }
  
  private generateNewLid(leaveDetails: any[]): number {
    const existingLids = leaveDetails.map((leave) => leave.Lid);
    return Math.max(0, ...existingLids) + 1;
  }
  
}
