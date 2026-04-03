import { Add, AddOutlined, EmailOutlined, FiberManualRecordOutlined, HeadsetMicOutlined, HomeOutlined, NotificationsNoneOutlined, PersonOutlineOutlined, Remove,CloudUploadOutlined, CheckBox } from "@mui/icons-material";
import { Grid, AppBar, Badge, Box, Button, Chip, Container, Divider, IconButton, MenuItem, Paper, Select, Stack, Typography, useTheme, Pagination, PaginationItem, TableContainer, Table, TableBody, TableRow, TableHead, TableCell, Avatar, TextField, InputAdornment, FormLabel, FormControl, RadioGroup, FormControlLabel, Radio, Stepper, StepLabel, Step, Checkbox } from "@mui/material";
import { BtNavSelect } from "components/bt/BtNavSelect";
import { BtContentGrid } from "components/bt/BtContentGrid";
import { BtTabContext } from "components/bt/BtTabContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
import React, {useEffect, useState, useCallback} from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { BtSelect } from "components/bt/BtSelect/BtSelect";
import dayjs from "dayjs";
import { useHistory } from 'react-router-dom'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import Header from 'components/header/Header'

//components
import VnentrLonSgshRegViewDetail from 'pageComponents/ibkPrplCntr/vncmloan/VnentrLonSgshRegViewDetail';
// import Grid from '@mui/material/Unstable_Grid2';

const VnentrLonSgshRegView = () => {

    const theme = useTheme();
    const history = useHistory();

    /**
   * (info): 벤처대출신청 상세 호출 api
   * (param): {
   *   utlinsttId : "CD_TEST",
   *}
   **/
//   const [acqtncOrderList, refetchAcqtncOrderList] = useMutation(() => Axios({
//     ...ConfigApi.BOOKS.TRANS_CASE.ORDER.LIST,
//     data: {...pageParams, ...searchParams, bsacId: state?.data?.bsacId}
//   }), {
//     deps: [pageParams?.page],
//     autoLoop: true,
//     onSuccess: () => setSearchParams({...searchParams})
//   });
    
    return (
        <VnentrLonSgshRegViewDetail/>
    )
};
  
export default VnentrLonSgshRegView;