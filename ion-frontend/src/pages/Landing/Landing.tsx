import { CssBaseline, Grid } from '@mui/material'
import LineChart from 'components/Charting/LineChart'
import Header from 'components/Dashboard/Header'
import Footer from 'components/Footer'
import ForexTable from './ForexTable'

export default function Landing() {
    return (
        <>
            <CssBaseline />
            <Header />
            <Grid container style={{ height: "90vh" }} spacing={1}>
                <Grid item xl={9} lg={8} xs={8}>
                    <LineChart />
                </Grid>
                <Grid item xl={3} lg={4} xs={4}><ForexTable /></Grid>
            </Grid>
            <Footer dataStreamProvider={"oanda"} />
        </>
    )
}
