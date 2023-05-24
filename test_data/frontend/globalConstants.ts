export const version = '6.7.0';

export const periods = ['Year', 'Month', 'Date Range'];

export const roles = {
  ADMINISTRATOR: 'ADMINISTRATOR',
  REGULAR_USER: 'REGULAR_USER',
  VIEW_ONLY_USER: 'VIEW_ONLY_USER',
};

export const siteLabels = {
  'STATUS': ['Completed', 'Mention'],
  'SITE_TYPE': ['Blogger', 'Media', 'Tourism'],
  'MENTION_TYPE': ['Link', 'Non Link'],
  'COMMERCIAL_LINK': ['No', 'Yes'],
  'MENTION_ACQUISITION': ['Earned', 'Outreach', 'Paid', 'Trade', 'Unpaid'],
  'FOLLOW_TYPE': ['Follow', 'No Follow', 'Non Link']
};

export const projectStatus = [
  {'id': 'enabled', 'name': 'Ready'},
  {'id': 1, 'name': 'In Progress'},
  {'id': 2, 'name': 'Published'},
  {'id': 9, 'name': 'Archived'}
];

export const contentTypes = [
  'contribute', 'image link', 'image placement', 'internal content',  'partner content', 'social share', 'syndicated'
];

export const targetUrlType = [
  'Homepage', 'Blog', 'CDG', 'Hotel', 'TTD', 'Military', 'Explore', 'Commercial', 'Worlds Beyond', 'Trip'
];

export const months = [
  {'index': 0, 'value': '01', 'label': 'January', 'abbr': 'Jan'},
  {'index': 1, 'value': '02', 'label': 'February', 'abbr': 'Feb'},
  {'index': 2, 'value': '03', 'label': 'March', 'abbr': 'Mar'},
  {'index': 3, 'value': '04', 'label': 'April', 'abbr': 'Apr'},
  {'index': 4, 'value': '05', 'label': 'May', 'abbr': 'May'},
  {'index': 5, 'value': '06', 'label': 'June', 'abbr': 'Jun'},
  {'index': 6, 'value': '07', 'label': 'July', 'abbr': 'Jul'},
  {'index': 7, 'value': '08', 'label': 'August', 'abbr': 'Aug'},
  {'index': 8, 'value': '09', 'label': 'September', 'abbr': 'Sep'},
  {'index': 9, 'value': '10', 'label': 'October', 'abbr': 'Oct'},
  {'index': 10, 'value': '11', 'label': 'November', 'abbr': 'Nov'},
  {'index': 11, 'value': '12', 'label': 'December', 'abbr': 'Dec'}
];

export const holidays = [
  '2019-11-28', '2019-11-29',
  '2019-12-24', '2019-12-25', '2019-12-26',
  '2019-12-31', '2020-1-1', '2020-5-25',
  '2020-7-3', '2020-9-7', '2020-11-26',
  '2020-11-27', '2020-12-24', '2020-12-28',
  '2020-12-31', '2021-01-01', '2021-5-31',
  '2021-7-2', '2021-7-5', '2021-9-6',
  '2021-11-25', '2021-11-26', '2021-12-24',
  '2021-12-27', '2021-12-31'
];

