import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { HttpService } from '../../http.service';
import { Router } from '@angular/router';
import * as d3 from 'd3';

@Component({
  selector: 'app-empchart1',
  templateUrl: './empchart1.component.html',
  styleUrls: ['./empchart1.component.scss']
})
export class Empchart1Component {

  

  loggedInUser: any;
  userId: number | null = null;
  monthlyLeaveDetails: any[] = [];
  leaveDetails: any[] = []; 
  totalLeaves!: number;
  filteredLeaveDetails: any[] = [];
  
  casualLeaveData: any[] = [];
  sickLeaveData: any[] = [];
  earnedLeaveData: any[] = [];
  monthlyTotalLeaves: any[] = [];

  constructor(private authService: AuthService,private httpService: HttpService,private router: Router) {}

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

  fetchMonthlyLeaveDetails(): void {
    if (this.userId) {
      this.httpService.getUser(this.userId).subscribe(
        (userData: any) => {
          console.log('User Data:', userData);
  
          if (userData) {
            this.leaveDetails = userData.leaveDetails || [];
            console.log('Leave Details:', this.leaveDetails);
  
            const leaveTypesData = this.extractLeaveTypesData(this.leaveDetails);
  
            this.casualLeaveData = leaveTypesData.filter(item => item.leaveType === 'casual');
            this.sickLeaveData = leaveTypesData.filter(item => item.leaveType === 'sick');
            this.earnedLeaveData = leaveTypesData.filter(item => item.leaveType === 'earned');
  
            if (this.casualLeaveData.length === 0) {
              this.casualLeaveData.push({ leaveType: 'casual', value: 0 });
            }
  
            if (this.sickLeaveData.length === 0) {
              this.sickLeaveData.push({ leaveType: 'sick', value: 0 });
            }
  
            if (this.earnedLeaveData.length === 0) {
              this.earnedLeaveData.push({ leaveType: 'earned', value: 0 });
            }
  
            this.renderDoughnutChart(this.casualLeaveData, 'casualLeaveChart', 10);
            this.renderDoughnutChart(this.sickLeaveData, 'sickLeaveChart', 10);
            this.renderDoughnutChart(this.earnedLeaveData, 'earnedLeaveChart', 10);
          } else {
            console.log('User not found');
          }
        },
        (error: any) => {
          console.log('Error fetching user details:', error);
        }
      );
    } else {
      console.log('User ID is not available');
    }
  }
  
  
extractLeaveTypesData(leaveDetails: any[]): any[] {
  const leaveTypesData: any[] = [];

  leaveDetails.forEach(leave => {
    if (leave.leaveType) {
      const existingLeaveType = leaveTypesData.find(item => item.leaveType === leave.leaveType);

      if (existingLeaveType) {
        existingLeaveType.value += this.calculateLeaveForRow(leave);
      } else {
        leaveTypesData.push({ leaveType: leave.leaveType, value: this.calculateLeaveForRow(leave) });
      }
    }
  });

  return leaveTypesData;
}

  calculateLeaveForRow(leave: any): number {
    const startDate = new Date(leave.startDate);
    const endDate = new Date(leave.endDate);
    const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    const leaveDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    return leaveDays;
  }

  renderLeaveDetailsTable(leaveDetails: any[]): void {
    this.leaveDetails = leaveDetails;
  }
  calculateTotalLeaves(leaveDetails: any[]): number {
    return leaveDetails.reduce((total, leave) => total + leave.value, 0);
  }


  renderDoughnutChart(data: any[], chartId: string, totalLeaves: number): void {
    const chartContainer = document.getElementById(chartId);
    if (chartContainer) {
      chartContainer.innerHTML = '';
  
      const width = 215;
      const height = 210;
      const radius = Math.min(width, height) / 2;
  
      const svg = d3
        .select(`#${chartId}`)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);
  
      const usedAngle = (data[0].value / totalLeaves) * 2 * Math.PI;
      const remainingAngle = 2 * Math.PI - usedAngle;
  
      const usedArc = d3.arc<any>().outerRadius(radius - 10).innerRadius(radius - 20).startAngle(0).endAngle(usedAngle);
      const remainingArc = d3.arc<any>().outerRadius(radius - 10).innerRadius(radius - 20).startAngle(usedAngle).endAngle(2 * Math.PI);
  
      svg.append('path')
        .datum(data)
        .attr('d', usedArc)
        .attr('fill', 'blue'); 
  
      svg.append('path')
        .datum(data)
        .attr('d', remainingArc)
        .attr('fill', 'rgb(155, 155, 155)'); 
  
      
      svg
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .style('fill', '#333') 
        .text(`${data[0].value}/${totalLeaves}`);

        const labelOffsetX = radius + 30; 
        const labelOffsetY = 5; 
    
        const valuesContainer = document.createElement('div');
        valuesContainer.className = 'chart-info';
        
        const chartName = chartId === 'casualLeaveChart' ? 'Casual Leave' :
        chartId === 'sickLeaveChart' ? 'Sick Leave' :
        chartId === 'earnedLeaveChart' ? 'Earned Leave' :
        'Unknown Chart';

        valuesContainer.innerHTML = `
        <div>
          <h4>${chartName}</h4>
          <div style="display: flex; align-items: center;" >
           <span style="color: lightgrey; font-size: 1.4em; vertical-align: middle;">&#8226;</span> <p style="color: rgb(155, 155, 155);">Remaining: <span>${totalLeaves - data[0].value}</span></p>
          </div>

          <div style="display: flex; align-items: center;" >  
          <span style="color: blue; font-size: 1.4em; vertical-align: middle;">&#8226;</span> <p style="color: rgb(155, 155, 155);"> Used: <span>${data[0].value}</span></p>
          </div>

          <div style="display: flex; align-items: center;" >
          <span style="font-size: 1.5em; vertical-align: middle;">&#8226;</span> <p style="color: rgb(155, 155, 155);">Total: <span>${totalLeaves}</span></p>
          </div>

        </div>
      `;
      
    
        chartContainer.appendChild(valuesContainer);
        
    }

    
  }
}
