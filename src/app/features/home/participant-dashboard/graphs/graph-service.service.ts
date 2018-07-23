import { Injectable } from '@angular/core';
import { CHART_CONFIG } from './../../../../constants/other-constants/chart-config';
import { LocalStorageService } from 'angular-2-local-storage';
import * as _ from 'lodash';

@Injectable()
export class GraphServiceService {

  constructor(private _storage: LocalStorageService) { }

  getGraphStub(timeline, vital): any {
    /**Temp Vaiable */
    let format = '';
    let tickInterval = 0;
    if ('month' === timeline) {
      format = '{value:%m-%d-%Y}';
      tickInterval = 60 * 60 * 24 * 1000;
    } if ('week' === timeline) {
      format = '{value:%a}';
      tickInterval = 60 * 60 * 24 * 1000;
    }

    // Comparing if there is a change in the Vital Type if So we have to use the ternaty operator
    // (vital === 'whbmi') ? (vital = 'Weight/BMI') : vital;
    if (vital === 'whbmi') {
      vital = 'Weight/BMI';
    }
    return {
      options: {
        chart: {
          height: 300,
          type: CHART_CONFIG.graphConfig[vital].type,
          zoomType: 'yx',
          animation: true,
          // Edit chart spacing
          spacingBottom: 15,
          spacingTop: 25,
          spacingLeft: 10,
          spacingRight: 10,
          // borderColor: '#D7D7D7',
          // borderWidth: 1,
          reflow: true
        },
        credits: { enabled: false },
        lang: {
          noData: 'No Data available',
        },
        size: {
          height: 100
        },
        exporting: {
          enabled: false
        },
        colors: ['#2C91DE', '#165A8E'],
        loading: false,
        yAxis: {
          gridLineWidth: 0,
          title: {
            text: '(%)', // For title to go on the Top eg (L)
            rotation: 0, // Rotate the Label to 0 degree imn order to make it horizontal as we see it
            margin: 0, // Mange the margin of the label in order to get it fixed properly
            y: -150 // Y Axis offset, starts from the center which leads negative offset to move it up and positive to move it down.
          },
          min: 0,
        },
        xAxis: {
          labels: {
            style: {
              textOverflow: 'none'
            }
          },
          startOnTick: true,
          type: 'datetime',
          gridLineWidth: 0,
          lineWidth: 0,
          minorGridLineWidth: 0,
          lineColor: 'transparent',
          tickWidth: 0,
          rotation: 0,
          dateTimeLabelFormats: {
            month: '%e. %b',
            year: '%b'
          }
        },
        plotOptions: {
          line: {
            marker: {
              symbol: 'circle'
            }
          },
          series: {
            stacking: (CHART_CONFIG.graphConfig[vital].stacking) ? CHART_CONFIG.graphConfig[vital].stacking : null,
            marker: {
              lineWidth: 0,
              lineColor: null,
              enabled: true,
              radius: 5
            }
          }
        },
        tooltip: {
          shared: true,
          //crosshairs: true,
          followPointer: true,
          borderColor: null,
          xDateFormat: (CHART_CONFIG.graphConfig[vital].tooltip.xDateFormat !== undefined) ?
            CHART_CONFIG.graphConfig[vital].tooltip.xDateFormat : null,
          useHTML: (CHART_CONFIG.graphConfig[vital].tooltip.useHTML !== undefined) ?
            CHART_CONFIG.graphConfig[vital].tooltip.useHTML : false,
          formatter: CHART_CONFIG.graphConfig[vital].tooltip.formatter ? CHART_CONFIG.graphConfig[vital].tooltip.formatter : null
        }
      },
      series: [],
      yAxis: CHART_CONFIG.graphConfig[vital].yAxis
    };
  }