export const weeks = [
  {'year': 2019, 'month': 11, 'yearmonth': 201911, 'name': 'Nov', 'days': 21, 'weeks' : [
    {'week': 43, 'days': 1, 'display': 'Nov 1'},
    {'week': 44, 'days': 5, 'display': 'Nov 4 - Nov 8'},
    {'week': 45, 'days': 5, 'display': 'Nov 11 - Nov 15'},
    {'week': 46, 'days': 5, 'display': 'Nov 18 - Nov 22'},
    {'week': 47, 'days': 5, 'display': 'Nov 25 - Nov 29'}
  ]},
  {'year': 2019, 'month': 12, 'yearmonth': 201912, 'name': 'Dec', 'days': 18, 'weeks' : [
    {'week': 48, 'days': 5, 'display': 'Dec 2 - Dec 6'},
    {'week': 49, 'days': 5, 'display': 'Dec 9 - Dec 13'},
    {'week': 50, 'days': 5, 'display': 'Dec 16 - Dec 20'},
    {'week': 51, 'days': 2, 'display': 'Dec 23 - Dec 27'},
    {'week': 52, 'days': 1, 'display': 'Dec 30 - Dec 31'}
  ]},
  {'year': 2020, 'month': 1, 'yearmonth': 202001, 'name': 'Jan', 'days': 22, 'weeks' : [
    {'week': 1, 'days': 3, 'display': 'Jan 1 - Jan 3'},
    {'week': 2, 'days': 5, 'display': 'Jan 6 - Jan 10'},
    {'week': 3, 'days': 5, 'display': 'Jan 13 - Jan 17'},
    {'week': 4, 'days': 5, 'display': 'Jan 20 - Jan 24'},
    {'week': 5, 'days': 5, 'display': 'Jan 27 - Jan 31'}
  ]},
  {'year': 2020, 'month': 2, 'yearmonth': 202002, 'name': 'Feb', 'days': 20, 'weeks' : [
    {'week': 6, 'days': 5, 'display': 'Feb 3 - Feb 7'},
    {'week': 7, 'days': 5, 'display': 'Feb 10 - Feb 14'},
    {'week': 8, 'days': 5, 'display': 'Feb 17 - Feb 21'},
    {'week': 9, 'days': 5, 'display': 'Feb 24 - Feb 28'}
  ]},
  {'year': 2020, 'month': 3, 'yearmonth': 202003, 'name': 'Mar', 'days': 22, 'weeks' : [
    {'week': 10, 'days': 5, 'display': 'Mar 2 - Mar 6'},
    {'week': 11, 'days': 5, 'display': 'Mar 9 - Mar 13'},
    {'week': 12, 'days': 5, 'display': 'Mar 16 - Mar 20'},
    {'week': 13, 'days': 5, 'display': 'Mar 23 - Mar 27'},
    {'week': 14, 'days': 2, 'display': 'Mar 30 - Mar 31'}
  ]},
  {'year': 2020, 'month': 4, 'yearmonth': 202004, 'name': 'Apr', 'days': 22, 'weeks' : [
    {'week': 14, 'days': 3, 'display': 'Apr 1 - Apr 3'},
    {'week': 15, 'days': 5, 'display': 'Apr 6 - Apr 10'},
    {'week': 16, 'days': 5, 'display': 'Apr 13 - Apr 17'},
    {'week': 17, 'days': 5, 'display': 'Apr 20 - Apr 24'},
    {'week': 18, 'days': 4, 'display': 'Apr 27 - Apr 30'}
  ]},
  {'year': 2020, 'month': 5, 'yearmonth': 202005, 'name': 'May', 'days': 21, 'weeks' : [
    {'week': 18, 'days': 1, 'display': 'May 1'},
    {'week': 19, 'days': 5, 'display': 'May 4 - May 8'},
    {'week': 20, 'days': 5, 'display': 'May 11 - May 15'},
    {'week': 21, 'days': 5, 'display': 'May 18 - May 22'},
    {'week': 22, 'days': 5, 'display': 'May 25 - May 29'}
  ]},
  {'year': 2020, 'month': 6, 'yearmonth': 202006, 'name': 'Jun', 'days': 22, 'weeks' : [
    {'week': 23, 'days': 5, 'display': 'Jun 1 - Jun 5'},
    {'week': 24, 'days': 5, 'display': 'Jun 8 - Jun 12'},
    {'week': 25, 'days': 5, 'display': 'Jun 15 - Jun 19'},
    {'week': 26, 'days': 5, 'display': 'Jun 22 - Jun 26'},
    {'week': 27, 'days': 2, 'display': 'Jun 29 - Jun 30'}
  ]},
  {'year': 2020, 'month': 7, 'yearmonth': 202007, 'name': 'Jul', 'days': 23, 'weeks' : [
    {'week': 27, 'days': 3, 'display': 'Jul 1 - Jul 3'},
    {'week': 28, 'days': 5, 'display': 'Jul 6 - Jul 10'},
    {'week': 29, 'days': 5, 'display': 'Jul 13 - Jul 17'},
    {'week': 30, 'days': 5, 'display': 'Jul 20 - Jul 24'},
    {'week': 31, 'days': 5, 'display': 'Jul 27 - Jul 31'}
  ]},
  {'year': 2020, 'month': 8, 'yearmonth': 202008, 'name': 'Aug', 'days': 21, 'weeks' : [
    {'week': 32, 'days': 5, 'display': 'Aug 3 - Aug 7'},
    {'week': 33, 'days': 5, 'display': 'Aug 10 - Jul 14'},
    {'week': 34, 'days': 5, 'display': 'Aug 17 - Aug 21'},
    {'week': 35, 'days': 5, 'display': 'Aug 24 - Aug 28'},
    {'week': 36, 'days': 1, 'display': 'Aug 31'}
  ]},
  {'year': 2020, 'month': 9, 'yearmonth': 202009, 'name': 'Sep', 'days': 22, 'weeks' : [
    {'week': 36, 'days': 4, 'display': 'Sep 1 - Sep 4'},
    {'week': 37, 'days': 5, 'display': 'Sep 7 - Sep 11'},
    {'week': 38, 'days': 5, 'display': 'Sep 14 - Sep 18'},
    {'week': 39, 'days': 5, 'display': 'Sep 21 - Sep 25'},
    {'week': 40, 'days': 3, 'display': 'Sep 28 - Sep 30'}
  ]},
  {'year': 2020, 'month': 10, 'yearmonth': 202010, 'name': 'Oct', 'days': 22, 'weeks' : [
    {'week': 40, 'days': 2, 'display': 'Oct 1 - Oct 2'},
    {'week': 41, 'days': 5, 'display': 'Oct 5 - Oct 9'},
    {'week': 42, 'days': 5, 'display': 'Oct 12 - Oct 16'},
    {'week': 43, 'days': 5, 'display': 'Oct 19 - Oct 23'},
    {'week': 44, 'days': 5, 'display': 'Oct 26 - Oct 30'}
  ]},
  {'year': 2020, 'month': 11, 'yearmonth': 202011, 'name': 'Nov', 'days': 21, 'weeks' : [
    {'week': 45, 'days': 5, 'display': 'Nov 2 - Nov 6'},
    {'week': 46, 'days': 5, 'display': 'Nov 9 - Nov 13'},
    {'week': 47, 'days': 5, 'display': 'Nov 16 - Nov 20'},
    {'week': 48, 'days': 3, 'display': 'Nov 23 - Nov 25'},
    {'week': 49, 'days': 1, 'display': 'Nov 30'}
  ]},
  {'year': 2020, 'month': 12, 'yearmonth': 202012, 'name': 'Dec', 'days': 23, 'weeks' : [
    {'week': 49, 'days': 4, 'display': 'Dec 1 - Dec 4'},
    {'week': 50, 'days': 5, 'display': 'Dec 7 - Dec 11'},
    {'week': 51, 'days': 5, 'display': 'Dec 17 - Dec 18'},
    {'week': 52, 'days': 3, 'display': 'Dec 21 - Dec 23'},
    {'week': 53, 'days': 4, 'display': 'Dec 28 - Dec 31'}
  ]},
  {'year': 2021, 'month': 1, 'yearmonth': 202101, 'name': 'Jan', 'days': 20, 'weeks' : [
    {'week': 1, 'days': 1, 'display': 'Jan 1', 'short': '1-2'},
    {'week': 2, 'days': 5, 'display': 'Jan 4 - Jan 8', 'short': '3-9'},
    {'week': 3, 'days': 5, 'display': 'Jan 11 - Jan 15', 'short': '10-16'},
    {'week': 4, 'days': 5, 'display': 'Jan 18 - Jan 22', 'short': '17-23'},
    {'week': 5, 'days': 5, 'display': 'Jan 25 - Jan 29', 'short': '24-31'}
  ]},
  {'year': 2021, 'month': 2, 'yearmonth': 202102, 'name': 'Feb', 'days': 20, 'weeks' : [
    {'week': 6, 'days': 5, 'display': 'Feb 1 - Feb 5', 'short': '1-6'},
    {'week': 7, 'days': 5, 'display': 'Feb 8 - Feb 12', 'short': '7-13'},
    {'week': 8, 'days': 5, 'display': 'Feb 15 - Feb 19', 'short': '14-20'},
    {'week': 9, 'days': 5, 'display': 'Feb 22 - Feb 26', 'short': '21-28'}
  ]},
  {'year': 2021, 'month': 3, 'yearmonth': 202103, 'name': 'Mar', 'days': 23, 'weeks' : [
    {'week': 10, 'days': 5, 'display': 'Mar 1 - Mar 5', 'short': '1-6'},
    {'week': 11, 'days': 5, 'display': 'Mar 8 - Mar 12', 'short': '7-13'},
    {'week': 12, 'days': 5, 'display': 'Mar 15 - Mar 19', 'short': '14-20'},
    {'week': 13, 'days': 5, 'display': 'Mar 22 - Mar 26', 'short': '21-27'},
    {'week': 14, 'days': 3, 'display': 'Mar 29 - Mar 31', 'short': '28-31'}
  ]},
  {'year': 2021, 'month': 4, 'yearmonth': 202104, 'name': 'Apr', 'days': 22, 'weeks' : [
    {'week': 14, 'days': 2, 'display': 'Apr 1 - Apr 2', 'short': '1-3'},
    {'week': 15, 'days': 5, 'display': 'Apr 5 - Apr 9', 'short': '4-10'},
    {'week': 16, 'days': 5, 'display': 'Apr 12 - Apr 16', 'short': '11-17'},
    {'week': 17, 'days': 5, 'display': 'Apr 19 - Apr 23', 'short': '18-24'},
    {'week': 18, 'days': 5, 'display': 'Apr 26 - Apr 30', 'short': '25-30'}
  ]},
  {'year': 2021, 'month': 5, 'yearmonth': 202105, 'name': 'May', 'days': 20, 'weeks' : [
    {'week': 19, 'days': 5, 'display': 'May 3 - May 7', 'short': '1-8'},
    {'week': 20, 'days': 5, 'display': 'May 10 - May 14', 'short': '9-15'},
    {'week': 21, 'days': 5, 'display': 'May 17 - May 21', 'short': '16-22'},
    {'week': 22, 'days': 5, 'display': 'May 24 - May 28', 'short': '23-29'},
    {'week': 23, 'days': 1, 'display': 'May 31', 'short': '30-31'}
  ]},
  {'year': 2021, 'month': 6, 'yearmonth': 202106, 'name': 'Jun', 'days': 22, 'weeks' : [
    {'week': 23, 'days': 4, 'display': 'Jun 1 - Jun 4', 'short': '1-5'},
    {'week': 24, 'days': 5, 'display': 'Jun 7 - Jun 11', 'short': '6-12'},
    {'week': 25, 'days': 5, 'display': 'Jun 14 - Jun 18', 'short': '13-19'},
    {'week': 26, 'days': 5, 'display': 'Jun 21 - Jun 25', 'short': '20-26'},
    {'week': 27, 'days': 3, 'display': 'Jun 28 - Jun 30', 'short': '27-30'}
  ]},
  {'year': 2021, 'month': 7, 'yearmonth': 202107, 'name': 'Jul', 'days': 19, 'weeks' : [
    {'week': 27, 'days': 2, 'display': 'Jul 1 - Jul 2', 'short': '1-3'},
    {'week': 28, 'days': 4, 'display': 'Jul 6 - Jul 9', 'short': '4-10'},
    {'week': 29, 'days': 5, 'display': 'Jul 12 - Jul 16', 'short': '11-17'},
    {'week': 30, 'days': 5, 'display': 'Jul 19 - Jul 23', 'short': '18-24'},
    {'week': 31, 'days': 3, 'display': 'Jul 26 - Jul 30', 'short': '25-31'}
  ]},
  {'year': 2021, 'month': 8, 'yearmonth': 202108, 'name': 'Aug', 'days': 22, 'weeks' : [    
    {'week': 32, 'days': 5, 'display': 'Aug 2 - Aug 6', 'short': '1-7'},
    {'week': 33, 'days': 5, 'display': 'Aug 9 - Aug 13', 'short': '8-14'},
    {'week': 34, 'days': 5, 'display': 'Aug 16 - Aug 20', 'short': '15-21'},
    {'week': 35, 'days': 5, 'display': 'Aug 23 - Aug 27', 'short': '22-28'},
    {'week': 36, 'days': 2, 'display': 'Aug 30 - Aug 31', 'short': '29-31'}
  ]},
  {'year': 2021, 'month': 9, 'yearmonth': 202109, 'name': 'Sep', 'days': 22, 'weeks' : [
    {'week': 36, 'days': 3, 'display': 'Sep 1 - Sep 3', 'short': '1-4'},
    {'week': 37, 'days': 5, 'display': 'Sep 6 - Sep 10', 'short': '5-11'},
    {'week': 38, 'days': 5, 'display': 'Sep 13 - Sep 17', 'short': '12-8'},
    {'week': 39, 'days': 5, 'display': 'Sep 20 - Sep 24', 'short': '19-25'},
    {'week': 40, 'days': 4, 'display': 'Sep 27 - Sep 30', 'short': '26-30'}
  ]},
  {'year': 2021, 'month': 10, 'yearmonth': 202110, 'name': 'Oct', 'days': 21, 'weeks' : [
    {'week': 40, 'days': 1, 'display': 'Oct 1', 'short': '1-2'},
    {'week': 41, 'days': 5, 'display': 'Oct 4 - Oct 8', 'short': '3-9'},
    {'week': 42, 'days': 5, 'display': 'Oct 11 - Oct 15', 'short': '10-16'},
    {'week': 43, 'days': 5, 'display': 'Oct 18 - Oct 22', 'short': '17-23'},
    {'week': 44, 'days': 5, 'display': 'Oct 25 - Oct 29', 'short': '24-31'}
  ]},
  {'year': 2021, 'month': 11, 'yearmonth': 202111, 'name': 'Nov', 'days': 20, 'weeks' : [
    {'week': 45, 'days': 5, 'display': 'Nov 1 - Nov 5', 'short': '1-6'},
    {'week': 46, 'days': 5, 'display': 'Nov 8 - Nov 12', 'short': '7-13'},
    {'week': 47, 'days': 5, 'display': 'Nov 15 - Nov 19', 'short': '14-20'},
    {'week': 48, 'days': 3, 'display': 'Nov 22 - Nov 24', 'short': '21-27'},
    {'week': 49, 'days': 2, 'display': 'Nov 29 - Nov 30', 'short': '28-30'}
  ]},
  {'year': 2021, 'month': 12, 'yearmonth': 202112, 'name': 'Dec', 'days': 20, 'weeks' : [
    {'week': 49, 'days': 3, 'display': 'Dec 1 - Dec 3', 'short': '1-4'},
    {'week': 50, 'days': 5, 'display': 'Dec 6 - Dec 10', 'short': '5-11'},
    {'week': 51, 'days': 5, 'display': 'Dec 13 - Dec 17', 'short': '12-18'},
    {'week': 52, 'days': 4, 'display': 'Dec 20 - Dec 23', 'short': '19-25'},
    {'week': 53, 'days': 3, 'display': 'Dec 28 - Dec 31', 'short': '26-31'}
  ]},
  {'year': 2022, 'month': 1, 'yearmonth': 202201, 'name': 'Jan', 'days': 21, 'weeks' : [
    {'week': 1, 'days': 5, 'display': 'Jan 3 - Jan 8', 'short': '1-8'},
    {'week': 2, 'days': 5, 'display': 'Jan 10 - Jan 14', 'short': '9-15'},
    {'week': 3, 'days': 5, 'display': 'Jan 17 - Jan 21', 'short': '16-22'},
    {'week': 4, 'days': 5, 'display': 'Jan 24 - Jan 28', 'short': '23-29'},
    {'week': 5, 'days': 1, 'display': 'Jan 31', 'short': '30-31'}
  ]},
  {'year': 2022, 'month': 2, 'yearmonth': 202202, 'name': 'Feb', 'days': 20, 'weeks' : [
    {'week': 6, 'days': 4, 'display': 'Feb 1 - Feb 4', 'short': '1-5'},
    {'week': 7, 'days': 5, 'display': 'Feb 8 - Feb 12', 'short': '6-12'},
    {'week': 8, 'days': 5, 'display': 'Feb 15 - Feb 19', 'short': '13-19'},
    {'week': 9, 'days': 5, 'display': 'Feb 22 - Feb 26', 'short': '20-26'},
    {'week': 10, 'days': 1, 'display': 'Feb 28', 'short': '27-28'}
  ]},
  {'year': 2022, 'month': 3, 'yearmonth': 202203, 'name': 'Mar', 'days': 23,  'weeks' : [
    {'week': 10, 'days': 4, 'display': 'Mar 1 - Mar 4', 'short': '1-5'},
    {'week': 11, 'days': 5, 'display': 'Mar 7 - Mar 11', 'short': '6-12'},
    {'week': 12, 'days': 5, 'display': 'Mar 14 - Mar 18', 'short': '13-19'},
    {'week': 13, 'days': 5, 'display': 'Mar 21 - Mar 25', 'short': '20-26'},
    {'week': 14, 'days': 4, 'display': 'Mar 28 - Mar 31', 'short': '27-31'}
  ]},
  {'year': 2022, 'month': 4, 'yearmonth': 202204, 'name': 'Apr', 'days': 21, 'weeks' : [
    {'week': 14, 'days': 1, 'display': 'Apr 1', 'short': '1-2'},
    {'week': 15, 'days': 5, 'display': 'Apr 4 - Apr 8', 'short': '3-9'},
    {'week': 16, 'days': 5, 'display': 'Apr 11 - Apr 15', 'short': '10-16'},
    {'week': 17, 'days': 5, 'display': 'Apr 18 - Apr 22', 'short': '17-23'},
    {'week': 18, 'days': 5, 'display': 'Apr 25 - Apr 29', 'short': '24-30'}
  ]},
  {'year': 2022, 'month': 5, 'yearmonth': 202205, 'name': 'May', 'days': 21, 'weeks' : [
    {'week': 19, 'days': 5, 'display': 'May 2 - May 6', 'short': '1-7'},
    {'week': 20, 'days': 5, 'display': 'May 9 - May 13', 'short': '8-14'},
    {'week': 21, 'days': 5, 'display': 'May 14 - May 20', 'short': '15-21'},
    {'week': 22, 'days': 5, 'display': 'May 23 - May 27', 'short': '22-28'},
    {'week': 23, 'days': 1, 'display': 'May 31', 'short': '29-31'}
  ]},
  {'year': 2022, 'month': 6, 'yearmonth': 202206, 'name': 'Jun', 'days': 21, 'weeks' : [
    {'week': 23, 'days': 3, 'display': 'Jun 1 - Jun 3', 'short': '1-4'},
    {'week': 24, 'days': 5, 'display': 'Jun 6 - Jun 10', 'short': '5-11'},
    {'week': 25, 'days': 5, 'display': 'Jun 13 - Jun 17', 'short': '12-18'},
    {'week': 26, 'days': 4, 'display': 'Jun 21 - Jun 24', 'short': '19-25'},
    {'week': 27, 'days': 4, 'display': 'Jun 27 - Jun 30', 'short': '26-30'}
  ]},
  {'year': 2022, 'month': 7, 'yearmonth': 202207, 'name': 'Jul', 'days': 20, 'weeks' : [
    {'week': 27, 'days': 1, 'display': 'Jul 1', 'short': '1-2'},
    {'week': 28, 'days': 4, 'display': 'Jul 5 - Jul 8', 'short': '3-9'},
    {'week': 29, 'days': 5, 'display': 'Jul 11 - Jul 15', 'short': '10-16'},
    {'week': 30, 'days': 5, 'display': 'Jul 18 - Jul 22', 'short': '17-23'},
    {'week': 31, 'days': 5, 'display': 'Jul 25 - Jul 29', 'short': '24-31'}
  ]},
  {'year': 2022, 'month': 8, 'yearmonth': 202208, 'name': 'Aug', 'days': 23, 'weeks' : [    
    {'week': 32, 'days': 5, 'display': 'Aug 2 - Aug 6', 'short': '1-6'},
    {'week': 33, 'days': 5, 'display': 'Aug 8 - Aug 12', 'short': '7-13'},
    {'week': 34, 'days': 5, 'display': 'Aug 15 - Aug 19', 'short': '14-20'},
    {'week': 35, 'days': 5, 'display': 'Aug 22 - Aug 26', 'short': '21-27'},
    {'week': 36, 'days': 3, 'display': 'Aug 29 - Aug 31', 'short': '28-31'}
  ]},
  {'year': 2022, 'month': 9, 'yearmonth': 202209, 'name': 'Sep', 'days': 22, 'weeks' : [
    {'week': 36, 'days': 2, 'display': 'Sep 1 - Sep 2', 'short': '1-3'},
    {'week': 37, 'days': 5, 'display': 'Sep 5 - Sep 9', 'short': '4-10'},
    {'week': 38, 'days': 5, 'display': 'Sep 12 - Sep 16', 'short': '11-17'},
    {'week': 39, 'days': 5, 'display': 'Sep 19 - Sep 23', 'short': '18-24'},
    {'week': 40, 'days': 5, 'display': 'Sep 26 - Sep 30', 'short': '25-30'}
  ]},
  {'year': 2022, 'month': 10, 'yearmonth': 202210, 'name': 'Oct', 'days': 21, 'weeks' : [
    {'week': 41, 'days': 5, 'display': 'Oct 1 - Oct 8', 'short': '1-8'},
    {'week': 42, 'days': 5, 'display': 'Oct 10 - Oct 14', 'short': '9-15'},
    {'week': 43, 'days': 5, 'display': 'Oct 17 - Oct 21', 'short': '16-22'},
    {'week': 44, 'days': 5, 'display': 'Oct 24 - Oct 28', 'short': '23-29'},
    {'week': 45, 'days': 1, 'display': 'Oct 31', 'short': '30-31'}
  ]},
  {'year': 2022, 'month': 11, 'yearmonth': 202211, 'name': 'Nov', 'days': 20, 'weeks' : [
    {'week': 45, 'days': 4, 'display': 'Nov 1 - Nov 4', 'short': '1-5'},
    {'week': 46, 'days': 5, 'display': 'Nov 7 - Nov 11', 'short': '6-12'},
    {'week': 47, 'days': 5, 'display': 'Nov 14 - Nov 18', 'short': '13-19'},
    {'week': 48, 'days': 3, 'display': 'Nov 21 - Nov 23', 'short': '20-26'},
    {'week': 49, 'days': 3, 'display': 'Nov 28 - Nov 30', 'short': '27-30'}
  ]},
  {'year': 2022, 'month': 12, 'yearmonth': 202212, 'name': 'Dec', 'days': 20, 'weeks' : [
    {'week': 49, 'days': 2, 'display': 'Dec 1 - Dec 2', 'short': '1-3'},
    {'week': 50, 'days': 5, 'display': 'Dec 5 - Dec 9', 'short': '4-10'},
    {'week': 51, 'days': 5, 'display': 'Dec 12 - Dec 16', 'short': '11-17'},
    {'week': 52, 'days': 4, 'display': 'Dec 19 - Dec 22', 'short': '18-24'},
    {'week': 53, 'days': 4, 'display': 'Dec 27 - Dec 31', 'short': '25-31'}
  ]},
  {'year': 2023, 'month': 1, 'yearmonth': 202301, 'name': 'Jan', 'days': 21, 'weeks' : [
    {'week': 1, 'days': 5, 'display': 'Jan 3 - Jan 6', 'short': '1-7'},
    {'week': 2, 'days': 5, 'display': 'Jan 9 - Jan 13', 'short': '8-14'},
    {'week': 3, 'days': 5, 'display': 'Jan 16 - Jan 20', 'short': '15-21'},
    {'week': 4, 'days': 5, 'display': 'Jan 23 - Jan 27', 'short': '22-28'},
    {'week': 5, 'days': 1, 'display': 'Jan 30 - Jan 31', 'short': '29-31'}
  ]},
  {'year': 2023, 'month': 2, 'yearmonth': 202302, 'name': 'Feb', 'days': 20, 'weeks' : [
    {'week': 6, 'days': 4, 'display': 'Feb 1 - Feb 3', 'short': '1-4'},
    {'week': 7, 'days': 5, 'display': 'Feb 6 - Feb 10', 'short': '5-11'},
    {'week': 8, 'days': 5, 'display': 'Feb 13 - Feb 17', 'short': '12-18'},
    {'week': 9, 'days': 5, 'display': 'Feb 20 - Feb 24', 'short': '19-25'},
    {'week': 10, 'days': 1, 'display': 'Feb 27 - Feb 28', 'short': '26-28'}
  ]},
  {'year': 2023, 'month': 3, 'yearmonth': 202303, 'name': 'Mar', 'days': 23,  'weeks' : [
    {'week': 10, 'days': 3, 'display': 'Mar 1 - Mar 3', 'short': '1-4'},
    {'week': 11, 'days': 5, 'display': 'Mar 6 - Mar 10', 'short': '5-11'},
    {'week': 12, 'days': 5, 'display': 'Mar 13 - Mar 17', 'short': '12-18'},
    {'week': 13, 'days': 5, 'display': 'Mar 20 - Mar 24', 'short': '19-25'},
    {'week': 14, 'days': 5, 'display': 'Mar 27 - Mar 31', 'short': '26-31'}
  ]},
  {'year': 2023, 'month': 4, 'yearmonth': 202304, 'name': 'Apr', 'days': 20, 'weeks' : [
    {'week': 15, 'days': 5, 'display': 'Apr 3 - Apr 7', 'short': '1-8'},
    {'week': 16, 'days': 5, 'display': 'Apr 10 - Apr 14', 'short': '9-10'},
    {'week': 17, 'days': 5, 'display': 'Apr 17 - Apr 21', 'short': '16-22'},
    {'week': 18, 'days': 5, 'display': 'Apr 24 - Apr 28', 'short': '23-29'}
  ]},
  {'year': 2023, 'month': 5, 'yearmonth': 202305, 'name': 'May', 'days': 22, 'weeks' : [
    {'week': 19, 'days': 5, 'display': 'May 1 - May 5', 'short': '1-6'},
    {'week': 20, 'days': 5, 'display': 'May 8 - May 12', 'short': '7-13'},
    {'week': 21, 'days': 5, 'display': 'May 13 - May 19', 'short': '14-20'},
    {'week': 22, 'days': 5, 'display': 'May 22 - May 26', 'short': '21-27'},
    {'week': 23, 'days': 2, 'display': 'May 30 - May 31', 'short': '28-31'}
  ]},
  {'year': 2023, 'month': 6, 'yearmonth': 202306, 'name': 'Jun', 'days': 22, 'weeks' : [
    {'week': 23, 'days': 2, 'display': 'Jun 1 - Jun 2', 'short': '1-3'},
    {'week': 24, 'days': 5, 'display': 'Jun 5 - Jun 9', 'short': '4-10'},
    {'week': 25, 'days': 5, 'display': 'Jun 12 - Jun 16', 'short': '11-17'},
    {'week': 26, 'days': 5, 'display': 'Jun 19 - Jun 23', 'short': '18-24'},
    {'week': 27, 'days': 5, 'display': 'Jun 26 - Jun 30', 'short': '25-30'}
  ]},
  {'year': 2023, 'month': 7, 'yearmonth': 202307, 'name': 'Jul', 'days': 21, 'weeks' : [
    {'week': 28, 'days': 5, 'display': 'Jul 3 - Jul 7', 'short': '1-8'},
    {'week': 29, 'days': 5, 'display': 'Jul 10 - Jul 14', 'short': '9-15'},
    {'week': 30, 'days': 5, 'display': 'Jul 17 - Jul 21', 'short': '16-22'},
    {'week': 31, 'days': 5, 'display': 'Jul 24 - Jul 28', 'short': '23-29'},
    {'week': 32, 'days': 1, 'display': 'Jul 31', 'short': '30-31'}
  ]},
  {'year': 2023, 'month': 8, 'yearmonth': 202308, 'name': 'Aug', 'days': 23, 'weeks' : [    
    {'week': 32, 'days': 4, 'display': 'Aug 1 - Aug 4', 'short': '1-5'},
    {'week': 33, 'days': 5, 'display': 'Aug 7 - Aug 11', 'short': '6-12'},
    {'week': 34, 'days': 5, 'display': 'Aug 14 - Aug 18', 'short': '13-19'},
    {'week': 35, 'days': 5, 'display': 'Aug 21 - Aug 25', 'short': '20-26'},
    {'week': 36, 'days': 4, 'display': 'Aug 28 - Aug 31', 'short': '27-31'}
  ]},
  {'year': 2023, 'month': 9, 'yearmonth': 202309, 'name': 'Sep', 'days': 21, 'weeks' : [
    {'week': 36, 'days': 1, 'display': 'Sep 1', 'short': '1-2'},
    {'week': 37, 'days': 5, 'display': 'Sep 4 - Sep 8', 'short': '3-9'},
    {'week': 38, 'days': 5, 'display': 'Sep 11 - Sep 15', 'short': '10-16'},
    {'week': 39, 'days': 5, 'display': 'Sep 18 - Sep 22', 'short': '17-23'},
    {'week': 40, 'days': 5, 'display': 'Sep 25 - Sep 29', 'short': '24-30'}
  ]},
  {'year': 2023, 'month': 10, 'yearmonth': 202310, 'name': 'Oct', 'days': 22, 'weeks' : [
    {'week': 41, 'days': 5, 'display': 'Oct 2 - Oct 6', 'short': '1-7'},
    {'week': 42, 'days': 5, 'display': 'Oct 9 - Oct 13', 'short': '8-14'},
    {'week': 43, 'days': 5, 'display': 'Oct 16 - Oct 20', 'short': '15-21'},
    {'week': 44, 'days': 5, 'display': 'Oct 23 - Oct 27', 'short': '22-28'},
    {'week': 45, 'days': 2, 'display': 'Oct 30 - Oct 31', 'short': '29-31'}
  ]},
  {'year': 2023, 'month': 11, 'yearmonth': 202311, 'name': 'Nov', 'days': 20, 'weeks' : [
    {'week': 45, 'days': 3, 'display': 'Nov 1 - Nov 3', 'short': '1-4'},
    {'week': 46, 'days': 5, 'display': 'Nov 6 - Nov 10', 'short': '5-11'},
    {'week': 47, 'days': 5, 'display': 'Nov 13 - Nov 17', 'short': '12-18'},
    {'week': 48, 'days': 3, 'display': 'Nov 20 - Nov 22', 'short': '19-25'},
    {'week': 49, 'days': 4, 'display': 'Nov 27 - Nov 30', 'short': '26-30'}
  ]},
  {'year': 2023, 'month': 12, 'yearmonth': 202312, 'name': 'Dec', 'days': 21, 'weeks' : [
    {'week': 49, 'days': 2, 'display': 'Dec 1', 'short': '1-2'},
    {'week': 50, 'days': 5, 'display': 'Dec 4 - Dec 8', 'short': '3-9'},
    {'week': 51, 'days': 5, 'display': 'Dec 11 - Dec 15', 'short': '10-16'},
    {'week': 52, 'days': 5, 'display': 'Dec 18 - Dec 22', 'short': '17-23'},
    {'week': 53, 'days': 4, 'display': 'Dec 26 - Dec 29', 'short': '24-31'}
  ]}


];
export const weekdays = [
  {'number': 1, 'days': ['2020-12-30', '2020-12-31', '2021-01-01', '2021-01-02', '2021-01-03', '2021-01-04', '2021-01-05']},
  {'number': 2, 'days': ['2020-12-30', '2020-12-31', '2021-01-01', '2021-01-02', '2021-01-03', '2021-01-04', '2021-01-05']}
];

