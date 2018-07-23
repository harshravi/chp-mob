import { Component, OnInit, Input, OnChanges, SimpleChange } from '@angular/core';
import { CHART_CONFIG } from './../../../../constants/other-constants/chart-config';
import { GraphServiceService } from './graph-service.service';
import { LocalStorageService } from 'angular-2-local-storage';

declare var _: any;

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.scss'],
  providers: [GraphServiceService]
})
export class GraphsComponent implements OnInit, OnChanges {

  /** Input data with all the different data for individual vitals */
  @Input() private data: any;

  /** This timeline data represents the current timeline in which the graph is currently */
  @Input() private timeline: any = 'week';

  /** Highcharts Default Chart Object */
  chart: any;

  /** Default options for the Graph Configuration */
  options: any;

  /** XAxis Label Format */
  labelFormat: string;

  /** Tickinterval for the XAxis */
  tickInterval = 60 * 60 * 24 * 1000;



  constructor(private _graphService: GraphServiceService, private _storage: LocalStorageService) {
    this.options = this._graphService.getGraphStub('week', 'O2S').options;

    setTimeout(() => {
    }, 2000);
    setInterval(() => { window.dispatchEvent(new Event('resize')); }, 100);
  }

  ngOnInit() {
    window.dispatchEvent(new Event('resize'));
  }

  saveInstance(chartConfig) {
    this.chart = chartConfig;
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    /**
     * This particular block is called if the Timeline Changes.
     * In accordance to this we need to update our format and the
     * ticker format in the highchart's chart object.
     * */
    if (changes['timeline']) {
      this.timeline = changes['timeline'].currentValue;
    }

    /**
     * Checking whether the data is exists. If it does then call the graph making
     * function so that it can build the graph easily.
     */
    if (changes['data'] !== undefined && changes['data'].currentValue !== undefined) {
      this.chartMaker(this.chart, changes['data'].currentValue);
    }
  }

  /**
   * Get all the Vital Status Values
   */
  vitalStatusProvider(statusValue) {
    var status = "#ecf0f1";
    if (0 === statusValue) {
      status = "#8EFFC1";
    }
    if (1 === statusValue) {
      status = "#F7E4A9";
    }
    if (2 === statusValue) {
      status = "#FFCCBB";
    }
    return status;
  }

  /**
   * Chart Utility Functions
   */
  getTickNLabelFormatXAxis() {
    if ('month' === this.timeline || 'quarter' === this.timeline) {
      this.labelFormat = '{value:%b}' + '<br/>' + '{value:%d}';
    } if ('week' === this.timeline) {
      this.labelFormat = '{value:%a}' + '<br/>' + '{value:%e}';
    }
  }

  updateXAxisLabel() {
    if ('month' === this._storage.get('timeLine')) {
      this.labelFormat = '{value:%b}' + '<br/>' + '{value:%d}';
    } if ('week' === this._storage.get('timeLine')) {
      this.labelFormat = '{value:%a}' + '<br/>' + '{value:%e}';
    }
  }

  removeSeries(chart) {
    while (chart && chart.series && chart.series.length > 0) {
      chart.series[0].remove(true);
    }
  }

  addDataToCurrentSelection(chart, formattedData) {
    if (chart) {
      for (let i = 0; i < formattedData.length; i++) {
        chart.addSeries(formattedData[i]);
      }
    }
  }


  updateXAxisLabelFormat(chart, type, thresholdLineValue) {
    if (chart && chart.xAxis && chart.xAxis.length) {
      chart.xAxis[0].update({
        labels: {
          rotation: 0,
          format: this.labelFormat,
          align: 'right'
        }
      });
    }
    this.addOrRemovePlotLine(chart, type, thresholdLineValue);
  }

  formatPlotBandsForPEF(chart, data) {
    if (data.vital_type === 'PEF') {
      let plotBands: Array<any> = [];
      _.each(data.colorcode, (colorcodeArray) => {
        _.each(colorcodeArray.values, (rule) => {
          plotBands.push({
            color: this.vitalStatusProvider(rule.colorcode),
            from: rule.min,
            to: rule.max
          });
        });
      });
      return plotBands;
    }
  }

