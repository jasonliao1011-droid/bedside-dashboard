function doGet(e) {
  const callback = sanitizeCallback_(e && e.parameter ? e.parameter.callback : '');
  const expectedKey = PropertiesService.getScriptProperties().getProperty('DASHBOARD_KEY');
  const suppliedKey = e && e.parameter ? String(e.parameter.key || '') : '';

  if (!expectedKey) {
    return jsonp_(callback, { ok: false, error: 'backend_key_not_configured' });
  }
  if (suppliedKey !== expectedKey) {
    return jsonp_(callback, { ok: false, error: 'unauthorized' });
  }

  try {
    const primary = CalendarApp.getDefaultCalendar();
    const primaryId = primary.getId();
    const timeZone = primary.getTimeZone() || Session.getScriptTimeZone() || 'Asia/Taipei';
    const allCalendars = CalendarApp.getAllCalendars();
    const calendars = allCalendars.filter(calendar => {
      try {
        return calendar.isSelected();
      } catch (err) {
        return true;
      }
    });

    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const todayEvents = collectEventsForDay_(calendars, today, timeZone, primaryId);
    const tomorrowEvents = collectEventsForDay_(calendars, tomorrow, timeZone, primaryId);

    return jsonp_(callback, {
      ok: true,
      generatedAt: new Date().toISOString(),
      timeZone: timeZone,
      events: todayEvents,
      todayEvents: todayEvents,
      tomorrowEvents: tomorrowEvents
    });
  } catch (err) {
    return jsonp_(callback, {
      ok: false,
      error: String(err && err.message ? err.message : err)
    });
  }
}

function collectEventsForDay_(calendars, day, timeZone, primaryId) {
  const rows = [];
  calendars.forEach(calendar => {
    const calendarName = calendar.getName() || '';
    const isPrimary = calendar.getId() === primaryId;
    calendar.getEventsForDay(day).forEach(event => {
      const allDay = event.isAllDayEvent();
      const time = allDay ? '全天' : Utilities.formatDate(event.getStartTime(), timeZone, 'HH:mm');
      rows.push({
        time: time,
        title: event.getTitle() || '（無標題）',
        meta: event.getLocation() || (isPrimary ? '' : calendarName),
        calendar: calendarName,
        sortKey: allDay ? '0000' : time
      });
    });
  });
  rows.sort((a, b) => a.sortKey.localeCompare(b.sortKey) || a.title.localeCompare(b.title));
  return rows.map(row => ({
    time: row.time,
    title: row.title,
    meta: row.meta,
    calendar: row.calendar
  }));
}

function sanitizeCallback_(name) {
  const candidate = String(name || '');
  return /^[A-Za-z_$][0-9A-Za-z_$]*$/.test(candidate)
    ? candidate
    : '__bedsideCalendarCallback';
}

function jsonp_(callback, payload) {
  return ContentService
    .createTextOutput(callback + '(' + JSON.stringify(payload) + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}