export const locationTypes = {
  'title': 'Locations',
  'entries': [
    {'label': 'POP', 'active': true, 'name': 'POP'},
    {'label': 'Competitor', 'active': false, 'name': 'competitor'},
    {'label': 'Sales', 'active': false, 'name': 'sales'},
    {'label': 'Sales Leads', 'active': false, 'name': 'salesleads'}
  ]
};

export const locationCampaigns = {
  'title': 'Campaigns',
  'entries': [
    {'label': 'Facebook', 'active': true, 'name': 'facebook', 'color': '#5d025d'},
    {'label': 'Google AdWords', 'active': false, 'name': 'adwords', 'color': 'green'}
  ]
};

export const apiLogin = {
  LOGIN: '/auth/token',
  SERVER_VERSION: '/api/status/version'
};

export const apiFeedback = {
  FEEDBACK_QUESTIONS: '/api/feedback/questions',
  FEEDBACK_ANSWERS: '/api/feedback/answers',
  FEEDBACK_COMMENTS: '/api/feedback/comments',
  FEATURE_CAPTAIN: '/api/featurecaptain/{{route}}',
  SEND_EMAIL: '/api/sendmail/'
};

export const apiUser = {
  INSERT_USER_FREE: '/api/user/free',
  GET_ALL_USERS: '/api/users?sort=first_name',
  GET_USER: '/api/user/username/{{userName}}',
  CHANGE_PASSWORD: '/api/user/password',
  SET_EMAIL_PASSWORD: '/api/email/password',
  PASSWORD_RESET_EMAIL: '/api/passwordreset/{{email}}',
  SEND_EMAIL: '/api/sendmail/',
  PASSWORD_RESET_TOKEN: '/api/passwordresetcheck/{{token}}',
  GET_USER_DETAILS: '/api/user/email/{{email}}',
  CHANGE_USER_PROFILE: '/api/user/profile/',
};

