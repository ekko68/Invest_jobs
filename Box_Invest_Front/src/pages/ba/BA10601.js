import { Add, AddOutlined, CheckOutlined, CloudUploadOutlined, EmailOutlined, FiberManualRecordOutlined, HeadsetMicOutlined, HomeOutlined, NotificationsNoneOutlined, PersonOutlineOutlined, Remove } from "@mui/icons-material";
import { Grid, AppBar, Badge, Box, Button, Chip, Container, Divider, IconButton, MenuItem, Paper, Select, Stack, Typography, useTheme, Pagination, PaginationItem, TableContainer, Table, TableBody, TableRow, TableHead, TableCell, Avatar, TextField, InputAdornment, FormLabel, FormControl, RadioGroup, FormControlLabel, Radio, Stepper, StepLabel, Step } from "@mui/material";
import { BtNavSelect } from "components/bt/BtNavSelect";
import { BtContentGrid } from "components/bt/BtContentGrid";
import { BtTabContext } from "components/bt/BtTabContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { BtSelect } from "components/bt/BtSelect/BtSelect";
import { BtAsteriskIcon } from "components/bt/BtAsteriskIcon";
// import Grid from '@mui/material/Unstable_Grid2';

import { useHistory } from 'react-router-dom'
import ROUTER_NAMES from 'modules/consts/RouterConst'

import Header from 'components/header/Header'

