---
'iryx-ui': minor
---

`IBarChart` and `ILineChart` take multiple series. Rows stay plain objects and a `series` descriptor names the measures, the same shape `ITable` uses; omit it and the single-series behaviour is unchanged.

Bars group inside their category, lines draw one path each, and one hover reports every series for that category in a single tooltip rather than making the reader chase individual marks. `ChartLegend` is exported and rendered automatically — mandatory from two series up, because colour alone is not a dependable identity channel.

`ChartSeries.slot` pins a series to a palette colour so filtering one out does not repaint the survivors: colour has to follow the entity, not its position. Past eight series the chart warns in development instead of silently reusing a hue.

Fixes a tooltip that was positioned against the chart root, so it rode up over anything above the plot.