export const apiClient = {
  GET_CLIENTS_BY_CUSTOMER: '/api/customer/{{customerId}}/clients',
};

export const messages = {
  SESSION: {
    EXPIRED_TITLE: 'Session Timeout',
    EXPIRED_MSG: `Your session has been idle for too long and as a result you have been logged out of the application.
                  <br><br>Please Sign In to continue.`,
    SET_PASSWORD: 'Password successfully set.',
    FATAL_ERROR_MESSAGE: 'System Maintenance is being performed. Please try again in 30 minutes.'
  },
  IMPORT: {
    REQUIRED_SHEET_NAME: 'Required sheet named "{{fileName}}" not found.',
    CONFIRM_IMPORT: 'Are you sure you want to import the data for "{{name}}" client?',
    FILE_SIZE_EXCEEDED: 'File size exceeded 5MB maximum.',
    UNSUPPORTED_FILE_TYPE: 'Unsupported file type. Supported file types: .xls .xlsx .ods.',
    LOAD_COMPLETED: 'Load completed successfully. Please proceed to next step.',
    LOAD_COMPLETED_EMPTY: 'Load completed successfully, {{sheetName}} sheet has no data rows.',
    REVIEW_FIX: 'Please review and fix the errors in your file in order to proceed to the Next Step.'
  },
  HELP: {
    MAIL_TO: 'mailto:engineering@pacific.co?subject=Feedback for PACIFIC Technology Platform&body=Enter your comments here...'
  },
  FATHOM_SCORE: {
    INCONSISTENT_DATA: 'Partial results due to inconsistent data for some sites.'
  },
  DELETE: {
    CONFIRM: 'Are you sure you want to delete "{{name}}"?',
    SUCCESS: '"{{name}}" successfully deleted.'
  },
  VALIDATION: {
    PASSWORD_LENGTH: 'Password must be at least 6 characteres.',
    PASSWORD_MISMATCH: 'Password mismatch.',
    INVALID_EMAIL: 'Please enter a valid email address.',
    INVALID_URL: 'Must be a valid URL.',
    REQUIRED_FIELD: 'This field is required.',
    REQUIRED_CAMPAIGN_NAME: 'The Campaign needs a name!',
    REQUIRED_TEAM_MEMBER: 'You must select at least one team member.',
    REQUIRED_CURRENT_USER: 'You cannot remove yourself from the list.',
    REQUIRED_EMAIL: 'Email is required.',
    REQUIRED_USERNAME: 'Username is required.',
    REQUIRED_PASSWORD: 'Password is required.',
    REQUIRED_CONFIRM: 'Confirm password is required'
  }
};

