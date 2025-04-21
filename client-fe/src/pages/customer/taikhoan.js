import Footer from '../../layout/customer/footer/footer'
import logomini from '../../assest/images/vaxmslogo3.png'

import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import Select from 'react-select';
import {getMethod, postMethodPayload} from '../../services/request';
import Swal from 'sweetalert2'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import * as React from 'react';
import LichDaDangKy from './lichdadangky';
import DoiMatKhau from './doimatkhau';
import CapNhatThongTin from './capnhatthongtin';
import FeedBack from './feedback';



function TaiKhoan(){
    const [value, setValue] = React.useState(0);
    useEffect(()=>{
        if (window.location.hash === '#lichtiem') {
            setValue(1); 
        }
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
  

    return(
     <div className='container-fluid'>
        <div className='container-web acctaikhoan'>
        <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', minHeight:500 }} >
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                sx={{ borderRight: 1, borderColor: 'divider' }}>
                <Tab label="Thông tin" {...a11yProps(0)} />
                <Tab label="Lịch tiêm" {...a11yProps(1)} />
                <Tab label="Đổi mật khẩu" {...a11yProps(2)} />
                <Tab label="Phản hồi" {...a11yProps(3)} />
            </Tabs>
            <TabPanel value={value} index={0} style={{width:"100%"}}>
                <CapNhatThongTin/>
            </TabPanel>
            <TabPanel value={value} index={1} style={{width:"100%"}}>
                <LichDaDangKy/>
            </TabPanel>
            <TabPanel value={value} index={2} style={{width:"100%"}}>
                <DoiMatKhau/>
            </TabPanel>
            <TabPanel value={value} index={3} style={{width:"100%"}}>
                <FeedBack/>
            </TabPanel>
        </Box>
        </div>
     </div>
    );
}
function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
}
  
TabPanel.propTypes = {
children: PropTypes.node,
index: PropTypes.number.isRequired,
value: PropTypes.number.isRequired,
};
  
function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}
export default TaiKhoan;