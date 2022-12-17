import { styled } from '@mui/system';
import { TableContainer } from '@mui/material';

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    maxHeight: 400,
    overflowY: 'scroll',
    '&::-webkit-scrollbar': { width: 0 },
}));
