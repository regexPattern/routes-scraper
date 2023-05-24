import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ClientReportsService } from './client-reports.service';
import { NavbarService } from '../commons/services/navbar.service';
import { UserData } from 'src/app/commons/helper/user-data';
import * as globals from '../globalConstants';
import * as constants from './constants';
import * as _ from 'lodash';
import { Utils } from '../utils';
import { PreferencesService } from '../commons/services/preferences.service';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import dayjs from 'dayjs/esm';

import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import 'chartjs-adapter-moment';


@Component({
  selector: 'app-clients',
  templateUrl: './client-reports.component.html',
  styleUrls: ['./client-reports.component.scss']
})
export class ClientReportsComponent implements OnInit {
  public chart;
  public chartData1 = [];
  public chartData2 = [];
  public showAnnotations = false;
  public annotations = [];
  public monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  public showCustomDatePopup = false;
  public selectedDateRange = '1Y';
  public custom = { start: dayjs().subtract(0, 'days'), end: dayjs().add(0, 'days')};

  public savedDateRanges = {
    range1: {startDate: dayjs().subtract(0, 'days'), endDate: dayjs().add(0, 'days'), dateRange: null},
    range2: {startDate: dayjs().subtract(0, 'days'), endDate: dayjs().add(0, 'days'), dateRange: null},
    compareTo: ''};

  public workingDateRanges = {
    range1: {startDate: dayjs().subtract(0, 'days'), endDate: dayjs().add(0, 'days'), dateRange: null},
    range2: {startDate: dayjs().subtract(0, 'days'), endDate: dayjs().add(0, 'days'), dateRange: null},
    compareTo: ''};

  public selectedClientMetric = 'clicks';
  public selectedClientMetricLabel = 'Clicks';

  public ytdMin = null;
  public ytdMax = null
  public avgStart = null;
  public avgTrailing = null
  public compareToPrevious = false;

  public pacificStartDate = new Date('2021-02-01 00:00:00');


  public barChartPlugins = [
    DataLabelsPlugin
  ];

  public user_id = null;
  public user_client_id = null;
  // public lastRunDate;

  public search = null;

  public tabs = ['SUMMARY', 'EMAIL NOTIFICATIONS', 'EXPORT DATA'];
  public selectedTabIndex = 0;

  public activeSort = 'alpha';

  public clientEdit = '';
  public clientSortField = 'name';
  public clientSortOrder = 'ASC';
  public clients = [];
  public selectedClient = {id: null, name: null, url: null, last_run_date: null, logo_filename: null, acronym: null, transaction_column: null, revenue_column: null, api_status: null, start_date: null, end_date: null};
  public clientMetrics = [
    {value: 'clicks', label: 'Clicks'},
    {value: 'impressions', label: 'Impressions'},
    {value: 'ctr', label: 'CTR'}
  ];
  public selectedClientMetricIndex = 0;

  public activePage = 'results';
  public searchFilter = '';
            
  public currentYear;
  public previousYear;

  public categories = [
    {'name': 'ExecSummary', 'label': 'Executive Summary', selected: true},
    {'name': 'SEOPerform', 'label': 'SEO Performance', selected: false},
    {'name': 'DataAcq', 'label': 'Data Acquisition', selected: false},
    {'name': 'DataMonitor', 'label': 'Data Monitor', selected: false}
  ]

  public selectedCategory = {name: null, label: null, selected: false};

  public selectedPerformanceMetric = 'traffic';
  public selectedPerformanceMetricLabel = 'Traffic';
  public selectedPerformancePrior = 'ytd';

  public performancePriorChartValues = [];
  public performancePriorChartOptions;
  public performancePriorChartColors = [];
  public performancePriorChartLabels = [];

  public priorityChartValues = [];
  public priorityChartOptions;
  public priorityChartColors = [];
  public priorityChartLabels = [];

  public trendedViewChartValues = [];
  public trendedViewChartOptions;
  public trendedViewChartColors = [
    {backgroundColor:['#2ACD4E50']}
  ];
  public trendedViewChartLabels = [];

  public performanceFilterChartValues = [];
  public performanceFilterChartOptions;
  public performanceFilterChartColors = [];
  public performanceFilterChartLabels = [];


  public seoTrendingChartValues = [];
  // public seoTrendingChartOptions;
  // public seoTrendingChartColors = [
  //   {backgroundColor: '#07213A', borderColor: "#07213A"},
  //   {backgroundColor: '#4FDB70', borderColor: "#4FDB70"}
  // ];
  // public seoTrendingChartLabels = [];

  public newUsersChartValues = [{data: [62, 38], backgroundColor: ['#07213A', '#4FDB70'], 
    hoverBackgroundColor: ['#07213A', '#4FDB70'], borderColor: ["#07213A", '#4FDB70']}];
  public newUsersChartOptions;
  // public newUsersChartColors = [
  //   {backgroundColor: ['#07213A', '#4FDB70'], borderColor: ["#07213A", '#4FDB70']}
  // ];

  public newUsersChartLabels = ['NEW VISITOR', 'RETURNING VISITOR'];
  public newUsersChange_new = 0;
  public newUsersChange_returning = 0;

  public keywordChartValues = [];
  public keywordChartOptions;
  public keywordChartColors = [
    {backgroundColor: '#8674e2', borderColor: "#8674e2"},
    {backgroundColor: '#d068d0', borderColor: "#d068d0"},
    {backgroundColor: '#ffde29', borderColor: "#ffde29"},
    { backgroundColor: '#00f88f', borderColor: "#00f88f"}
  ];
  public keywordChartLabels = [];

