import { ColorsEnum } from 'common/theme';
import * as d3 from 'd3';
import { LINECHARTCONFIGS, LINECHARTIDS } from '../../config';

interface LegendObject {
    name: string;
    id: string;
    color: string;
    parent: boolean;
}

type LegendDataProps = LegendObject[];

function truncateString(s: string): string {
    if (s.length > 20) return s.slice(0, 20) + '...';
    else return s;
}

/**
 * Accomodates multiple lines for legend plotting
 */
export const addLegend = (props: { legend: LegendDataProps }): void => {
    const svg = d3.selectAll(`#${LINECHARTIDS.BASE_SVG_ID}`);

    const treePosition = LINECHARTCONFIGS.DEFAULT_MARGIN_LEFT + 10;
    const boxXPosition = treePosition + 10;
    const labelXPosition = boxXPosition + LINECHARTCONFIGS.DEFAULT_LEGEND_BOX_SIZE + 3;
    const valueXPosition = LINECHARTCONFIGS.DEFAULT_LEGEND_WIDTH - 20;

    const parentBoxSize = LINECHARTCONFIGS.DEFAULT_LEGEND_PARENT_TREE_BOX_SIZE;

    // Add the large box background, and the group that will contain all of the legend items
    svg.append('g')
        .attr('id', LINECHARTIDS.LEGEND_GROUP_ID)
        .append('rect')
        .attr('class', LINECHARTIDS.LEGEND_BOX_CLASS)
        .attr('x', LINECHARTCONFIGS.DEFAULT_MARGIN_LEFT + 2)
        .attr('y', (d, i) => LINECHARTCONFIGS.DEFAULT_MARGIN_TOP + i * 15)
        .attr('rx', 5)
        .attr('height', props.legend.length * (LINECHARTCONFIGS.DEFAULT_LEGEND_BOX_SIZE + 6))
        .attr('width', LINECHARTCONFIGS.DEFAULT_LEGEND_WIDTH)
        .attr('fill', ColorsEnum.darkGrey)
        .attr('opacity', LINECHARTCONFIGS.DEFAULT_LEGEND_OPACITY);

    // Create the tree
    const legendTree = svg.selectAll(`#${LINECHARTIDS.LEGEND_GROUP_ID}`);
    for (let i = 0; i < props.legend.length; i++) {
        if (props.legend[i].parent) {
            legendTree
                .append('rect')
                .attr('class', LINECHARTIDS.LEGEND_HINT_CLASS)
                .attr('id', props.legend[i].id)
                .attr('x', treePosition)
                .attr('y', LINECHARTCONFIGS.DEFAULT_MARGIN_TOP + parentBoxSize * 1.5 + i * 15)
                .attr('width', 5)
                .attr('height', 5)
                .attr('stroke', 'white')
                .attr('fill', 'transparent');
        } else {
            const xOffset = treePosition + 5 * 0.5;
            const y2Offset = LINECHARTCONFIGS.DEFAULT_MARGIN_TOP + parentBoxSize * 1.5 + i * 15 + 5;

            // Plot the vertical line
            legendTree
                .append('line')
                .attr('class', LINECHARTIDS.LEGEND_HINT_CLASS)
                .attr('id', props.legend[i].id)
                .attr('x1', xOffset)
                .attr('x2', xOffset)
                .attr('y1', LINECHARTCONFIGS.DEFAULT_MARGIN_TOP + i * 15 - parentBoxSize * 0.5)
                .attr('y2', y2Offset)
                .attr('stroke', 'white');
            // Plot the horizontal line
            legendTree
                .append('line')
                .attr('class', LINECHARTIDS.LEGEND_HINT_CLASS)
                .attr('id', props.legend[i].id)
                .attr('x1', xOffset)
                .attr('x2', treePosition + parentBoxSize)
                .attr('y1', y2Offset)
                .attr('y2', y2Offset)
                .attr('stroke', 'white');
        }
    }

    // CREATE the legend squares
    d3.selectAll(`#${LINECHARTIDS.LEGEND_GROUP_ID}`)
        .selectAll(`rect ${LINECHARTIDS.LEGEND_SQUARE_CLASS}`)
        .data(props.legend)
        .enter()
        .append('rect')
        .attr('class', LINECHARTIDS.LEGEND_SQUARE_CLASS)
        .attr('id', d => d.id)
        .attr('x', boxXPosition)
        .attr('y', (d, i) => LINECHARTCONFIGS.DEFAULT_MARGIN_TOP + i * 15 + 5) // 5 denotes padding from the top box
        .attr('height', LINECHARTCONFIGS.DEFAULT_LEGEND_BOX_SIZE)
        .attr('width', LINECHARTCONFIGS.DEFAULT_LEGEND_BOX_SIZE)
        .attr('fill', d => d.color);

    d3.selectAll(`#${LINECHARTIDS.LEGEND_GROUP_ID}`)
        .selectAll('text')
        .data(props.legend)
        .enter()
        .append('text')
        .attr('class', LINECHARTIDS.LEGEND_TEXT_CLASS)
        .attr('x', labelXPosition)
        .attr('y', (d, i) => LINECHARTCONFIGS.DEFAULT_MARGIN_TOP + i * 15 + 11)
        .attr('width', valueXPosition - labelXPosition - 10)
        .style('fill', ColorsEnum.white)
        .style('alignment-baseline', 'middle')
        .style('font-size', LINECHARTCONFIGS.DEFAULT_CHART_FONTSIZE)
        .attr('text-anchor', 'left')
        .text(d => truncateString(d.name));

    d3.selectAll(`#${LINECHARTIDS.LEGEND_GROUP_ID}`)
        .selectAll(`text .${LINECHARTIDS.LEGEND_VALUE_CLASS}`)
        .data(props.legend)
        .enter()
        .append('text')
        .attr('class', LINECHARTIDS.LEGEND_VALUE_CLASS)
        .attr('id', d => d.id)
        .attr('x', valueXPosition) // 20 pixels from the right
        .attr('y', (d, i) => LINECHARTCONFIGS.DEFAULT_MARGIN_TOP + i * 15 + 11)
        .style('fill', d => ColorsEnum.white)
        .style('alignment-baseline', 'middle')
        .style('font-size', LINECHARTCONFIGS.DEFAULT_CHART_FONTSIZE)
        .attr('text-anchor', 'left');
};