  updateYAxis(chart, vital) {

    /**
     * If the data is just a list and does not contain any type variable.
     *  We will consider it as ACTIVITY
     **/
    if (vital.vital_type === 'undefined') {
      vital.vital_type = 'ACTIVITY';

      // We will also add UNIT to it since its ACTIVITY
      vital.current = {};
      vital.current.unit = 'STEPS';
    }
    const yAxisValue = CHART_CONFIG.graphConfig[vital.vital_type].yAxis;
    yAxisValue['plotBands'] = this.formatPlotBandsForPEF(chart, vital);

    /*Updating the data to be shown in YAxis*/
    yAxisValue.title.text = vital.current ? vital.current.unit : '';

    /** Updating the YAxis with the relevant values */
    if (chart && chart.yAxis && chart.yAxis.length) {
      chart.yAxis[0].remove();
      chart.addAxis(yAxisValue);
    }
  }

  updateXAxisTickInterval(chart) {
    if (chart && chart.xAxis && chart.xAxis.length) {
      chart.xAxis[0].update({ tickInterval: this.tickInterval });
    }
  }

  redrawGraph(chart) {
    if (chart) {
      chart.redraw();
    }
  }

  /**
   * This function helps in creating the charts with respect to the data provided.
   * @param chart This parameter is the current context to the Chart Object.
   * @param data This Data is the full data that is being represented in the table.
   *
   * ALGORITHM IS AS FOLLOWS:-
   * 1. Get the Formatted Graph Data
   * 2. Remove the Existing Series If Any in the Chart Variable
   * 3. Add the Data to the Series Using the utility function
   * 4. Check what is the timeline and tick interval
   * 5. Set the tickinterval and the timeline for the graph
   */
  chartMaker(chart, data) {
    if (data.all !== undefined && data.vital_type !== undefined) {
      if (data.vital_type === 'LUNG' || data.vital_type === 'DEVELOPMENT') {
        if (chart) {
          chart.setTitle({ text: '' });
        }
      } else {
        if (chart) {
          chart.setTitle({ text: data.vital_type_desc });
        }
      }

      /** Setting TickInterval and Label Format Globally for this component */
      this.getTickNLabelFormatXAxis();

      /** Setting the Tick Interval and Format for the X-Axis */
      this.updateXAxisTickInterval(chart);

      /** Updating the values for the Y-Axis from the configuration */
      this.updateYAxis(chart, data);
      if (chart) {
        chart.yAxis[0].update({

          title: {

            y: -0.48 * this.chart.plotHeight

          }

        });
      }

      /** Adding Data to the Chart Points */
      const formattedData = this._graphService.formatGraphData(data);
      if (data.vital_type === 'LUNG' && data.all.length !== 0) {
        this.updateXAxisLabel();
        const selectedUnit = this._storage.get('selectedUnit');
        if (selectedUnit === 'us') {
          this.updateXAxisLabelFormat(chart, data.vital_type, Number(data.all[0].banchmark_us));
        } else {
          this.updateXAxisLabelFormat(chart, data.vital_type, Number(data.all[0].banchmark_metric));
        }
      } else if (data.vital_type === 'DEVELOPMENT') {
        this.updateXAxisLabel();
        this.updateXAxisLabelFormat(chart, data.vital_type, 25);
      } else {
        this.updateXAxisLabelFormat(chart, data.vital_type_desc, 0);
      }
      this.removeSeries(chart);
      this.addDataToCurrentSelection(chart, formattedData);

      /** Redrawing the Graph explicitely */
      // commented to show month name in x axis in the first point,if uncomment first point month will go off
      //this.redrawGraph(chart);

    }

  }

