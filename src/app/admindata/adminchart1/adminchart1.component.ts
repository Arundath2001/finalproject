import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { HttpService } from '../../http.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';



@Component({
  selector: 'app-adminchart1',
  templateUrl: './adminchart1.component.html',
  styleUrls: ['./adminchart1.component.scss']
})
export class Adminchart1Component {
  
  @ViewChild('doughnutChartContainer', { static: false })
  doughnutChartContainer!: ElementRef;
  
  
  loggedInUser: any;
  users: any[] = [];
  private data: any[] = [];

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
      const activeUsers = users.filter((user: { rank: string; active: any; }) => user.rank !== 'admin' && user.active).length;
      const inactiveUsers = users.filter((user: { rank: string; active: any; }) => user.rank !== 'admin' && !user.active).length;
      this.createDoughnutChart(activeUsers, inactiveUsers, this.doughnutChartContainer);
    });
  }
  createDoughnutChart(activeUsers: number, inactiveUsers: number, container: ElementRef) {
    if (!container || !container.nativeElement) {
      console.error('Chart container not available');
      return;
    }
  
    const width = 165;
    const height = 140;
    const radius = Math.min(width, height) / 2;
  
    const data = [activeUsers, inactiveUsers];
    const colors = ['blue', 'lightgrey'];
  
    const parentContainer = d3.select(container.nativeElement)
      .append('div')
      .style('display', 'flex')
      .style('flex-direction', 'row')
      .style('align-items', 'center');
  
    const svg = parentContainer
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
  
    const arc: d3.Arc<any, d3.DefaultArcObject> = d3.arc()
      .innerRadius(radius / 2)
      .outerRadius(radius);
  
    const pie = d3.pie();
  
    const arcs = svg.selectAll('path')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('d', arc as any)
      .attr('fill', (d: any, i: number) => colors[i]);
  
    const labels = svg.selectAll('text')
      .data(pie(data))
      .enter()
      .append('text')
      .attr('transform', (d: any) => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px') 
      .style('fill', 'white')   
      .text((d: any) => {
        const percentage = ((d.data / (activeUsers + inactiveUsers)) * 100).toFixed(1);
        return `${percentage}%`;
      });
  
    const valuesContainer = parentContainer
      .append('div')
      .style('display', 'flex')
      .style('flex-direction', 'column')
      .style('align-items', 'flex-start')
      .style('margin-left', '20px'); 
  
    valuesContainer.html(`
      <div>
        <div style="display: flex; align-items: center;" >
          <span style="color: blue; font-size: 1.5em;">&#8226;</span> <p style="color: rgb(155, 155, 155); margin: 0;"> Active: <span>${activeUsers}</span></p>
        </div>
  
        <div style="display: flex; align-items: center;" >  
          <span style="color: lightgrey; font-size: 1.5em;">&#8226;</span> <p style="color: rgb(155, 155, 155); margin: 0;"> Inactive: <span>${inactiveUsers}</span></p>
        </div>
      </div>
    `);
  }
  

  
}
