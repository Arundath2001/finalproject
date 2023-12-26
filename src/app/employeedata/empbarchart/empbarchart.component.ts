import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { HttpService } from '../../http.service';
import { Router } from '@angular/router';
import * as d3 from 'd3';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-empbarchart',
  templateUrl: './empbarchart.component.html',
  styleUrls: ['./empbarchart.component.scss']
})
export class EmpbarchartComponent {
  loggedInUser: any;
  userId: number | null = null;
  monthlyLeaveDetails: any[] = []; 
  selectedYear: number = 2023;
  leaveDetails: any[] = []; 
  totalLeaves!: number;
  filteredLeaveDetails: any[] = [];
  showDropdown: boolean = false;
  
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

            this.monthlyTotalLeaves = Object.entries(userData.leaves).map(([month, value]) => ({
              month: this.getMonthName(parseInt(month)),
              value: value
            }));
            console.log('Monthly Total Leaves:', this.monthlyTotalLeaves);
            this.renderBarChart(this.monthlyLeaveDetails);

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

  onYearChange(selectedYear: number): void {
    this.selectedYear = selectedYear;
    this.fetchMonthlyLeaveDetails(); 
  }
  
renderBarChart(data: any[]): void {
  const chartContainer = document.getElementById('chartContainer');
  if (chartContainer) {
    chartContainer.innerHTML = '';

    const margin = { top: 10, right: 10, bottom: 20, left: 30 };
    const width = 300 - margin.left - margin.right;
    const height = 230 - margin.top - margin.bottom;
    
    const svg = d3
      .select('#chartContainer')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const x = d3.scaleBand().range([0, width]).padding(0.1);
    const y = d3.scaleLinear().range([height, 0]);
    
    x.domain(data.map(d => d.month));
    y.domain([0, d3.max(data, d => d.value)]);
    
    svg
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.month) || 0)
      .attr('y', d => y(d.value))
      .attr('height', d => height - y(d.value))
      .attr('width', x.bandwidth() - 5)
      .attr('fill', 'steelblue') 
      .attr('rx', 5) 
      .attr('ry', 5) 
      .on('mouseover', function (event, d) {
        const leavesText = `${d.value} leaves`;
        svg
          .append('text')
          .attr('class', 'hover-text')
          .attr('x', x(d.month) || 0)
          .attr('y', y(d.value) - 5)
          .style('font-size', '10px') 
          .text(leavesText);
      })
      .on('mouseout', function (event, d) {
        svg.selectAll('.hover-text').remove();
      });
    

    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append('g').call(d3.axisLeft(y));

    svg
  .append('text')
  .attr('transform', `translate(${width / 2},${height + margin.top + 15})`) 
  .style('text-anchor', 'middle')
  .text('');

svg
  .append('text')
  .attr('transform', 'rotate(-90)')
  .attr('y', 0 - margin.left)
  .attr('x', 0 - height / 2)
  .attr('dy', '1em')
  .style('text-anchor', 'middle')
  .text('');
  }
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
