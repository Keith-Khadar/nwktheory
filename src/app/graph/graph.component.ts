import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsNetworkGraph from 'highcharts/modules/networkgraph';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
import { PanZoomConfig, PanZoomAPI, PanZoomModel, PanZoomConfigOptions } from 'ngx-panzoom';
import { HttpClient } from '@angular/common/http';
import { HttpErrorHandler } from '../http-error-handler.service';
import { HandleError } from '../http-error-handler.service';
import { Subscription } from 'rxjs';
import { Connection, Node, MyPoint, ProfilePic } from './types';


HighchartsNetworkGraph(Highcharts);

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements AfterViewInit, OnInit, OnDestroy {
  constructor(@Inject(DOCUMENT) public document: Document,
  public auth: AuthService, private http: HttpClient, httpErrorHandler: HttpErrorHandler) {}

  userEmail: string = ""
  userName: string = ""
  url = "https://nwk.tehe.xyz:3000/"
  imageExt = ""
  Connections: Array<Connection> = []

  panZoomConfig: PanZoomConfig = new PanZoomConfig();
  private panZoomAPI: PanZoomAPI|null = null;
  private apiSubscription: Subscription = new Subscription();
  private modelChangedSubscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.panZoomConfig.keepInBounds = true;
    this.panZoomConfig.keepInBoundsRestoreForce = 2.0;
    this.panZoomConfig.keepInBoundsDragPullback = 2.0;
    this.apiSubscription = this.panZoomConfig.api.subscribe( (api: PanZoomAPI) => this.panZoomAPI = api );
    this.modelChangedSubscription = this.panZoomConfig.modelChanged.subscribe( (model: PanZoomModel) => this.onModelChanged(model) );
  }

  ngOnDestroy(): void {
    this.apiSubscription.unsubscribe();
    this.modelChangedSubscription.unsubscribe();
  }

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
  
  // reset(): void {
  //   if (this.panZoomAPI) {
  //     this.panZoomAPI.reset();
  //   }
  // }

  public ngAfterViewInit(): void {
    this.auth.user$.subscribe((user) => {
      this.userEmail = user!.email!
      this.userName = user!.name!
      this.http.get<ProfilePic>(this.url + 'users/' + this.userEmail + '?profilepic=true').subscribe((image) =>{
        this.imageExt = image.ProfilePic.substring(image.ProfilePic.lastIndexOf('.'));
        fetch(`${this.url}users/${this.userEmail}`)
        .then((res) => res.json())
        .then((data) => {
          data.Connections.forEach((connection: Node) => {
            this.Connections.push({
              from: connection.from,
              to: connection.to,
              imageSrc: this.url + 'static/images/' + this.userEmail + '_profile' + this.imageExt
            })
          })
        })
        .then(() => {
          this.createChartNWK()
        })
      });

    })
  }

  private createChartNWK(): void {
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
        nodes: this.Connections.map((connection: Connection) => {
          return {
            id: connection.from,
            marker: {
              radius: 30,
              symbol: 'url(' + connection.imageSrc + ')',
              width:'100',
              height:'100'
            },
          }
        })
      }]
    } as any);
  }
}
