import * as React from 'react';
import * as S from './style';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import BaseLineChart from 'components/Charting/BaseChart';
import { FinnhubCandlesEntrySchema, FinnhubCandlesSchema } from 'data/schema/candles';
import WidgetContainer from 'components/WidgetContainer';
import { ETFDataSchema } from 'data/schema/etf';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { ColorsEnum } from 'common/theme';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

function ModifiedTable(props: { entry: any; title: string }) {
    return (
        <div style={{ paddingTop: 10 }}>
            <Typography variant="subtitle1">
                <b>{props.title}</b>
            </Typography>
            <Table>
                {props.entry.type === 'table-vertical' ? (
                    <TableHead>
                        <TableRow>
                            {Object.keys(props.entry.data[0]).map((column: string) => (
                                <TableCell
                                    sx={{ padding: 0.5 }}
                                    key={`${props.title}_header_${column}`}
                                >
                                    <Typography
                                        key={`${props.title}_header_typo_${column}`}
                                        variant="subtitle2"
                                    >
                                        {' '}
                                        {column}{' '}
                                    </Typography>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                ) : null}
                <TableBody>
                    {props.entry.type !== 'table-vertical'
                        ? Object.keys(props.entry.data).map((column: string, index: number) => {
                              const cell_id_2_content: string | null =
                                  props.entry.type === 'table-horizontal'
                                      ? props.entry.data[column][0]
                                      : props.entry.type === 'list'
                                      ? props.entry.data[column].text
                                      : null;

                              const cell_id_1: string = `${props.title}_${column}_${index}`;
                              const cell_id_2: string = `${cell_id_2_content}_${column}`;

                              return (
                                  <TableRow key={`${props.title}_mainrow_${index}`}>
                                      <TableCell sx={{ padding: 0.5 }} key={cell_id_1}>
                                          <Typography variant="subtitle2" key={`${cell_id_1}_typo`}>
                                              {column}
                                          </Typography>
                                      </TableCell>
                                      <TableCell sx={{ padding: 0.5 }} key={cell_id_2}>
                                          <Typography
                                              variant="subtitle2"
                                              align="right"
                                              key={`${cell_id_2}_typo`}
                                          >
                                              {cell_id_2_content}
                                          </Typography>
                                      </TableCell>
                                  </TableRow>
                              );
                          })
                        : props.entry.data.map((entry: any, index: number) => {
                              return (
                                  <TableRow key={`${props.title}_mainrow_${index}`}>
                                      {Object.keys(entry).map((column: string) => (
                                          <TableCell
                                              sx={{ padding: 0.5 }}
                                              key={`${column}_${index}`}
                                          >
                                              <Typography
                                                  key={`${column}_typo_${index}`}
                                                  variant="subtitle2"
                                              >
                                                  {entry[column]}
                                              </Typography>
                                          </TableCell>
                                      ))}
                                  </TableRow>
                              );
                          })}
                </TableBody>
            </Table>
        </div>
    );
}

export default function ETFViewer(props: {
    ticker: string;
    etfData: ETFDataSchema | undefined;
    setSelection: Function;
    etfCandlesData: FinnhubCandlesSchema | undefined;
}) {
    console.log(props.etfData);
    if (props.etfData && props.etfCandlesData) {
        const diff =
            props.etfCandlesData[props.etfCandlesData.length - 1].close -
            props.etfCandlesData[props.etfCandlesData.length - 2].close;
        const pctDiff = (100 * diff) / props.etfCandlesData[props.etfCandlesData.length - 2].close;
        return (
            <>
                <Grid container columns={20}>
                    <Grid item xs={8}>
                        <S.TitleWrapper>
                            <S.IconButtonWrapper
                                disableRipple
                                onClick={() => props.setSelection(undefined)}
                            >
                                <ChevronLeftIcon fontSize="small" />
                            </S.IconButtonWrapper>
                            <S.TickerWrapper>
                                <Typography variant="subtitle2">
                                    <b>{props.ticker}</b>
                                </Typography>
                            </S.TickerWrapper>
                            <Typography variant="h2" sx={{ padding: 1 }}>
                                {props.etfData.base_info.etf_name}
                            </Typography>
                        </S.TitleWrapper>
                        <div>
                            <div style={{ display: 'inline-flex', alignItems: 'end', gap: 5 }}>
                                <Typography variant="h2" component="div">
                                    $
                                    {props.etfCandlesData[
                                        props.etfCandlesData.length - 1
                                    ].close.toFixed(3)}
                                </Typography>
                                <Typography variant="subtitle2"> USD </Typography>
                                <Typography variant="subtitle2" style={{ paddingLeft: 10 }}>
                                    {diff.toFixed(3)}
                                </Typography>
                                <Typography variant="subtitle2">{pctDiff.toFixed(2)}%</Typography>
                                <span
                                    style={{
                                        color:
                                            pctDiff > 0 ? ColorsEnum.upHint : ColorsEnum.downHint,
                                        transform: pctDiff > 0 ? undefined : 'rotate(180deg)',
                                    }}
                                >
                                    <ArrowUpwardIcon fontSize="small" />
                                </span>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{ padding: 1 }}>
                            {props.etfData.info.analyst_report}
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container columns={20} columnSpacing={2}>
                    <Grid item xs={6}>
                        <ModifiedTable entry={props.etfData.info.vitals} title="Vitals" />
                        <ModifiedTable
                            entry={props.etfData.info.historical_trade_data}
                            title="Historical Trading Data"
                        />
                    </Grid>
                    <Grid item xs={14}>
                        <Grid container columnSpacing={2}>
                            <div style={{ width: '100%' }}>
                                <WidgetContainer title="past_1y_historical">
                                    {props.etfCandlesData.length !== 0 ? (
                                        <BaseLineChart
                                            showAxis
                                            showAverage
                                            showTooltip
                                            baseId={`svg-container`}
                                            width={200}
                                            height={30}
                                            strokeWidth="0.2px"
                                            margin={{
                                                top: 2,
                                                right: 1,
                                                bottom: 2,
                                                left: 8,
                                            }}
                                            defaultData={{
                                                id: 'base-line',
                                                name: 'Base Line Chart',
                                                parent: true,
                                                dataX: props.etfCandlesData.map(
                                                    (entry: FinnhubCandlesEntrySchema) =>
                                                        new Date(entry.date * 1000)
                                                ),
                                                dataY: props.etfCandlesData.map(
                                                    (entry: FinnhubCandlesEntrySchema) =>
                                                        entry.close
                                                ),
                                                color: 'white',
                                                type: 'line',
                                            }}
                                        />
                                    ) : null}
                                </WidgetContainer>
                            </div>
                            <Grid item xs={6}>
                                <ModifiedTable
                                    entry={props.etfData.info.dbtheme}
                                    title="Database Theme"
                                />
                                <ModifiedTable
                                    entry={props.etfData.info.alternative_etfs}
                                    title="Alternative ETFs"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <ModifiedTable
                                    entry={props.etfData.info.fact_set}
                                    title="Factset Table"
                                />
                                <ModifiedTable
                                    entry={props.etfData.info.other_alternative_etfs}
                                    title="Other Alternative ETFs"
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </>
        );
    } else return <></>;
}
