import Switch from '@mui/material/Switch';
import { alpha, styled } from '@mui/material/styles';

export const StyledSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#ff4c4c',
    '&:hover': {
      backgroundColor: alpha('#ff4c4c', theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#ff4c4c',
  },
}));