import moment from 'moment';

export default class DateHelper {
  public static formatCurrentDateIntoUtc(): string {
    return moment().utc().format('HH:mm [UTC,] DD MMM YYYY');
  }

  public static formateStartDateToUtc(): string {
    return moment(new Date()).utc().format('YYYY-MM-DD');
  }
}
