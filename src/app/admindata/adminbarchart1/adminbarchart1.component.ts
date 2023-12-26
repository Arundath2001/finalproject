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
  selector: 'app-adminbarchart1',
  templateUrl: './adminbarchart1.component.html',
  styleUrls: ['./adminbarchart1.component.scss']
})
export class Adminbarchart1Component {

  @ViewChild('barChartContainer', { static: false })
  barChartContainer!: ElementRef;
  
  @ViewChild('doughnutChartContainer', { static: false })
  doughnutChartContainer!: ElementRef;
  
  
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
      const userData = users.filter((user: { rank: string; }) => user.rank !== 'admin');
      this.createBarChart(userData, this.barChartContainer);

      const activeUsers = users.filter((user: { rank: string; active: any; }) => user.rank !== 'admin' && user.active).length;
      const inactiveUsers = users.filter((user: { rank: string; active: any; }) => user.rank !== 'admin' && !user.active).length;

    });
  }

  createBarChart(userData: any[], container: ElementRef): void {
    console.log('User Data:', userData);
  
    if (!container || !container.nativeElement || userData.length === 0) {
      console.error('Chart container not available or userData is empty');
      return;
    }
  
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);
  
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 280 - margin.left - margin.right;
    const height = 170 - margin.top - margin.bottom;
  
    console.log('Container:', container.nativeElement);
    console.log('Width:', width);
    console.log('Height:', height);
  
    const svg = d3.select(container.nativeElement)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  
    const x = d3.scaleBand()
      .domain(userData.map(d => d.username))
      .range([0, width])
      .padding(0.4);
  
    const y = d3.scaleLinear()
      .range([height, 0]);
  
    const maxTotalLeaves = d3.max(userData, (user) =>
      d3.sum(Object.values(user.leaves))
    ) || 1;
  
    y.domain([0, maxTotalLeaves]);
  
    console.log('X Scale Domain:', x.domain());
    console.log('Y Scale Domain:', y.domain());
  
    svg.selectAll('.bar')
      .data(userData)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.username) || 0)
      .attr('width', 20)
      .attr('y', d => y(d3.sum(Object.values(d.leaves))) || 0)
      .attr('height', d => height - y(d3.sum(Object.values(d.leaves))) || 0)
      .attr('fill', '#3354F4')
      .attr('rx', 5)
      .on('mouseover', function (event, d) {
        if (d) {
          const leaves = d3.sum(Object.values(d.leaves));
          const tooltipText = `${leaves} leaves`;
          tooltip.transition()
            .duration(200)
            .style('opacity', .9);
          tooltip.html(tooltipText)
            .style('left', (x(d.username) || 0) + margin.left + 'px')
            .style('top', (y(leaves) || 0) + margin.top - 10 + 'px');
        }
      })
      .on('mouseout', function (d) {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });
  
    svg.select('.domain').style('display', 'none');
  
    svg.select('.y-axis path').style('display', 'none');
  
    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');
  
    svg.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y));
  
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Total Leaves');
      svg.select('.x-axis .domain').remove();
      
  }
  
}
