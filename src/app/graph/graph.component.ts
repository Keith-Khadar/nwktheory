import { AfterViewInit, Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsNetworkGraph from 'highcharts/modules/networkgraph';

HighchartsNetworkGraph(Highcharts);

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements AfterViewInit {
  public ngAfterViewInit(): void {
    this.createChartNWK();
  }

  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  private createChartNWK(): void {
    const chart = Highcharts.chart('chart-nwk', {
      chart: {
          type: 'networkgraph'
      },
      plotOptions: {
          networkgraph: {
              layoutAlgorithm: {
                  linkLength: 50 // in pixels
              },
              link: {
                  color: 'red'
              }
          }
      },
      series: [{
          data: [
              ['A', 'B'],
              ['B', 'C'],
              ['C', 'A']
          ]
      }]
    } as any);

    /*
    setInterval(() => {
      chart.series[0].points[0].update(this.getRandomNumber(0, 100));
    }, 1000);
    */
  }

  title = 'nwktheory';
  constructor(){
  } 
}
