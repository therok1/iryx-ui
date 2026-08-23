---
"iryx-ui": patch
---

Fix the case of sortable column headers in `ITable`. The header cell is uppercase, but its sort button did not inherit `text-transform`, so sortable columns rendered in sentence case beside their uppercase neighbours.
