---
"iryx-ui": patch
---

Fix the global `unstyled` option being ignored by `IChartLegend`.

It declared `unstyled` without `withDefaults`, so Vue cast the absent prop to
`false` and `props.unstyled ?? config.unstyled` never reached the config. Setting
`unstyled` on the plugin or the Nuxt module left the legend styled while every
other component went bare. The `unstyled` prop on the component itself always
worked.
