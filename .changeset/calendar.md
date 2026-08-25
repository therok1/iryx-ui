---
"iryx-ui": minor
---

Add `ICalendar`, the month grid on its own

The grid `IDatePicker` puts behind a field, available inline for the cases a popover is the wrong shape — a booking page, an availability view. ISO `YYYY-MM-DD` model like the pickers, plus `min` / `max`, an `isUnavailable` predicate taking ISO strings, `months`, `pagedNavigation`, `weekdayFormat`, `preventDeselect` and `readonly`.

With nothing selected it opens inside `min` / `max` rather than on today, so a calendar for a future window no longer opens on a month where every day is disabled.

Both pickers now render the same theme rather than a second copy of it: the grid's classes moved to `calendarTheme`, and `IDatePicker` renders `ICalendar` internally. `IDatePicker` also gained `isUnavailable` as a result.