export const sheetValues = {
  SITE_DATA_NAME: 'Site Data',
  TRAFFIC_DATA_NAME: 'Traffic Engagement Data',
  FILE_SIZE: 5 * 1024 * 1024,
  EXTENSIONS_ALLOWED: ['xls', 'xlsx', 'ods']
};

export const regularExp = {
  valid_url: /^(http:\/\/|https:\/\/|www\.)?[-a-zA-Z0-9@%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/,
  valid_url_v2: /^(www\.)?[-a-zA-Z0-9@%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/
};

export const pagination = {
  PAGE: '0',
  SIZE: '10000'
};

export const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  elements: {
    line: {
      tension: 0,
      fill: false,
      borderWidth: 3
    }
  },
  layout: {
    padding: {
        top: 15
    }
  },
  scales: {
    xAxis: {
      id: 'x-axis-0',
      stacked: true,
      grid: { 
        display: false, 
        color: '#000',
        zeroLineColor: '#000'
      },
      ticks: {
        beginAtZero: true,
        autoSkip: false,
        font: {
          size: 10,
          color: '#000'
        }
      }
    },
    yAxis: {
      stacked: true,
      position: 'left',
      id: 'y-axis-1',
      ticks: {
        beginAtZero: true,
        callback: function(value, index, values) {
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },
        font: {
          size: 10,
          color: '#000'
        }
      },
      grid: {}
    }
  },
  plugins: {
    autocolors: false,
    datalabels: {
      display: false,
      formatter: (value, ctx) => {
        return value !== 0 ?
          value.toLocaleString( /* ... */ ) : 'N/A';
      },
      anchor: 'end',
      align: 'end',
      color: '#000',
      font: {
        weight: 'bold',
        size: 14
      }
    },
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        boxWidth: 10,
        fontSize: 11
      }
    },
    tooltip: {
      callbacks: {
        
      }
    },
    // annotation: {
    //   annotations: {
    //     box1: {
    //       type: "line",
    //       mode: "horizontal",
    //       scaleID: "y",
    //       value: 60,
    //       borderColor: "red",
    //       borderWidth: 2
    //     }
    //   }
    // }
  },
};

