import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import { environment } from './../../environments/environment';

@Injectable()
export class HttpdataService{

  constructor(private httpClient: HttpClient) {}

  GET_STATISTICS:string = environment.apiEndPoint + "/v1/xcash/dpops/unauthorized/stats/";
  GET_DELEGATES:string = environment.apiEndPoint + "/v1/xcash/dpops/unauthorized/delegates/active";
  GET_DELEGATES_STATISTICS:string = environment.apiEndPoint + "/v1/xcash/dpops/unauthorized/delegates";
  GET_DELEGATES_ONLINE:string = environment.apiEndPoint + "/v1/xcash/dpops/unauthorized/delegates/registered/";
  //GET_DELEGATES_STATISTICS:string = environment.apiEndPoint + "/getdelegatesstatistics";
  GET_DELEGATES_INFORMATION:string = environment.apiEndPoint + "/v1/xcash/dpops/unauthorized/delegates";
  GET_DELEGATES_VOTERS_LIST:string = environment.apiEndPoint + "/v1/xcash/dpops/unauthorized/delegates/votes";
  GET_ROUND_STATISTICS:string = environment.apiEndPoint + "/getroundstatistics";
  GET_PUBLIC_ADDRESS_PAYMENT_INFORMATION:string = environment.apiEndPoint + "/getpublicaddresspaymentinformation";
  XCASH_WALLET_DECIMAL_PLACES_AMOUNT:number = 1000000;
  BLOCK_TIME:number = 5;
  GET_LAST_BLOCK_DATA:string = environment.explorerApiEndPoint + "/getlastblockdata";

  Timer:any;

  get_request(url:string)
  {
    return this.httpClient.get(url);
  }

  post_request(url:string, data:string)
  {
    const headers = new HttpHeaders ({'Content-Type':'application/x-www-form-urlencoded'});
    return this.httpClient.post(url,data, {headers: headers});
  }

  post_request_json(item: any[])
  {
    const headers = new HttpHeaders ({'Content-Type':'application/json'});
    return this.httpClient.post('url',item, {headers: headers});
  }

}
