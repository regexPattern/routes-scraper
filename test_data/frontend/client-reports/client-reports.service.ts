import { Injectable } from '@angular/core';
//import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Utils } from '../utils';
import * as globals from './constants';

@Injectable({
  providedIn: 'root'
})
export class ClientReportsService {
  // @Output() change: EventEmitter<any> = new EventEmitter();
  // @Output() reload: EventEmitter<any> = new EventEmitter();

  nodeServerUrl = environment.nodeServerUrl;

  constructor(private http: HttpClient) { }

  getClients(search, sort, order): any {
    const api = Utils.interpolate(globals.apiUrls.GET_CLIENTS, { search : search, sort: sort, order: order });
    const url = this.nodeServerUrl + api;
    return this.http.get<any>(url);
  }

  getClient(clientId): any {
    const api = Utils.interpolate(globals.apiUrls.GET_CLIENT, { clientId : clientId });
    const url = this.nodeServerUrl + api;
    return this.http.get<any>(url);
  }

  getClientReporting(client, ga, period, endDate, compare): any {
    const api = Utils.interpolate(globals.apiUrls.GET_CLIENT_REPORTING, { client: client, ga: ga, period: period, enddate: endDate, compare: compare });
    const url = this.nodeServerUrl + api;
    return this.http.get<any>(url);
  }

  getClientTrendedViews(client, ga, endDate): any {
    const api = Utils.interpolate(globals.apiUrls.GET_CLIENT_TRENDED_VIEWS, { client: client, ga: ga, enddate: endDate });
    const url = this.nodeServerUrl + api;
    return this.http.get<any>(url);
  }

  getClientPriorMetrics(clientId): any {
    const api = Utils.interpolate(globals.apiUrls.GET_PRIOR_METRICS, { clientId: clientId });
    const url = this.nodeServerUrl + api;
    return this.http.get<any>(url);
  }

  getClientSummaryMetrics(clientId): any {
    const api = Utils.interpolate(globals.apiUrls.GET_SUMMARY_METRICS, { clientId: clientId });
    const url = this.nodeServerUrl + api;
    return this.http.get<any>(url);
  }

  getClientTrendMetrics(clientId): any {
    const api = Utils.interpolate(globals.apiUrls.GET_TREND_METRICS, { clientId: clientId });
    const url = this.nodeServerUrl + api;
    return this.http.get<any>(url);
  }


  getSeoPerformance(client, gaAvailable, filters, clientFilters, compare): any {
    const api = globals.apiUrls.GET_SEO_PERFORMANCE;
    const url = this.nodeServerUrl + api;
    const body = { client: client, ga_available: gaAvailable, filters: filters, clientfilters: clientFilters, compare: compare};
    return this.http.post<any>(url, body, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  getPriorityMetrics(client, filters, clientFilters, metric, compare): any {
    const api = globals.apiUrls.GET_PRIORITY_METRICS;
    const url = this.nodeServerUrl + api;
    const body = { "client": client, "filters": filters, "clientfilters": clientFilters, metric: metric, compare: compare};
    return this.http.post<any>(url, body, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  getClientAPISummary(acronym, metric, dateRanges): any {
    const api = Utils.interpolate(globals.apiUrls.GET_CLIENT_API_SUMMARY, { acronym: acronym });
    const url = this.nodeServerUrl + api;
    const body = {metric: metric, dateRanges: dateRanges};
    return this.http.post<any>(url, body, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  getClientAPIResults(acronym, metric, dateRanges): any {
    const api = Utils.interpolate(globals.apiUrls.GET_CLIENT_API_RESULTS, { acronym: acronym });
    const url = this.nodeServerUrl + api;
    const body = {metric: metric, dateRanges: dateRanges};
    return this.http.post<any>(url, body, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

 
}
