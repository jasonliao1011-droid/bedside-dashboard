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
    const calendar = CalendarApp.getDefaultCalendar();
    const today = new Date();
    const timeZone = calendar.getTimeZone() || Session.getScriptTimeZone() || 'Asia/Taipei';
    const events = calendar.getEventsForDay(today).map(event => {
      const allDay = event.isAllDayEvent();
      return {
        time: allDay ? '全天' : Utilities.formatDate(event.getStartTime(), timeZone, 'HH:mm'),
        title: event.getTitle() || '（無標題）',
        meta: event.getLocation() || ''
      };
    });

    return jsonp_(callback, {
      ok: true,
      generatedAt: new Date().toISOString(),
      timeZone: timeZone,
      events: events
    });
  } catch (err) {
    return jsonp_(callback, {
      ok: false,
      error: String(err && err.message ? err.message : err)
    });
  }
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
