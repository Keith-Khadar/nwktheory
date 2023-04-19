import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsNetworkGraph from 'highcharts/modules/networkgraph';
import { PanZoomConfig, PanZoomAPI, PanZoomModel, PanZoomConfigOptions } from 'ngx-panzoom';
import { Subscription } from 'rxjs';

// Custom Services
import { HttpsService } from '../services/https.service';
import { Node, Connection} from '../services/info';


HighchartsNetworkGraph(Highcharts);


@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements AfterViewInit {
  // Https
  constructor(private https: HttpsService) {}

  // Graph States
  Connections: Array<Connection> = []
  Nodes: { [key: string]: Node } = {}
  isModalOpen = false

  // Initialization States
  dataFetched = false
  viewInitialized = false

  // PanZoomAPI
  panZoomConfig: PanZoomConfig = new PanZoomConfig();
  private panZoomAPI: PanZoomAPI|null = null;
  private apiSubscription: Subscription = new Subscription();

  // Fetch Data & Initialize PanZoomConfig
  ngOnInit(): void {
    // Use the custom service to get the user from the database 
    this.https.getUser(true).subscribe(async (user) => {
      // Save the connections gathered from the database into the connections array
      this.Connections = user.Connections;
      const promises = this.Connections.map(async (connection: Connection) => {
        if (!(connection.from in this.Nodes)) {
          const url = await this.https.getImageFromUser(connection.from)
          this.addNode(connection.from, url)
        }
        if (!(connection.to in this.Nodes)) {
          const url = await this.https.getImageFromUser(connection.to)
          this.addNode(connection.to, url)
        }
      })
      await Promise.all(promises)
      this.dataFetched = true
      this.createChartNWK()
    }); 
    this.panZoomConfig.keepInBounds = true;
    this.panZoomConfig.keepInBoundsRestoreForce = 2.0;
    this.panZoomConfig.keepInBoundsDragPullback = 2.0;
    this.apiSubscription = this.panZoomConfig.api.subscribe( (api: PanZoomAPI) => {
      this.panZoomAPI = api 
    });
  }

  // Destroy
  ngOnDestroy(): void {
    this.apiSubscription.unsubscribe();
  }

  // PanZoom Functions
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

  zoomReset(): void {
    if (this.panZoomAPI) {
      this.panZoomAPI.resetView()
    }
  }
  
  // Render graph once view initialzed
  ngAfterViewInit(): void {
    this.viewInitialized = true
    this.createChartNWK()
  }

  // Add graph node
  addNode(id: string, imageURL: string): void {
    this.Nodes[id] = {
      id: id,
      marker: {
        symbol: 'url(' + imageURL + ')',
        width:'50',
        height:'50',
      },
    }
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen
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
      accessibility: {
        enabled: false
      },
      plotOptions: {
        networkgraph: {
          keys: ['from', 'to'],
          layoutAlgorithm: {
            enableSimulation: true,
            integration: 'verlet',
            linkLength: 100
          },
          allowPointSelection: true,
          events: {
            click: () => this.setOpen(true)
          }
        }
      },
      series: [{
        marker: {
          radius: 13,
        },
        dataLabels: {
          enabled: false,
          linkFormat: '',
          allowOverlap: true,style: {
                        textOutline: false 
                    }
        },
        data: this.Connections,
        nodes: Object.values(this.Nodes)
      }]
    } as any);
  }
}
  
