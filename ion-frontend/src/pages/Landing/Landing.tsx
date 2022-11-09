import * as d3 from 'd3';
import * as React from 'react';

import { CssBaseline, Grid } from '@mui/material';
import TSChart from 'components/Charting/LineCharts/TSChart';
import Header from 'components/Dashboard/Header';
import Footer from 'components/Footer';
import ForexTable from './ForexTable';

export default function Landing(): React.ReactElement {
    const [data, setData] = React.useState<{ X: string[]; Y: string[] }>();

    React.useEffect(() => {
        d3.csv(
            'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv'
        ).catch()
            .then((d: any) => {
                setData({
                    X: d.map((d_: any) => d_.date).slice(0, 500),
                    Y: d.map((d_: any) => d_.value).slice(0, 500),
                });
            })
            .catch(() => null)
    }, []);

    return (
        <>
            <CssBaseline />
            <Header />
            <Grid container style={{ height: '90vh', padding: 5 }} spacing={2}>
                <Grid item xl={9} lg={9} xs={9}>
                    {data !== undefined && data !== null ? (
                        <TSChart dataX={data.X} dataY={data.Y.map((d: string) => parseFloat(d))} />
                    ) : null}
                </Grid>
                <Grid item xl={3} lg={3} xs={3}>
                    <ForexTable />
                </Grid>
            </Grid>
            <Footer dataStreamProvider={'oanda'} />
        </>
    );
}
