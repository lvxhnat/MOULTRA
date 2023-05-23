import { DefaultDataProps } from './schema/schema';

export interface LineChartProps {
    defaultData: DefaultDataProps;
    baseId: string;
    strokeWidth?: string;
    zeroAxis?: boolean;
    showPricing?: boolean;
    showAverage?: boolean;
    showLegend?: boolean;
    showGrid?: boolean;
    showXAxis?: boolean;
    showYAxis?: boolean;
    showNormalised?: boolean;
    showTooltip?: boolean;
    showEndTags?: boolean;
}

export type ChartTypes = 'line' | 'area';
