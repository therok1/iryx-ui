---
"iryx-ui": minor
---

`ITable` now shows an indeterminate bar on the rule between the header and the first row while a refresh is in flight. `loading` previously only did something when the table had no rows to show, so a page change or re-sort in server mode gave no sign that anything was happening. Skeletons still cover the first load; the two indicators are alternatives and never appear together.
