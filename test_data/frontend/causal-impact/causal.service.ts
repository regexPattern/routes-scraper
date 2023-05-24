import { Injectable } from '@angular/core';
//import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Utils } from '../utils';
import * as globals from './constants';

@Injectable({
  providedIn: 'root'
})
export class CausalService {
  // @Output() change: EventEmitter<any> = new EventEmitter();
  // @Output() reload: EventEmitter<any> = new EventEmitter();

  nodeServerUrl = environment.nodeServerUrl;
  analyticsServerUrl = environment.analyticsServerUrl;

  constructor(private http: HttpClient) { }

  getMetaHierarchies(): any {
    const api = globals.apiUrls.GET_META_HIERARCHIES;
    const url = this.nodeServerUrl + api;
    return this.http.get<any>(url);
  }

  getMetaKpis(): any {
    const api = globals.apiUrls.GET_META_KPIS;
    const url = this.nodeServerUrl + api;
    return this.http.get<any>(url);
  }

  getMetaTypes(): any {
    const api = globals.apiUrls.GET_META_TYPES;
    const url = this.nodeServerUrl + api;
    return this.http.get<any>(url);
  }

  getResults(client_id, user_id, search, sort, order): any {
    const api = globals.apiUrls.GET_RESULTS;
    const url = this.nodeServerUrl + api;
    const body = {
       client_id: client_id, user_id: user_id, search: search, sort: sort, order: order};
    return this.http.post<any>(url, body, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });

  }

  getArchivedResults(client_id, user_id, search, sort, order): any {
    const api = globals.apiUrls.GET_ARCHIVEDRESULTS;
    const url = this.nodeServerUrl + api;
    const body = {
       client_id: client_id, user_id: user_id, search: search, sort: sort, order: order};
    return this.http.post<any>(url, body, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });

  }

  getTestByName(name): any {
    const api = Utils.interpolate(globals.apiUrls.GET_TEST_BY_NAME, { name: name });
    const url = this.nodeServerUrl + api;
    return this.http.get<any>(url);
  }

  getDateRange(testId, pre, post): any {
    const api = Utils.interpolate(globals.apiUrls.GET_DATE_RANGE, { testId: testId, pre: pre, post: post });
    const url = this.nodeServerUrl + api;
    return this.http.get<any>(url);
  }

  saveParameters(data): any {
    const api = globals.apiUrls.SAVE_PARAMETERS;
    const url = this.nodeServerUrl + api;
    const body = { data: data };
    return this.http.post<any>(url, body, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });

  }


  saveResults(data): any {
    const api = globals.apiUrls.SAVE_RESULTS;
    const url = this.nodeServerUrl + api;
    const body = { data: data };
    return this.http.post<any>(url, body, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });

  }

  updatePctComplete(testId, pctComplete): any {
    const api = globals.apiUrls.UPDATE_PCT_COMPLETE;
    const url = this.nodeServerUrl + api;
    const body = { id: testId, pctComplete: pctComplete };
    return this.http.post<any>(url, body, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });

  }

  archiveTest(testId): any {
    const api = Utils.interpolate(globals.apiUrls.ARCHIVE, { testId: testId });
    const url = this.nodeServerUrl + api;
    return this.http.delete<any>(url);  
  }

  getParametersById(resultId): any {
    const api = Utils.interpolate(globals.apiUrls.GET_PARAMETERS_BY_ID, { resultId: resultId });
    const url = this.nodeServerUrl + api;
    return this.http.get<any>(url);
  }

  getResultsById(resultId): any {
    const api = Utils.interpolate(globals.apiUrls.GET_RESULTS_BY_ID, { resultId: resultId });
    const url = this.nodeServerUrl + api;
    return this.http.get<any>(url);
  }

  importTestInputs(source, testId, data): any {
    const api = globals.apiUrls.IMPORT;
    const url = this.nodeServerUrl + api;
    const body = { source: source, testId: testId, data: data };
    return this.http.post<any>(url, body, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });

  }

  deleteTest(testId): any {
    const api = Utils.interpolate(globals.apiUrls.DELETE, { testId: testId });
    const url = this.nodeServerUrl + api;
    return this.http.delete<any>(url);
  }

  deleteTestInputs(testId): any {
    const api = Utils.interpolate(globals.apiUrls.DELETE_INPUTS, { testId: testId });
    const url = this.nodeServerUrl + api;
    return this.http.delete<any>(url);
  }

  getTestInputsCount(testId): any {
    const api = Utils.interpolate(globals.apiUrls.GET_TEST_INPUTS_COUNT, { testId: testId });
    const url = this.nodeServerUrl + api;
    return this.http.get<any>(url);

  }

  getTestInputs(testId, max): any {
    const api = Utils.interpolate(globals.apiUrls.GET_TEST_INPUTS, { testId: testId, max: max });
    const url = this.nodeServerUrl + api;
    return this.http.get<any>(url);

  }

  getChartFilters(testId): any {
    const api = Utils.interpolate(globals.apiUrls.GET_CHART_FILTERS, { testId: testId });
    const url = this.nodeServerUrl + api;
    return this.http.get<any>(url);

  }

  getSummaries(testId, metric, site, segment, lob, page, device): any {
    const api = Utils.interpolate(globals.apiUrls.GET_SUMMARIES,
      { testId: testId, metric: metric, site: site, segment: segment, lob: lob,
        page: page, device: device});
    const url = this.nodeServerUrl + api;
    return this.http.get<any>(url);
  }

  getChartData(testId, metric, site, segment, lob, page, device): any {
    const api = Utils.interpolate(globals.apiUrls.GET_CHART_DATA,
      { testId: testId, metric: metric, site: site, segment: segment, lob: lob,
        page: page, device: device});
    const url = this.nodeServerUrl + api;
    return this.http.get<any>(url);
  }

  getClients(userClientId): any {
    let api = globals.apiUrls.GET_CLIENTS;
    if (userClientId !== undefined && userClientId !== null) {
      api = Utils.interpolate(globals.apiUrls.GET_CLIENT, { clientId: userClientId });
    }
    const url = this.nodeServerUrl + api;
    return this.http.get<any>(url);
  }

  runTest(testId): any {
    const api = Utils.interpolate(globals.apiUrls.RUN_TEST, { testId: testId });
    const url = this.analyticsServerUrl + api;
    return this.http.get<any>(url);
  }

}
