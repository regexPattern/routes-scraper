import * as moment from 'moment';
import * as globals from './globalConstants';

export class Utils {
  public static formatDate(date: string | number | Date) {
    if (date instanceof Date) {
      const d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();

      if (month.length < 2) {
        month = '0' + month;
      }
      if (day.length < 2) {
        day = '0' + day;
      }

      return [month, day, year].join('/');
    } else {
      return date;
    }
  }

  public static formatTime(value: any) {
    const duration = moment.duration({ seconds: value });
    let hours = duration
      .asHours()
      .toString()
      .split('.')[0];
    let minutes = duration.minutes().toString();
    let seconds = duration.seconds().toString();

    if (hours.length < 2) {
      hours = '0' + hours;
    }
    if (duration.minutes() < 10) {
      minutes = '0' + minutes;
    }
    if (duration.seconds() < 10) {
      seconds = '0' + seconds;
    }

    return hours + ':' + minutes + ':' + seconds;
  }

  public static formatDateCompact(date: string | number | Date) {
    if (date instanceof Date) {
      const d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();

      if (month.length < 2) {
        month = '0' + month;
      }
      if (day.length < 2) {
        day = '0' + day;
      }

      return day + month + year;
    } else {
      return date;
    }
  }

  public static formatTrend(trend: { value: string; name: string; }) {
    if (!trend.value || trend.value === 'null') {
      return '--';
    } else if (trend.name === 'Avg Time on Page') {
      return this.formatTime(trend.value);
    } else if (trend.name === 'Bounce Rate') {
      return trend.value + '%';
    } else {
      return this.formatNumber(trend.value);
    }
    return trend.value;
  }

  public static previousDate(formattedDate: string) {
    let today = new Date();
    if (formattedDate && formattedDate.length > 4) {
      const month = formattedDate.substr(2, 2);
      const year = formattedDate.substr(4, 4);
      today = new Date(month + '/01/' + year);
    }
    today.setMonth(today.getMonth() - 1);
    const newMonth = today.getMonth() + 1;
    let previousMonth = '01' + newMonth + today.getFullYear();
    if (newMonth < 10) {
      previousMonth = '010' + newMonth + today.getFullYear();
    }
    return { date: today, previousMonth: previousMonth };
  }

  public static numberValueParser(params: { newValue: any; }) {
    return Number(params.newValue);
  }

  public static formatNumber(numberValue: any) {
    let returnvalue;

    if (isNaN(numberValue)) {
      returnvalue = '--';
    } else {
      returnvalue = Math.floor(numberValue)
        .toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }
    return returnvalue;
  }

  public static formatNumber1(number: any) {
    let returnvalue;
    number = Math.round(number * 10) / 10;
    if (number === null) {
      returnvalue = 0;
    } else if (isNaN(number)) {
      returnvalue = '--';
    } else {
      returnvalue = number.toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }
    return returnvalue;
  }

  public static formatNumber2(number: any) {
    let returnvalue;
    number = Math.round(number * 100) / 100;
    if (number === null) {
      returnvalue = 0;
    } else if (isNaN(number)) {
      returnvalue = '--';
    } else {
      returnvalue = number.toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }
    return returnvalue;
  }

  public static formatCurrency(number: any) {
    let returnvalue;
    number = Math.round(number * 100) / 100;
    if (number === null) {
      returnvalue = 0;
    } else if (isNaN(number)) {
      returnvalue = '--';
    } else {
      returnvalue = '$' + number.toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }
    return returnvalue;
  }

  public static getErrorMessage(control: any) {
    // return this[control].hasError('required')
    //   ? 'You must enter a value'
    //   : this[control].hasError('email')
    //   ? 'Not a valid email'
    //   : '';
  }

