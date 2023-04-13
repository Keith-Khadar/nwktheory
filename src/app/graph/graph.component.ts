import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsNetworkGraph from 'highcharts/modules/networkgraph';
import { PanZoomConfig, PanZoomAPI, PanZoomModel, PanZoomConfigOptions } from 'ngx-panzoom';
import { Subscription } from 'rxjs';

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

  ImageURLS: Array<string> = []
  Connections: Array<Connection> = []

  panZoomConfig: PanZoomConfig = new PanZoomConfig();private panZoomAPI: PanZoomAPI|null = null;
  private apiSubscription: Subscription = new Subscription();
  private modelChangedSubscription: Subscription = new Subscription();

  constructor(private https: HttpsService) {}

  dataFetched = false
  viewInitialized = false

  ngOnInit(): void {
    // Use the custom service to get the user from the database 
    this.https.getUser(true).subscribe(async (user) => {
      // Save the connections gathered from the database into the connections array
      this.Connections = user.Connections;
      const promises = this.Connections.map(async (connection: Connection) => {
          const url = await this.https.getImageFromUser(connection.to)
          this.ImageURLS.push(url)
      })
      await Promise.all(promises)
      this.dataFetched = true
      this.createChartNWK()
    }); 
    this.panZoomConfig.keepInBounds = true;
    this.panZoomConfig.keepInBoundsRestoreForce = 2.0;
    this.panZoomConfig.keepInBoundsDragPullback = 2.0;
    this.apiSubscription = this.panZoomConfig.api.subscribe( (api: PanZoomAPI) => this.panZoomAPI = api );
    this.modelChangedSubscription = this.panZoomConfig.modelChanged.subscribe( (model: PanZoomModel) => this.onModelChanged(model));
  }

  // panZoom functions
  onModelChanged(model: PanZoomModel): void {}
  zoomIn(): void {
    if (this.panZoomAPI) {
      this.panZoomAPI.zoomIn();
    }
  }
  zoomOut(): void {
    if (this.panZoomAPI) {
      this.panZoomAPI.zoomOut();
    }
  }
  
  // Render graph once view initialzed
  ngAfterViewInit(): void {
    this.viewInitialized = true
    this.createChartNWK()
  }

  // Destroy subscriptions
  ngOnDestroy(): void {
    this.apiSubscription.unsubscribe();
    this.modelChangedSubscription.unsubscribe();
  }

  // Render when data has returned and data initialized
  private createChartNWK(): void {
    if (!this.dataFetched || !this.viewInitialized)
      return

    Highcharts.chart('chart-nwk', {
      chart: {
        type: 'networkgraph',
      },
      title: {
        text: null
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        networkgraph: {
          keys: ['from', 'to'],
          layoutAlgorithm: {
            enableSimulation: true,
            integration: 'verlet',
            linkLength: 100
          }
        }
      },
      series: [{
        marker: {
          radius: 13,
        },
        dataLabels: {
          enabled: true,
          linkFormat: '',
          allowOverlap: true,style: {
                        textOutline: false 
                    }
        },
        data: this.Connections,
        nodes: this.Connections.map((connection: Connection, index) => {

          return {
            id: connection.to,
            marker: {
              radius: 100,
              symbol: 'url(' + this.ImageURLS[index] + ')',
              width:'50',
              height:'50'
            },
          }
        })
      }]
    } as any);
  }
}
  
