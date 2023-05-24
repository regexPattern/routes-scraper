import { Utils } from '../utils';

export const apiUrls = {
  GET_CLIENTS: '/api/apiclients?search={{search}}&sort={{sort}}&order={{order}}',
  GET_CLIENT: '/api/client/{{clientId}}',
  GET_CLIENT_REPORTING: '/api/client/reporting/{{client}}/{{ga}}/{{period}}/{{enddate}}/{{compare}}',
  GET_CLIENT_TRENDED_VIEWS: '/api/client/trendedviews/{{client}}/{{ga}}/{{enddate}}',
  GET_SEO_PERFORMANCE2: '/api/gscsummary?client=gexa&from=2020-01-01&to=2020-04-02&filters=&branded=1',
  GET_SEO_PERFORMANCE: '/api/reports/seoperformance',
  GET_PRIOR_METRICS: '/api/reports/priormetrics/{{clientId}}',
  GET_SUMMARY_METRICS: '/api/reports/summarymetrics/{{clientId}}',
  GET_TREND_METRICS: '/api/reports/trendmetrics/{{clientId}}',
  GET_PRIORITY_METRICS: '/api/reports/prioritymetrics',
  GET_CLIENT_API_SUMMARY: '/api/client/{{acronym}}/apisummary',
  GET_CLIENT_API_RESULTS: '/api/client/{{acronym}}/apiresults'
};

export const timeframes = [ 
  {
    "id": "yoy",
    "label": "YoY"
  },
  {
    "id": "Q1-2021",
    "label": "In Q1 2021",
    "dateFrom": "2021-01-01",
    "dateTo": "2021-03-31"
  },
  {
    "id": "Q2-2021",
    "label": "In Q2 2021",
    "dateFrom": "2021-04-01",
    "dateTo": "2021-06-30"
  },
  {
    "id": "Q3-2021",
    "label": "In Q3 2021",
    "dateFrom": "2021-07-01",
    "dateTo": "2021-09-30"
  },
  {
    "id": "Q4-2021",
    "label": "In Q3 2021",
    "dateFrom": "2021-10-01",
    "dateTo": "2021-12-31"
  }
];

export const chartOptions = {
  "responsive": true,
  "maintainAspectRatio": false,
  "layout": {
    "padding": {
      "top": 25,
      "bottom": 15,
      "right": 10
    }
  },
  "scales": {
    "xAxis": {
      "display": false,
    },
    "yAxis": { 
      "display": true,
      title: {
        display: true,
        text: '% of Prior Year',
        font: {
          size: 10
        }
      },
      "beginAtZero": true,
      "ticks": {
        "beginAtZero": true,
        "font": {
          "size": 9
        },
        "autoSkip": true,
        "maxTicksLimit": 10,
        callback: function(value, index, values) {
          return value + '%';
        }
      },
      grid: {
        drawBorder: false,
        color: '#333',
        lineWidth: context => context.tick.value == 0 ? 1 : 0 //Set only 0 line visible
      },
      scaleLabel: {
        display: true,
        labelString: '% of Prior Year',
        fontColor: '#666666',
        fontSize: 10,
        fontStyle: 'bold'
      },
    }
  },
  plugins: {
    datalabels: {
      display: true,
      anchor: 'end',
      align: 'end',
      color: '#333',
      font: {
        size: 12,
        weight: 'bold'
      },
      "padding": {
        "top": 0,
        "bottom": 0,
      },
      formatter: (value, ctx) => {
        return Utils.formatNumber(value) + '%'
      },
    },
    legend: {
      display: false
    },
    "tooltip": {
      "enabled": true,
      "callbacks": {
        label: function(context) {
          return context.dataset.label + ': ' + Utils.formatNumber(context.parsed.y) + '%';
        }
      }
    }
  }
};