export const chartColors = [
  {
    backgroundColor: ['#395B64', '#395B64', '#395B64', '#395B64', '#395B64', '#395B64', '#395B64', '#395B64', '#395B64', '#395B64',
                      '#395B64', '#395B64', '#395B64', '#395B64', '#395B64', '#395B64', '#395B64', '#395B64', '#395B64', '#395B64'],
    borderColor: ['#395B64', '#395B64', '#395B64', '#395B64', '#395B64', '#395B64', '#395B64', '#395B64', '#395B64', '#395B64',
                  '#395B64', '#395B64', '#395B64', '#395B64', '#395B64', '#395B64', '#395B64', '#395B64', '#395B64', '#395B64'],
    borderWidth: 2
  },
  {
    backgroundColor: ['#DCDA6E', '#DCDA6E', '#DCDA6E', '#DCDA6E', '#DCDA6E', '#DCDA6E', '#DCDA6E', '#DCDA6E', '#DCDA6E', '#DCDA6E',
                      '#DCDA6E', '#DCDA6E', '#DCDA6E', '#DCDA6E', '#DCDA6E', '#DCDA6E', '#DCDA6E', '#DCDA6E', '#DCDA6E', '#DCDA6E'],
    borderColor: ['#DCDA6E', '#DCDA6E', '#DCDA6E', '#DCDA6E', '#DCDA6E', '#DCDA6E', '#DCDA6E', '#DCDA6E', '#DCDA6E', '#DCDA6E',
                  '#DCDA6E', '#DCDA6E', '#DCDA6E', '#DCDA6E', '#DCDA6E', '#DCDA6E', '#DCDA6E', '#DCDA6E', '#DCDA6E', '#DCDA6E'],
    borderWidth: 2
  },
  {
    backgroundColor: ['#00A2BB', '#00A2BB', '#00A2BB', '#00A2BB', '#00A2BB', '#00A2BB', '#00A2BB', '#00A2BB', '#00A2BB', '#00A2BB',
                      '#00A2BB', '#00A2BB', '#00A2BB', '#00A2BB', '#00A2BB', '#00A2BB', '#00A2BB', '#00A2BB', '#00A2BB', '#00A2BB'],
    borderColor: [],
    borderWidth: 2
  },
  {
    backgroundColor: ['#FDBE66', '#FDBE66', '#FDBE66', '#FDBE66', '#FDBE66', '#FDBE66', '#FDBE66', '#FDBE66', '#FDBE66', '#FDBE66',
                      '#FDBE66', '#FDBE66', '#FDBE66', '#FDBE66', '#FDBE66', '#FDBE66', '#FDBE66', '#FDBE66', '#FDBE66', '#FDBE66'],
    borderColor: ['#FDBE66', '#FDBE66', '#FDBE66', '#FDBE66', '#FDBE66', '#FDBE66', '#FDBE66', '#FDBE66', '#FDBE66', '#FDBE66',
                  '#FDBE66', '#FDBE66', '#FDBE66', '#FDBE66', '#FDBE66', '#FDBE66', '#FDBE66', '#FDBE66', '#FDBE66', '#FDBE66'],
    borderWidth: 2
  }
];

