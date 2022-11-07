
import * as d3 from 'd3';
import * as React from 'react';
import * as C from './plugins';
import { LineChartProps } from './type';

import { useD3 } from 'common/hooks/useD3';
import { useThemeStore } from 'store/theme';
import { ColorsEnum } from 'common/theme';
import { calculateSMA } from './helpers/movingAverage';

import { LineChartConfig } from './config';

/**
 * A generalised line chart object, taking date as its x-axis and numerical value on its y-axis. Supports currently the following:
 * 1. Normalisation of y-axis
 * 2. Multiple line charts on the same axis
 * @returns 
 */
export default function BaseLineChart({
	dataX,
	dataY,
	width = LineChartConfig.DEFAULT_WIDTH,
	height = LineChartConfig.DEFAULT_HEIGHT,
	margin = { top: LineChartConfig.DEFAULT_MARGIN_TOP, right: LineChartConfig.DEFAULT_MARGIN_RIGHT, bottom: LineChartConfig.DEFAULT_MARGIN_BOTTOM, left: LineChartConfig.DEFAULT_MARGIN_LEFT },
	timeParseFormat = LineChartConfig.DEFAULT_TIME_PARSE_FORMAT,
	showAverage = LineChartConfig.DEFAULT_SHOW_AVERAGE,
	showGrid = LineChartConfig.DEFAULT_SHOW_GRID,
	showAxis = LineChartConfig.DEFAULT_SHOW_AXIS,
	showArea = LineChartConfig.DEFAULT_SHOW_LINE_AREA,
	showNormalised = LineChartConfig.DEFAULT_SHOW_NORMALISED,
	showTooltip = LineChartConfig.DEFAULT_SHOW_TOOLTIP,
}: LineChartProps) {

	const { mode } = useThemeStore();

	const ref = useD3(
		(svg: d3.Selection<SVGElement, {}, HTMLElement, any>) => {
			// set the dimensions and margins of the graph
			const formattedWidth = width - margin.left - margin.right;
			const formattedHeight = height;
			// Configure the color palette of the charts
			const lineColor = mode === 'dark' ? LineChartConfig.DEFAULT_DARKMODE_LINE_COLOR : LineChartConfig.DEFAULT_LIGHTMODE_LINE_COLOR;
			const fillColor = LineChartConfig.DEFAULT_LINE_AREA_COLOR;
			const fillOpacity = LineChartConfig.DEFAULT_LINE_AREA_OPACITY;

			const defined = d3.map(dataY, (_, i) => !isNaN(dataY[i]));
			const indexes = d3.map(dataX, (_, i) => i); // Denotes simply an array containing index values

			svg.attr('viewBox', [0, 0, formattedWidth, formattedHeight])
				.attr('preserveAspectRatio', 'xMidYMid meet')
				.classed('svg-content-responsive', true);

			// Parse the time in data
			const parseTime = d3.timeParse(timeParseFormat);
			const dates: Array<Date> = dataX.map((value: string) => parseTime(value)!); // Parse time should not return null
			const dateTime: Array<number> = dates.map((date: Date) => date.getTime());

			// Prep and plot the axis
			const x = d3.scaleTime().range([margin.left, width - margin.right]);
			const y = d3.scaleLinear().range([height - margin.top, margin.bottom]);

			x.domain([Math.min(...dateTime), Math.max(...dateTime)]);
			y.domain([0, Math.max(...dataY)]);

			const yAxis = d3.axisLeft(y)
				.tickSize(margin.left + margin.right - width)
				.ticks(0);

			const xAxis = d3.axisBottom(x)
				.tickSize(margin.bottom + margin.top - height)
				.ticks(0);

			if (showAxis) {
				xAxis.ticks(10);
				yAxis.ticks(10);
			}

			svg.append('g')
				.attr('transform', 'translate(0,' + (height - margin.top) + ')')
				.attr('class', 'xAxis') // Sets a class name for our x axis
				.call(xAxis);

			svg.append('g')
				.attr('transform', 'translate(' + (margin.left) + ',0)')
				.attr('class', 'yAxis') // Set a class name for our y axis
				.call(yAxis);

			if (showAverage) {
				const mean = dataY.reduce((a: number, b: number) => a + b) / dataY.length;
				svg.append('line')
					.attr('class', 'drawLine')
					.attr('x1', margin.left)
					.attr('y1', y(mean))
					.attr('x2', width - margin.right)
					.attr('y2', y(mean))
					.attr('stroke-width', 2)
					.attr('stroke-dasharray', '2,2')
					.attr('stroke', dataY[dataY.length - 1] > mean ? ColorsEnum.upHint : ColorsEnum.downHint);
			}

			// Calculate the Line for plotting
			const valueLine: any = d3.line()
				.defined((_, i: number) => defined[i])
				.x((_, i: number) => x(dates[i]))
				.y((_, i: number) => y(dataY[i]));

			svg.append('path')
				.attr('id', 'base-line')
				.attr('fill', 'none')
				.attr('stroke', lineColor)
				.attr('stroke-width', 1)
				.attr('d', valueLine(indexes.filter(i => defined[i])));


			if (showGrid) {
				C.styleGrid({
					svg,
					xAxis: '.xAxis',
					yAxis: '.yAxis'
				});
			}

			// Calculate Area to fill the line chart
			if (showArea) {
				const area: any = d3.area()
					.defined((_, i: number) => defined[i])
					.curve(d3.curveLinear)
					.x((_, i: number) => x(dates[i]))
					.y0(height - margin.top)
					.y1((_, i: number) => y(dataY[i]));

				svg.append('path')
					.attr('id', 'base-line-area')
					.attr('fill', fillColor)
					.attr('opacity', fillOpacity)
					.attr('d', area(indexes.filter(i => defined[i])));
			}

			// const smas = calculateSMA(dataY, 14)
			// C.addLine({ svg: svg, id: "sma14", x: x, y: y, indexes: indexes, dataX: dates, dataY: smas })

			if (showTooltip) {
				C.addToolTip({
					x: x,
					y: y,
					svg: svg,
					dataX: dates,
					dataY: dataY,
					fontColor: mode === 'dark' ? LineChartConfig.DEFAULT_DARKMODE_TOOLTIP_FONTCOLOR : LineChartConfig.DEFAULT_LIGHTMODE_TOOLTIP_FONTCOLOR,
				});
			}

			// C.addDrag({
			//     x: x,
			//     y: y,
			//     svg: svg,
			// })
		},
		[]
	);


	return (
		<div id="linechart-svg-container">
			<div id="linechart-tooltip" style={{ height: 20, backgroundColor: ColorsEnum.darkGrey }}></div>
			<svg
				ref={ref}
				id="linechart"
				style={{
					height: '100%',
					width: '100%',
					margin: '0px',
				}}
			>
				<g className="plot-area" />
				<g className="x-axis" />
				<g className="y-axis" />
			</svg>
		</div>
	);
}