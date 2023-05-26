export const apiUrls = {
  GET_RESULTS: '/api/causal/results',
  GET_ARCHIVEDRESULTS: '/api/causal/archivedresults',
  GET_TEST_BY_NAME: '/api/causal/test/name?name={{name}}',
  SAVE_PARAMETERS: '/api/causal/test/parameters',
  SAVE_RESULTS: '/api/causal/test/results',
  UPDATE_PCT_COMPLETE: '/api/causal/test/pctcomplete/',
  GET_PARAMETERS_BY_ID: '/api/causal/test/parameters/{{resultId}}',
  GET_RESULTS_BY_ID: '/api/causal/test/results/{{resultId}}',
  IMPORT: '/api/causal/import',
  DELETE_INPUTS: '/api/causal/deleteinputs/{{testId}}',
  DELETE: '/api/causal/delete/{{testId}}',
  ARCHIVE: '/api/causal/archive/{{testId}}',
  GET_TEST_INPUTS: '/api/causal/test/{{testId}}/inputs?max={{max}}',
  GET_TEST_INPUTS_COUNT: '/api/causal/test/{{testId}}/count/',
  GET_META_HIERARCHIES: '/api/causal/meta/hierarchies/',
  GET_META_KPIS: '/api/causal/meta/kpis/',
  GET_META_TYPES: '/api/causal/meta/types/',
  RUN_TEST: '/api/causal/run/{{testId}}/',
  // RUN_TEST: '/api/causal/python/{{testId}}/',
  GET_CHART_DATA: '/api/causal/chart/{{testId}}?site_name={{site}}&segment={{segment}}&page_lob={{lob}}&page_type={{page}}&device={{device}}&metric={{metric}}',
  // GET_CHART_DATA: '/api/causal/chartresults/{{testId}}?site_name={{site}}&segment={{segment}}&page_lob={{lob}}&page_type={{page}}&device={{device}}&metric={{metric}}',
  GET_CLIENTS: '/api/activeclients',
  GET_CLIENT: '/api/client/{{clientId}}',
  GET_DATE_RANGE: '/api/causal/daterange/{{testId}}/{{pre}}/{{post}}',
  GET_CHART_FILTERS: '/api/causal/filters/{{testId}}',
  GET_SUMMARIES: '/api/causal/summaries/{{testId}}?site_name={{site}}&segment={{segment}}&page_lob={{lob}}&page_type={{page}}&device={{device}}&metric={{metric}}'
};

export const chartOptions = {
  chart: {
    type: 'line',
    spacing: [15,15,15,15],
    zooming: {
      type: 'x'
    }
  },
  title: {
    text: ''
  },
  yAxis: {
    title: {
      text: '',
      style: {
        fontSize: '10px'
      },
    },
    labels: {
      style: {
        fontSize: '9px'
      },
      x: -8,
      format: '{value:,.0f}'
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
    enabled: false
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
    area: {
      marker: {
          radius: 1
      },
      lineWidth: 1
    },
    line: {
      marker: {
        radius: 2,
      },
      lineWidth: 3,
    }
  },

  credits: {
    enabled: false
  },

  series: [],

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
    valueDecimals: 0,
    valueSuffix: '',
    valuePrefix: '',
    shared: true
  },
  annotations: []
}

