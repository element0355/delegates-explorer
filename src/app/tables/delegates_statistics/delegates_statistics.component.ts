import {fromEvent as observableFromEvent} from 'rxjs';
import {distinctUntilChanged, debounceTime} from 'rxjs/operators';

import { Component, OnInit , ElementRef, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExampleDatabase, ExampleDataSource } from './helpers.data';
import { HttpdataService } from '../../services/http-request.service';
import { FunctionsService } from '../../services/functions.service';
import Swal from 'sweetalert2';


import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-fixed-table',
  templateUrl: './delegates_statistics.component.html',
  styleUrls: ['./delegates_statistics.component.scss']
})
export class Delegates_statisticsComponent implements OnInit {

  public dashCard1 = [
    { ogmeter: false, width_icon: 25, text_size: 36, text: '-', suffix: '',  title: 'ONLINE STATUS', icon: 'online_prediction' },
    { ogmeter: true, width_icon: 25, text_size: 40, text: 0, suffix: '',  title: 'DELEGATE RANK ', icon: 'leaderboard' },
    { ogmeter: true, width_icon: 25, text_size: 40, text: 0, suffix: '',  title: 'BLOCKS PRODUCED ', icon: 'find_in_page' },
    { ogmeter: false, width_icon: 25, text_size: 40, text: '-', suffix: '',  title: 'VOTE COUNT', icon: 'done_all' },
    { ogmeter: true, width_icon: 25, text_size: 40, text: 0, suffix: '%',  title: 'Top 50 PERCENTAGE', icon: 'update' },
    { ogmeter: true, width_icon: 25, text_size: 40, text: 0, suffix: '',  title: 'DELEGATE ONLINE ROUNDS', icon: 'model_training' },
    { ogmeter: true, width_icon: 25, text_size: 40, text: 0, suffix: '',  title: 'VERIFIER ROUNDS', icon: 'autorenew' },
    { ogmeter: true, width_icon: 25, text_size: 40, text: 0, suffix: '',  title: 'VERIFIER SCORE', icon: 'military_tech' },
    { ogmeter: true, width_icon: 25, text_size: 40, text: 0, suffix: '%',  title: 'PRODUCER/VERIFIER RATIO', icon: 'star_half' },
    { ogmeter: true, width_icon: 25, text_size: 40, text: 0, suffix: '',  title: 'EST ROUNDS BTW BLOCK PRODUCER ', icon: 'published_with_changes' },
    { ogmeter: false, width_icon: 25, text_size: 40, text: '-', suffix: '',  title: 'SINCE LAST BLOCK PRODUCED', icon: 'alarm_on' },
    { ogmeter: false, width_icon: 25, text_size: 40, text: '0', suffix: '%',  title: 'FEE', icon: 'local_atm' }
  ];

  title:string = "Delegates Statistics";
  delegateName:string = "";

  public displayedColumns = ['id', 'block_height'];
	public exampleDatabase = new ExampleDatabase();
	public dataSource: ExampleDataSource | null;
	public showFilterTableCode;
  last_block_found:number;
  length;
  is_seednode:boolean = false;

  constructor(private route: ActivatedRoute, private httpdataservice: HttpdataService, public functionsService: FunctionsService) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('filter') filter: ElementRef;


	ngOnInit() {

      this.delegateName = this.route.snapshot.queryParamMap.get("data");
      if ( environment.seedNodes.includes(this.delegateName)) {
        this.is_seednode = true;
      }

      // get the data
    	this.httpdataservice.get_request(this.httpdataservice.GET_DELEGATES_STATISTICS + "?parameter1=" + this.delegateName).subscribe(
  	   (res) =>	{
          this.exampleDatabase = new ExampleDatabase();

          var data = JSON.parse(JSON.stringify(res));

          var block_producer_block_heights = data.block_producer_block_heights.split("|");
          var block_reward;
          var count = 0;

          for (count = 1; count < block_producer_block_heights.length; count++) {
      	    this.exampleDatabase.addUser((count).toString(),block_producer_block_heights[count].toString(),"Block Producer");
            if (count + 1 == block_producer_block_heights.length)  {
              this.last_block_found = parseInt(block_producer_block_heights[count]);
            }
      	  }

          this.dashCard1[0].text = data.online == 'true' ? 'Online'  : 'Offline';
          this.dashCard1[1].text = parseInt(data.current_delegate_rank);
          this.dashCard1[2].text = block_producer_block_heights.length-1;
          this.dashCard1[3].text = this.functionsService.get_lg_numer_format(parseInt(data.votes) / this.httpdataservice.XCASH_WALLET_DECIMAL_PLACES_AMOUNT);

          this.dashCard1[4].text = parseInt(data.onlinePercentage);
          this.dashCard1[5].text = parseInt(data.totalRounds);
          this.dashCard1[6].text = parseInt(data.totalBlockProducerRounds);
          this.dashCard1[7].text = parseInt(data.block_verifier_score);

          this.dashCard1[8].text = parseInt(data.block_producer_total_rounds) / parseInt(data.block_verifier_total_rounds) * 100;
          this.dashCard1[9].text = data.block_producer_total_rounds > 0 ? parseInt(data.block_verifier_total_rounds) / parseInt(data.block_producer_total_rounds) : "0";
          this.dashCard1[11].text = data.fee == '' ? '0' : data.fee;

          this.length = block_producer_block_heights.length - 1;
          this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);

          this.get_delegates_website_statistics();

          observableFromEvent(this.filter.nativeElement, 'keyup').pipe(
            debounceTime(150),
            distinctUntilChanged()
          ).subscribe(() => {
              if (!this.dataSource) { return; }
              this.dataSource.filter = this.filter.nativeElement.value;
            }
          );
        },
        (error) => {
          Swal.fire({
              title: "Error",
              html: "An error has occured:<br>API: Get delegates statistics failed.",
              icon: "error",
              position: 'bottom',
              timer: 2500
            });
        }
    	);
    }

    get_delegates_website_statistics()
    {
      this.httpdataservice.get_request(this.httpdataservice.GET_STATISTICS).subscribe(
      (res) =>
      {

        var data = JSON.parse(JSON.stringify(res));
        if (this.last_block_found) {
          var minutes_since_last_block_found = ((parseInt(data.current_block_height) - this.last_block_found) * this.httpdataservice.BLOCK_TIME);
          var minutes = minutes_since_last_block_found % 60;
          var hours = (minutes_since_last_block_found-minutes) / 60;
          this.dashCard1[10].text =  "~" + hours.toString() + "h " + (minutes<10?"0":"") + minutes.toString() + "m";
        }else{
          this.dashCard1[10].text =  "∞";
        }

      },
      (error) => {
        Swal.fire({
            title: "Error",
            html: "An error has occured:<br>API: Get delegates website statistics failed.",
            icon: "error",
            position: 'bottom',
            timer: 2500
          });
      });
    }

}
