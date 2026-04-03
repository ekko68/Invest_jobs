import {StringUtils} from "./StringUtils";

const DateUtils = {
  insertYyyyMmDdDash: (valueNoDash) => {
    if (valueNoDash === undefined || valueNoDash === null || String(valueNoDash).trim() === '') return ''
    const str = valueNoDash.substring(0, 4) + '-' + valueNoDash.substring(4, 6) + '-' + valueNoDash.substring(6, 8)
    return str
  },
  // 2021-10-01 14:05:25
  convertYyyyMmDdNormalDate: (value) => {
    if (value === undefined || value === null || String(value).trim() === '') return ''
    const str =
      value.substring(0, 4) +
      '-' +
      value.substring(4, 6) +
      '-' +
      value.substring(6, 8) +
      ' ' +
      value.substring(8, 10) +
      ':' +
      value.substring(10, 12) +
      ':' +
      value.substring(12, 14)
    return str
  },

  /** 위의 메서드에서 아래 방식 추가 */
  // string date (yyyyMMdd 등 -> Date 전환)
  convertStringToDate: (dateString, isUTC = false) => {
    const onlyNum = String(dateString).replace(/\D/gm, '');

    const date = {
      year: '',
      month: '1',
      day: '1',
      hour: '00',
      minute: '00',
      second: '00'
    }

    if(onlyNum.length >= 4) {
      date.year = onlyNum.substring(0, 4);
      if(onlyNum.length >= 6) date.month = onlyNum.substring(4, 6);
      if(onlyNum.length >= 8) date.day = onlyNum.substring(6, 8);

      if(onlyNum.length >= 10) date.hour = onlyNum.substring(8, 10);
      if(onlyNum.length >= 12) date.minute = onlyNum.substring(10, 12);
      if(onlyNum.length >= 14) date.second = onlyNum.substring(12, 14);
    }

    if(isUTC) return new Date(Date.UTC(Number(date.year), Number(date.month) - 1, Number(date.day), Number(date.hour), Number(date.minute), Number(date.second)));
    else  return new Date(Number(date.year), Number(date.month) - 1, Number(date.day), Number(date.hour), Number(date.minute), Number(date.second));
  },

  customDateFormat: (dateString, pattern, locale = 'ko', isUTC = false, option = {}) => {

    let dateValue;

    if(dateString instanceof Date) {
      dateValue = dateString;
    } else {
      if(!StringUtils.hasLength(dateString)) return '';
      dateValue = DateUtils.convertStringToDate(dateString, isUTC);
    }


    const defaultOption = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',

      timeZone: 'Asia/Seoul',
      hour12: false
    }

    const dateObj = {};
    new Intl.DateTimeFormat(locale, {...defaultOption, ...option})
        .formatToParts(dateValue).forEach(x => { dateObj[x.type] = x.value; })

    return pattern
        .replace('yyyy', dateObj.year)
        .replace('MM', dateObj.month)
        .replace('dd', dateObj.day)
        .replace('HH', dateObj.hour)
        .replace('mm', dateObj.minute)
        .replace('ss', dateObj.second);
  },
}
export default DateUtils
