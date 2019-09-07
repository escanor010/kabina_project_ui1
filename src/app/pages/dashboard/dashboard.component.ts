import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { max } from 'rxjs/operators';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  tBu:Array<any>  
  tFloor:Array<any>  

  public barChartOptionsBU = {};
  public barChartOptionsFloor = {};

  public barChartLabelsBU = [];
  public barChartLabelsFloor = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];//[pluginDataLabels];

  public barChartDataBU = [];
  public barChartDataFloor = [];


  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.adminService.generateReportShelves().subscribe((data : any) => { 
      //let data = {"FloorReport":[{"floorNumber":1,"availableShelves":[],"available":0,"bookedShelves":[{"id":1,"floor":1,"positionNumber":10,"status":"Booked","businessUnit":{"id":1,"name":"Insurance"}}],"booked":1},{"floorNumber":2,"availableShelves":[{"id":2,"floor":2,"positionNumber":20,"status":"Available","businessUnit":{"id":1,"name":"Insurance"}}],"available":1,"bookedShelves":[],"booked":0},{"floorNumber":3,"availableShelves":[{"id":3,"floor":3,"positionNumber":30,"status":"Available","businessUnit":{"id":2,"name":"Admin"}}],"available":1,"bookedShelves":[],"booked":0},{"floorNumber":4,"availableShelves":[{"id":4,"floor":4,"positionNumber":40,"status":"Available","businessUnit":{"id":2,"name":"Admin"}}],"available":1,"bookedShelves":[],"booked":0},{"floorNumber":5,"availableShelves":[],"available":0,"bookedShelves":[{"id":5,"floor":5,"positionNumber":50,"status":"Booked","businessUnit":{"id":3,"name":"Human Resource"}}],"booked":1},{"floorNumber":6,"availableShelves":[],"available":0,"bookedShelves":[{"id":6,"floor":6,"positionNumber":60,"status":"Booked","businessUnit":{"id":3,"name":"Human Resource"}}],"booked":1}],"BusinessUnitReport":[{"id":2,"name":"Admin","availableShelves":[{"id":3,"floor":3,"positionNumber":30,"status":"Available","businessUnit":{"id":2,"name":"Admin"}},{"id":4,"floor":4,"positionNumber":40,"status":"Available","businessUnit":{"id":2,"name":"Admin"}}],"available":2,"bookedShelves":[],"booked":0},{"id":3,"name":"Human Resource","availableShelves":[],"available":0,"bookedShelves":[{"id":5,"floor":5,"positionNumber":50,"status":"Booked","businessUnit":{"id":3,"name":"Human Resource"}},{"id":6,"floor":6,"positionNumber":60,"status":"Booked","businessUnit":{"id":3,"name":"Human Resource"}}],"booked":2},{"id":1,"name":"Insurance","availableShelves":[{"id":2,"floor":2,"positionNumber":20,"status":"Available","businessUnit":{"id":1,"name":"Insurance"}}],"available":1,"bookedShelves":[{"id":1,"floor":1,"positionNumber":10,"status":"Booked","businessUnit":{"id":1,"name":"Insurance"}}],"booked":1}]};
      let floorReport = data.FloorReport;
      let businessUnitReport = data.BusinessUnitReport;
      let lablesFloor: Array<string>=[];
      let floorAvai: Array<number>=[];
      let floorBook: Array<number>=[];
      let buAvai: Array<number>=[];
      let buBook: Array<number>=[];
      let lablesBusinessUnit: Array<string>=[];

      var floorDataSets : any[] = [];
      var buDataSets : any[] = [];
      var tBu : any[] = [];
      var tFloor : any[] = [];

      for (let entryf of floorReport) {
          var inforf = {
            name: 'Floor ' + entryf.floorNumber,
            availables: entryf.available,
            booked: entryf.booked,
            percentage: entryf.booked*100/(entryf.booked+entryf.available)  
          };
          tFloor.push(inforf);
          lablesFloor.push('Floor '+ entryf.floorNumber);
          floorBook.push(entryf.booked);
          floorAvai.push(entryf.available);
      }
      this.tFloor = tFloor;
      floorDataSets[0] = {
          data : floorBook,
          label: 'Booked'
      }
      floorDataSets[1] = {
          data : floorAvai,
          label : 'Available'
      }

      for (let entryb of businessUnitReport) {
          var inforb = {
            name: entryb.name,
            availables: entryb.available,
            booked: entryb.booked,
            percentage: entryb.booked*100/(entryb.booked+entryb.available)  
          };
          tBu.push(inforb);
          lablesBusinessUnit.push(entryb.name);
          buBook.push(entryb.booked);
          buAvai.push(entryb.available);
      }
      this.tBu = tBu;
      buDataSets[0] = { 
          data : buBook,
          label : 'Booked'
      }
      buDataSets[1] = { 
          data : buAvai,
          label : 'Available'
      }

      var maxBu = Math.max(...buAvai) +  Math.max(...buBook); 
      var maxFl = Math.max(...floorAvai) +  Math.max(...floorBook); 

      var ChartOptionsBU = {
        responsive: true,
        scales: { xAxes: [{}], yAxes: [{ticks:{max:maxBu,userCallback: function(label, index, labels) {
          if (Math.floor(label) === label) {
              return label;
          }
      }}}] },
        plugins: {
          datalabels: {
            anchor: 'end',
            align: 'end',
          }
        }
      };
      this.barChartOptionsBU = ChartOptionsBU;
      var ChartOptionsFloor = {
        responsive: true,
        scales: { xAxes: [{}], yAxes: [{ticks:{max:maxFl,userCallback: function(label, index, labels) {
          if (Math.floor(label) === label) {
              return label;
          }
      }}}] },
        plugins: {
          datalabels: {
            anchor: 'end',
            align: 'end',
          }
        }
      };
      this.barChartOptionsFloor = ChartOptionsFloor;
      this.barChartLabelsBU = lablesBusinessUnit;
      this.barChartDataBU = buDataSets;
      this.barChartLabelsFloor = lablesFloor;
      this.barChartDataFloor = floorDataSets;
    });
  }

  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }
}
