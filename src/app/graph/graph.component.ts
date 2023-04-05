import { AfterViewInit, Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsNetworkGraph from 'highcharts/modules/networkgraph';
import { PanZoomConfig } from 'ngx-panzoom';

// Custom Services
import { HttpsService } from '../services/https.service';
import { Connection } from '../services/info';


HighchartsNetworkGraph(Highcharts);

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements AfterViewInit {
  constructor(private https: HttpsService) {}

  Connections: Array<Connection> = []

  panZoomConfig: PanZoomConfig = new PanZoomConfig();


  public ngAfterViewInit(): void {
    // Use the custom service to get the user from the database 
    this.https.getUser(true).subscribe((user) => {
      // Save the connections gathered from the database into the connections array
      this.Connections = user.Connections;
      // Then create the chart
      this.createChartNWK()
    });
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
