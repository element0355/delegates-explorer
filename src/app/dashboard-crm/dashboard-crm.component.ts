import { Component, OnInit } from '@angular/core';
import { HttpdataService } from '../services/http-request.service';
import { FunctionsService } from '../services/functions.service';
import { Title } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { formatDate } from '@angular/common'
import {MatSnackBar} from '@angular/material/snack-bar';


import { environment } from './../../environments/environment';

@Component({
    selector: 'app-dashboard-crm',
    templateUrl: './dashboard-crm.component.html',
    styleUrls: ['./dashboard-crm.component.scss']
})


export class DashboardCrmComponent implements OnInit {

    delegatestatistics:string;
    delegateprofileinformation:string;
    circulating_percentage;
    miliseconds_left;
    isMainnet = false;
    mainnet_date_and_time:any;
    announcementJSON:string = environment.announcementJSON;
    announcement:any;

    public dashCard1 = [
      { ogmeter: false,  width_icon: 25, text_size: 40, text: 0, suffix: '',title: 'NEXT RECALCULATING OF VOTES', icon: 'hourglass_empty' },
      { ogmeter: true,  width_icon: 25, text_size: 40, text: 0, suffix: '', title: 'BLOCK HEIGHT', icon: 'assignment' },
      { ogmeter: true,  width_icon: 25, text_size: 40, text: 0, suffix: '', title: 'TOTAL BLOCK VERIFIERS', icon: 'verified_user' },
      { ogmeter: true,  width_icon: 25, text_size: 40, text: 0, suffix: '', title: 'TOTAL DELEGATES', icon: 'groups' },
      { ogmeter: false,  width_icon: 25, text_size: 40, text: '-', suffix: '', title: 'TOTAL VOTES', icon: 'done_all' },
      { ogmeter: false,  width_icon: 25, text_size: 40, text: 0, suffix: '', title: 'AVERAGE DELEGATE TOTAL VOTE', icon: 'signal_cellular_null' },
      { ogmeter: true,  width_icon: 25, text_size: 40, text: 0, suffix: '%', title: 'PoS CIRCULATING', icon: 'pie_chart' },
      { ogmeter: true,  width_icon: 25, text_size: 40, text: 0, suffix: '', title: 'DPoPS ROUND NUMBER', icon: 'autorenew' },
      { ogmeter: false,  width_icon: 25, text_size: 40, text: 0, suffix: '', title: 'RANK '+ environment.totalBlockVerifiers +' TOTAL VOTE ', icon: 'swap_vert' },
      { ogmeter: false,  width_icon: 25, text_size: 40, text: 0, suffix: '', title: 'BLOCK REWARD ', icon: 'toll' },
      { ogmeter: false,  width_icon: 25, text_size: 40, text: 0, suffix: '', title: 'BLOCK TIME ', icon: 'timelapse' },
      { ogmeter: false,  width_icon: 25, text_size: 40, text: 0, suffix: '', title: 'EST. BLOCK PER DAY ', icon: 'view_week' },
    ];



    constructor(private httpdataservice:HttpdataService, private titleService:Title,  public functionsService: FunctionsService) {
        this.titleService.setTitle( environment.shortTitle + " - X-CASH");
     }



    ngOnInit() {

      this.get_delegates();
      this.get_statistics();
      this.get_blockheight();
      this.get_announcement();
      setInterval(() => {
          var current_date_and_time = new Date();
          var minutes:any = (60 - current_date_and_time.getMinutes() - 1) % 60;
          var seconds:any = 60 - current_date_and_time.getSeconds() - 1;
          this.dashCard1[0].text = ('0' + minutes).slice(-2) + ":" + ('0' + seconds).slice(-2);
      }, 1000);

    }

    get_announcement() {
      // get the data from blockchain explorer
      this.httpdataservice.get_request(environment.announcementJSON).subscribe(
        (res) => {
          var announcementData = JSON.parse(JSON.stringify(res));
          this.announcement = announcementData;
        }
      )
    }

    get_blockheight() {
      // get the data
      this.httpdataservice.get_request(this.httpdataservice.GET_LAST_BLOCK_DATA).subscribe(
        (res) => {
          var data = JSON.parse(JSON.stringify(res));

          this.dashCard1[9].text = this.functionsService.get_lg_numer_format(data.block_reward);
          this.dashCard1[10].text = 5 + " min";
          this.dashCard1[11].text = (24*60)/5;

        },
        (error) =>  {
          Swal.fire({
              title: "Error",
              html: "An error has occured:<br>API: Get blockheight failed.",
              icon: "error",
              position: 'bottom',
              timer: 2500
            });
        }
      );
    }



    get_statistics() {
      // get the data
      this.httpdataservice.get_request(this.httpdataservice.GET_STATISTICS).subscribe(
        (res) => {
          var data = JSON.parse(JSON.stringify(res));
          this.dashCard1[7].text = data.roundNumber;
          this.dashCard1[1].text = data.roundNumber - 1;
          this.dashCard1[2].text = environment.totalBlockVerifiers;
          this.dashCard1[4].text = this.functionsService.get_lg_numer_format(parseInt(data.totalVotes) / this.httpdataservice.XCASH_WALLET_DECIMAL_PLACES_AMOUNT);
          this.dashCard1[6].text = parseInt(data.votePercentage);
        },
        (error) =>  {
          Swal.fire({
              title: "Error",
              html: "An error has occured:<br>API: Get statistics failed.",
              icon: "error",
              position: 'bottom',
              timer: 2500
            });
        }
      );
    }



    get_delegates() {
      // get the data
      this.httpdataservice.get_request(this.httpdataservice.GET_STATISTICS).subscribe(
        (res) => {

          let data2 = JSON.parse(JSON.stringify(res));

          let count = 0;
          let delegate_total_vote_count = 0;
          let current_delegate_total_vote_count2 = 0;
          let xcash_wallet_decimal_places_amount = this.httpdataservice.XCASH_WALLET_DECIMAL_PLACES_AMOUNT;

          this.dashCard1[3].text = data2.currentBlockVerifiersValidAmount;

          for (count = 0 ; count < data2.totalVotes; count++)
          {
            current_delegate_total_vote_count2 = parseInt(data2[count].totalVotes) / xcash_wallet_decimal_places_amount;
            delegate_total_vote_count += current_delegate_total_vote_count2;
          }

          this.dashCard1[8].text = this.functionsService.get_lg_numer_format(parseInt(data2[environment.totalBlockVerifiers - 1].totalVotes) / this.httpdataservice.XCASH_WALLET_DECIMAL_PLACES_AMOUNT );
          // only use 45 to calculate this since there are no votes for the 5 seed nodes
          //var avg_vote_count = this.functionsService.get_lg_numer_format(delegate_total_vote_count / environment.totalBlockVerifiers - 3);
          this.dashCard1[5].text = this.functionsService.get_lg_numer_format(parseInt(data.averageVote) / this.httpdataservice.XCASH_WALLET_DECIMAL_PLACES_AMOUNT); //avg_vote_count;

        },
        (error) => {
          Swal.fire({
              title: "Error",
              html: "An error has occured:<br>API: Get delegates failed.",
              icon: "error",
              position: 'bottom',
              timer: 2500
            });
        }
      );
    }

}