export const sparklinesOptions = {
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  data: {
    toolTipContent: '<a href ="#"> Score</a><hr/>Views: {y}',
  },
  plugins: {
    datalabels: {
      display: false,
    }},
  elements: {
    line: {
      borderColor: '#000000',
      borderWidth: 1
    },
    point: {
      radius: 0
    }
  },
  tooltips: {
    enabled: true,
    callbacks: {
      label: function(tooltipItem, data) {
        let label = 'Value';

        if (label) {
            label += ': ';
        }
        label += tooltipItem.yLabel;
        return label;
    },
    title: function(tooltipItem, data) {
      // for (let i = 0; i < data.labels.length; i++) {
      //    return data.labels[i];
      // }
      return null;
    }
  }
},
  scales: {
    yAxis: 
      {
        display: false,
        ticks: {
          beginAtZero: true
        }
      },
    xAxis: 
      {
        display: false
      }
  }
};

export const sparklinesColors = [
  {
    backgroundColor: 'rgba(206, 220, 237, 1)',
    borderColor: 'rgba(60, 116, 183, 1)',
    borderWidth: 1,
  }
];

export const lastDays = 7;
export const PasswordLength = 6;

export const timeZones = [
{code: 'GMT', name: 'Greenwich Mean Time', offset: -8},
{code: 'UTC', name: 'Universal Coordinated Time', offset: -8},
{code: 'ECT', name: 'European Central Time', offset: -15},
{code: 'EET', name: 'Eastern European Time', offset: -14},
{code: 'ART', name: '(Arabic) Egypt Standard Time', offset: -14},
{code: 'EAT', name: 'Eastern African Time', offset: -13},
{code: 'MET', name: 'Middle East Time', offset: -13},
{code: 'NET', name: 'Near East Time', offset: -12},
{code: 'PLT', name: 'Pakistan Lahore Time', offset: -11},
{code: 'IST', name: 'India Standard Time', offset: -11},
{code: 'BST', name: 'Bangladesh Standard Time', offset: -10},
{code: 'VST', name: 'Vietnam Standard Time', offset: -9},
{code: 'CTT', name: 'China Taiwan Time', offset: -8},
{code: 'JST', name: 'Japan Standard Time', offset: -7},
{code: 'ACT', name: 'Australia Central Time', offset: -7},
{code: 'AET', name: 'Australia Eastern Time', offset: -6},
{code: 'SST', name: 'Solomon Standard Time', offset: -5},
{code: 'NST', name: 'New Zealand Standard Time', offset: -4},
{code: 'MIT', name: 'Midway Islands Time', offset: -3},
{code: 'HST', name: 'Hawaii Standard Time', offset: -2},
{code: 'AST', name: 'Alaska Standard Time', offset: -1},
{code: 'PST', name: 'Pacific Standard Time', offset: 0},
{code: 'PNT', name: 'Phoenix Standard Time', offset: 1},
{code: 'MST', name: 'Mountain Standard Time', offset: 1},
{code: 'CST', name: 'Central Standard Time', offset: 2},
{code: 'EST', name: 'Eastern Standard Time', offset: 3},
{code: 'IET', name: 'Indiana Eastern Standard Time', offset: 3},
{code: 'RT', name: 'Puerto Rico and US Virgin Islands Time', offset: 4},
{code: 'CNT', name: 'Canada Newfoundland Time', offset: 4},
{code: 'AGT', name: 'Argentina Standard Time', offset: 5},
{code: 'BET', name: 'Brazil Eastern Time', offset: 5},
{code: 'CAT', name: 'Central African Time', offset: 7}
]
