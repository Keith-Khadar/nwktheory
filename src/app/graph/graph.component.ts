import { AfterViewInit, Component, Inject } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsNetworkGraph from 'highcharts/modules/networkgraph';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';


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

  public ngAfterViewInit(): void {
    this.createChartNWK();
    this.auth.user$.subscribe((user) => {
      this.userEmail = user!.email!
      this.userName = user!.name!
    })
    const req = fetch(`http://localhost:3000/users/${this.userEmail}`)
    req.then((res) => {
        console.log(res.json())
      }
    )
  }

  private createChartNWK(): void {
    const chart = Highcharts.chart('chart-nwk', {
      title: {
        text: 'NWK Theory'
      },
      chart: {
          type: 'networkgraph',
          height: '500'
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
          marker: {
            radius: 10
          },
  
          type: 'networkgraph',
          dataLabels: {
            enabled: true
          },
          draggable: false,
          layoutAlgorithm: {
            enableSimulation: false,
          },
          data: [
            ['Miracle Mile Medical Center', 'Samer Alaiti M.D.'],
            ['Miracle Mile Medical Center', 'Platinum Toxicology'],
            ['Vantage Toxicology Management', 'Platinum Toxicology'],
            ['West Oaks Orthopaedic', 'Southern California Orthopedic Institute'],
            ['Chaparral Medical Group Inc', 'Internal Medicine Medical Group'],
            ['Vantage Toxicology Management', 'Internal Medicine Medical Group'],
            ['Chaparral Medical Group Inc', 'West Oaks Orthopaedic'],
            ['Miracle Mile Medical Center', 'Platinum Toxicology'],
            ['Vantage Toxicology Management', 'Andrew D Rah MD'],
            ['Vantage Toxicology Management', 'Norman N Nakata MD'],
            ['Vantage Toxicology Management', 'Joanne Halbrecht M.d'],
            ['Vantage Toxicology Management', 'Ronald J Gowey MD'],
            ['Vantage Toxicology Management', 'Mohammad Sirajullah MD'],
            ['West Oaks Orthopaedic', 'Chaparral Medical Group Inc'],
            [
              'West Oaks Orthopaedic',
              'Hospitalists Corporation of Inland Empire'
            ],
            ['West Oaks Orthopaedic', 'Robert L Horner M.D.'],
            ['West Oaks Orthopaedic', 'Mark H Hyman MD Inc'],
            ['Chaparral Medical Group Inc', 'Precision Occ MED Grp Inc.'],
            ['Precision Occ MED Grp Inc.', 'Gary Phillip Jacobs MD Inc'],
            ['Precision Occ MED Grp Inc.', 'Wellness Wave LLC'],
            ['Precision Occ MED Grp Inc.', 'Precision Occ MED Grp Inc'],
            [
              'Precision Occ MED Grp Inc.',
              'Precision Occupational Medical Group, Inc.'
            ],
            ['Precision Occ MED Grp Inc.', 'Samer Alaiti MD Inc'],
            ['Precision Occ MED Grp Inc.', 'Lotus Laboratories'],
            ['Precision Occ MED Grp Inc.', 'Ontario Medical Center L'],
            ['Precision Occ MED Grp Inc.', 'Leo Newman'],
            ['Precision Occ MED Grp Inc.', 'Ca Diagnostic Specialists Inc'],
            ['Precision Occ MED Grp Inc.', 'Physiolink'],
            ['Precision Occ MED Grp Inc.', 'Matrix Rehabilitation Inc'],
            ['Precision Occ MED Grp Inc.', 'Kaiser Foundation Hospitals']
          ]
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