  public static interpolate(text: string, data: any) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        text = text.replace('{{' + key + '}}', encodeURIComponent(data[key]));
      }
    }
    return text;
  }

  public static createDateCriteria(period: string, field: any) {
    let dateFoundCriteria = {startDate: new Date(), endDate: new Date(), field: null,
    operation: '', type: ''};
    if (String(period).length < 5) {
      dateFoundCriteria.startDate = new Date('01/01/' + period);
      dateFoundCriteria['endDate'] = new Date('12/31/' + period);
    } else if (String(period).length < 10) {
      const startDate = new Date(period.substr(2, 2) + '-' + period.substr(0, 2) + '-' + period.substr(4, 4));
      dateFoundCriteria['startDate'] = startDate;
      const endDate = new Date(period.substr(2, 2) + '-' + period.substr(0, 2) + '-' + period.substr(4, 4));
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(endDate.getDate() - 1);
      dateFoundCriteria['endDate'] = endDate;
    } else if (String(period).length > 10) {
      const dateArray = period.split(':');
      const startDate = new Date(
        dateArray[0].substr(2, 2) + '-' + dateArray[0].substr(0, 2) + '-' + dateArray[0].substr(4, 4)
      );
      dateFoundCriteria['startDate'] = startDate;
      const endDate = new Date(
        dateArray[1].substr(2, 2) + '-' + dateArray[1].substr(0, 2) + '-' + dateArray[1].substr(4, 4)
      );
      dateFoundCriteria['endDate'] = endDate;
    }
    dateFoundCriteria['field'] = field;
    dateFoundCriteria['operation'] = 'RANGE';
    dateFoundCriteria['type'] = 'DateCriteria';

    return dateFoundCriteria;
  }

  public static buildErrorMessage(error: { errorsList: any[]; messageDetails: any; message: any; }) {
    const errorsMessage = [];
    if (error.errorsList) {
      error.errorsList.forEach(row => {
        errorsMessage.push(row.field + ': ' + row.errorMessage);
      });
    } else if (error.messageDetails) {
      errorsMessage.push(error.messageDetails);
    } else {
      errorsMessage.push(error.message);
    }

    return errorsMessage;
  }

  public static isObjectEmpty(obj: {}) {
    const attrs = Object.keys(obj);
    return attrs.length === 0;
  }

  public static isNewItem(itemDate: moment.MomentInput) {
    const lastDays = globals.lastDays;
    const startDate = moment().subtract(lastDays, 'days');
    const date = moment(itemDate);

    return date.isSameOrAfter(startDate);
  }

  public static extractUrlData(value: string) {
    const http = 'http://';
    const https = 'https://';
    let url = value || '';
    let prefix = https;
    if (url.includes(http)) {
      prefix = http;
      url = url.replace(http, '');
    } else if (url.includes(https)) {
      prefix = https;
      url = url.replace(https, '');
    }
    return { url, prefix };
  }

  public static openUrl($event: { stopPropagation: () => void; preventDefault: () => void; }, url: string, target: string = '_blank') {
    // Note: to avoid component's event by default, it's needed next 2 lines
    $event.stopPropagation();
    $event.preventDefault();
    if (url.indexOf('http') !== 0) {
      url = 'https://' + url;
    }
    window.open(url, target);
  }

  public static checkUrl(data: ClipboardEvent) {
    // const text = data.clipboardData.getData('text');
    // let path = '';
    // let prefix = 'https://';
    // if (!text) {
    //   return { path, prefix };
    // }
    // path = text;

    // try {
    //   const url = new URL(text);
    //   prefix = url.protocol + '//';
    //   path = url.host + url.pathname;
    // } catch (err) {}

    // return { path, prefix };
  }

  public static week(year: string | number | Date, month: any, day: any) {
    function serial(days: number) { return 86400000 * days; }
    function dateserial(year: number, month: number, day: number | undefined) { return (new Date(year, month-1, day).valueOf()); }
    function weekday(date: string | number | Date) { return (new Date(date)).getDay()+1; }
    function yearserial(date: string | number | Date) { return (new Date(date)).getFullYear(); }
    const date = year instanceof Date ? year.valueOf() : typeof year === 'string' ? new Date(year).valueOf() : dateserial(year,month,day), 
        date2 = dateserial(yearserial(date - serial(weekday(date-serial(1))) + serial(4)),1,3);
    return ~~((date - date2 + serial(weekday(date2) + 5)) / serial(7));
  }

  public static monthsBetween(startDate: string, endDate: string) {
    const start      = startDate.split('-');
    const end        = endDate.split('-');
    const startYear  = parseInt(start[0]);
    const endYear    = parseInt(end[0]);
    const dates      = [];
  
    for (let i = startYear; i <= endYear; i++) {
      const endMonth = i !== endYear ? 11 : parseInt(end[1]) - 1;
      const startMon = i === startYear ? parseInt(start[1])-1 : 0;
      for (let j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
        const month = j + 1;
        const displayMonth = month < 10 ? '0' + month : month;
        dates.push([i, displayMonth, '01'].join('-'));
      }
    }
    return dates;
  }

  public static getBrowserName() {
    const agent = window.navigator.userAgent.toLowerCase()
    switch (true) {
      case agent.indexOf('edge') > -1:
        return 'edge';
      case agent.indexOf('opr') > -1 && !!(<any>window).opr:
        return 'opera';
      case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
        return 'chrome';
      case agent.indexOf('trident') > -1:
        return 'ie';
      case agent.indexOf('firefox') > -1:
        return 'firefox';
      case agent.indexOf('safari') > -1:
        return 'safari';
      default:
        return 'other';
    }
  }

}

// DATE EXTENSIONS
// ================

declare global {
  interface Date {
     getWeek(): number;
  }
}

// Returns the ISO week of the date.
Date.prototype.getWeek = function() {
  const date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  // January 4 is always in week 1.
  const week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                        - 3 + (week1.getDay() + 6) % 7) / 7);
}
