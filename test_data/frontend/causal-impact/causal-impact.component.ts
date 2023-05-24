import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { UserData } from 'src/app/commons/helper/user-data';
import { NavbarService } from 'src/app/commons/services/navbar.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CausalService } from './causal.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { CausalOutputsComponent } from '../causal-outputs/causal-outputs.component';
import { Subscription } from 'rxjs';
import * as globals from 'src/app/globalConstants';
import * as _ from 'lodash';
import { Utils } from '../utils';
// import * as ChartAnnotation from 'chartjs-plugin-annotation';
import {default as Annotation} from 'chartjs-plugin-annotation';
import * as Highcharts from 'highcharts';
import * as constants from './constants';


// import * as Chart from 'chart.js';
import { ChartOptions, ChartType, Chart } from "chart.js";
// import { BaseChartDirective } from 'ng2-charts';

import { QuestionComponent } from '../commons/dialogs/question/question.component';

@Component({
  selector: 'app-causal-impact',
  templateUrl: './causal-impact.component.html',
  styleUrls: ['./causal-impact.component.scss']
})
export class CausalImpactComponent implements OnInit, OnDestroy {
  // @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartPlugins = [
    Annotation
  ];

  public analysisTypes = [];
  public hierarchies = [];

  public activePage = 'results';
  public results = [];
  public archivedResults = [];
  public search = null;
  public sortField = 'c.date_updated';
  public sortOrder = 'DESC';
  public searchFilter = '';

  public sortCompletedField = 'c.date_updated';
  public sortCompletedDirection = 'DESC';
  public sortCompletedOrderBy = 'c.date_updated DESC';

  public clients: any;

  public metrics: any;

  public causalTest: any;

  public authorUserId: any;
  public userFirstName = '';
  public userLastName = '';

  public selectedTest: any;

  public outputs: any;

  public selectedFile: any;
  public selectedFileName = '';
  public importReady = false;
  public importDone = false;
  public importCount = 0;
  public importCountPre = '';
  public importCountPost = 'No records loaded';
  public importPctComplete = 0;

  public errorsFound = false;
  public test_name_error = false;

  public resultId = null;
  public visualization = '';
  public metric = '';
  public platform = '';
  public pageType = '';
  public period = '';
  public plot = '';

  public summary_prediction = 0;
  public summary_actual = 0;
  public summary_py_actual = 0;
  public summary_relative_impact = 0;
  public summary_yoy = 0;
  public summary_absolute_impact = 0;
  public summary_significance = '';
  public summary_confidence = 0;
  public summary_explanation = '';
  public summary_synthetic = '';

  public showOriginalChart = true;
  public showCumulativeChart = true;
  public showPointwiseChart = true;
  public showArchivedTests = false;

  public checkStatus = false;

  public clearSourceData = false;

  public metricList = [
    {'id': 'aov', 'label': 'AVG ORDER VALUE', 'mixed': 'Avg Order Value', 'visible': false},
    {'id': 'br', 'label': 'BOUNCE RATE', 'mixed': 'Bounce Rate', 'visible': false},
    {'id': 'clicks', 'label': 'CLICKS', 'mixed': 'Clicks', 'visible': false},
    {'id': 'ctr', 'label': 'CTR', 'mixed': 'CTR', 'visible': false},
    {'id': 'cvr', 'label': 'CONVERSION RATE', 'mixed': 'Conversion Rate', 'visible': false},
    {'id': 'impressions', 'label': 'IMPRESSIONS', 'mixed': 'Impressions', 'visible': false},
    {'id': 'orders', 'label': 'CONVERSIONS', 'mixed': 'Conversions', 'visible': false},
    {'id': 'revenue', 'label': 'REVENUE', 'mixed': 'Revenue', 'visible': false},
    {'id': 'visitors', 'label': 'VISITS', 'mixed': 'Visits', 'visible': false},
    {'id': 'war', 'label': 'WEIGHTED AVG RANK', 'mixed': 'Weighted Avg Rank', 'visible': false}
  ];

  public subscription: Subscription | undefined;

  public chartFilters = {site_name: [], segment: [], page_lob: [], page_type: [], device: [], metric: [] };
  public selectedSegment: any;
  public selectedPageLOB: any;
  public selectedSiteName: any;
  public selectedPageType: any;
  public selectedSitePlatform: any;
  public selectedMetric: any;
  public selectedMetricLabel = '';
  public selectedMetricMixed = '';

  public showChart1 = false;
  public showChart2 = false;
  public showChart3 = false;

  public chartLabels: Array<any> = [];
  public chartExtendedLabels: Array<any> = [];
  public chartColors = [];
  public chartColors2 = [];
  public chartColors3 = [];
  public chartOptions: any;

  public chart1Values: Array<any> = [];
  public chart2Values: Array<any> = [];
  public chart3Values: Array<any> = [];

  public hints = {};

  public user_client_id = null;

  constructor(
    private navbarService: NavbarService,
    private causalService: CausalService,
    private toastr: ToastrService,
    private userData: UserData,
    public dialog: MatDialog,
    private gtmService: GoogleTagManagerService
  ) {
    Chart.register(Annotation);

  }

  ngOnInit() {
    this.navbarService.onChange();

    Highcharts.setOptions({
      lang: {
        thousandsSep: ','
      }
    });

    this.user_client_id = this.userData.getUser().client_id;



    // const namedChartAnnotation = ChartAnnotation;
    //   namedChartAnnotation['id'] = 'annotation';
    //   Chart.register(namedChartAnnotation);

    this.causalService.getMetaHierarchies().subscribe(data => {
      this.hierarchies = data;
    });

    this.causalService.getClients(this.user_client_id).subscribe(data => {
      this.clients = data.result;
    });

    this.causalService.getMetaKpis().subscribe(data => {
      this.metrics = data;
    });
    this.causalService.getMetaTypes().subscribe(data => {
      this.analysisTypes = data;
    });

    this.authorUserId = this.userData.getUser().id;
    this.userFirstName = this.userData.getUser().first_name;
    this.userLastName = this.userData.getUser().last_name;

    this.setHints();

    this.onSearch();
  }

  setHints() {
    this.hints['statsig'] = `Statistical Significance is achieved when the results are deemed unlikely to occur by chance.  Confidence Interval is used to define the threshold for achieving Statistical Significance.  Our default Confidence Interval is 95% which means a 'Statistically Significant' result has less than a 5% likelihood of being caused by chance.`;
    this.hints['prediction'] = `Prediction, also referred to as a 'synthetic control' is the projection that Causal Impact generates on the premise that this is what performance would have been if the event did not take place.`;  
    this.hints['actual'] = `This reflects your actual performance for comparison to what Causal Impacts predicts would have happened if no event had taken place.`;
    this.hints['synthetic'] = `The Synthetic Control attribute identifies what inputs were used to generate the prediction of perfromance.  CY/PY leverages prior year data to determine seasonality and current year to determine trajectory and will generate a more confident model than when CY Only is used.`;
    this.hints['yoy'] = `% Difference of Actuals to Prior Year Performance 
    Calculation: ((Current Year/Prior Year)-1)`;
    this.hints['py'] = `Prior year data is included for reference as it is valuable in comparing how well the prediction follows seasonality, and how the model predicts your business will perform compared to previous performance.`;
    this.hints['absoluteimpact'] = `Absolute Impact shows the cumulative impact of performance for the entire period following the event.
    Calculation: Sum(Post Event Actuals) - Sum(Post Event Prediction)`;
    this.hints['relativeimpact'] = `Relative Effect shows the cumulative variance % of performance for the entire period following the event.
    Calculation: (Sum(Post Event Actuals) / Sum(Post Event Prediction)) - 1`;
 
    this.hints['originalPlot'] = `Performance:  This plot shows actual performance compared to the prediction, or synthetic control.  This allows you to see if performance (Actual) diverged from the prediction following the event.`;
    this.hints['originalEvent'] = `This represents the point from which performance will be compared to the prediction.  It can be just about anything, from a Google algorithm update, a test, or a site migration.`;
    this.hints['originalActual'] = `Actual:  ​This line represents actual performance which will be compared to the prediction generated by Causal Impact.`;
    this.hints['originalPrediction'] = `Prediction:  ​This line represents a statistically generated prediction of where performance is expected to trends.  The model takes historical seasonality and recent trajectory to generate the most accurate model possible.`;
    this.hints['originalMargin'] = `Upper/Lower Margin of Error:  These lines represent the confidence interval indicating statistical significant results.  Default confidence interval is 95%`;

    this.hints['pointwisePlot'] = `Daily Impact:  This plot shows the difference between performance (Actual) and the prediction on a daily basis.  In this chart, the Y-axis represents the prediction and the Actual series represents the difference from control.`;
    this.hints['pointwiseEvent'] = `Event: This represents the point from which performance will be compared to the prediction.  It can be just about anything, from a Google algorithm update, a test, or a site migration.`;
    this.hints['pointwiseActual'] = `Actual:  ​This line represents the difference in actual performance compared to the prediction generated by Causal Impact on a dialy basis`;
    this.hints['pointwisePrediction'] = `Prediction:  ​This is represented as the x-axis in this plot.`;
    this.hints['pointwiseMargin'] = `Upper/Lower Margin of Error:  These lines represent the confidence interval indicating statistical significant results.  Default confidence interval is 95%`;

    this.hints['cumulativePlot'] = `Cumulative:  This plot shows the cumulative impact on performance compared to the prediction since the Event date.  This chart is not applicable for certain metrics like Conversion Rate, Weighted Avg. Rank (WAR), and Bounce Rate`;
    this.hints['cumulativeEvent'] = `Event: This represents the point from which performance will be compared to the prediction.  It can be just about anything, from a Google algorithm update, a test, or a site migration.`;
    this.hints['cumulativeActual'] = `Actual:  ​This line represents cumulative actual performance since the date of the event.`;
    this.hints['cumulativeMargin'] = `Upper/Lower Margin of Error:  These lines represent the confidence interval indicating statistical significant results.  Default confidence interval is 95%`;
    
  }

  onChangeClearSourceData(event) {
    this.clearSourceData = event.checked;
  }

  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
    this.selectedFileName = this.selectedFile.name;
    this.importReady = true;
  }

  importTestOutputs() {
    this.test_name_error = false;
    if (this.causalTest['name'] === null || this.causalTest['name'] === '') {
      this.test_name_error = true;
      this.toastr.error('Test Name must be entered before importing.');
    } else if (this.selectedFile === undefined || this.causalTest['name'] === null) {
      this.toastr.error('Select a file to import using Browse Files first, then Import.');
    } else {
      this.startUpload();
      this.importDone = true;
      // this.selectedFile = null;
      // this.selectedFileName = '';
      this.importReady = false;
    }
  }


  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.causalTest.hierarchies, event.previousIndex, event.currentIndex);
    this.onSaveParameters();
}

  onChangeName(value) {
    this.causalTest.name = value;
    this.causalService.getTestByName(this.causalTest['name']).subscribe(result => {
      if (result.length > 0) {
        this.toastr.error('The name you entered already exists, enter a new Name of Test.');
      } else {
        this.onSaveParameters();
      }
    });
  }

  onChangeTestParameter(name, value) {
    if (this.causalTest[name] !== value) {
      this.causalTest[name] = value;
      this.onSaveParameters();
    }
    if (name === 'pre_period') {
      var date = new Date(this.causalTest['event_date']);
      date.setDate(date.getDate() - Number(value));
      this.causalTest['pre_period_date'] = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    } else if (name === 'post_period') {
      var date = new Date(this.causalTest['event_date']);
      date.setDate(date.getDate() + Number(value));
      this.causalTest['post_period_date'] = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    }
  }

  onChangeTertiaryKPI(event, index) {
    if (event.value === 'delete') {
      this.causalTest.kpis.splice(index, 1);
    } else {
      this.causalTest.kpis[index].id = event.value;
      this.causalTest.kpis[index].label = event.source.selected.viewValue;
    }
    this.onSaveParameters();

  }

  addKPI() {
    this.causalTest.kpis.push({id: null, label: null});
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

  onSearch(testId = null) {
    // push GTM data layer with a custom event
    const gtmTag = {
          event: 'content-view',
          data: 'CausalImpactSearchResults',
        };
    this.gtmService.pushTag(gtmTag);
    
    this.causalService.getResults(this.user_client_id, this.authorUserId, this.search, this.sortField, this.sortOrder).subscribe(result => {
      if (this.search === null) {
        this.searchFilter = 'All Tests';
      } else {
        this.searchFilter = this.search;
      }
      this.results = result;
      if (testId !== null) {
        for (let i = 0; i < this.results.length; i++) {
          if (this.results[i].id === testId) {
            if (this.results[i].pct_complete < 100) {
              if (this.results[i].pct_complete === 0) {
                this.results[i].pct_complete = 1;
              }
              this.checkStatus = true;
            } else {
              this.checkStatus = false;
            }
          }
        }
      }
    });

    this.onShowArchivedTests(true);

    this.activePage = 'results';
  }

  onShowArchivedTests(noChange = false) {
    if (!noChange) {
      this.showArchivedTests = !this.showArchivedTests;
    }
    if (this.showArchivedTests === true) {
      this.causalService.getArchivedResults(this.user_client_id, this.authorUserId, this.search, this.sortField, this.sortOrder).subscribe(result => {
        this.archivedResults = result;
      });
    }
  }

  onVisualizationChange(value) {
    this.visualization = value;
  }

  onPlatformChange(value) {
    this.platform = value;
  }

  onPageTypeChange(value) {
    this.pageType = value;
  }

  onPeriodChange(value) {
    this.period = value;
  }

  onPlotChange(value) {
    this.plot = value;
  }

  onHierarchyChange(event, index) {
    this.causalTest.hierarchies[index].id = event.value;
    this.causalTest.hierarchies[index].label = event.source.selected.viewValue;
    this.onSaveParameters();
  }

  onRunTest(testId, testName, eventDate, pre, post) {
    if (testId === null || testId === undefined) {
      this.toastr.error('You must create a named Test before a Run can be submitted.');
    } else {
      const eventDate_date = new Date(eventDate)
      this.causalService.getDateRange(testId, pre, post).subscribe(dateRange => {
        let min_date = new Date(dateRange.min_date);
        min_date = min_date
        let max_date = new Date(dateRange.max_date);
        if (eventDate_date < min_date || eventDate_date > max_date) {
          this.toastr.error('Event Date is outside the range of the Imported Test data.');
        } else {
          for (let i = 0; i < this.results.length; i++) {
            if (this.results[i].id === testId) {
              this.results[i].pct_complete = 1;
              break;
            }
          }
          this.activePage = 'results';
          // this.causalService.updatePctComplete(testId, 0).subscribe(data => {
            this.causalService.runTest(testId).subscribe(result => {
              this.toastr.info('The test: [' + testName + '] has been submitted for execution');
            });
          // });
        }
      });
    }
  }

  onRefresh(testId) {
    this.onSearch(testId);
  }

  onDelete(testId, testName) {
    const dialogRef = this.dialog.open(QuestionComponent, {
      data: { message: 'Are you sure you want to delete ' + testName + '?',
        cancel: false }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.value === 'YES') {
        this.causalService.deleteTest(testId).subscribe(data => {
          this.toastr.info('The test: [' + testName + '] has been deleted');
          this.onSearch();
        });
      }
    });
  }

  onArchive(testId, testName) {
    const dialogRef = this.dialog.open(QuestionComponent, {
      data: { message: 'Are you sure you want to archive this ' + testName + '?',
        cancel: false }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.value === 'YES') {
        this.causalService.archiveTest(testId).subscribe(data => {
          this.toastr.info('The test: [' + testName + '] has been archived');
          this.onSearch();
        });
      }
    });
  }

  executeTest(test) {
    this.selectedTest = test;
    this.causalService.getChartFilters(test.id).subscribe(data => {
      this.chartFilters = data;
      this.selectedSegment = this.chartFilters.segment[0];
      this.selectedPageLOB = this.chartFilters.page_lob[0];
      this.selectedSiteName = this.chartFilters.site_name[0];
      this.selectedPageType = this.chartFilters.page_type[0];
      this.selectedSitePlatform = this.chartFilters.device[0];
      this.selectedMetric = null;
      for (let i = 0; i < this.metricList.length; i++) {
        this.metricList[i].visible = false;
        for (let x = 0; x < this.chartFilters.metric.length; x++) {
          if (this.metricList[i].id === this.chartFilters.metric[x]) {
            this.metricList[i].visible = true;
            if (this.selectedMetric === null) {
              this.selectedMetric = this.chartFilters.metric[x];
            }
          }
        }
      }
      this.onMetricChange(this.selectedMetric);

      this.activePage = 'charts';
    });

  }

  returnToSearch() {
    this.activePage = 'setup';
  }

  newTest() {
    this.causalTest = {id: null, name: null, analysis_type: this.analysisTypes[0].id,
      event_date: new Date(), pre_period: null, post_period: null, hypothesys: null,
      author_first_name: null, author_last_name: null, client_id: this.user_client_id,
      hierarchies: [], kpis: [{id: null, label: null}, {id: null, label: null}, {id: null, label: null}]};

    if (this.hierarchies !== null) {
      for (let i = 0; i < this.hierarchies.length; i++) {
        if (this.hierarchies[i].default === 1) {
          this.causalTest.hierarchies.push({id: this.hierarchies[i].id});
        }
      }
    }

    this.activePage = 'setup';
  }

  sortResults(fieldName) {
    if (fieldName === this.sortField) {
      if (this.sortOrder === 'ASC') {
        this.sortOrder = 'DESC';
      } else {
        this.sortOrder = 'ASC';
      }
    } else {
      this.sortField = fieldName;
      this.sortOrder = 'ASC';
    }
    this.onSearch();
  }

  addHierarchy() {
    this.causalTest.hierarchies.push({id: this.hierarchies[0].id, label: this.hierarchies[0].label});
    this.onSaveParameters();
  }

  removeHierarchy(index) {
    this.causalTest.hierarchies.splice(index, 1);
    this.onSaveParameters();
  }

  onEditParameters(resultId) {
    this.causalService.getParametersById(resultId).subscribe(result => {
      this.causalTest = result[0];
      this.causalTest['event_date'] = new Date(this.causalTest['event_date']);
      if (this.causalTest.kpis.length === 0) {
        this.causalTest.kpis.push({id: null, label: null});
        this.causalTest.kpis.push({id: null, label: null});
        this.causalTest.kpis.push({id: null, label: null});
      } else if (this.causalTest.kpis.length === 1) {
        this.causalTest.kpis.push({id: null, label: null});
        this.causalTest.kpis.push({id: null, label: null});
      } else if (this.causalTest.kpis.length === 2) {
        this.causalTest.kpis.push({id: null, label: null});
      }

      this.activePage = 'setup';

      this.getTestOutputs();
    });

  }

  onSaveParameters() {
    // --------------------------------------
    //  dont save until you have a name
    // --------------------------------------
    if (this.causalTest['name'] === null || this.causalTest['name'] === '') {
      return;
    }

    if (this.causalTest['author_first_name'] === null) {
      this.causalTest['author_user_id'] = this.authorUserId;
      this.causalTest['author_first_name'] = this.userFirstName;
    }
    if (this.causalTest['author_last_name'] === null) {
      this.causalTest['author_user_id'] = this.authorUserId;
      this.causalTest['author_last_name'] = this.userLastName;
    }

    this.causalService.saveParameters(this.causalTest).subscribe(saveResult => {
      if (this.causalTest['id'] === null) {
        this.toastr.info('The Causal Test: [' + this.causalTest.name + '] has been created.');
        this.onEditParameters(saveResult.insertId);
      }
    });
  }


  onShowTestOutputs() {
    if (this.outputs !== undefined) {
      if (this.outputs.length > 0) {
        let dialogRef;
        dialogRef = this.dialog.open(CausalOutputsComponent, { data: {outputs: this.outputs} });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
          }
        });
      }
    }
  }

  getTestOutputs() {
    this.causalService.getTestInputsCount(this.causalTest['id']).subscribe(data => {
      if (data[0].count > 0) {
        this.importDone = true;
        this.importCount = data[0].count;
        this.importCountPre = '';
        this.importCountPost = 'records loaded and ready for processing';
      } else {
        this.importDone = false;
        this.importCount = 0;
        this.importCountPre = '';
          this.importCountPost = 'No records loaded';
      }
    });
    this.causalService.getTestInputs(this.causalTest['id'], 10000).subscribe(data => {
      this.outputs = data;
      // this.getInputs(runForecast);
    });

  }

  onMetricChange(value) {
    this.selectedMetric = value;
    for (let i = 0; i < this.metricList.length; i++) {
      if (this.metricList[i].id === value) {
        this.selectedMetricLabel = this.metricList[i].label;
        this.selectedMetricMixed = this.metricList[i].mixed;
        break;
      }
    }
    this.showCharts(this.selectedTest.id);
  }

  onChartFilterChange(filterName, value) {
    if (filterName === 'site_name') {
      this.selectedSiteName = value;
    }
    if (filterName === 'segment') {
      this.selectedSegment = value;
    }
    if (filterName === 'page_lob') {
      this.selectedPageLOB = value;
    }
    if (filterName === 'page_type') {
      this.selectedPageType = value;
    }
    if (filterName === 'device') {
      this.selectedSitePlatform = value;
    }

    this.showCharts(this.selectedTest.id);
  }

  onHideOriginal() {
    this.showOriginalChart = !this.showOriginalChart;
  }
  onHideCumulative() {
    this.showCumulativeChart = !this.showCumulativeChart;
  }
  onHidePointwise() {
    this.showPointwiseChart = !this.showPointwiseChart;
  }

  showCharts(testId) {
    this.chartColors = [];
    this.chartColors.push({backgroundColor: '#10282F', borderColor: '#10282F', borderWidth: 3});
    this.chartColors.push({backgroundColor: '#50eef7', borderColor: '#50eef7', borderWidth: 3});
    this.chartColors.push({backgroundColor: 'orange', borderColor: 'orange', borderWidth: 3});
    this.chartColors.push({backgroundColor: '#ffffff', borderColor: '#ffffff'});
    this.chartColors.push({backgroundColor: '#55fdbf5c', borderColor: '#55fdbf5c'});

    this.chartColors2 = [];
    this.chartColors2.push({backgroundColor: 'orange', borderColor: 'orange', borderWidth: 3});
    this.chartColors2.push({backgroundColor: '#50eef7', borderColor: '#50eef7', borderWidth: 3});
    this.chartColors2.push({backgroundColor: 'orange', borderColor: 'orange', borderWidth: 3});
    this.chartColors2.push({backgroundColor: '#55fdbf5c', borderColor: '#55fdbf5c'});
    this.chartColors2.push({backgroundColor: '#55fdbf5c', borderColor: '#55fdbf5c'});

    this.chartOptions = _.cloneDeep(globals.chartOptions);

    this.chartOptions.plugins.tooltip = {
      enabled: true,
      mode: 'index',
      intersect: false,
      reverse: true,
      callbacks: {
        title: function(tooltipItem, data) {
          var year = tooltipItem[0].label.substr(0,4);
          var month = tooltipItem[0].label.substr(4,2);
          var day = tooltipItem[0].label.substr(6,2);
          var date = new Date(year + '-' + month + '-' + day);
          var label = 'Date: ' + (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
          return label;
        },
        label: function(context) {
          var label = context.dataset.label + ': ';
          label += Utils.formatNumber(context.parsed.y);
          return label;
        }    
      }
    };

    if (this.selectedMetric === 'ctr' || this.selectedMetric === 'cvr' || this.selectedMetric === 'br') {
      this.chartOptions.scales.yAxis.ticks.callback = function(value, index, values) {
        return ((value * 100).toFixed(1)) + '%';
      };
      this.chartOptions.plugins.tooltip.callbacks.label = function(tooltipItem, data) {
        var label = data.datasets[tooltipItem.datasetIndex].label + ': ';
        label += ((tooltipItem.yLabel * 100).toFixed(1)) + '%';
        return label;
      };    
    } else if (this.selectedMetric === 'revenue' || this.selectedMetric === 'aov') {
      this.chartOptions.scales.yAxis.ticks.callback = function(value, index, values) {
        return Utils.formatCurrency(value);
      };
      this.chartOptions.plugins.tooltip.callbacks.label = function(tooltipItem, data) {
        var label = data.datasets[tooltipItem.datasetIndex].label + ': ';
        label += Utils.formatCurrency(tooltipItem.yLabel);
        return label;

      };    
    }

    this.chartOptions.plugins.legend.display = false;
    this.chartOptions.scales.xAxis.stacked = false;
    this.chartOptions.scales.yAxis.stacked = false;

    this.chartOptions.scales.xAxis.ticks.display = true;
    this.chartOptions.scales.xAxis.ticks.autoSkip = true;
    this.chartOptions.scales.xAxis.ticks.maxTicksLimit = 10;
    // this.chartOptions.scales.xAxis.ticks.fontFamily = 'Gotham';
    this.chartOptions.scales.yAxis.title = {display: true, text: this.selectedMetricMixed, 
      font: {size: 10, color: '#10282F'}};
      // this.chartOptions.scales.yAxis.title = {display: true, text: this.selectedMetricMixed, 
      //   fontFamily: 'Gotham', fontStyle: 'bold', fontSize: '10', fontColor: '#10282F'};
  
    this.causalService.getSummaries(testId, this.selectedMetric,
      this.selectedSiteName, this.selectedSegment, this.selectedPageLOB,
      this.selectedPageType, this.selectedSitePlatform).subscribe(summaryData => {
        if (summaryData === null) {
          this.summary_prediction = 0;
          this.summary_actual = 0;
          this.summary_py_actual = 0;
          this.summary_relative_impact = 0;
          this.summary_yoy = 0;
          this.summary_absolute_impact = 0;
          this.summary_significance = 'No';
          this.summary_confidence = 0;
          this.summary_explanation = '';
          this.summary_synthetic = '';
        } else {
          if (['ctr', 'cvr', 'br', 'aov', 'war'].indexOf(this.selectedMetric) >= 0) {
            this.summary_prediction = summaryData.prediction;
            this.summary_actual = summaryData.actual;
            this.summary_py_actual = summaryData.py_actual;
            this.summary_absolute_impact = summaryData.absolute_impact;
          } else {
            this.summary_prediction = Math.round(summaryData.prediction);
            this.summary_actual = Math.round(summaryData.actual);
            this.summary_py_actual = Math.round(summaryData.py_actual);
            this.summary_absolute_impact = Math.round(summaryData.absolute_impact);
          }
          this.summary_relative_impact = summaryData.relative_impact;
          this.summary_yoy = summaryData.yoy;
          this.summary_significance = summaryData.significance;
          this.summary_confidence = summaryData.confidence;
          this.summary_explanation = summaryData.test_summary;
          this.summary_synthetic = summaryData.synthetic_inputs;
        }
    });

    this.causalService.getChartData(testId, this.selectedMetric,
        this.selectedSiteName, this.selectedSegment, this.selectedPageLOB,
        this.selectedPageType, this.selectedSitePlatform).subscribe(chartData => {
      // if (this.authorUserId === 29) {
        this.loadNewCharts(chartData);
      // } else {
      //   this.loadOldCharts(chartData)
      // }  
    });

  }

  // loadOldCharts(chartData) {
  //   const chartValues_original_1 = [];
  //   const chartValues_original_2 = [];
  //   const chartValues_original_3 = [];
  //   const chartValues_original_4 = [];
  //   const chartValues_original_5 = [];
  //   const chartValues_pointwise_1 = [];
  //   const chartValues_pointwise_2 = [];
  //   const chartValues_pointwise_3 = [];
  //   const chartValues_pointwise_4 = [];
  //   const chartValues_pointwise_5 = [];
  //   const chartValues_cumulative_1 = [];
  //   const chartValues_cumulative_2 = [];
  //   const chartValues_cumulative_3 = [];
  //   const chartValues_cumulative_4 = [];
  //   const chartValues_cumulative_5 = [];

  //   this.chartLabels = [];
  //   this.chartExtendedLabels = [];
  //   let chartCount = 0;

  //   for (let i = 0; i < chartData.length; i++) {
  //     const dateLabel = Number(new Date(chartData[i].date).getFullYear()
  //       + ('0' + (new Date(chartData[i].date).getMonth() + 1)).slice(-2)
  //       + ('0' + new Date(chartData[i].date).getDate()).slice(-2));

  //     if (chartData[i].plot === undefined) {
  //       chartCount++;

  //       chartValues_original_1.push({x: chartCount, y: chartData[i].prediction_series});
  //       chartValues_original_2.push({x: chartCount, y: chartData[i].cy_series});
  //       chartValues_original_3.push({x: chartCount, y: chartData[i].py_series});
  //       chartValues_original_4.push({x: chartCount, y: chartData[i].prediction_upper_series});
  //       chartValues_original_5.push({x: chartCount, y: chartData[i].prediction_lower_series});
  //       this.chartLabels.push(dateLabel);
  //       this.chartExtendedLabels.push(chartData[i].date_formatted);

  //       chartValues_pointwise_1.push({x: chartCount, y: chartData[i].pointwise_series});
  //       chartValues_pointwise_2.push({x: chartCount, y: null});
  //       chartValues_pointwise_3.push({x: chartCount, y: null});
  //       chartValues_pointwise_4.push({x: chartCount, y: chartData[i].pointwise_upper_series});
  //       chartValues_pointwise_5.push({x: chartCount, y: chartData[i].pointwise_lower_series});

  //       chartValues_cumulative_1.push({x: chartCount, y: chartData[i].cummulative_series});
  //       chartValues_cumulative_2.push({x: chartCount, y: null});
  //       chartValues_cumulative_3.push({x: chartCount, y: null});
  //       chartValues_cumulative_4.push({x: chartCount, y: chartData[i].cummulative_upper_series});
  //       chartValues_cumulative_5.push({x: chartCount, y: chartData[i].cummulative_lower_series});
  //     } else if (chartData[i].plot === 'original') {
  //       chartCount++;

  //       chartValues_original_1.push({x: chartCount, y: chartData[i].prediction_series});
  //       chartValues_original_2.push({x: chartCount, y: chartData[i].actuals_series});
  //       chartValues_original_3.push({x: chartCount, y: chartData[i].py_series});
  //       chartValues_original_4.push({x: chartCount, y: chartData[i].prediction_upper_series});
  //       chartValues_original_5.push({x: chartCount, y: chartData[i].prediction_lower_series});
  //       this.chartLabels.push(dateLabel);
  //       this.chartExtendedLabels.push(chartData[i].date_formatted);
  //     } else if (chartData[i].plot === 'pointwise') {
  //       chartValues_pointwise_1.push({x: chartCount, y: chartData[i].prediction_series});
  //       chartValues_pointwise_2.push({x: chartCount, y: null});
  //       chartValues_pointwise_3.push({x: chartCount, y: null});
  //       chartValues_pointwise_4.push({x: chartCount, y: chartData[i].prediction_upper_series});
  //       chartValues_pointwise_5.push({x: chartCount, y: chartData[i].prediction_lower_series});
  //     } else if (chartData[i].plot === 'cumulative') {
  //       chartValues_cumulative_1.push({x: chartCount, y: chartData[i].prediction_series});
  //       chartValues_cumulative_2.push({x: chartCount, y: null});
  //       chartValues_cumulative_3.push({x: chartCount, y: null});
  //       chartValues_cumulative_4.push({x: chartCount, y: chartData[i].prediction_upper_series});
  //       chartValues_cumulative_5.push({x: chartCount, y: chartData[i].prediction_lower_series});
  //     }
  //   }

  //   this.chart1Values = [
  //     { data: chartValues_original_1,
  //       pointBorderColor: '#10282F', pointBackgroundColor: '#10282F', borderColor: '#10282F', borderWidth: 3,
  //       label: 'Prediction', borderDash: [5, 5], pointRadius: 0 },
  //     { data: chartValues_original_3,
  //       pointBorderColor: '#50eef7', pointBackgroundColor: '#50eef7', borderColor: '#50eef7', borderWidth: 3,
  //       label: 'PY Actual', pointRadius: 0 },
  //     { data: chartValues_original_2,
  //       pointBorderColor: 'orange', pointBackgroundColor: 'orange', borderColor: 'orange', borderWidth: 3,
  //       label: 'Actual', pointRadius: 1 },
  //     { fill: true, stacked: true,
  //       data: chartValues_original_5,
  //       backgroundColor: '#ffffff', pointBackgroundColor: '#ffffff', borderColor: '#ffffff',
  //       label: 'Margin of Error - Lower', pointRadius: 0 },
  //     { fill: true, stacked: true,
  //       data: chartValues_original_4,
  //       backgroundColor: '#55fdbf5c', pointBackgroundColor: '#55fdbf5c', borderColor: '#55fdbf5c',
  //       label: 'Margin of Error - Upper', pointRadius: 0 }
  //   ];

  //   this.chart2Values = [
  //     { data: chartValues_cumulative_1,
  //       pointBorderColor: 'orange', pointBackgroundColor: 'orange', borderColor: 'orange', borderWidth: 3,
  //       label: 'Cummulative Impact', borderDash: [5, 5], pointRadius: 0 },
  //     { data: chartValues_cumulative_3,
  //       pointBorderColor: '#50eef7', pointBackgroundColor: '#50eef7', borderColor: '#50eef7', borderWidth: 3,
  //       label: 'PY Actual', pointRadius: 0 },
  //     { data: chartValues_cumulative_2,
  //       pointBorderColor: 'orange', pointBackgroundColor: 'orange', borderColor: 'orange', borderWidth: 3,
  //       label: 'Actual', pointRadius: 1 },
  //     { fill: false, stacked: true,
  //       data: chartValues_cumulative_5,
  //       pointBorderColor: '#55fdbf5c', pointBackgroundColor: '#55fdbf5c', borderColor: '#55fdbf5c',
  //       label: 'Margin of Error - Lower', pointRadius: 0 },
  //     { fill: false, stacked: true,
  //       data: chartValues_cumulative_4,
  //       pointBorderColor: '#55fdbf5c', pointBackgroundColor: '#55fdbf5c', borderColor: '#55fdbf5c',
  //       label: 'Margin of Error - Upper', pointRadius: 0 }
  //   ];

  //   this.chart3Values = [
  //     { data: chartValues_pointwise_1,
  //       pointBorderColor: 'orange', pointBackgroundColor: 'orange', borderColor: 'orange', borderWidth: 3,
  //       label: 'Daily Impact', borderDash: [5, 5], pointRadius: 0 },
  //     { data: chartValues_pointwise_3,
  //       pointBorderColor: '#50eef7', pointBackgroundColor: '#50eef7', borderColor: '#50eef7', borderWidth: 3,
  //       label: 'PY Actual', pointRadius: 0 },
  //     { data: chartValues_pointwise_2,
  //       pointBorderColor: 'orange', pointBackgroundColor: 'orange', borderColor: 'orange', borderWidth: 3,
  //       label: 'Actual', pointRadius: 1 },
  //     { fill: false, stacked: true,
  //       data: chartValues_pointwise_5,
  //       pointBorderColor: '#55fdbf5c', pointBackgroundColor: '#55fdbf5c', borderColor: '#55fdbf5c',
  //       label: 'Margin of Error - Lower', pointRadius: 0 },
  //     { fill: false, stacked: true,
  //       data: chartValues_pointwise_4,
  //       pointBorderColor: '#55fdbf5c', pointBackgroundColor: '#55fdbf5c', borderColor: '#55fdbf5c',
  //       label: 'Margin of Error - Upper', pointRadius: 0 }
  //   ];
  //   this.chartOptions.scales.xAxis.ticks.callback = function(value, index) {
  //     const valueStr = String(this.getLabelForValue(value));
  //     const year = valueStr.substring(0, 4);
  //     const month = valueStr.substring(4, 6);
  //     const day = valueStr.substring(6, 8);
  //     const newDate = new Date(year + '-' + month + '-' + day);
  //     const returnValue = (newDate.getMonth() + 1) + '/' + newDate.getDate() + '/' + newDate.getFullYear();
  //     return returnValue;
  //   };

  //   const annotationDate = Number(new Date(this.selectedTest.event_date).getFullYear()
  //   + ('0' + (new Date(this.selectedTest.event_date).getMonth() + 1)).slice(-2)
  //   + ('0' + new Date(this.selectedTest.event_date).getDate()).slice(-2));
  //   let annotationIndex = 0;
  //   for (let i = 0; i < this.chartLabels.length; i++) {
  //     if (this.chartLabels[i] === annotationDate) {
  //       annotationIndex = i + 1;
  //     }
  //   }
  //   const annotationContent = 'Event Date - ' + (new Date(this.selectedTest.event_date).getMonth() + 1) + '/' +
  //     new Date(this.selectedTest.event_date).getDate() + '/' + new Date(this.selectedTest.event_date).getFullYear();
  //   this.chartOptions.plugins.annotation = {
  //     common: {
  //       drawTime: 'afterDraw'
  //     },
  //       annotations: {
  //         line1: {
  //           type: 'line',
  //           mode: 'vertical',
  //           xMin: annotationIndex,
  //           xMax: annotationIndex,
  //           borderWidth: 3,
  //           borderColor: '#D8DD28',
  //           label: {
  //             content: annotationContent,
  //             display: true,
  //             position: 'top'
  //           }
  //         }
  //       }
  //   };
  // }

  loadNewCharts(chartData) {
    const chartValues_original_1 = [];
    const chartValues_original_2 = [];
    const chartValues_original_3 = [];
    const chartValues_original_4 = [];
    const chartValues_original_5 = [];
    let chartValues_original_value = 0;
    const chartValues_pointwise_1 = [];
    const chartValues_pointwise_2 = [];
    const chartValues_pointwise_3 = [];
    let chartValues_pointwise_value = 0;
    const chartValues_cumulative_1 = [];
    const chartValues_cumulative_2 = [];
    const chartValues_cumulative_3 = [];
    let chartValues_cumulative_value = 0;

    this.chartLabels = [];
    this.chartExtendedLabels = [];
    let chartCount = 0;

    for (let i = 0; i < chartData.length; i++) {
      const dateLabel = Number(new Date(chartData[i].date).getFullYear()
        + ('0' + (new Date(chartData[i].date).getMonth() + 1)).slice(-2)
        + ('0' + new Date(chartData[i].date).getDate()).slice(-2));

      if (this.selectedMetric === 'ctr' || this.selectedMetric === 'cvr' || this.selectedMetric === 'br') {          
        chartData[i].prediction_series = chartData[i].prediction_series * 100;
        chartData[i].cy_series = chartData[i].cy_series * 100;
        chartData[i].py_series = chartData[i].py_series * 100;
        chartData[i].actuals_series = chartData[i].actuals_series * 100;
        chartData[i].prediction_upper_series = chartData[i].prediction_upper_series * 100;
        chartData[i].prediction_lower_series = chartData[i].prediction_lower_series * 100;
      }

      if (chartData[i].plot === undefined) {
        chartCount++;
        chartValues_original_1.push([new Date(chartData[i].date).getTime(), chartData[i].prediction_series]);
        chartValues_original_2.push([new Date(chartData[i].date).getTime(), chartData[i].cy_series]);
        chartValues_original_3.push([new Date(chartData[i].date).getTime(), chartData[i].prediction_upper_series]);
        chartValues_original_4.push([new Date(chartData[i].date).getTime(), chartData[i].prediction_lower_series]);
        chartValues_original_5.push([new Date(chartData[i].date).getTime(), chartData[i].py_series]);
        if ((chartData[i].actuals_series) > chartValues_original_value) {
          chartValues_original_value = chartData[i].actuals_series
        }

        chartValues_pointwise_1.push([new Date(chartData[i].date).getTime(), chartData[i].pointwise_series]);
        chartValues_pointwise_2.push([new Date(chartData[i].date).getTime(), chartData[i].pointwise_upper_series]);
        chartValues_pointwise_3.push([new Date(chartData[i].date).getTime(), chartData[i].pointwise_lower_series]);
        if ((chartData[i].prediction_series) > chartValues_pointwise_value) {
          chartValues_pointwise_value = chartData[i].prediction_series
        }

        chartValues_cumulative_1.push([new Date(chartData[i].date).getTime(), chartData[i].cummulative_series]);
        chartValues_cumulative_2.push([new Date(chartData[i].date).getTime(), chartData[i].cummulative_upper_series]);
        chartValues_cumulative_3.push([new Date(chartData[i].date).getTime(), chartData[i].cummulative_lower_series]);
        if ((chartData[i].prediction_series) > chartValues_cumulative_value) {
          chartValues_cumulative_value = chartData[i].prediction_series
        }

      } else if (chartData[i].plot === 'original') {
        chartCount++;

        chartValues_original_1.push([new Date(chartData[i].date).getTime(), chartData[i].prediction_series]);
        chartValues_original_2.push([new Date(chartData[i].date).getTime(), chartData[i].actuals_series]);
        chartValues_original_3.push([new Date(chartData[i].date).getTime(), chartData[i].prediction_upper_series]);
        chartValues_original_4.push([new Date(chartData[i].date).getTime(), chartData[i].prediction_lower_series]);
        chartValues_original_5.push([new Date(chartData[i].date).getTime(), chartData[i].py_series]);
        if ((chartData[i].actuals_series) > chartValues_original_value) {
          chartValues_original_value = chartData[i].actuals_series
        }

      } else if (chartData[i].plot === 'pointwise') {

        chartValues_pointwise_1.push([new Date(chartData[i].date).getTime(), chartData[i].prediction_series]);
        chartValues_pointwise_2.push([new Date(chartData[i].date).getTime(), chartData[i].prediction_upper_series]);
        chartValues_pointwise_3.push([new Date(chartData[i].date).getTime(), chartData[i].prediction_lower_series]);
        if ((chartData[i].prediction_series) > chartValues_pointwise_value) {
          chartValues_pointwise_value = chartData[i].prediction_series
        }

      } else if (chartData[i].plot === 'cumulative') {

        chartValues_cumulative_1.push([new Date(chartData[i].date).getTime(), chartData[i].prediction_series]);
        chartValues_cumulative_2.push([new Date(chartData[i].date).getTime(), chartData[i].prediction_upper_series]);
        chartValues_cumulative_3.push([new Date(chartData[i].date).getTime(), chartData[i].prediction_lower_series]);
        if ((chartData[i].prediction_series) > chartValues_cumulative_value) {
          chartValues_cumulative_value = chartData[i].prediction_series
        }

      }
      
    }
    let chartOptions;   
     // let chartOptions = {series: [], annotations: [], tooltip: {valueDecimals: 0, valuePrefix: '', valueSuffix: ''}, yAxis: {title: {text: ''}, labels: {format: ''}}};
    chartOptions = new Object(constants.chartOptions);
    chartOptions.yAxis.title.text = this.selectedMetricMixed;
    if (this.selectedMetric === 'ctr' || this.selectedMetric === 'cvr' || this.selectedMetric === 'br') {
      chartOptions.yAxis.labels.format = '{value:,.1f}%'
      chartOptions.tooltip.valueDecimals = 2;
      chartOptions.tooltip.valueSuffix = '%';
    } else if (this.selectedMetric === 'revenue' || this.selectedMetric === 'aov') {
      chartOptions.yAxis.labels.format = '${value:,.0f}';
      chartOptions.tooltip.valuePrefix = '$';
    } else {
      chartOptions.yAxis.labels.format = '{value:,.0f}';
      chartOptions.tooltip.valuePrefix = '';
      chartOptions.tooltip.valueSuffix = '';
    }

    let performanceAnnotations = this.getEventDateAnnotation(chartValues_original_value);
    let performanceChartSeries = [];
    performanceChartSeries = [
      {type: 'area', name: 'Upper Margin of Error', data: chartValues_original_3, color: '#55fdbf5c'},
      {type: 'area', name: 'Lower Margin of Error ', data: chartValues_original_4, color: '#ffffffff'},
      {type: 'line', name: 'PY Actual', data: chartValues_original_5, color: '#50eef7', marker: {radius: 1}},
      {type: 'line', name: 'Prediction', data: chartValues_original_1, color: '#10282F', dashStyle: 'ShortDash', marker: {radius: 0}},
      {type: 'line', name: 'Actual', data: chartValues_original_2, color: 'orange'},
      
    ];

    let performanceChartOptions = _.cloneDeep(chartOptions);
    performanceChartOptions.series = performanceChartSeries;
    performanceChartOptions.annotations = performanceAnnotations;
    Highcharts.chart('performanceChart', performanceChartOptions);

    let pointwiseAnnotations = this.getEventDateAnnotation(chartValues_pointwise_value);
    let pointwiseChartSeries = [];
    pointwiseChartSeries = [
      {type: 'line', name: 'Upper Margin of Error', data: chartValues_pointwise_2, color: '#55fdbf5c'},
      {type: 'line', name: 'Lower Margin of Error ', data: chartValues_pointwise_3, color: '#55fdbf5c'},
      {type: 'line', name: 'Actual', data: chartValues_pointwise_1, color: 'orange', dashStyle: 'ShortDash', marker: {radius: 0}}        
    ];

    let pointwiseChartOptions = _.cloneDeep(chartOptions);
    pointwiseChartOptions.series = pointwiseChartSeries;
    pointwiseChartOptions.annotations = pointwiseAnnotations;
    Highcharts.chart('pointwiseChart', pointwiseChartOptions);

     if (['impressions', 'clicks', 'visitors', 'orders', 'bounces', 'revenue'].indexOf(this.selectedMetric) > -1) {
      let cumulativeAnnotations = this.getEventDateAnnotation(chartValues_cumulative_value);
      let cumulativeChartSeries = [];
      cumulativeChartSeries = [
        {type: 'line', name: 'Upper Margin of Error', data: chartValues_cumulative_2, color: '#55fdbf5c'},
        {type: 'line', name: 'Lower Margin of Error ', data: chartValues_cumulative_3, color: '#55fdbf5c'},
        {type: 'line', name: 'Actual', data: chartValues_cumulative_1, color: 'orange', dashStyle: 'ShortDash', marker: {radius: 0}}        
      ];

      let cumulativeChartOptions = _.cloneDeep(chartOptions);
      cumulativeChartOptions.series = cumulativeChartSeries;
      cumulativeChartOptions.annotations = cumulativeAnnotations;
      Highcharts.chart('cummulativeChart', cumulativeChartOptions);
    }

  }

  getEventDateAnnotation(yValue) {
    let annotations = [];
    const date = new Date(this.selectedTest.event_date);
    const color = 'yellow';
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
            y: yValue
        },
        x: 0,
        text: 'Event Date <br>' + (new Date(this.selectedTest.event_date).getMonth() + 1) + '/' +
        new Date(this.selectedTest.event_date).getDate() + '/' + new Date(this.selectedTest.event_date).getFullYear(),
        allowOverlap: true
      }]
    });
    return annotations;
  }

  updatePctComplete(pctComplete): void {
    this.causalService.updatePctComplete(this.causalTest['id'], pctComplete).subscribe(data => {
    });
  }

  startUpload(): void {
    const fileToRead = this.selectedFile;
    const reader = new FileReader();
    reader.readAsText(fileToRead);

    reader.onload = async (data) => {
      const csvData = reader.result;

      // convert csv into an array for processing
      let csvRecords = [];
      csvRecords = csvToArray(csvData);

      const outputArray = [];
      let counter = 0;

      if (csvRecords == null) {
        // If control reached here it means csv file contains error, reset file.
        alert('Unable to read ' + fileToRead);
      } else {
        this.importCount = 0;
        this.importCountPre = 'Processing row';
        this.importCountPost = '...';

        let importSource = '';
        for (let i = 0; i < 10; i++) {
          if (csvRecords[0][i] === 'impressions') {
            importSource = 'gsc';
          } else if (csvRecords[0][i] === 'visitors') {
            if (importSource === 'gsc') {
              importSource = 'combined';
            } else {
              importSource = 'analytics';
            }
          }
        }

        // clear out any old test output first
        if (this.clearSourceData) {
          const deleteResult = await this.causalService.deleteTestInputs(this.causalTest['id']).toPromise();
        }

        let columnDefs = {'local_date': 0, 'site_name': 0, 'segment': 0,
          'lob': 0, 'page_type': 0, 'deviec': 0, 'impressions': 0, 'clicks': 0,
          'weight': 0, 'visitors': 0, 'orders': 0, 'bounces': 0, 'revenue': 0};
        for (let i = 0; i < 15; i++) {
          columnDefs[csvRecords[0][i]] = i;
        }


        for (let i = 1; i < csvRecords.length; i++) {
          this.importCount++;

          var colArray = [];
          colArray.push(csvRecords[i][columnDefs['local_date']]);

          if (columnDefs['site_name'] === 0) {
            colArray.push(null);            
          } else {
            colArray.push(csvRecords[i][columnDefs['site_name']]);
          }
          if (columnDefs['segment'] === 0) {
            colArray.push(null);            
          } else {
            colArray.push(csvRecords[i][columnDefs['segment']]);
          }
          if (columnDefs['lob'] === 0) {
            colArray.push(null);            
          } else {
            colArray.push(csvRecords[i][columnDefs['lob']]);
          }
          if (columnDefs['page_type'] === 0) {
            colArray.push(null);            
          } else {
            colArray.push(csvRecords[i][columnDefs['page_type']]);
          }
          if (columnDefs['device'] === 0) {
            colArray.push(null);            
          } else {
            colArray.push(csvRecords[i][columnDefs['device']]);
          }
          if (columnDefs['impressions'] === 0) {
            colArray.push(null);            
          } else {
            if (csvRecords[i][columnDefs['impressions']] === '') {
              colArray.push(null); 
            } else {
              colArray.push(csvRecords[i][columnDefs['impressions']]);
            }
          }
          if (columnDefs['clicks'] === 0) {
            colArray.push(null);            
          } else {
            if (csvRecords[i][columnDefs['clicks']] === '') {
              colArray.push(null); 
            } else {
              colArray.push(csvRecords[i][columnDefs['clicks']]);
            }
          }
          if (columnDefs['weight'] === 0) {
            colArray.push(null);            
          } else {
            if (csvRecords[i][columnDefs['weight']] === '') {
              colArray.push(null); 
            } else {
              colArray.push(csvRecords[i][columnDefs['weight']]);
            }
          }
          if (columnDefs['visitors'] === 0) {
            colArray.push(null);            
          } else {
            if (csvRecords[i][columnDefs['visitors']] === '') {
              colArray.push(null); 
            } else {
              colArray.push(csvRecords[i][columnDefs['visitors']]);
            }
          }
          if (columnDefs['orders'] === 0) {
            colArray.push(null);            
          } else {
            if (csvRecords[i][columnDefs['orders']] === '') {
              colArray.push(null); 
            } else {
              colArray.push(csvRecords[i][columnDefs['orders']]);
            }
          }
          if (columnDefs['bounces'] === 0) {
            colArray.push(null);            
          } else {
            if (csvRecords[i][columnDefs['bounces']] === '') {
              colArray.push(null); 
            } else {
              colArray.push(csvRecords[i][columnDefs['bounces']]);
            }
          }
          if (columnDefs['revenue'] === 0) {
            colArray.push(null);            
          } else {
            if (csvRecords[i][columnDefs['revenue']] === '') {
              colArray.push(null); 
            } else {
              colArray.push(csvRecords[i][columnDefs['revenue']]);
            }
          }
          outputArray.push(colArray)

          counter++;
          if (counter >= 100) {
            const result = await this.causalService.importTestInputs(importSource, this.causalTest['id'], outputArray).toPromise();
            counter = 0;
            outputArray.length = 0;
          }
          this.importPctComplete = (this.importCount / csvRecords.length) * 100;
        }

        if (counter >= 1) {
          const importResult = await this.causalService.importTestInputs(importSource, this.causalTest['id'], outputArray).toPromise();
        }

        this.importCountPre = '';
        this.importCountPost = 'Source Data loaded and ready for processing';
        this.toastr.info('Import completed successfully.');
        this.getTestOutputs();
        this.selectedFile = '';
        this.updatePctComplete(0);
        this.importPctComplete = 0;
      }
    };

    reader.onerror = function () {
      alert('Unable to read ' + fileToRead);
    };

    function csvToArray(text) {
      let p = '', row = [''], ret = [row], i = 0, r = 0, s = !0, l;
      for (l of text) {
        if ('"' === l) {
          if (s && l === p) {
            row[i] += l;
          }
          s = !s;
        } else if (',' === l && s) {
          l = row[++i] = '';
        } else if ('\n' === l && s) {
          if ('\r' === p) {
            row[i] = row[i].slice(0, -1);
          }
          row = ret[++r] = [l = '']; i = 0;
        } else {
          row[i] += l;
        }
        p = l;
      }
      return ret;
    }
  }

  createTemplateCsv() {
    const gscOutputArray = [];
    const gscColHeaders = [];
    const gscColDefs = [
      {'field': 'field1', 'headerName': 'date'},
      {'field': 'field2', 'headerName': 'site_name'},
      {'field': 'field3', 'headerName': 'segment'},
      {'field': 'field4', 'headerName': 'lob'},
      {'field': 'field5', 'headerName': 'page_type'},
      {'field': 'field6', 'headerName': 'device'},
      {'field': 'field7', 'headerName': 'impressions'},
      {'field': 'field8', 'headerName': 'clicks'},
      {'field': 'field9', 'headerName': 'weight'}];
    const gscColData = [
      {'field1': '', 'field2': '', 'field3': '', 'field4': '',
       'field5': '', 'field6': '', 'field7': '', 'field8': '',
       'field9': ''}
    ];

    for (let i = 0; i < gscColDefs.length; i++) {
      gscColHeaders.push(gscColDefs[i].headerName);
    }
    gscOutputArray.push(gscColHeaders);
    for (let i = 0; i < gscColData.length; i++) {
      const colValues = [];
      for (let x = 0; x < gscColDefs.length; x++) {
        let value = '';
        if (gscColData[i][gscColDefs[x].field] !== null && gscColData[i][gscColDefs[x].field] !== undefined) {
          value = '"' + gscColData[i][gscColDefs[x].field].replace(/"/g, '\'') + '"';
        }
        colValues.push(value);
      }
      gscOutputArray.push(colValues);
    }
    const csvContent1 = gscOutputArray.join('\n');
    const link1 = window.document.createElement('a');
    link1.setAttribute('href', 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURI(csvContent1));
    link1.setAttribute('download', 'causalImpactGSCTemplate.csv');
    link1.click();

    const analyticsOutputArray = [];
    const analyticsColHeaders = [];
    const analyticsColDefs = [
      {'field': 'field1', 'headerName': 'date'},
      {'field': 'field2', 'headerName': 'site_name'},
      {'field': 'field3', 'headerName': 'segment'},
      {'field': 'field4', 'headerName': 'lob'},
      {'field': 'field5', 'headerName': 'page_type'},
      {'field': 'field6', 'headerName': 'device'},
      {'field': 'field7', 'headerName': 'visitors'},
      {'field': 'field8', 'headerName': 'orders'},
      {'field': 'field9', 'headerName': 'bounces'},
      {'field': 'field10', 'headerName': 'revenue'}];
    const analyticsColData = [
      {'field1': '', 'field2': '', 'field3': '', 'field4': '',
       'field5': '', 'field6': '', 'field7': '', 'field8': '',
       'field9': '', 'field10': ''}
    ];

    for (let i = 0; i < analyticsColDefs.length; i++) {
      analyticsColHeaders.push(analyticsColDefs[i].headerName);
    }
    analyticsOutputArray.push(analyticsColHeaders);
    for (let i = 0; i < analyticsColData.length; i++) {
      const colValues = [];
      for (let x = 0; x < analyticsColDefs.length; x++) {
        let value = '';
        if (analyticsColData[i][analyticsColDefs[x].field] !== null && analyticsColData[i][analyticsColDefs[x].field] !== undefined) {
          value = '"' + analyticsColData[i][analyticsColDefs[x].field].replace(/"/g, '\'') + '"';
        }
        colValues.push(value);
      }
      analyticsOutputArray.push(colValues);
    }
    const csvContent2 = analyticsOutputArray.join('\n');
    const link2 = window.document.createElement('a');
    link2.setAttribute('href', 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURI(csvContent2));
    link2.setAttribute('download', 'causalImpactAnalyticsTemplate.csv');
    link2.click();


    const combinedOutputArray = [];
    const combinedColHeaders = [];
    const combinedColDefs = [
      {'field': 'field1', 'headerName': 'date'},
      {'field': 'field2', 'headerName': 'site_name'},
      {'field': 'field3', 'headerName': 'segment'},
      {'field': 'field4', 'headerName': 'lob'},
      {'field': 'field5', 'headerName': 'page_type'},
      {'field': 'field6', 'headerName': 'device'},
      {'field': 'field7', 'headerName': 'impressions'},
      {'field': 'field8', 'headerName': 'clicks'},
      {'field': 'field9', 'headerName': 'weight'},
      {'field': 'field10', 'headerName': 'visitors'},
      {'field': 'field11', 'headerName': 'orders'},
      {'field': 'field12', 'headerName': 'bounces'},
      {'field': 'field13', 'headerName': 'revenue'}];
    const combinedColData = [
      {'field1': '', 'field2': '', 'field3': '', 'field4': '',
       'field5': '', 'field6': '', 'field7': '', 'field8': '',
       'field9': '', 'field10': '', 'field11': '', 'field12': '', 'field13': ''}
    ];

    for (let i = 0; i < combinedColDefs.length; i++) {
      combinedColHeaders.push(combinedColDefs[i].headerName);
    }
    combinedOutputArray.push(combinedColHeaders);
    for (let i = 0; i < combinedColData.length; i++) {
      const colValues = [];
      for (let x = 0; x < combinedColDefs.length; x++) {
        let value = '';
        if (combinedColData[i][combinedColDefs[x].field] !== null && combinedColData[i][combinedColDefs[x].field] !== undefined) {
          value = '"' + combinedColData[i][combinedColDefs[x].field].replace(/"/g, '\'') + '"';
        }
        colValues.push(value);
      }
      combinedOutputArray.push(colValues);
    }
    const csvContent3 = combinedOutputArray.join('\n');
    const link3 = window.document.createElement('a');
    link3.setAttribute('href', 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURI(csvContent3));
    link3.setAttribute('download', 'causalImpactCombinedTemplate.csv');
    link3.click();
  }

  onExportSource() {
    this.causalService.getTestInputs(this.selectedTest.id, 10000).subscribe(data => {
      const gscOutputArray = [];
      const gscColHeaders = [];
      const gscColDefs = [
        {'field': 'local_date_formatted', 'headerName': 'date'},
        {'field': 'site_name', 'headerName': 'site_name'},
        {'field': 'segment', 'headerName': 'segment'},
        {'field': 'lob', 'headerName': 'lob'},
        {'field': 'page_type', 'headerName': 'page_type'},
        {'field': 'device', 'headerName': 'device'},
        {'field': 'impressions', 'headerName': 'impressions'},
        {'field': 'clicks', 'headerName': 'clicks'},
        {'field': 'weight', 'headerName': 'weight'},
        {'field': 'keyword_count', 'headerName': 'keyword_count'},
        {'field': 'url_count', 'headerName': 'url_count'},
        {'field': 'visitors', 'headerName': 'visitors'},
        {'field': 'orders', 'headerName': 'orders'},
        {'field': 'bounces', 'headerName': 'bounces'},
        {'field': 'revenue', 'headerName': 'revenue'}];
      for (let i = 0; i < gscColDefs.length; i++) {
        gscColHeaders.push(gscColDefs[i].headerName);
      }

      const gscColData = data;
      gscOutputArray.push(gscColHeaders);
      for (let i = 0; i < gscColData.length; i++) {
        const colValues = [];
        for (let x = 0; x < gscColDefs.length; x++) {
          colValues.push(gscColData[i][gscColDefs[x].field]);
        }
        gscOutputArray.push(colValues);
      }
      const csvContent1 = gscOutputArray.join('\n');
      const link1 = window.document.createElement('a');
      link1.setAttribute('href', 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURI(csvContent1).replace(/#/gi,'%23'));
      link1.setAttribute('download', 'causal_source_data.csv');
      link1.click();
    });

  }

  onExportOutput() {
    const csvOutputArray1 = [];
    csvOutputArray1.push(['Test Name: ' + this.selectedTest.name]);
    csvOutputArray1.push(['Selected Metric: ' + this.selectedMetric.charAt(0).toUpperCase() + this.selectedMetric.slice(1)]);
    csvOutputArray1.push(['Filters: ' + this.selectedSiteName + ' | ' + this.selectedSegment + ' | ' 
    + this.selectedPageLOB + ' | ' + this.selectedPageType + ' | ' + this.selectedSitePlatform]);
    csvOutputArray1.push(['Event Date: ' + this.selectedTest.event_date_formatted]);
    csvOutputArray1.push(['Pre / Post: ' + this.selectedTest.pre_period + ' / ' + this.selectedTest.pre_period]);
    csvOutputArray1.push([' ']);

    const csvColHeaders1 = [
      'Date', 
      this.chart1Values[0].label,
      this.chart1Values[1].label,
      this.chart1Values[2].label,
      this.chart1Values[3].label,
      this.chart1Values[4].label
      ];
    csvOutputArray1.push(csvColHeaders1);

    for (let i = 0; i < this.chart1Values[0].data.length; i++) {
      csvOutputArray1.push([
        this.chartLabels[i], 
        this.chart1Values[0].data[i].y,
        this.chart1Values[1].data[i].y,
        this.chart1Values[2].data[i].y,
        this.chart1Values[3].data[i].y,
        this.chart1Values[4].data[i].y
      ]);
    }

    const csvContent1 = csvOutputArray1.join('\n');
    const link1 = window.document.createElement('a');
    link1.setAttribute('href', 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURI(csvContent1));
    link1.setAttribute('download', 'causal_performance_' + this.selectedMetric + '.csv');
    link1.click();

    const csvOutputArray2 = [];
    csvOutputArray2.push(['Test Name: ' + this.selectedTest.name]);
    csvOutputArray2.push(['Selected Metric: ' + this.selectedMetric.charAt(0).toUpperCase() + this.selectedMetric.slice(1)]);
    csvOutputArray2.push(['Filters: ' + this.selectedSiteName + ' | ' + this.selectedSegment + ' | ' 
    + this.selectedPageLOB + ' | ' + this.selectedPageType + ' | ' + this.selectedSitePlatform]);
    csvOutputArray2.push(['Event Date: ' + this.selectedTest.event_date_formatted]);
    csvOutputArray2.push(['Pre / Post: ' + this.selectedTest.pre_period + ' / ' + this.selectedTest.pre_period]);
    csvOutputArray2.push([' ']);

    const csvColHeaders2 = [
      'Date', 
      this.chart2Values[0].label,
      this.chart2Values[3].label,
      this.chart2Values[4].label
      ];
    csvOutputArray2.push(csvColHeaders2);

    for (let i = 0; i < this.chart2Values[0].data.length; i++) {
      csvOutputArray2.push([
        this.chartLabels[i], 
        this.chart2Values[0].data[i].y,
        this.chart2Values[3].data[i].y,
        this.chart2Values[4].data[i].y
      ]);
    }
    const csvContent2 = csvOutputArray2.join('\n');
    const link2 = window.document.createElement('a');
    link2.setAttribute('href', 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURI(csvContent2));
    link2.setAttribute('download', 'causal_cummulative_' + this.selectedMetric + '.csv');
    link2.click();

    const csvOutputArray3 = [];
    csvOutputArray3.push(['Test Name: ' + this.selectedTest.name]);
    csvOutputArray3.push(['Selected Metric: ' + this.selectedMetric.charAt(0).toUpperCase() + this.selectedMetric.slice(1)]);
    csvOutputArray3.push(['Filters: ' + this.selectedSiteName + ' | ' + this.selectedSegment + ' | ' 
    + this.selectedPageLOB + ' | ' + this.selectedPageType + ' | ' + this.selectedSitePlatform]);
    csvOutputArray3.push(['Event Date: ' + this.selectedTest.event_date_formatted]);
    csvOutputArray3.push(['Pre / Post: ' + this.selectedTest.pre_period + ' / ' + this.selectedTest.pre_period]);
    csvOutputArray3.push([' ']);

    const csvColHeaders3 = [
      'Date', 
      this.chart3Values[0].label,
      this.chart3Values[3].label,
      this.chart3Values[4].label
      ];
    csvOutputArray3.push(csvColHeaders3);

    for (let i = 0; i < this.chart3Values[0].data.length; i++) {
      csvOutputArray3.push([
        this.chartLabels[i], 
        this.chart3Values[0].data[i].y,
        this.chart3Values[3].data[i].y,
        this.chart3Values[4].data[i].y
      ]);
    }
    const csvContent3 = csvOutputArray3.join('\n');
    const link3 = window.document.createElement('a');
    link3.setAttribute('href', 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURI(csvContent3));
    link3.setAttribute('download', 'causal_daily_' + this.selectedMetric + '.csv');
    link3.click();
  }

  ngOnDestroy() {
    this.checkStatus = false;
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }

}

