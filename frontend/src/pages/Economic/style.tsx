import { Typography } from '@mui/material';
import { styled } from '@mui/system';
import { ColorsEnum } from 'common/theme';

const displayFlexCenter = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

interface FredRowProps {
    isTitle?: boolean;
    children?: any;
    [x: string]: any;
}

export const LoadingWrapper = styled('div')(({ theme }) => ({
    gap: 15,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    ...displayFlexCenter,
}));

export const ButtonWrapper = styled('div')<{ disabled?: boolean; selected?: boolean }>(
    ({ theme, disabled = false, selected = false }) => ({
        ...displayFlexCenter,
        gap: 3,
        width: 130,
        height: 25,
        borderRadius: 5,
        fontColor: ColorsEnum.white,
        backgroundColor: selected ? ColorsEnum.warmgray1 : 'transparent',
        border: selected ? 'none' : `1px solid ${ColorsEnum.warmgray2}`,
        opacity: !disabled ? 1 : 0.4,
        padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
        '&:hover': !disabled
            ? {
                  backgroundColor: ColorsEnum.warmgray2,
                  cursor: 'pointer',
              }
            : undefined,
    })
);

export const BaseDivClass = styled('div')(({ theme }) => ({
    ...displayFlexCenter,
}));

export const FredRow = (props: FredRowProps) => {
    return (
        <BaseFredRow {...props}>
            <Typography variant={props.isTitle ? 'body1' : 'subtitle2'}>
                {props.isTitle ? <strong> {props.children} </strong> : props.children}
            </Typography>
        </BaseFredRow>
    );
};

const BaseFredRow = styled('div')<FredRowProps>(({ theme, title }) => ({
    padding: `${theme.spacing(0.8)} ${theme.spacing(2)}`,
    '&:hover': {
        color: ColorsEnum.beer,
        cursor: 'pointer',
    },
}));

export const PanelOpener = styled('div')(({ theme }) => ({
    display: 'flex',
    width: '100%',
    height: '100%',
}));

export const SeriesPanel = styled('div')(({ theme }) => ({
    overflowY: 'scroll',
    '&::-webkit-scrollbar': { display: 'none' },
}));

export const SidePanelOpener = styled('div')(({ theme }) => ({
    width: '25%',
    height: '100%',
    overflowY: 'auto',
    backgroundColor: theme.palette.mode === 'dark' ? ColorsEnum.darkerGrey : 'default',
    '&::-webkit-scrollbar': { display: 'none' },
    display: 'flex',
    flexDirection: 'column',
}));

export const MainPanelOpener = styled('div')(({ theme }) => ({
    width: '75%',
    height: '100%',
    overflowY: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    '&::-webkit-scrollbar': { display: 'none' },
}));

export const UpdateBar = styled('div')(({ theme }) => ({
    display: 'flex',
    width: '100%',
    padding: 5,
    gap: 10,
    justifyContent: 'flex-end',
}));

export const ChildNodesPanel = styled('div')(({ theme }) => ({
    flexGrow: 1,
    overflowY: 'auto',
    '&::-webkit-scrollbar': { display: 'none' },
}));

export const SeriesContainer = styled('div')(({ theme }) => ({
    width: '100%',
    padding: `${theme.spacing(2)} ${theme.spacing(2)}`,
    '&:hover': {
        cursor: 'pointer',
        backgroundColor: theme.palette.mode == 'dark' ? ColorsEnum.warmgray6 : ColorsEnum.coolgray7,
    },
}));

export const IconButtonWrapper = styled('div')(({ theme }) => ({
    ...displayFlexCenter,
    paddingLeft: 15,
    '&:hover': {
        cursor: 'pointer',
    },
}));

export const SelectedSeriesMainviewContainer = styled('div')(({ theme }) => ({
    height: '100%',
    minHeight: '300px',
}));

export const NoDataAvailableContainer = styled('div')(({ theme }) => ({
    ...displayFlexCenter,
    gap: 5,
    flexDirection: 'column',
    width: '100%',
    height: '100%',
}));