const BA10601 = () => {

    const theme = useTheme();
    const history = useHistory();

    return <>
    {/* Header */}
    <Header />
    {/* End ofHeader */}
    {/* Contents */}
    <Stack direction={'column'} sx={{mt:'5.25rem', backgroundColor:theme.palette.background.default}}>
        {/* page banner*/}
        <Box sx={{
            position:'relative',
            background:`linear-gradient(0deg, rgba(81, 105, 153, 0.7), rgba(81, 105, 153, 0.7)), url("./banners/IBK_center.jpg")`,
            backgroundSize:'cover',
            backgroundPosition: 'center center',
            height:'18rem',
        }} >
            <Typography 
                variant="h1"
                color={'white'}
                sx={{position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)' }}
            >
                IBK 제안센터
            </Typography>
        </Box>
        {/* end of page banner*/}
        {/* breadcrumbs */}
        <Box sx={{
            background:theme.palette.background.white,
            borderBottom:`1px solid ${theme.palette.divider}`,
        }}>
            <Container maxWidth="false" disableGutters sx={{maxWidth:'1280px', px:'1.25rem'}}>
                <Box>
                    <Stack direction={'row'} divider={<Divider orientation="vertical" flexItem />}>
                        <Divider orientation="vertical" flexItem sx={{height:'1px'}}/>
                        <IconButton sx={{borderRadius:0, px:2}}>
                            <HomeOutlined/>
                        </IconButton>
                        <BtNavSelect defaultValue={10} onnItem={true}>
                            
                            <MenuItem value={10} sx={{fontSize:'1rem'}}>IBK 제안센터</MenuItem>

                        </BtNavSelect>
                        <BtNavSelect  defaultValue={10} >
                            <MenuItem value={10} sx={{fontSize:'1rem'}}>IBK 추천기업 리스트</MenuItem>
                            <MenuItem value={20} sx={{fontSize:'1rem'}}>Item 2</MenuItem>
                            <MenuItem value={30} sx={{fontSize:'1rem'}}>Item 3</MenuItem>
                        </BtNavSelect>
                        <Divider orientation="vertical" flexItem sx={{height:'1px'}}/>
                        
                    </Stack>
                </Box>
            </Container>
        </Box>
        {/* end of breadcrumbs */}
        <Container maxWidth="false" disableGutters sx={{maxWidth:'1280px', px:'1.25rem'}}>
            <Stack spacing={8} direction={'column'} sx={{py:5}}>



                {/* 추천기업 */}
                <Stack spacing={2}>
                    <Stack  spacing={1}>
                        <Stack direction={'row'} alignItems="flex-end" spacing={1} >
                            <Typography variant="h2" flexGrow={1}>
                                IBK 추천기업 리스트
                            </Typography>

                        </Stack>
                        <Divider/>
                    </Stack>

                    <Grid container spacing={2} sx={{mt:0, position:'relative', left:'-1rem'}}>
                        <Grid item xs={2}>
                            <Paper sx={{p:2}}>
                                <Stack direction={'column'} spacing={1}>
                                    <img height={120} src="logos/company_logo_1.jpg" style={{objectFit:'contain'}} />
                                    <Typography variant="body2" sx={{color:theme.palette.text.sub}}>
                                        스타트업
                                    </Typography>
                                    <Typography variant="h2" sx={{fontWeight:500}}>
                                        일루넥스
                                    </Typography>
                                    <Typography variant="body2" sx={{color:theme.palette.text.sub}}>
                                        Seed | 300억
                                    </Typography>

                                </Stack>
                            </Paper>
                        </Grid>
                        <Grid item xs={2}>
                            <Paper sx={{p:2}}>
                                <Stack direction={'column'} spacing={1}>
                                    <img height={120} src="logos/company_logo_1.jpg" style={{objectFit:'contain'}} />
                                    <Typography variant="body2" sx={{color:theme.palette.text.sub}}>
                                        스타트업
                                    </Typography>
                                    <Typography variant="h2" sx={{fontWeight:500}}>
                                        일루넥스
                                    </Typography>
                                    <Typography variant="body2" sx={{color:theme.palette.text.sub}}>
                                        Seed | 300억
                                    </Typography>

                                </Stack>
                            </Paper>
                        </Grid>
                        <Grid item xs={2}>
                            <Paper sx={{p:2}}>
                                <Stack direction={'column'} spacing={1}>
                                    <img height={120} src="logos/company_logo_1.jpg" style={{objectFit:'contain'}} />
                                    <Typography variant="body2" sx={{color:theme.palette.text.sub}}>
                                        스타트업
                                    </Typography>
                                    <Typography variant="h2" sx={{fontWeight:500}}>
                                        일루넥스
                                    </Typography>
                                    <Typography variant="body2" sx={{color:theme.palette.text.sub}}>
                                        Seed | 300억
                                    </Typography>

                                </Stack>
                            </Paper>
                        </Grid>
                        <Grid item xs={2}>
                            <Paper sx={{p:2}}>
                                <Stack direction={'column'} spacing={1}>
                                    <img height={120} src="logos/company_logo_1.jpg" style={{objectFit:'contain'}} />
                                    <Typography variant="body2" sx={{color:theme.palette.text.sub}}>
                                        스타트업
                                    </Typography>
                                    <Typography variant="h2" sx={{fontWeight:500}}>
                                        일루넥스
                                    </Typography>
                                    <Typography variant="body2" sx={{color:theme.palette.text.sub}}>
                                        Seed | 300억
                                    </Typography>

                                </Stack>
                            </Paper>
                        </Grid>
                        <Grid item xs={2}>
                            <Paper sx={{p:2}}>
                                <Stack direction={'column'} spacing={1}>
                                    <img height={120} src="logos/company_logo_1.jpg" style={{objectFit:'contain'}} />
                                    <Typography variant="body2" sx={{color:theme.palette.text.sub}}>
                                        스타트업
                                    </Typography>
                                    <Typography variant="h2" sx={{fontWeight:500}}>
                                        일루넥스
                                    </Typography>
                                    <Typography variant="body2" sx={{color:theme.palette.text.sub}}>
                                        Seed | 300억
                                    </Typography>

                                </Stack>
                            </Paper>
                        </Grid>
                        <Grid item xs={2}>
                            <Paper sx={{p:2}}>
                                <Stack direction={'column'} spacing={1}>
                                    <img height={120} src="logos/company_logo_1.jpg" style={{objectFit:'contain'}} />
                                    <Typography variant="body2" sx={{color:theme.palette.text.sub}}>
                                        스타트업
                                    </Typography>
                                    <Typography variant="h2" sx={{fontWeight:500}}>
                                        일루넥스
                                    </Typography>
                                    <Typography variant="body2" sx={{color:theme.palette.text.sub}}>
                                        Seed | 300억
                                    </Typography>

                                </Stack>
                            </Paper>
                        </Grid>

                    </Grid>

                    <Stack direction={'row'} alignItems="center">
                        <Typography variant="h7" flexGrow={1}>
                            99개 기업이 투자를 기다리고 있습니다.
                        </Typography>
                        <Button variant="outlined">
                            더보기
                        </Button>
                    </Stack>

                    <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} >
                        <Button size="large" variant="contained" onClick={()=>history.push(ROUTER_NAMES.BA10301)} disableElevation>확인</Button>
                    </Stack>
                </Stack>

            </Stack>


        </Container>
    </Stack>
    {/* End of Contents */}
    </>
};
  
export default BA10601;