  public current_start_date;
  public current_end_date;
  public prior_start_date;
  public prior_end_date;

  public trendedViews = [];

  public filters = {from_date: null, to_date: null, preset: null, comparison: '1', branded: true, nonbranded: true, mobile: true, desktop: true, tablet: true, entries: [null, null, null, null, null]};
  public showAdvancedFilters = true;
  public priorMetrics = [ ];
  public seoMetrics = [ ];
  public clientFilters = [];

  public priorityFilters = [];

  public showDetails = {bounceRate: true, priorperiod: true, priorfilter: true, 
    pacing: true, ctr: false, usermix: true, keyword: false}
  
  public selectedMetric = {name: null, label: null};

  public selectedPriorPeriod = 'YEAR';
  public passedClientId = null;

  constructor(
    private preferencesService: PreferencesService,
    private navbarService: NavbarService,
    private clientReportsService: ClientReportsService,
    private userData: UserData,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private router: Router
  ) {
    if (this.router.getCurrentNavigation().extras.state !== undefined) {
      this.passedClientId = this.router.getCurrentNavigation().extras.state['clientId'];
    }
  }

  ngOnInit() {
    this.navbarService.onChange();
    this.selectedCategory = this.categories[0];

    this.user_client_id = this.userData.getUser().client_id;
    this.user_id = this.userData.getUser().id;
  
    if (this.user_client_id === null) {
      this.onSearch();
    }

    const today = new Date();
    this.currentYear = today.getFullYear();
    this.previousYear = this.currentYear - 1;

    this.performancePriorChartOptions = _.cloneDeep(constants.chartOptions);
    this.performancePriorChartOptions.plugins.tooltip.callbacks.label = function(context) {
      let current = context.dataset.current;
      let prior = context.dataset.prior;

      if (context.dataset.metric === 'cvr' || context.dataset.metric === 'ctr') {
        current = Utils.formatNumber2(current * 100) + '%';
        prior = Utils.formatNumber2(prior * 100) + '%';
      } else if (context.dataset.metric === 'position' || context.dataset.metric === 'war') {
          current = Utils.formatNumber2(current);
          prior = Utils.formatNumber2(prior);
      } else {
        current = Utils.formatNumber(current);
        prior = Utils.formatNumber(prior);
      }
      return [' Pct Change: ' + Utils.formatNumber2(context.parsed.y) + '%',
        ' Current: ' + current,
        ' Previous: ' + prior];
    };
    // this.performancePriorChartOptions.plugins.tooltip.callbacks.title = function(tooltipItem, chart) {
    //   return chart.datasets[tooltipItem[0].datasetIndex].label;
    // };

    this.priorityChartOptions = _.cloneDeep(constants.chartOptions);
    // this.trendedViewChartOptions = _.cloneDeep(constants.trendingChartOptions);
    this.newUsersChartOptions = _.cloneDeep(constants.donutChartOptions);
    this.keywordChartOptions = _.cloneDeep(constants.trendingChartOptions);
    this.performanceFilterChartOptions = _.cloneDeep(constants.trendingChartOptions);
    this.priorityChartOptions.scales.xAxis.display = true;

    this.onChangeFilters('preset', 'MTD');

  }

  onTabSelect(index) {
    this.selectedTabIndex = index;

  }

  loadClientDetails(index) {
    this.selectedClient = this.clients[index];
    this.clientReportsService.getClient(this.selectedClient.id).subscribe(data => {
      const client = data.result[0];
      this.clientFilters = client.filters;
      for (let i = 0; i < this.clientFilters.length; i++) {
        this.clientFilters[i].selectedValue = [];
      }

      this.activePage = 'setup';
      this.onSelectPerformancePrior('ytd', 'YTD')
      this.getTrendedViews(this.selectedClient.acronym);
      this.onExecuteFilters();
    });

    this.priorMetrics = [];
    this.clientReportsService.getClientPriorMetrics(this.selectedClient.id).subscribe(priorMetrics => {
      for (let i = 0; i < priorMetrics.length; i++) {
        this.priorMetrics.push({name: priorMetrics[i].name, label: priorMetrics[i].label, format: priorMetrics[i].format, current: null, prev_month: null, prev_year: null, detail1: null, detail2: null});
      }
    });

    this.seoMetrics = [];
    this.clientReportsService.getClientSummaryMetrics(this.selectedClient.id).subscribe(summaryMetrics => {
      for (let i = 0; i < summaryMetrics.length; i++) {
        let selected = false;
        if (i === 0) {
          selected = true;
          this.selectedMetric.name = summaryMetrics[i].name;
          this.selectedMetric.label = summaryMetrics[i].label;    
        }
        this.seoMetrics.push({name: summaryMetrics[i].name, label: summaryMetrics[i].label, format: summaryMetrics[i].format, current: null, prev_month: null, prev_year: null, detail1: null, detail2: null, selected: selected});
      }
    });

    this.seoTrendingChartValues = [];
    this.clientReportsService.getClientTrendMetrics(this.selectedClient.id).subscribe(trendMetrics => {
      for (let i = 0; i < trendMetrics.length; i++) {
        let options = _.cloneDeep(constants.trendingChartOptions);
        options.scales.yAxis.title.display = true;
        options.scales.yAxis.title.text = trendMetrics[i].label.toUpperCase();
        // options.scales.xAxis.distribution = 'series';

        if (trendMetrics[i].name === 'ctr' || trendMetrics[i].name === 'cvr' || trendMetrics[i].name === 'bouncerate') {
          options.scales.yAxis.ticks.callback = function(value, index, ticks) {
            return (Math.round(value * 10000) / 100) + '%';
          };
          options.plugins.tooltip.callbacks.label = function(context){
            return context.dataset.label + ': ' + (Math.round(context.parsed.y * 10000) / 100) + '%';
          }
        } else if (trendMetrics[i].name === 'war' || trendMetrics[i].name === 'position') {
          options.scales.yAxis.ticks.callback = function(value, index, ticks) {
            return (Math.round(value * 100) / 100);
          };
          options.plugins.tooltip.callbacks.label = function(context){
            return context.dataset.label + ': ' + (Math.round(context.parsed.y * 100) / 100);
          }
        }
        
        options.elements.line.borderWidth = 2;
        options.elements.point.radius = 1;
        this.seoTrendingChartValues.push({name: trendMetrics[i].name, label: trendMetrics[i].label, show: trendMetrics[i].show, visible: false, options: options, dataset: [{ data: [], label: ' ACTUAL YEAR'},{ data: [], label: ' PRIOR YEAR'}]});
  
      }
    });

    if (this.user_id === 29 || this.user_id === 33) {
      this.onSelectDateRange('1Y');
    }
  }