export const trendingChartOptions = {
    "responsive": true,
    "maintainAspectRatio": false,
    "elements": {
      "line": {
        "tension": 0,
        "fill": false,
        "borderWidth": 4,
        // "backgroundColor": "#ffa50050",
        // "borderColor": "#ffa50050",
      },
      point: {
        radius: 2
      }
    },
    "layout": {
      "padding": {
        "top": 15,
        "bottom": 0,
        "right": 10
      }
    },
    "scales": {
      "xAxis": {
        "type": "time",
        id: 'time1',
        time: {
          unit: 'day',
          displayFormats: {
            'millisecond': 'MMM DD',
            'second': 'MMM DD',
            'minute': 'MMM DD',
            'hour': 'MMM DD',
            'day': 'MMM DD',
            'week': 'MMM DD',
            'month': 'MMM DD',
            'quarter': 'MMM DD',
            'year': 'MMM DD',
          },
          tooltipFormat: 'MM/DD/YYYY'
        },
        "display": true,
        "stacked": true,
        "grid": {
          "display": false,
          "color": "#ccc",
          "lineWidth": 1,
          "zeroLineWidth": 3
        },
        "ticks": {
          "beginAtZero": true,
          "autoSkip": true,
          maxRotation: 0,
          minRotation: 0,
          "maxTicksLimit": 10,
          "font": {
            "size": 8,
            "color": "#10282F"
          }
        }
      },
      "yAxis": { 
        "display": true,
        title: {
          display: false,
          text: '',
          font: {
            size: 10
          }
        },
        "stacked": false,
        "position": "left",
        "beginAtZero": true,
        "ticks": {
          "beginAtZero": true,
          "font": {
            "size": 8,
            "color": "#333"
          },
          "autoSkip": true,
          "maxTicksLimit": 10,
          callback: function(value, index, ticks) {
            if (value < 1000) {
              return (value);
            } else if (value < 1000000) {
              return (value / 1000) + 'K';
            } else {
              return (value / 1000000) + 'M';
            }
          }
        },
        "grid": {
          "display": true,
          "color": "#eee",
          "lineWidth": 1,
          "zeroLineWidth": 3
        },
        scaleLabel: {
          display: true,
          labelString: 'SESSIONS',
          fontColor: '#666666',
          fontSize: 10,
          fontStyle: 'bold'
        }
      }
    },
    plugins: {
      datalabels: {
        display: false,
      },
      "legend": {
        "display": true,
        "reverse": true,
        "position": "bottom",
        "labels": {
          "boxWidth": 10,
          "font": { 
            "size": 9
          }
        }
      },  
      "tooltip": {
        "enabled": true,
        "mode": "index",
        "intersect": false,
        "reverse": true,
        "callbacks": {
          label: function(context){
            if (context.dataset.label.indexOf('CVR') > 1) {
              return context.dataset.label + ': ' + (context.parsed.y * 100) + '%';
            } else if (context.dataset.label.indexOf('AOV') > 1) {
              return context.dataset.label + ': ' + (context.parsed.y * 100) + '%';
            } else if (context.dataset.label.indexOf('Revenue') > 1) {
              return context.dataset.label + ': $' + context.parsed.y;
            } else {
              return context.dataset.label + ': ' + context.parsed.y;
            }
          }
        }
      
      }
    }

  };
  

  export const donutChartOptions = {
    aspectRatio: 1,
    responsive: true,
    cutout: '55%',
    tooltips: {
      enabled: true,
      callbacks: {
        label: function(tooltipItem, data) {
          return data['labels'][tooltipItem['index']] + 'S: ' + Utils.formatNumber(data['datasets'][0]['data'][tooltipItem['index']]);
        }
      }
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
            let sum = 0;
            let dataArr = ctx.chart.data.datasets[0].data;
            dataArr.map(data => {
                sum += data;
            });
            let percentage = (value*100 / sum).toFixed(0)+"%";
            return percentage;
        },
        color: '#fff',
      },
      legend: {
        display: true,
        position: 'right'
      }
    } 
  };