  // To add or remove plotline in graph
  addOrRemovePlotLine(chart, type, thresholdLineValue) {
    var val = this._storage.get('percentile');
    const selectedUnit = this._storage.get('selectedUnit');
    var displayMonth = this._storage.get('displayMonth');
    var timeline = this._storage.get('timeLine');
    if (displayMonth === 0) {
      window.localStorage.removeItem('currentMonth');
    }
    var unitToShowOnGraph = '';
    var removePlotLine = false;

    if (val === 'FEV1/FVC') {
      unitToShowOnGraph = '(%)';
      removePlotLine = true;
    } else if (val === 'FEV1' || val === 'FVC') {
      if (selectedUnit === 'us') {
        unitToShowOnGraph = '(fl oz)';
      } else {
        unitToShowOnGraph = '(L)';
      }
    }else if (val === 'PEF') {
      if (selectedUnit === 'us') {
        unitToShowOnGraph = '(fl oz)';
      } else {
        unitToShowOnGraph = '(L/min)';
      }
    }else if (val === 'WeightBMI') {
      removePlotLine = true;
      if (selectedUnit === 'us') {
        unitToShowOnGraph = 'lbs';
      } else {
        unitToShowOnGraph = 'kg';
      }
    } else {
      unitToShowOnGraph = '(%)';
    }


    if (chart && (type === 'LUNG' || type === 'DEVELOPMENT')) {
      if (chart) {
        chart.update({
          yAxis: {
            gridLineWidth: 0,
            title: {
              text: unitToShowOnGraph, // For title to go on the Top eg (L)
              rotation: 0, // Rotate the Label to 0 degree imn order to make it horizontal as we see it
              margin: 0, // Mange the margin of the label in order to get it fixed properly
              // Y Axis offset, starts from the center which leads negative offset to move it up and positive to move it down.
              x: 5,
            },
            min: 0,
            plotLines: [{
              value: thresholdLineValue,
              width: 1,
              color: '#ED5565',
              label: {
                y: 4,
                style: { color: '#ED5565' }
              },
              id: 'plot-line'
            }]
          },
          legend: {
            enabled: false
          },
           plotOptions: {
            series: {
              connectNulls: true
            }
          },
          xAxis: {
            title: {
              text: ''
            },
            labels: {
              formatter: function () {
                if ('month' === timeline) {
                  if (window.localStorage.getItem('currentMonth') === null || window.localStorage.getItem('currentMonth') === undefined) {
                    window.localStorage.setItem('currentMonth', moment(this.value).format("MMM"));
                    return moment(this.value).format("D") + '<br>' + moment(this.value).format("MMM")
                  } else {
                    if (window.localStorage.getItem('currentMonth') !== moment(this.value).format("MMM")) {
                      window.localStorage.setItem('currentMonth', moment(this.value).format("MMM"));
                      return moment(this.value).format("D") + '<br>' + moment(this.value).format("MMM")
                    } else {
                      return moment(this.value).format("D");
                    }
                  }

                } if ('week' === timeline) {
                  if (window.localStorage.getItem('currentMonth') === null || window.localStorage.getItem('currentMonth') === undefined) {
                    window.localStorage.setItem('currentMonth', moment(this.value).format("MMM"));
                    return '     ' + moment(this.value).format("MMM") + ' ' + moment(this.value).format("D") + '<br>' + moment(this.value).format("ddd")
                  } else {
                    if (window.localStorage.getItem('currentMonth') !== moment(this.value).format("MMM")) {
                      window.localStorage.setItem('currentMonth', moment(this.value).format("MMM"));
                      return moment(this.value).format("MMM") + ' ' + moment(this.value).format("D") + '<br>' + moment(this.value).format("ddd")
                    } else {
                      return moment(this.value).format("D") + '<br>' + moment(this.value).format("ddd")
                    }
                  }
                }
              }
            }
          }
        });
      }
    }

    if (chart && removePlotLine && (type === 'LUNG' || type === 'DEVELOPMENT')) {
      chart.yAxis[0].removePlotLine('plot-line');
    }
  }
}