  onSearchChange(value) {
    if (value === '') {
      this.search = null;
    } else {
      this.search = value;
    }
  }
  onSearchClear() {
    this.search = null;
  }

  onSearch() {
    this.clientReportsService.getClients(this.search, this.clientSortField, this.clientSortOrder).subscribe(data => {
      if (this.search === null) {
        this.searchFilter = 'All Clients';
      } else {
        this.searchFilter = this.search;
      }
      this.clients = data;

      if (this.passedClientId !== null) {
        for (let i = 0; i < this.clients.length; i++) {
          if (this.clients[i].id === this.passedClientId) {
            this.loadClientDetails(i);
            this.passedClientId = null;
            break;
          }
        }
      }
  
    });

    this.selectedTabIndex = 0;
    this.activePage = 'results';
  }

  sortClientResults(fieldName) {
    if (fieldName === this.clientSortField) {
      if (this.clientSortOrder === 'ASC') {
        this.clientSortOrder = 'DESC';
      } else {
        this.clientSortOrder = 'ASC';
      }
    } else {
      this.clientSortField = fieldName;
      this.clientSortOrder = 'ASC';
    }
    this.onSearch();
  }


  onBackToList() {
    this.activePage = 'results';
  }

  onSelectSummaryCategory (index) {
    for (let i = 0; i < this.categories.length; i++) {
      this.categories[i].selected = false;
    }
    this.categories[index].selected = true;
    this.selectedCategory = this.categories[index];    
  }

  onSelectPerformancePrior(value, label) {
    this.selectedPerformancePrior = value;
    const color_red = '#FF0000';
    const color_green = '#2ACD4E'

    this.performancePriorChartColors = [
      {backgroundColor:[color_green]},
      {backgroundColor:[color_green]},
      {backgroundColor:[color_green]},
      {backgroundColor:[color_green]},
      {backgroundColor:[color_green]}
    ];
    this.performancePriorChartValues = [];

    this.performanceFilterChartColors = [
      {backgroundColor:[color_green]},
      {backgroundColor:[color_green]},
      {backgroundColor:[color_green]},
      {backgroundColor:[color_green]},
      {backgroundColor:[color_green]}
    ];
    this.performanceFilterChartValues = [];

    this.clientReportsService.getClientReporting(this.selectedClient.acronym, this.selectedClient.api_status, this.selectedPerformancePrior, this.selectedClient.end_date, this.selectedPriorPeriod).subscribe(result => {
      let date = new Date();
      date = new Date(result.current_start_date);
      this.current_start_date = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
      date = new Date(result.current_end_date);
      this.current_end_date = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
      date = new Date(result.prior_start_date);
      this.prior_start_date = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
      date = new Date(result.prior_end_date);
      this.prior_end_date = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();

      this.performancePriorChartLabels = ['Pct of Prior'];
      this.performancePriorChartValues = [];
      let dataLabel = '% of Prior Year';
      if (this.selectedPriorPeriod === 'PERIOD') {
        dataLabel = '% of Previous Period';
      }
      for (let i = 0; i < this.priorMetrics.length; i++) {
        let backgroundColor = color_green;
        if (this.priorMetrics[i].name === 'position') {
          if (result[this.priorMetrics[i].name] > 0) {
            backgroundColor = color_red;
          }
        } else if (result[this.priorMetrics[i].name] < 0) {
          backgroundColor = color_red;
        }  
        this.performancePriorChartValues.push({ "type": 'bar', metric: this.priorMetrics[i].name, 
        'current': result['current_' + this.priorMetrics[i].name], 'prior': result['prior_' + this.priorMetrics[i].name],
        "data": [result[this.priorMetrics[i].name]], 'label': dataLabel, barPercentage: 0.5, categoryPercentage: 1,
        backgroundColor: backgroundColor, hoverBackgroundColor: backgroundColor, borderColor: backgroundColor});
        // if (this.priorMetrics[i].name === 'position') {
        //   if (result[this.priorMetrics[i].name] > 0) {
        //     this.performancePriorChartColors[i].backgroundColor[0] = color_red;
        //   }
        // } else if (result[this.priorMetrics[i].name] < 0) {
        //   this.performancePriorChartColors[i].backgroundColor[0] = color_red;
        // }  
      }
    });
  }

