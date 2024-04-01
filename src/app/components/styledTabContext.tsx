import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import TabContext, { TabContextProps } from '@mui/lab/TabContext';

export const StyledTabContext = styled((props: TabContextProps) => (
  <TabContext
    {...props}
  />
))(({ theme }) => ({
  '& .mui-lqkzq6-MuiPaper-root':{
    border: '0px'
  }
}));

export default StyledTabContext