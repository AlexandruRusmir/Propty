import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

export const StyledTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: '#ff4c4c',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#ff4c4c',
    },
    '& .MuiOutlinedInput-root': {
        '&:hover fieldset': {
            borderColor: '#ff4c4c',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#ff4c4c',
        },
    },
  });