  getTrendedViews(client) {
    this.trendedViews = [];
    this.clientReportsService.getClientTrendedViews(client, this.selectedClient.api_status, this.selectedClient.end_date).subscribe(result => {
      this.trendedViews = result;
      this.selectedPerformanceMetric = this.priorMetrics[0].name;
      this.selectedPerformanceMetricLabel = this.priorMetrics[0].label;
      this.buildTrendedViewsChart();
      // move to...
    });
  }


  drawPerformanceChart() {
    let series = [];

    if (this.workingDateRanges.compareTo === '') {
       series = [
        {type: 'areaspline', name: this.selectedClientMetricLabel, data: this.chartData1}
      ];
    } else {
      series = [
        {type: 'spline', name: 'Current ' + this.selectedClientMetricLabel, data: this.chartData1, color: '#2ACD4E'},
        {type: 'spline', name: 'Previous ' + this.selectedClientMetricLabel, data: this.chartData2, color: '#07213A'}
      ];
    }

    let annotations = [];
    if (this.showAnnotations && this.annotations.length > 0) {
      for (let i = 0; i < this.annotations.length; i++) {
        const date = new Date(this.annotations[i].annotationDate);
        const annotationDate = this.monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
        const annotationText = this.annotations[i].annotationText;
        const color = this.annotations[i].color;
        annotations.push({
          draggable: '',
          labelOptions: {
            backgroundColor: color
          },
          labels: [{
            point: {
                xAxis: 0,
                yAxis: 0,
                x: date.getTime(),
                y: 0
            },
            x: -30,
            text: annotationText + '<br>' + annotationDate,
            allowOverlap: true
          }]
        });
      }
    }

    let format = '{value:,.0f}';
    let valueDecimals = 0;
    let valueSuffix = '';
    if (this.selectedClientMetric === 'ctr') {
      format = '{value:,.1f}%';
      valueDecimals = 2;
      valueSuffix = '%';
    }
    let legendEnabled = false;
    if (series.length > 1) {
      legendEnabled = true;
    }

    Highcharts.setOptions({
      lang: {
        thousandsSep: ','
      }
    });
    Highcharts.chart('clientApiChart', {
      chart: {
        type: 'areaspline',
        spacing: [5,5,5,5],
        zooming: {
          type: 'x'
        }
      },
      title: {
         text: ''
      },
      yAxis: {
        title: {
          text: this.selectedClientMetricLabel,
          style: {
            fontSize: '10px'
          },
        },
        labels: {
          style: {
            fontSize: '9px'
          },
          x: -8,
          format: format
        },
    
      },
      xAxis: {
        type: 'datetime',
        labels: {
          style: {
            fontSize: '9px'
          }
        },
        dateTimeLabelFormats: {
          day: '%b %e',
          week: '%b %e',
        }
      },
      legend: {
        enabled: legendEnabled,
        itemStyle: {
          fontSize: '9px',
          fontWeight: "normal"
        },
      },
      exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            menuItems: ["viewFullscreen",
                        "separator",
                        "printChart",
                        "downloadPNG",
                        "downloadJPEG",
                        "downloadPDF",
                        "downloadSVG",
                        "separator",
                        "downloadCSV",
                        "downloadXLS",
                        //"viewData",
                        "openInCloud"]
          }
        }
      },
      plotOptions: {
        areaspline: {
          fillColor: {
              linearGradient: {
                  x1: 1,
                  y1: 1,
                  x2: 1,
                  y2: 1
              },
              stops: [
                  [0, '#07213A'],
                  [1, '#07213A']
              ]
          },
          marker: {
              radius: 1,
              fillColor: '#07213A'
          },
          lineWidth: 2,
          lineColor: '#07213A',
          threshold: null
        },
        spline: {
          marker: {
            radius: 1,
          },
          lineWidth: 2,
        }
      },

      credits: {
        enabled: false
      },

