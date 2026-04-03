import { useHistory } from 'react-router-dom'
import ROUTER_NAMES from 'modules/consts/RouterConst'

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
import Header from 'components/header/Header'

const BA10304 = () => {

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
                            <MenuItem value={10} sx={{fontSize:'1rem'}}>펀드 제안</MenuItem>
                            <MenuItem value={20} sx={{fontSize:'1rem'}}>Item 2</MenuItem>
                            <MenuItem value={30} sx={{fontSize:'1rem'}}>Item 3</MenuItem>
                        </BtNavSelect>
                        <BtNavSelect  defaultValue={10} >
                            <MenuItem value={10} sx={{fontSize:'1rem'}}>신규 펀드 제안</MenuItem>
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
                <Paper sx={{p:4}}>
                    <Stepper activeStep={2} alternativeLabel>
                        
                        <Step key={'0'}>
                            <StepLabel>제안 펀드 정보</StepLabel>
                        </Step>
                        <Step key={'1'}>
                            <StepLabel>운용사 상세 정보</StepLabel>
                        </Step>
                        <Step key={'2'}>
                            <StepLabel>제출 완료</StepLabel>
                        </Step>
                    </Stepper>
                </Paper>

                {/* complete message */}
                <Paper  sx={{p:6}}>
                    <Stack direction={'column'} justifyContent="center" alignItems="center" spacing={4}>
                        <Box sx={{p:3, borderRadius:20 , backgroundColor:theme.palette.primary.lighter }}>
                            <CheckOutlined color="primary" sx={{fontSize:'3rem'}}/>
                        </Box>
                        
                        <Typography variant="h6" sx={{textAlign:'center'}}>
                            IBK 혁신투자부에 펀드 출자를 제안해주셔서 감사합니다.<br/>
                            담당자 검토 후 답변 드릴 수 있도록 하겠습니다.<br/><br/>

                            투자를 할 기업을 찾고 계시다면 아래 추천 기업을 확인해 보시기 바랍니다.
                        </Typography>
                        <Stack direction={'row'} spacing={1}>
                            <Button variant="outlined" disableElevation >제안내용 보기</Button>
                            <Button variant="contained" onClick={()=>history.push(ROUTER_NAMES.BA10202)}disableElevation>확인</Button>
                        </Stack>
                    </Stack>
                </Paper>

                {/* 추천기업 */}
                <Stack spacing={2}>
                    <Stack  spacing={1}>
                        <Stack direction={'row'} alignItems="flex-end" spacing={1} >
                            <Typography variant="h2" flexGrow={1}>
                                추천 기업
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
                        <Button variant="outlined" onClick={()=>history.push(ROUTER_NAMES.COMPANY)}>
                            더보기
                        </Button>
                    </Stack>
                </Stack>

            </Stack>


        </Container>
    </Stack>
    {/* End of Contents */}
    </>
};
  
export default BA10304;