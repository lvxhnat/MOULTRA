import * as React from 'react';

import Typography from '@mui/material/Typography';
import { TickerMetricStoreFormat, useLiveMovesStore, useMetricStore } from 'store/prices/watchlist';
import { ColorsEnum } from 'common/theme';

export default function ChartviewPriceShower(props: { ticker: string }) {
    const metrics = useMetricStore(state => state.metrics[props.ticker]);

    return (
        <div
            style={{
                display: 'flex',
                gap: 5,
                alignItems: 'center',
                justifyContent: 'flex-start',
                border: `1px solid ${ColorsEnum.coolgray1}`,
            }}
        >
            <ChartViewPriceShowerCell ticker={props.ticker} />
            {metrics
                ? metrics.map((entry: TickerMetricStoreFormat) => {
                      return <ChartViewMetricShowerCell ticker={props.ticker} entry={entry} />;
                  })
                : undefined}
        </div>
    );
}

const ChartViewMetricShowerCell = (props: { ticker: string; entry: TickerMetricStoreFormat }) => {
    const liveMoves: number | null = useLiveMovesStore(
        state => state.liveMoves[props.ticker][props.entry.metricId]
    );

    const formattedIndicatorString = `${props.entry.metric}(${Object.values(
        props.entry.metricParams
    ).join(', ')})`;

    return (
        <Typography
            key={props.entry.metricId}
            variant="subtitle2"
            style={{
                color: props.entry.color,
                padding: 2,
                paddingRight: 5,
                borderRight: `1px solid ${ColorsEnum.coolgray1}`,
            }}
        >
            {formattedIndicatorString}: {liveMoves?.toFixed(2)}
        </Typography>
    );
};

const ChartViewPriceShowerCell = (props: { ticker: string }) => {
    const liveMoves: number | null = useLiveMovesStore(
        state => state.liveMoves[props.ticker]['price']
    );

    return (
        <Typography
            variant="subtitle2"
            component="div"
            style={{
                color: 'white',
                padding: 2,
                paddingRight: 5,
                borderRight: `1px solid ${ColorsEnum.coolgray1}`,
            }}
        >
            ${liveMoves?.toFixed(2)}
        </Typography>
    );
};
