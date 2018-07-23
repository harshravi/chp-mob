import { Injectable } from '@angular/core';

@Injectable()
export class DateUtilityService {

    constructor() { }

    /**
     * method gives the date in text format as:
     * today's date will be displayed as Today,
     * a date before that as Yesterday,
     * beyond that it will show normal date
     */
    getDateAsString(dateVal) {
        const dateNow = new Date().toDateString();
        const dateThen = moment(dateVal).toDate().toDateString();
        const diffDays = moment(dateNow).diff(dateThen, 'days');
        if (dateVal !== null || dateVal !== undefined) {
            if (diffDays === 0) {
                return 'Today';
            } else if (diffDays === 1) {
                return 'Yesterday';
            } else {
                return moment(dateVal).format('MMM DD YYYY');
            }
        }

    }

    // Getting only the String Today and Yesterday for the current date.
    getStringForTodayAndYesterday(dateVal) {
        const dateNow = new Date().toDateString();
        const dateThen = moment(dateVal).toDate().toDateString();
        const diffDays = moment(dateNow).diff(dateThen, 'days');
        if (dateVal !== null || dateVal !== undefined) {
            if (diffDays === 0) {
                return 'Today';
            } else if (diffDays === 1) {
                return 'Yesterday';
            } else {
                return moment(dateVal).format('MMM DD YYYY hh:mm A');
            }
        }
    }
    // To get only time
    getOnlyTime(dateVal) {
        const dateNow = new Date().toDateString();
        const dateThen = moment(dateVal).toDate().toDateString();
        const diffDays = moment(dateNow).diff(dateThen, 'days');
        if (dateVal !== null || dateVal !== undefined) {
            return moment(dateVal).format('hh:mm A');
        }
    }
    // when date is string then we have to change string to date so to change string to date we are calling this // method
    getDateForStringValue(dateVal) {
        if (dateVal) {
            const dateSet = dateVal.split('/');
            const dateNewVal = new Date(dateVal);
            return moment(dateNewVal).format('MMM DD YYYY');
        }
    }

    // to get only date not today or Yesterday
    getOnlyDate(dateVal){
         const dateNow = new Date().toDateString();
        const dateThen = moment(dateVal).toDate().toDateString();
        const diffDays = moment(dateNow).diff(dateThen, 'days');
        if (dateVal !== null || dateVal !== undefined) {
            return moment(dateVal).format('MMM DD YYYY');
        }
    }

    /**
     * method gives the date in text format as:
     * today's date will be displayed as only time,
     * a date before that as Yesterday,
     * beyond that it will show normal date
     */
    getDateAsStringAndOnlyTimeForToday(dateVal) {
        const dateNow = new Date().toDateString();
        const dateThen = moment(dateVal).toDate().toDateString();
        const diffDays = moment(dateNow).diff(dateThen, 'days');
        if (dateVal !== null || dateVal !== undefined) {
            if (diffDays === 0) {
                return moment(dateVal).format('H:mm');;
            } else if (diffDays === 1) {
                return 'Yesterday';
            } else {
                return moment(dateVal).format('MMM-d');
            }
        }
    }
    /*
    *Date format for last login time. In header component
    */
    getDateForLastLogin(dateVal) {
        return moment(dateVal).format('MMMM D, YYYY hh:mm A');
    }
}