      series: series,

      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom'
            }
          }
        }]
      },
      tooltip: {
        dateTimeLabelFormats: {
          hour: '%A, %b %e, %Y' 
        },
        valueDecimals: valueDecimals,
        valueSuffix: valueSuffix,
        shared: true
      },
      annotations: annotations
    });
  
  }
  onSelectDateRange(selection) {
    this.workingDateRanges = _.cloneDeep(this.savedDateRanges); 

    const lastUpdateDate = this.selectedClient.end_date;
    const lastUpdateDate_date = new Date(lastUpdateDate);
    const year = lastUpdateDate_date.getFullYear();
    const month = lastUpdateDate_date.getMonth();
    const daysInMonth = new Date(year, month, 0).getDate();

    if (selection === 'max') {
      this.selectedDateRange = selection;
      this.savedDateRanges.range1.startDate = dayjs(this.selectedClient.start_date);
      this.savedDateRanges.range1.endDate = dayjs(this.selectedClient.end_date);
      this.calculateCompareToDates(this.savedDateRanges);
      // this.savedDateRanges = _.cloneDeep(this.workingDateRanges);
    } else if (selection === 'ytd') {
      this.selectedDateRange = selection;
      this.showCustomDatePopup = false;
      this.savedDateRanges.range1.startDate = dayjs(year + '-01-01')
      this.savedDateRanges.range1.endDate = dayjs(lastUpdateDate)
      this.calculateCompareToDates(this.savedDateRanges);
      // this.savedDateRanges = _.cloneDeep(this.workingDateRanges);
    } else if (selection === '1W') {
      this.selectedDateRange = selection;
      this.showCustomDatePopup = false;
      this.savedDateRanges.range1.endDate = dayjs(lastUpdateDate)
      this.savedDateRanges.range1.startDate = this.savedDateRanges.range1.endDate.subtract(6, 'days')
      this.calculateCompareToDates(this.savedDateRanges);
      // this.savedDateRanges = _.cloneDeep(this.workingDateRanges);
    } else if (selection === '1M') {
      this.selectedDateRange = selection;
      this.showCustomDatePopup = false;
      this.savedDateRanges.range1.endDate = dayjs(lastUpdateDate)
      this.savedDateRanges.range1.startDate = this.savedDateRanges.range1.endDate.subtract((daysInMonth), 'days')
      this.calculateCompareToDates(this.savedDateRanges);
      // this.savedDateRanges = _.cloneDeep(this.workingDateRanges);
    } else if (selection === '3M') {
      this.selectedDateRange = selection;
      this.showCustomDatePopup = false;
      this.savedDateRanges.range1.endDate = dayjs(lastUpdateDate)
      this.savedDateRanges.range1.startDate = this.savedDateRanges.range1.endDate.subtract(90, 'days')
      this.calculateCompareToDates(this.savedDateRanges);
      // this.savedDateRanges = _.cloneDeep(this.workingDateRanges);
    } else if (selection === '1Y') {
      this.selectedDateRange = selection;
      this.showCustomDatePopup = false;
      this.savedDateRanges.range1.endDate = dayjs(lastUpdateDate)
      this.savedDateRanges.range1.startDate = this.savedDateRanges.range1.endDate.subtract(365, 'days')
      this.calculateCompareToDates(this.savedDateRanges);
      // this.savedDateRanges = _.cloneDeep(this.workingDateRanges);
    } else if (selection === 'custom') {
      this.showCustomDatePopup = true;
    } else {
      this.selectedDateRange = selection;
    }
  }

  calculateCompareToDates(dateRanges) {
    if (dateRanges.compareTo === 'period') {
      const diff = (dateRanges.range1.endDate.diff(dateRanges.range1.startDate, 'day') + 1)
      dateRanges.range2.startDate = (dateRanges.range1.startDate.subtract(diff, 'days'))
      dateRanges.range2.endDate = (dateRanges.range1.endDate.subtract(diff, 'days'))
    } else if (dateRanges.compareTo === 'year') {
      dateRanges.range2.startDate = (dateRanges.range1.startDate.subtract(365, 'days'))
      dateRanges.range2.endDate = (dateRanges.range1.endDate.subtract(365, 'days'))
    } else {
      dateRanges.range2.startDate = null;
      dateRanges.range2.endDate = null;
    }

    if (dateRanges.range1.startDate !== null && dateRanges.range1.endDate !== null) {
      dateRanges.range1.dateRange = (dateRanges.range1.startDate.format('MMM DD, YYYY') + ' - ' + dateRanges.range1.endDate.format('MMM DD, YYYY'))
    }
    if (dateRanges.range2.startDate !== null && dateRanges.range2.endDate !== null) {
      dateRanges.range2.dateRange = (dateRanges.range2.startDate.format('MMM DD, YYYY') + ' - ' + dateRanges.range2.endDate.format('MMM DD, YYYY'))
    } else {
      dateRanges.range2.dateRange = null;
    }
    this.getClientAPIResults(dateRanges);
  }

  onCancelCustomDatePopup() {
    this.showCustomDatePopup = false;
    this.getClientAPIResults(this.savedDateRanges);
  }

  onStartDateChanged(event): void {
    this.workingDateRanges.range1.startDate = event.startDate;
    if (this.workingDateRanges.range1.startDate !== null && this.workingDateRanges.range1.endDate !== null) {
      this.workingDateRanges.range1.dateRange = (this.workingDateRanges.range1.startDate.format('MMM DD, YYYY') + ' - ' + this.workingDateRanges.range1.endDate.format('MMM DD, YYYY'))
    }
  }
  onEndDateChanged(event): void {
    this.workingDateRanges.range1.endDate = event.endDate;
    this.calculateCompareToDates(this.workingDateRanges);

  }

  onChangeCompareTo(value) {
    this.workingDateRanges.compareTo = value;
    this.calculateCompareToDates(this.workingDateRanges);
  }

  onCompareToPrevious() {
    this.compareToPrevious = !this.compareToPrevious;
    if (!this.compareToPrevious) {
      this.workingDateRanges.compareTo = '';
      this.calculateCompareToDates(this.workingDateRanges);

    }
  }

  onShowAnnotations() {
    this.showAnnotations = !this.showAnnotations;
    this.drawPerformanceChart();
  }

  onChangeClientMetric(value) {
    this.selectedClientMetric = value;
    for (let i = 0; i < this.clientMetrics.length; i++) {
      if (this.clientMetrics[i].value === value) {
        this.selectedClientMetricIndex = i;
        this.selectedClientMetricLabel = this.clientMetrics[i].label;
        break;
      }
    }
    this.getClientAPIResults(this.savedDateRanges);

  }

  getClientAPIResults(dateRanges) {
    this.clientReportsService.getClientAPIResults(this.selectedClient.acronym, this.selectedClientMetric, dateRanges).subscribe(result => {
      this.chartData1 = result.primary;
      this.chartData2 = result.secondary;
      this.annotations = result.annotations;

      setTimeout(() => {
        this.drawPerformanceChart();
      }, 100);    

    });

    this.clientReportsService.getClientAPISummary(this.selectedClient.acronym, this.selectedClientMetric, this.savedDateRanges).subscribe(result => {
      this.ytdMax = result.ytd_high
      this.ytdMin = result.ytd_low;
      this.avgStart = result.avg_start;
      this.avgTrailing = result.avg_trailing;
    });

  }

  onApplyCustomDatePopup() {
    this.savedDateRanges = _.cloneDeep(this.workingDateRanges);
    this.showCustomDatePopup = false;
    this.selectedDateRange = 'custom'
  }

  buildTrendedViewsChart() {
    const selectedView = this.selectedPerformanceMetric;
    const viewlabel = this.selectedPerformanceMetricLabel;
    let chartValues1 = [];
    let chartValues2 = [];
    this.trendedViewChartValues = [];
    this.trendedViewChartLabels = [];
    for (let i = 0; i < this.trendedViews.length; i++) {
      chartValues1.push(this.trendedViews[i][selectedView]);
      chartValues2.push(this.trendedViews[i]['prior_' + selectedView]);
      this.trendedViewChartLabels.push(globals.months[(this.trendedViews[i].month - 1)].abbr + ' ' + this.trendedViews[i].year);
    }

    this.trendedViewChartValues = [
      { "data": chartValues1, 'label': 'Current Year ', backgroundColor: '#2ACD4E', pointBackgroundColor: '#2ACD4E', pointBorderColor: '#2ACD4E', "borderColor": "#2ACD4E"},
      { "data": chartValues2, 'label': 'Prior Year ', backgroundColor: '#92c6d9', pointBackgroundColor: '#92c6d9', pointBorderColor: '#92c6d9', "borderColor": "#92c6d9"}
      ];  

    this.trendedViewChartOptions = _.cloneDeep(constants.trendingChartOptions);

    this.trendedViewChartOptions.scales.yAxis.title.display = true;
    this.trendedViewChartOptions.scales.yAxis.title.text = viewlabel;
    if (this.selectedPerformanceMetric === 'ctr' || this.selectedPerformanceMetric === 'cvr' || this.selectedPerformanceMetric === 'bouncerate') {
      this.trendedViewChartOptions.scales.yAxis.ticks.callback = function(value, index, ticks) {
        return (Math.round(value * 10000) / 100) + '%';
      };
      this.trendedViewChartOptions.plugins.tooltip.callbacks.label = function(context){
        return context.dataset.label + ': ' + (Math.round(context.parsed.y * 10000) / 100) + '%';
      }
    }

  }

  onSelectPerformanceMetric(value) {
    this.selectedPerformanceMetric = value;
    for (let i = 0; i < this.priorMetrics.length; i++) {
      if (this.priorMetrics[i].name === value) {
        this.selectedPerformanceMetricLabel = this.priorMetrics[i].label;
        break;
      }
    }
    this.buildTrendedViewsChart();
  }

  onChangeFilterEntry(index, value) {
    if (this.clientFilters[index].selectedValue.length > 0) {
      if (this.clientFilters[index].selectedValue[0] === 'all') {
        if (value.length > 1 && value[0] === 'all') {
          value.splice(0, 1)
        } else {
          value = ['all']
        }
      } else {
        if (value.length > 1 && value[0] === 'all') {
          value = ['all']
        }
      }
    }

    if (this.clientFilters[index].selectedValue !== value) {
      this.clientFilters[index].selectedValue = value
      this.getSeoPerformance();
    }
 
  }

  onChangeFilters(name, value) {
    if (value !== undefined) {
      if (this.filters[name] !== value) {
        this.filters[name] = value;
        if (name === 'preset') {
          const today = new Date();
          this.filters['to_date'] = today;
          if (value === 'MTD') {
            const monthStart = new Date((today.getMonth() + 1) + '/01/' + today.getFullYear());
            this.filters['from_date'] = monthStart;
          } else if (value === 'QTD') {
            let monthStart;
            if (today.getMonth() < 3) {
              monthStart = new Date('01/01/' + today.getFullYear());
            } else if (today.getMonth() < 6) {
              monthStart = new Date('04/01/' + today.getFullYear());
            } else if (today.getMonth() < 9) {
              monthStart = new Date('07/01/' + today.getFullYear());
            } else if (today.getMonth() < 12) {
              monthStart = new Date('10/01/' + today.getFullYear());
            }
            this.filters['from_date'] = monthStart;
          } else if (value === 'YTD') {
            const monthStart = new Date('01/01/' + today.getFullYear());
            this.filters['from_date'] = monthStart;
          }
        } else if (name === 'to_date' || name === 'from_date') {
          this.filters['preset'] = '';
        }
        this.onExecuteFilters();
      }
    }
  }

  onExecuteFilters() {
    if (this.selectedClient.acronym !== null ) {

      let branded = null;
      if (this.filters.branded && !this.filters.nonbranded) {
        branded = 1;
      } else if (this.filters.nonbranded && !this.filters.branded) {
        branded = 0;
      }


      let device = null;
      if (this.filters.mobile) {
        device = 'MOBILE';
      } 
      if (this.filters.desktop) {
        if (device !== null) {
          device += ';DESKTOP';
        } else {
          device = 'DESKTOP';
        }
      } 
      if (this.filters.tablet) {
        if (device !== null) {
          device += ';TABLET';
        } else {
          device = 'TABLET';
        }
      }
      const start_date = this.filters.from_date.getFullYear() + '-' + (this.filters.from_date.getMonth() + 1) + '-' + this.filters.from_date.getDate()
      const end_date = this.filters.to_date.getFullYear() + '-' + (this.filters.to_date.getMonth() + 1) + '-' + this.filters.to_date.getDate();

      let filters = {start_date: start_date, end_date: end_date, device: device, branded: branded};

      let clientFilters = [null, null, null, null, null];
      for (let i = 0; i < this.clientFilters.length; i++) {
        clientFilters[i] = this.clientFilters[i].selectedValue;
      }

      for (let x = 0; x < this.seoTrendingChartValues.length; x++) {
        this.seoTrendingChartValues[x].visible = false;
      }

      this.clientReportsService.getSeoPerformance(this.selectedClient.acronym, this.selectedClient.api_status, filters, clientFilters, this.selectedPriorPeriod).subscribe(result => {
        for (let x = 0; x < this.seoTrendingChartValues.length; x++) {
          this.seoTrendingChartValues[x].dataset[0].data = [];
          this.seoTrendingChartValues[x].dataset[1].data = [];
          for (let i = 0; i < result.trends.length; i++) {
            this.seoTrendingChartValues[x].dataset[0].data.push({x: new Date(result.trends[i].activity_date), y: result.trends[i][this.seoTrendingChartValues[x].name]});
            this.seoTrendingChartValues[x].dataset[1].data.push({x: new Date(result.trends[i].activity_date), y: result.trends[i]['previous_' + this.seoTrendingChartValues[x].name]});
          }
          this.seoTrendingChartValues[x].dataset[0].backgroundColor = '#07213A'
          this.seoTrendingChartValues[x].dataset[0].pointBackgroundColor = '#07213A'
          this.seoTrendingChartValues[x].dataset[0].borderColor = '#07213A'
          this.seoTrendingChartValues[x].dataset[1].backgroundColor = '#4FDB70'
          this.seoTrendingChartValues[x].dataset[1].pointBackgroundColor = '#4FDB70'
          this.seoTrendingChartValues[x].dataset[1].borderColor = '#4FDB70'       
        }      

        for (let x = 0; x < this.seoTrendingChartValues.length; x++) {
          this.seoTrendingChartValues[x].visible = true;
        }

        this.newUsersChartValues = [{data: [result.new_visitors, result.returning_visitors],
          backgroundColor: ['#07213A', '#4FDB70'], hoverBackgroundColor: ['#07213A', '#4FDB70'], borderColor: ["#07213A", '#4FDB70']}
        ];

        this.newUsersChange_new = (result.new_visitors - result.month_new_visitors) / result.month_new_visitors;
        this.newUsersChange_returning = (result.returning_visitors - result.month_returning_visitors) / result.month_returning_visitors;
      
        for (let i = 0; i < this.seoMetrics.length; i++) {
          if (this.seoMetrics[i].format === 'number1') {
            this.seoMetrics[i].current = numberFormat(result.current[this.seoMetrics[i].name], 1);
            this.seoMetrics[i].prev_month = numberFormat(result.previous_month[this.seoMetrics[i].name], 1);
            this.seoMetrics[i].prev_year = numberFormat(result.previous_year[this.seoMetrics[i].name], 1);
          } else if (this.seoMetrics[i].format === 'number2') {
            this.seoMetrics[i].current = numberFormat(result.current[this.seoMetrics[i].name], 2);
            this.seoMetrics[i].prev_month = numberFormat(result.previous_month[this.seoMetrics[i].name], 2);
            this.seoMetrics[i].prev_year = numberFormat(result.previous_year[this.seoMetrics[i].name], 2);
          } else if (this.seoMetrics[i].format === 'percent') {
            this.seoMetrics[i].current = numberFormat((result.current[this.seoMetrics[i].name] * 100), 2) + '%';
            this.seoMetrics[i].prev_month = numberFormat((result.previous_month[this.seoMetrics[i].name] * 100), 2) + '%';
            this.seoMetrics[i].prev_year = numberFormat((result.previous_year[this.seoMetrics[i].name] * 100), 2) + '%';
          } else if (this.seoMetrics[i].format === 'currency0') {
            this.seoMetrics[i].current = '$' + numberFormat(result.current[this.seoMetrics[i].name]);
            this.seoMetrics[i].prev_month = '$' + numberFormat(result.previous_month[this.seoMetrics[i].name]);
            this.seoMetrics[i].prev_year = '$' + numberFormat(result.previous_year[this.seoMetrics[i].name]);
          } else if (this.seoMetrics[i].format === 'currency2') {
            this.seoMetrics[i].current = '$' + numberFormat(result.current[this.seoMetrics[i].name], 2);
            this.seoMetrics[i].prev_month = '$' + numberFormat(result.previous_month[this.seoMetrics[i].name], 2);
            this.seoMetrics[i].prev_year = '$' + numberFormat(result.previous_year[this.seoMetrics[i].name], 2);
          } else {
            this.seoMetrics[i].current = numberFormat(result.current[this.seoMetrics[i].name]);
            this.seoMetrics[i].prev_month = numberFormat(result.previous_month[this.seoMetrics[i].name]);
            this.seoMetrics[i].prev_year = numberFormat(result.previous_year[this.seoMetrics[i].name]);
          }
          if (this.seoMetrics[i].name === 'war' || this.seoMetrics[i].name === 'position') {
            this.seoMetrics[i].detail1 = (result.current[this.seoMetrics[i].name] - result.previous_month[this.seoMetrics[i].name]);
            this.seoMetrics[i].detail2 = (result.current[this.seoMetrics[i].name] - result.previous_year[this.seoMetrics[i].name]);
          } else {
            this.seoMetrics[i].detail1 = (result.current[this.seoMetrics[i].name] - result.previous_month[this.seoMetrics[i].name]) / result.previous_month[this.seoMetrics[i].name];
            this.seoMetrics[i].detail2 = (result.current[this.seoMetrics[i].name] - result.previous_year[this.seoMetrics[i].name]) / result.previous_year[this.seoMetrics[i].name];
          }
        }   
      });
      this.loadPriorityChart();

    }


    function numberFormat(value, precision=0) {
      let formattedValue;
      if (value > 10000000) {
        formattedValue = Utils.formatNumber2(value / 1000000000) + 'B'
      } else if (value > 1000000) {
        formattedValue = Utils.formatNumber2(value / 1000000) + 'M'
      } else if (value > 100000) {
        formattedValue = Utils.formatNumber1(value / 1000) + 'k'
      } else {
        if (precision === 1) {
          formattedValue = Utils.formatNumber1(value)
        } else if (precision === 2) {
          formattedValue = Utils.formatNumber2(value)
        } else {
          formattedValue = Utils.formatNumber(value)
        }
      }
      return formattedValue;
    }
  }

  onChangePriorityMetric(value) {
    this.selectedMetric = {name: null, label: null};
    for (let i = 0; i < this.seoMetrics.length; i++) {
      if (this.seoMetrics[i].name === value) {
        this.seoMetrics[i].selected = true;
        this.selectedMetric.name = this.seoMetrics[i].name;
        this.selectedMetric.label = this.seoMetrics[i].label;
      } else {
        this.seoMetrics[i].selected = false;
      }
    }

    this.loadPriorityChart();
  }

  loadPriorityChart() {
    let branded = null;
    if (this.filters.branded && !this.filters.nonbranded) {
      branded = 1;
    } else if (this.filters.nonbranded && !this.filters.branded) {
      branded = 0;
    }


    let device = null;
    if (this.filters.mobile) {
      device = 'MOBILE';
    } 
    if (this.filters.desktop) {
      if (device !== null) {
        device += ';DESKTOP';
      } else {
        device = 'DESKTOP';
      }
    } 
    if (this.filters.tablet) {
      if (device !== null) {
        device += ';TABLET';
      } else {
        device = 'TABLET';
      }
    }
    const start_date = this.filters.from_date.getFullYear() + '-' + (this.filters.from_date.getMonth() + 1) + '-' + this.filters.from_date.getDate()
    const end_date = this.filters.to_date.getFullYear() + '-' + (this.filters.to_date.getMonth() + 1) + '-' + this.filters.to_date.getDate();

    let filters = {start_date: start_date, end_date: end_date, device: device, branded: branded};

    let clientFilters = [null, null, null, null, null];
    for (let i = 1; i < this.clientFilters.length; i++) {
      clientFilters[i] = this.clientFilters[i].selectedValue;
    }

    const color_red = '#FF0000';
    const color_green = '#2ACD4E'
    this.priorityChartOptions.scales.yAxis.title.display = true;
    this.priorityChartOptions.scales.yAxis.title.text = this.selectedMetric.label + ' Performance';
    this.priorityChartOptions.plugins.datalabels.formatter = (value, ctx) => {
          return Utils.formatNumber2(value) + '%'
        };
    this.priorityChartOptions.plugins.tooltip.callbacks.label = function(context) {
      return [' Pct Change: ' + Utils.formatNumber2(context.parsed.y) + '%',
        ' Current: ' + Utils.formatNumber(context.dataset.current),
        ' Previous: ' + Utils.formatNumber(context.dataset.previous)];
    };

    this.clientReportsService.getPriorityMetrics(this.selectedClient.acronym, filters, clientFilters, this.selectedMetric.name, this.selectedPriorPeriod).subscribe(result => {
      this.priorityChartLabels = [];
      this.priorityChartValues = [];
      this.priorityChartColors = [{backgroundColor: []}];
      let data = [];
      let backgroundColor = [];
      for (let i = 0; i < result.length; i++) {
        data.push(result[i].diff);
        if (result[i].diff < 0) {
          backgroundColor.push([color_red]);
        } else {
          backgroundColor.push([color_green]);
        }
        this.priorityChartLabels.push([result[i].filter])
      }
      this.priorityChartValues.push(
        { "type": 'bar', "data": data, 'result': result, 'label': this.selectedMetric.label + ' Movement', 
        barPercentage: 0.5, categoryPercentage: 1, 
        backgroundColor: backgroundColor, borderColor: backgroundColor, hoverBackgroundColor: backgroundColor }
      );
    });

  }

  onShowDetails(name) {
    this.showDetails[name] = !this.showDetails[name]
  }

  onShowTrendingDetails(index) {
    this.seoTrendingChartValues[index].show = !this.seoTrendingChartValues[index].show
  }
  onShowAdvanceFilters() {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  getSeoPerformance() {
    this.onExecuteFilters();
  }

  onChangePriorPeriod(value) {
    this.selectedPriorPeriod = value;
    if (this.selectedPriorPeriod === 'YEAR') {
      this.performancePriorChartOptions.scales.yAxis.title = {display: true, text: '% of Prior Year'};
      // this.performancePriorChartOptions.scales.yAxis.scaleLabel.labelString = '% of Prior Year';
    } else if (this.selectedPriorPeriod === 'PERIOD') {
      this.performancePriorChartOptions.scales.yAxis.title = {display: true, text: '% of Previous Period'};
      // this.performancePriorChartOptions.scales.yAxis.scaleLabel.labelString = '% of Previous Period';
    }
    this.performancePriorChartOptions.plugins.tooltip.callbacks.title = function(context, chart) {
      return context.label;
    };
    this.onSelectPerformancePrior(this.selectedPerformancePrior, '');

    this.onExecuteFilters();
  }

}
