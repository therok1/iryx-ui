---
"iryx-ui": minor
---

Add `IPinInput` and `ITagsInput`, completing the form set.

`IPinInput` gives one cell per character for a short code, with `group-size` to break a long one into readable chunks, `mask` for a PIN, and `otp` so a phone can offer the code straight from the SMS that carried it. Its model is a plain **string** rather than Reka's array of single characters — a code is a string in the request body, the validator and the email it arrived in.

`ITagsInput` collects a list as removable tags, with a configurable delimiter, `max`, duplicate control, and paste splitting. The field grows as tags wrap rather than scrolling them out of sight, the name lands on the `<input>` rather than the box around it, and each delete control is named after the tag it removes instead of being one of a row of identical crosses. Inside an `IFormField` it inherits the id, invalid state and error's `aria-describedby`.
