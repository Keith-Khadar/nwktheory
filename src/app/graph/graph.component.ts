import { AfterViewInit, Component, Inject } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsNetworkGraph from 'highcharts/modules/networkgraph';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';

import { fakeData } from './fake-data';

type Connection = {
  from: string,
  to: string,
}

type Node = {
  DestinationUser: string,
  SourceUser: string,
  Weight: number,
}

HighchartsNetworkGraph(Highcharts);

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements AfterViewInit {
  constructor(@Inject(DOCUMENT) public document: Document,
  public auth: AuthService) {}

  userEmail: string = ""
  userName: string = ""
  Connections: Array<Connection> = []

  public ngAfterViewInit(): void {
    this.auth.user$.subscribe((user) => {
      this.userEmail = user!.email!
      this.userName = user!.name!

      fetch(`http://localhost:3000/users/${this.userEmail}`)
      .then((res) => res.json())
      .then((data) => {
        data.Connections.forEach((connection: Node) => {
          this.Connections.push({
            from: connection.DestinationUser,
            to: connection.SourceUser,
          })
        })
      })
      .then(() => {
        this.createChartNWK()
      })
    })
  }

  private createChartNWK(): void {
    const chart = Highcharts.chart('chart-nwk', {
      title: {
        text: 'Your Connections'
      },
      chart: {
          type: 'networkgraph',
          height: '750'
      },
      credits: {
        enabled: false
      },
      draggable: {
        draggable: false,
      },
      plotOptions: {
        networkgraph: {
          keys: ['from', 'to'],
          layoutAlgorithm: {
            enableSimulation: false,
          }
        }
      },
      series: [
        {
          accessibility: {
            enabled: false,
          },
          marker: {
            radius: 10
          },
  
          type: 'networkgraph',
          dataLabels: {
            enabled: true,
          },
          draggable: false,
          layoutAlgorithm: {
            enableSimulation: false,
          },
          data: this.Connections,
        }
      ]
    } as Highcharts.Options);

    /*
    setInterval(() => {
      chart.series[0].points[0].update(this.getRandomNumber(0, 100));
    }, 1000);
    */
  }
}
