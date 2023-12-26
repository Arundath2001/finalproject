import { Component, OnInit } from '@angular/core';
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
  selector: 'app-adminbarchart2',
  templateUrl: './adminbarchart2.component.html',
  styleUrls: ['./adminbarchart2.component.scss']
})
export class Adminbarchart2Component implements OnInit {

  loggedInUser: any;
  users: any[] = [];
  leaveData: any[] = [];
  private data: any[] = [];
  private svg: any;
  private xScale: any;
  private yScale: any;
  public selectedMonth: string = 'December';
  public selectedUser: string = 'Select All'; 

  constructor(private httpService: HttpService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const loggedInUsername = 'user1';

    this.httpService.getUsers().subscribe(
      (data) => {
        const loggedInUser = data.find((user: any) => user.username === loggedInUsername);

        this.data = data.filter((userData: any) => userData.username !== loggedInUsername);
        this.createBarChart1();

        this.users = ['Select All', ...this.getUsers()]; 
        this.loggedInUser = loggedInUser;
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  createBarChart1(): void {
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 290 - margin.left - margin.right;
    const height = 240 - margin.top - margin.bottom;

    this.svg = d3
      .select('#chart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    this.xScale = d3.scaleBand().range([0, width]).padding(0.5);
    this.yScale = d3.scaleLinear().range([height, 0]);

    this.updateChart();
  }

  getMonths(): string[] {
    if (!this.data) {
      return [];
    }

    const monthsSet = new Set<string>();
    this.data.forEach((item) => {
      Object.keys(item.leaves).forEach((month) => monthsSet.add(month));
    });
    return Array.from(monthsSet);
  }

  getUsers(): any[] {
    if (!this.data) {
      return [];
    }

    const usersSet = new Set<string>();
    this.data.forEach((item) => usersSet.add(item.username));
    return Array.from(usersSet);
  }

  updateChart(): void {
    this.svg.selectAll('*').remove();
  
    let filteredData = this.data;
  
    if (this.selectedUser && this.selectedUser !== 'Select All') {
      filteredData = filteredData.filter((item) =>
        item.username === this.selectedUser
      );
    }
  
    this.xScale.domain(filteredData.map((d) => d.username));
    this.yScale.domain([1, d3.max(filteredData, (d) => d.leaves[this.selectedMonth]) || 1]);
  
    this.svg
      .append('g')
      .attr('transform', 'translate(0,' + this.yScale.range()[0] + ')')
      .call(d3.axisBottom(this.xScale))
      .selectAll('text') 
      .attr('transform', 'rotate(-45)') 
      .style('text-anchor', 'end');
  
    this.svg.append('g').call(d3.axisLeft(this.yScale));
  
    this.svg
      .selectAll('rect')
      .data(filteredData)
      .enter()
      .append('rect')
      .attr('x', (d: any) => this.xScale(d.username) + this.xScale.bandwidth() / 2 - 12.5 || 0)
      .attr('y', (d: any) => this.yScale(d.leaves[this.selectedMonth]) || 0)
      .attr('width', 25)
      .attr('height', (d: any) => this.yScale.range()[0] - this.yScale(d.leaves[this.selectedMonth]) || 0)
      .attr('rx', 6) 
      .attr('ry', 6) 
      .attr('fill', '#3354F4');
  }
}
