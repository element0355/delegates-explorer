import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {HttpdataService} from '../services/http-request.service';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';
import { FunctionsService } from '../services/functions.service';
import { environment } from './../../environments/environment';

@Component({
    selector: 'app-delegates_information',
    templateUrl: './delegates_information.component.html',
    styleUrls: ['./delegates_information.component.scss']
})

export class Delegates_informationComponent implements OnInit {

    delegateName:string = "Delegates Information";
    data;

    about:string;
    website:string;
    team:string;
    shared_delegate_status:string;
    delegate_fee:string;
    server_specs:string;
    public_address:string;
    is_seednode:boolean = false;

    constructor(private route: ActivatedRoute, private httpdataservice: HttpdataService, private titleService:Title, public functionsService: FunctionsService) {
        this.delegateName = this.route.snapshot.queryParamMap.get("data");
        if ( environment.seedNodes.includes(this.delegateName)) {
          this.is_seednode = true;
        }
        this.titleService.setTitle( this.delegateName +  "Delegate Information - " + environment.shortTitle + " - X-CASH" );
     }


    ngOnInit() {



      this.httpdataservice.get_request(this.httpdataservice.GET_DELEGATES_INFORMATION + "?parameter1=" + this.delegateName).subscribe(
        (res) => {
              var data = JSON.parse(JSON.stringify(res));

              this.data = data;
              this.about = data.about;
              this.website = data.website;
              this.team = data.team;
              this.shared_delegate_status = data.shared_delegate_status == 'solo' ? 'Solo' : data.shared_delegate_status == 'shared' ? 'Shared' : 'Group';
              this.delegate_fee = data.fee;
              this.server_specs = data.server_specs;
              this.public_address = data.public_address;
            },
            (error) =>    {
              Swal.fire({
                  title: "Error",
                  html: "An error has occured:<br>API: Get delegates information failed.",
                  icon: "error",
                  position: 'bottom',
                  timer: 2500
                });
            }
        );
    }
}
