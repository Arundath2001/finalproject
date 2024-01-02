import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { HttpService } from '../../http.service';

@Component({
  selector: 'app-adminbarchart1',
  templateUrl: './adminbarchart1.component.html',
  styleUrls: ['./adminbarchart1.component.scss']
})
export class Adminbarchart1Component implements OnInit {

  @ViewChild('barChartContainer', { static: false })
  barChartContainer!: ElementRef;

  loggedInUser: any;
  users: any[] = [];
  leaveData: any[] = [];
  private data: any[] = [];

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    const loggedInUsername = 'user1';

    this.httpService.getUsers().subscribe(
      (data) => {
        console.log('Fetched data:', data);

        const loggedInUser = data.find((user: any) => user.username === loggedInUsername);

        this.data = data.filter((userData: any) => userData.username !== loggedInUsername);

        this.httpService.getUsers().subscribe(users => {
          const userData = users.filter((user: { rank: string; }) => user.rank !== 'hr');
          this.createBarChart(userData, this.barChartContainer);
        });

        this.users = this.data;
        this.loggedInUser = loggedInUser;
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  createBarChart(userData: any[], container: ElementRef): void {
    if (!container || !container.nativeElement || userData.length === 0) {
      console.error('Chart container not available or userData is empty');
      return;
    }

    const tooltip = d3.select(container.nativeElement).append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 280 - margin.left - margin.right;
    const height = 170 - margin.top - margin.bottom;

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
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        tooltip.html(`Leaves: ${d3.sum(Object.values(d.leaves))}`)
          .style('font-size', '12px')
          .style('left', (event.pageX) + 'px')
          .style('top', (event.pageY - 30) + 'px');
      })
      .on('mouseout', function () {
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
