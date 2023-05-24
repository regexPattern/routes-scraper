import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Utils } from '../utils';

@Component({
  selector: 'app-causal-outputs',
  templateUrl: './causal-outputs.component.html',
  styleUrls: ['./causal-outputs.component.scss']
})
export class CausalOutputsComponent implements OnInit {
  public outputs = [];
  public outputsColDefs;
  public outputsGridApi;
  public outputsGridColumnApi;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CausalOutputsComponent>
  ) {
    this.outputs = this.data.outputs;
  }

  ngOnInit() {
    this.buildOutputsColumns();
  }

  onGridSizeChanged(params) {
    if (params.clientWidth !== undefined && params.clientWidth !== 0) {
      params.api.sizeColumnsToFit();
    }
  }

  onGridReady(params) {
    this.outputsGridApi = params.api;
    this.outputsGridColumnApi = params.columnApi;
  }

  buildOutputsColumns() {
    this.outputsColDefs = [
      {
        headerName: 'Date', field: 'local_date_formatted',
        minWidth: 50, width: 100,  suppressSizeToFit: true,
        editable: false, sortable: true, filter: true, resizable: true
      },
      {
        headerName: 'Site Name', field: 'site_name',
        minWidth: 50, width: 150,  suppressSizeToFit: true,
        editable: false, sortable: true, filter: false, resizable: true
      },
      {
        headerName: 'Segment', field: 'segment',
        minWidth: 50, width: 120,  suppressSizeToFit: true,
        editable: false, sortable: true, filter: true, resizable: true
      },
      {
        headerName: 'LOB', field: 'lob',
        minWidth: 50, width: 150,  suppressSizeToFit: true,
        editable: false, sortable: true, filter: false, resizable: true
      },
      {
        headerName: 'Page Type', field: 'page_type',
        minWidth: 50, width: 120, suppressSizeToFit: true,
        editable: false, sortable: true, filter: false, resizable: true
      },
      {
        headerName: 'Device', field: 'device',
        minWidth: 50, width: 220,  suppressSizeToFit: true,
        editable: false, sortable: true, filter: false, resizable: true
      },
      {
        headerName: 'Impressions', field: 'impressions',
        minWidth: 50, width: 120,  suppressSizeToFit: true,
        editable: false, sortable: true, filter: false, resizable: true,
        cellRenderer: NumberCellRenderer
      },
      {
        headerName: 'Clicks', field: 'clicks',
        minWidth: 50, width: 120,  suppressSizeToFit: true,
        editable: false, sortable: true, filter: false, resizable: true,
        cellRenderer: NumberCellRenderer
      },
      {
        headerName: 'Weight', field: 'weight',
        minWidth: 50, width: 120,  suppressSizeToFit: true,
        editable: false, sortable: true, filter: false, resizable: true,
        cellRenderer: NumberCellRenderer
      },
      {
        headerName: 'Visits', field: 'visitors',
        minWidth: 50, width: 120,  suppressSizeToFit: true,
        editable: false, sortable: true, filter: false, resizable: true,
        cellRenderer: NumberCellRenderer
      },
      {
        headerName: 'Conversions', field: 'orders',
        minWidth: 50, width: 120,  suppressSizeToFit: true,
        editable: false, sortable: true, filter: false, resizable: true,
        cellRenderer: NumberCellRenderer
      },
      {
        headerName: 'Bounces', field: 'bounces',
        minWidth: 50, width: 120,  suppressSizeToFit: true,
        editable: false, sortable: true, filter: false, resizable: true,
        cellRenderer: NumberCellRenderer
      },
      {
        headerName: 'Revenue', field: 'revenue',
        minWidth: 50, width: 120,  suppressSizeToFit: true,
        editable: false, sortable: true, filter: false, resizable: true,
        cellRenderer: CurrencyCellRenderer
      }
    ];
  }

  onClose() {
    this.dialogRef.close();
  }

}

function NumberCellRenderer(params) {
  let returnValue;
  if (!isNaN(params.value)) {
    returnValue = Utils.formatNumber(params.value);
  } else {
    returnValue = params.value;
  }
  return returnValue;
}

function CurrencyCellRenderer(params) {
  let returnValue;
  if (!isNaN(params.value)) {
    returnValue = Utils.formatCurrency(params.value);
  } else {
    returnValue = params.value;
  }
  return returnValue;
}