  /*Graph Formatting Function*/
  formatGraphData(data) {

    /**
     * Refers to the chart Data that is the final data to be emitted out.
     * @type {Array}
     */
    let chartData = [];

    /**
     * Calculate the Last Remaining Days if its Not Available in the Array
     */
    function daysLeftOut(noOfDays, startDate) {
      // Array Containing number of missing data
      const daysData = [];
      // Loop starts from 1 since we need to get along with substraction of days starting from 1
      for (let i = 1; i < noOfDays; i++) {
        daysData.push(moment(startDate).subtract(i, 'days'));
      }
      return daysData;
    }

    /**
     * Function that gives out the status color for the vitals
     * @param  {Number} statusValue Value of the status coming from vital_status
     * @return {String}             Color of the status, a string containing color
     */
    function vitalStatusProvider(statusValue) {
      let status = '#ecf0f1';
      if (0 === statusValue) {
        status = '#2ecc71';
      }
      if (1 === statusValue) {
        status = '#f1c40f';
      }
      if (2 === statusValue) {
        status = '#e74c3c';
      }
      return status;
    }

    /**
     * A function which acts as a factory for generating data points for the graphs.
     * @param  {Number} x     This is a number which carries a timestamp for the event.
     * @param  {Number} y     Refers to the exact value for the vital
     * @param  {Number} color Code of the color which helps in identifying the status
     * @return {Object}       An object that can be added to the array of data.
     */
    const highchartsObjFormatter = function (x, y, color) {
      return { x: Number(x), y: Number(y), color: vitalStatusProvider(color) };
    };
    const highchartsObjBGFormatter = function (x, y, color, mealType) {
      return { x: Number(x), y: Number(y), color: vitalStatusProvider(color), mealType: mealType };
    };

    /**
     * @param {string} [vital_type] - Type of Vital we are dealing with.
     */
    if (('BP' === data.vital_type) || ('PEF' === data.vital_type) ||
      ('BG' === data.vital_type) || ('O2S' === data.vital_type) || ('HR' === data.vital_type) || ('Fluid' === data.data_type)) {
      const SystolicData = [], // Array of Systolic Records
        DiastolicData = [], // Array for Diastolic Records
        GlucoseBeforeMealData = [], // Array of Glucose Value before meal
        GlucoseAfterMealData = [], // Array of Glucose Value after meal
        otherData = []; // Array for PEF, Heart Rate, Blood Glucose, Blood Oxygen

      /**
       * @param {string} [vital_type] - Type of Vital we are dealing with - Blood Pressure/Blood Glucose.
       */
      if (('BP' === data.vital_type) || ('BG' === data.vital_type)) {
        _.each(data.all, function (obj) {
          _.each(obj.data, function (dataPoint) {
            if ('BP' === data.vital_type) {
              SystolicData.push(highchartsObjFormatter(dataPoint.time, dataPoint.value, dataPoint.vital_status));
              DiastolicData.push(highchartsObjFormatter(dataPoint.time, dataPoint.value_ext, dataPoint.vital_status));
            } else
              if ('BG' === data.vital_type) {
                if (dataPoint.value_ext === 'before') {
                  GlucoseBeforeMealData.push(highchartsObjBGFormatter(dataPoint.time, dataPoint.value, dataPoint.vital_status, 'before'));
                }
                if (dataPoint.value_ext === 'after') {
                  GlucoseAfterMealData.push(highchartsObjBGFormatter(dataPoint.time, dataPoint.value, dataPoint.vital_status, 'after'));
                }
              }
          });
        });
        /**
         * Assiging data for Blood Pressure
         */
        if ('BP' === data.vital_type) {
          chartData = [
            {
              name: 'Systolic',
              data: SystolicData.reverse()
            },
            {
              name: 'Diastolic',
              data: DiastolicData.reverse()
            }
          ];
        }
        /**
         * Assiging data for Blood Glucose
         */
        const tempObj = {
          date: '',
          fillColor: '#fff',
          x: 0,
          y: 0,
          type: ''
        };
        if (GlucoseBeforeMealData.length === 0 || GlucoseAfterMealData.length === 0) {
          if (GlucoseBeforeMealData.length === 0 && GlucoseAfterMealData.length > 0) {
            tempObj.x = GlucoseAfterMealData[0].x;
            tempObj.y = GlucoseAfterMealData[0].y;
            tempObj.type = 'before';
            GlucoseBeforeMealData.push(tempObj);
          }
          if (GlucoseAfterMealData.length === 0 && GlucoseBeforeMealData.length > 0) {
            tempObj.x = GlucoseBeforeMealData[0].x;
            tempObj.y = GlucoseBeforeMealData[0].y;
            tempObj.type = 'after';
            tempObj.fillColor = GlucoseBeforeMealData[0].fillColor;
            GlucoseAfterMealData.push(tempObj);
          }
        }
        if ('BG' === data.vital_type) {
          chartData = [
            {
              name: 'Before Meal',
              data: GlucoseBeforeMealData.reverse()
            },
            {
              dashStyle: 'ShortDash',
              name: 'After Meal',
              data: GlucoseAfterMealData.reverse()
            }
          ];
        }
      } else {
        /**
         * @param {string} [vital_type] - Type of Vital we are dealing with PEF, Heart Rate, Blood Glucose, Blood Oxygen
         */
        _.each(data.all, function (obj) {
          _.each(obj.data, function (dataPoint) {
            if ('Fluid' === data.data_type) {
              otherData.push(highchartsObjFormatter(dataPoint.timestamp, dataPoint.value_ltr, null));
            } else {
              otherData.push(highchartsObjFormatter(dataPoint.time, dataPoint.value, dataPoint.vital_status));
            }

          });
        });

        /**
         * Comparing whether the vital_type is
         * Heart Rate : HR,
         * Blood Oxygen : O2S,
         * Peak Expiratory Flow : PEF
         *
         * If So add zones so as to color the region. Otherwise just the general data point is returned in the
         * else Block
         */
        if (('HR' === data.vital_type) || ('O2S' === data.vital_type) || ('PEF' === data.vital_type)) {
          const zones = [];
          if ('O2S' === data.vital_type || 'HR' === data.vital_type) {
            _.each(data.colorcode, (colorcode) => {
              _.each(colorcode.values, (zoneRules) => {
                zones.push({
                  value: Number(Number(zoneRules.max) + 1),
                  color: vitalStatusProvider(zoneRules.colorcode)
                });
              });
            });
            chartData = [{
              type: CHART_CONFIG.graphConfig[data.vital_type].type,
              zones: zones,
              marker: CHART_CONFIG.graphConfig[data.vital_type].marker,
              name: data.vital_type,
              data: otherData.reverse()
            }];
          } else {
            // Save PlotOptions in the LocalStorage
            this._storage.set('PEFPlotBands', data.colorcode[0].values);
            chartData = [{
              type: CHART_CONFIG.graphConfig[data.vital_type].type,
              name: data.vital_type,
              data: otherData.reverse()
            }];
          }
        } else if ('Fluid' === data.data_type) {
          /**
           * Data to be broken into two parts, first part would be data below 2
           * and the second part would contain the rest. This would help us to
           * get the stacked bar graph.
           */
          const xAxis = [], // Taken as time, it would act as category
            safeData = [], // Data that is condidered to be safe wrt fluid intake
            unsafeData = []; // Data considered to be unsafe wrt to the fluid intake
          _.each(otherData, function (dataPoint) {
            xAxis.push(dataPoint.x); // Pushed time as a category
            if (dataPoint.y < 2) {
              safeData.push([dataPoint.x, dataPoint.y]); // Data is below 2 so the unsafeData is null
              unsafeData.push([dataPoint.x, null]);
            } else {
              safeData.push([dataPoint.x, 2]);
              // Data is above 2 so the base would be 2 by default and the unsafeData would be the difference
              unsafeData.push([dataPoint.x, (dataPoint.y - 2)]);
            }
          });


          chartData = [
            {
              name: 'Unsafe Limit',
              data: unsafeData.reverse(),
              color: '#FF0000'
            },
            {
              name: 'Safe Limit',
              data: safeData.reverse(),
              color: '#2ecc71'
            }];
        }
      }
    } else if ('DEVELOPMENT' === data.vital_type) {
      const status = this._storage.get('developmentStatus');
      const WeightBmi = [];
      /**
      * Object Generator for the weight
      */
      const getWhbmiObject: any = (time, weight, status) => {
       if(weight === null) { 
           return {
          x: time,
          y: null,
          color: vitalStatusProvider(status)
        };
       }else {
        return {
          x: time,
          y: weight,
          color: vitalStatusProvider(status)
        };
       }
        
      };

      const selectedUnit = this._storage.get('selectedUnit');
      if (selectedUnit === 'us') {
        _.each(data.all, (dataPoint) => {
          WeightBmi.push(getWhbmiObject(dataPoint.time, dataPoint.value_us == null ? null : Number(dataPoint.value_us), dataPoint.vital_status));
        });
      } else if (selectedUnit === 'metric') {
        _.each(data.all, (dataPoint) => {
          WeightBmi.push(getWhbmiObject(dataPoint.time, dataPoint.value_metric == null ? null : Number(dataPoint.value_metric), dataPoint.vital_status));
        });
      }

      /**
      * Save values for the Plot Bands on the Local Storage
      */

      /**
       * Assigning Lungs variable to the chartData
       */
      chartData = [{
        type: CHART_CONFIG.graphConfig[data.vital_type].type,
        name: 'Development',
        data: WeightBmi.reverse()
      }];
    } else if ('LUNG' === data.vital_type) {
      const lungsData = [];
      /**
      * Object Generator for the Lungs
      */
      const getLungObject: any = function (time, value, status) {
        if (value === 0) {
          return {
            x: time,
            y: null,
            color: vitalStatusProvider(status)
          };
        } else {
          return {
            x: time,
            y: value,
            color: vitalStatusProvider(status)
          };
        }
      };

      const selectedUnit = this._storage.get('selectedUnit');
      if (selectedUnit === 'us') {
        _.each(data.all, (dataPoint) => {
          lungsData.push(getLungObject(dataPoint.time, dataPoint.value_us == null ? null : Number(dataPoint.value_us), dataPoint.vital_status));
        });
      } else if (selectedUnit === 'metric') {
        _.each(data.all, (dataPoint) => {
          lungsData.push(getLungObject(dataPoint.time, dataPoint.value_metric == null ? null : Number(dataPoint.value_metric), dataPoint.vital_status));
        });
      }

      /**
       * Assigning Lung variable to the chartData
       */
      chartData = [{
        type: CHART_CONFIG.graphConfig[data.vital_type].type,
        name: 'Lung',
        data: lungsData.reverse()
      }];
    } else if ('miles' === data[0] ? data[0].distance_unit : false) {
      const activityData = [];
      _.each(data, (dataPoint) => {
        activityData.push({
          x: dataPoint.timestamp,
          y: dataPoint.steps,
          calories: dataPoint.calories,
          steps: dataPoint.steps,
          distance: dataPoint.distance,
          source: dataPoint.source
        });
      });
      chartData = [{
        name: 'Steps', // changed 'distance covered' to Steps
        data: activityData.reverse()
      }];
    }

    /**
     * @param {string} [vital_type] - Type of Vital we are dealing with HR.
     */
    // here timeline should take from session
    if (this._storage.get('dataTimeline') === 'week') {
      _.each(chartData, function (dataPoint) {
        _.each(dataPoint.data, function (dataStat) {
          dataStat.date = moment(dataStat.x).format('MM-DD-YYYY');
        });
        // Grouped the Days and Removed Redundent Days
        let startingDate: any;
        const totalDays: Dictionary<{}[]> = _.groupBy(dataPoint.data, 'date');

        // Loop in to push into an Array and get the first DataPoint key
        for (const obj in totalDays) {
          if (totalDays[obj]) {
            //todo sathish
            //startingDate = totalDays[obj].x;
            break;
          }
        }

        // Starting Point to go through the dates
        const numberOfDays = Object.keys(totalDays).length;
        if (numberOfDays < 8) {
          const timestamp_data = daysLeftOut((8 - numberOfDays), startingDate);
          // Converting to Timestamp for the same
          _.each(timestamp_data, function (d) {
            dataPoint.data.push({
              x: d.toDate().getTime(),
              y: null,
              fillColor: null
            });
          });
        }
      });
    }
    return chartData;
  }

}
