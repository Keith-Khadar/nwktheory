import { AfterViewInit, Component, Inject } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsNetworkGraph from 'highcharts/modules/networkgraph';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
import { PanZoomConfig, PanZoomAPI, PanZoomModel, PanZoomConfigOptions } from 'ngx-panzoom';


type Connection = {
  from: string,
  to: string,
}

type Node = {
  from: string,
  to: string,
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

  panZoomConfig: PanZoomConfig = new PanZoomConfig();


  public ngAfterViewInit(): void {
    this.auth.user$.subscribe((user) => {
      this.userEmail = user!.email!
      this.userName = user!.name!

      fetch(`http://nwk.tehe.xyz:3000/users/${this.userEmail}`)
      .then((res) => res.json())
      .then((data) => {
        data.Connections.forEach((connection: Node) => {
          this.Connections.push({
            from: connection.from,
            to: connection.to,
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
        text: ''
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
  }
}
