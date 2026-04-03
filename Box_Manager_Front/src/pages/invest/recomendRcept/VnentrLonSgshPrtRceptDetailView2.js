
import DoneIcon from '@mui/icons-material/Done';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import HomeIcon from '@mui/icons-material/Home';
import LensOutlinedIcon from '@mui/icons-material/LensOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { AppBar, Box, Container, IconButton, Stack, useTheme } from "@mui/material";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import * as React from 'react';
import { BtaListItemButton } from '../../../components/BtaListItemButton';
import { BtaNavButton } from "../../../components/BtaNavButton/BtaNavButton";
import { BtaNestedListItemButton } from '../../../components/BtaNestedListItemButton/BtaNestedListItemButton';
import { BtaSubListItemButton } from "../../../components/BtaSubListItemButton";









const VnentrLonSgshPrtRceptDetailView2 = () => {
  
  const pages = ['투자BOX', '커머스BOX', '관리자계정'];

  const theme = useTheme();

  const [statusValue, setStatusValue] = React.useState('10');

  const handleStatusChange = (event) => {
    setStatusValue(event.target.value);
  };

  return <>
    {/* Header */}
    <AppBar 
      position="fixed"
      sx={{backgroundColor:theme.palette.tertiary.main,boxShadow:'none',}}
    >
      <Container maxWidth="lg">
        <Stack direction={'row'} spacing={8}>
          <Box>
            <Stack 
              direction={'row'} 
              sx={{width:210, mt:'2rem'}}
              spacing={1}
              justifyContent="center"
              alignItems="flex-end"
            >
              <img width='76' src="./logo.png" alt="logo" />
              <Typography variant="h1" color={theme.palette.white.main} sx={{pb:'0.125rem', fontSize:'1.25rem'}} >운영자 포털</Typography>
            </Stack>
          </Box>
          
          <Stack  direction={'column'} sx={{width:'100%'}}>
            <Stack direction={'row'} justifyContent={'flex-end'}  >
                {/* account tool */}
              <Stack 
                direction={'row'} 
                spacing={2}
                sx={{px:2, py:1.25, color:theme.palette.white, backgroundColor:theme.palette.tertiary.light}}  
              >
                <Stack direction={'row'} alignItems="center" sx={{color:theme.palette.white}} spacing={0.5}>
                  <PersonOutlineIcon color={theme.palette.tertiary.lighter} sx={{fontSize: '1.25rem', color:theme.palette.tertiary.lighter }}/>
                  <Typography variant="body2" color={theme.palette.white.main} >서인규</Typography>
                </Stack>

                <Divider orientation="vertical" flexItem sx={{backgroundColor:theme.palette.tertiary.lighter}}/>

                <Stack direction={'row'} alignItems="center" spacing={0.5} >
                  <Typography variant="body2" color={theme.palette.tertiary.lighter}>일루넥스</Typography>
                  <FiberManualRecordIcon sx={{fontSize: '0.25rem', color:theme.palette.tertiary.lighter }}/>
                  <Typography variant="body2" color={theme.palette.tertiary.lighter}>운영자</Typography>
                </Stack>

                <SettingsOutlinedIcon sx={{fontSize: '1.25rem', color:theme.palette.tertiary.lighter }}/>

                <LogoutOutlinedIcon sx={{fontSize: '1.25rem', color:theme.palette.tertiary.lighter }}/>

              </Stack>
            </Stack>
            
            

            <Box sx={{ flexGrow: 1, display: 'flex', gap: 2}}>
              <BtaNavButton selected={true}>
                투자BOX
              </BtaNavButton>
              <BtaNavButton >
                커머스BOX
              </BtaNavButton>
              <BtaNavButton >
                관리자계정
              </BtaNavButton>

            </Box>
          </Stack>
          
        </Stack>
        {/* Logo */}

      </Container>
    </AppBar>

    
    <Container maxWidth="lg" sx={{mt:'6.25rem', py:'2rem'}}>
    
    <Stack direction='row' spacing={8}>
      {/* Side Menu */}
      <Box>
          <List
            sx={{ width: 210, bgcolor: 'background.paper' }}
            component="nav"
            aria-labelledby="nested-list-subheader"
        
            subheader={
              <ListSubheader component="div" id="nested-list-subheader" sx={{color:theme.palette.tertiary.main , fontWeight:'bold', fontSize:'1.5rem', padding:0, lineHeight:'1.5rem',mb:'2rem' }}>
                투자BOX
              </ListSubheader>
            }
          >
            <Divider color={theme.palette.tertiary.main}/>

            
            <BtaNestedListItemButton title='베너관리' defaultOpen={false}>
              <Divider/>
              <List component="div" disablePadding>
                <BtaSubListItemButton title="서브아이템 1" selected={false}/>
                <BtaSubListItemButton title="서브아이템 2" selected={false}/>
              </List>
            </BtaNestedListItemButton>
            

            <Divider/>

            
            <BtaNestedListItemButton title='공지사항' defaultOpen={false}>
              <Divider/>
              <List component="div" disablePadding>
                <BtaSubListItemButton title="서브아이템 1" selected={false}/>
                <BtaSubListItemButton title="서브아이템 2" selected={false}/>
              </List>
            </BtaNestedListItemButton>
            

            <Divider/>

            
            <BtaNestedListItemButton title='컨설팅' defaultOpen={false}>
              <Divider/>
              <List component="div" disablePadding>
                <BtaSubListItemButton title="서브아이템 1" selected={false}/>
                <BtaSubListItemButton title="서브아이템 2" selected={false}/>
              </List>
            </BtaNestedListItemButton>
            

            <Divider/>

            
            <BtaNestedListItemButton title='문서관리' defaultOpen={false}>
              <Divider/>
              <List component="div" disablePadding>
                <BtaSubListItemButton title="서브아이템 1" selected={false}/>
                <BtaSubListItemButton title="서브아이템 2" selected={false}/>
              </List>
            </BtaNestedListItemButton>
            

            <Divider/>
            
            
            <BtaNestedListItemButton title='Q&A' defaultOpen={false}>
              <Divider/>
              <List component="div" disablePadding>
                <BtaSubListItemButton title="서브아이템 1" selected={false}/>
                <BtaSubListItemButton title="서브아이템 2" selected={false}/>
              </List>
            </BtaNestedListItemButton>
            

            <Divider/>

            
              <BtaNestedListItemButton title='통계' defaultOpen={false}>
                <Divider/>
                <List component="div" disablePadding>

                  <BtaSubListItemButton title="서브아이템 1" selected={false}/>
                  <BtaSubListItemButton title="서브아이템 2" selected={false}/>
                </List>
              </BtaNestedListItemButton>
            

            <Divider/>

            
              {/* <BtaListItemButton sx={{ py:0.5, my:1}}>
                <ListItemText primary='VC관리' sx={{color:theme.palette.tertiary.main , '.MuiListItemText-primary':{fontWeight:'bold'}}} />
              </BtaListItemButton> */}
            
              <BtaListItemButton title={'VC 관리'} selected={false}/>
            

            <Divider/>

            
            <BtaNestedListItemButton title='추천기업 관리' defaultOpen={false}>
              <Divider/>
              <List component="div" disablePadding>

                <BtaSubListItemButton title="추천기업 관리" selected={false}/>
                <BtaSubListItemButton title="추천받은 기업" selected={false}/>
              </List>
            </BtaNestedListItemButton>
            

            <Divider/>

            
            <BtaNestedListItemButton title='펀드 관리' defaultOpen={false}>
              <Divider/>
              <List direction="vertical" component="div" disablePadding>
                <BtaSubListItemButton title="제안받은 펀드" selected={false}/>
                <BtaSubListItemButton title="펀드 평가 결과 등록" selected={false}/>
              </List>
            </BtaNestedListItemButton>

            <Divider/>

            <BtaNestedListItemButton title='IBK 벤처대출' defaultOpen={true}>
              <Divider/>
              <List component="div" disablePadding>
                <BtaSubListItemButton title="협약 벤처투자기관 관리" selected={false}/>
                <BtaSubListItemButton title="IBK벤처대출 추천 접수(VC)" selected={true}/>
                <BtaSubListItemButton title="IBK벤처대출 접수(기업)" selected={false}/>
              </List>
            </BtaNestedListItemButton>
            
          </List>
      </Box>
      {/* End of Side Menu */}
      <Box sx={{width:'100%'}}>

        <Breadcrumbs aria-label="breadcrumb" sx={{mb:3}}>
          
          <IconButton size="small" sx={{p:0, '&:hover':{ backgroundColor: 'transparent' }}} >
            <HomeIcon fontSize="inherit"/>
          </IconButton>
          
          <Link underline="hover" color="inherit" href="/" >
            <Typography variant="body2" >투자BOX</Typography>
          </Link>

          <Link underline="hover" color="inherit" href="/" >
            <Typography variant="body2" >IBK 벤처대출</Typography>
          </Link>


          <Typography variant="body2" color="text.primary">IBK벤처대출 접수(기업)</Typography>

        </Breadcrumbs>

        <Stack  direction={'column'} spacing={4}  alignItems="center">

          <Stack direction={'column'} spacing={2} sx={{width:'100%'}}>
          
            <Stack direction={'row'} alignItems="center" spacing={1}>
              <Typography flexGrow={1} variant="h1" sx={{lineHeight:'2.375rem', fontSize:'1.875rem',fontWeight:'bold'}}>
                IBK벤처대출 접수(기업)
              </Typography>
            </Stack>

            <Divider/>

            <Stack direction={'column'} spacing={6} >

              <Stack direction={'column'} spacing={4}>

                <Stack direction={'column'} spacing={1}>
                  <Stack direction={'row'} spacing={1} alignItems={'center'}>
                    <LensOutlinedIcon color="secondary"/>
                    <Typography 
                      flexGrow={1} variant="h2" 
                      sx={{lineHeight:'1.375rem', fontSize:'1.375rem',fontWeight:'bold'}}
                    >
                      추천기업
                    </Typography>
                  </Stack>
                  <Divider sx={{backgroundColor:theme.palette.secondary.main}}/>
                </Stack>


                <Box sx={{flexGrow: 1}}>
                  <Typography variant="h3" sx={{lineHeight:'1.5rem', fontSize:'1.125rem',fontWeight:'bold'}} paddingBottom={true}>1.기본정보</Typography>
                  <Grid container sx={{borderTop:`1px solid ${theme.palette.info.main}`}}>
                    <Grid xs={6} container sx={{
                      borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`,
                    }}>
                      <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                        <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                          <Typography  variant="body1"  >
                            기업명
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid xs sx={{p:2}}>
                        <Typography  variant="body1"  >
                          (주)불코커뮤니케이션
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid xs={6} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                      <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                        <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                          <Typography  variant="body1"  >
                            대표자명
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid xs sx={{p:2}}>
                        <Typography  variant="body1"  >
                          엄선진
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid xs={6} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                      <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                        <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                          <Typography  variant="body1"  >
                            사업자번호
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid xs sx={{p:2}}>
                        <Typography  variant="body1"  >
                          617-86-11111
                        </Typography>
                      </Grid>
                    </Grid>
                    
                    <Grid xs={6} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                      <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                        <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                          <Typography  variant="body1"  >
                            설립년월일
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid xs sx={{p:2}}>
                        <Typography  variant="body1"  >
                          2017-01-25
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid xs={12} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                      <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                        <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                          <Typography  variant="body1"  >
                            본사 주소
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid xs sx={{p:2}}>
                        <Typography  variant="body1"  >
                          서울특별시 강남구 선릉로 108길 51, 3층(삼성동)
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid xs={12} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                      <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                        <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                          <Typography  variant="body1"  >
                            업종명<br/>
                            (표준산업분류)
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid xs sx={{p:2}}>
                        <Typography  variant="body1"  >
                          교육 서비스업(85709)
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid xs={6} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                      <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                        <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                          <Typography  variant="body1"  >
                            투자업종 구분
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid xs sx={{p:2}}>
                        <Typography  variant="body1"  >
                          유통・서비스
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid xs={6} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                      <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                        <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                          <Typography  variant="body1"  >
                            주요제품
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid xs sx={{p:2}}>
                        <Typography  variant="body1"  >
                          방문PT플랫폼
                        </Typography>
                      </Grid>
                    </Grid>


                  </Grid>

                  
                </Box>

                <Box sx={{flexGrow: 1}}>
                  <Typography variant="h3" sx={{lineHeight:'1.5rem', fontSize:'1.125rem',fontWeight:'bold'}} paddingBottom={true}>2. 담당자 정보</Typography>
                  <Grid container sx={{borderTop:`1px solid ${theme.palette.info.main}`}}>
                    <Grid xs={6} container sx={{
                      borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`,
                    }}>
                      <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                        <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                          <Typography  variant="body1"  >
                            기업 담당자명
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid xs sx={{p:2}}>
                        <Typography  variant="body1"  >
                          김정근
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid xs={6} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                      <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                        <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                          <Typography  variant="body1"  >
                            담당자 직책
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid xs sx={{p:2}}>
                        <Typography  variant="body1"  >
                          매니저
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid xs={6} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                      <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                        <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                          <Typography  variant="body1"  >
                            담당자 연락처
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid xs sx={{p:2}}>
                        <Typography  variant="body1"  >
                          010-1234-1234
                        </Typography>
                      </Grid>
                    </Grid>
                    
                    <Grid xs={6} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                      <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                        <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                          <Typography  variant="body1"  >
                            담당자 이메일
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid xs sx={{p:2}}>
                        <Typography  variant="body1"  >
                          abc@gmail.com
                        </Typography>
                      </Grid>
                    </Grid>


                  </Grid>

                  
                </Box>

                <Box sx={{flexGrow: 1}}>
                  <Typography variant="h3" sx={{lineHeight:'1.5rem', fontSize:'1.125rem',fontWeight:'bold'}} paddingBottom={true}>3. 투자 의견</Typography>
                  <Grid container sx={{borderTop:`1px solid ${theme.palette.info.main}`}}>
                    <Grid xs={12} container sx={{
                      borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`,
                    }}>
                      <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                        <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                          <Typography  variant="body1"  >
                            기업 경쟁력 또는 
                            성장가능성
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid xs sx={{p:2, height:'10rem'}}>
                        <Typography  variant="body1"  >
                          
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid xs={12} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                      <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                        <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                          <Typography  variant="body1"  >
                            후속투자 가능성 및 
                            예상시기
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid xs sx={{p:2, height:'10rem'}}>
                        <Typography  variant="body1"  >
                          
                        </Typography>
                      </Grid>
                    </Grid>

                  </Grid>

                  
                </Box>

              </Stack>

              <Stack direction={'column'} spacing={4}>

                <Stack direction={'column'} spacing={1}>
                  <Stack direction={'row'} spacing={1} alignItems={'center'}>
                    <LensOutlinedIcon color="secondary"/>
                    <Typography 
                      flexGrow={1} variant="h2" 
                      sx={{lineHeight:'1.375rem', fontSize:'1.375rem',fontWeight:'bold'}}
                    >
                      투자기관
                    </Typography>
                  </Stack>
                  <Divider sx={{backgroundColor:theme.palette.secondary.main}}/>
                </Stack>


                <Box sx={{flexGrow: 1}}>
                  <Typography variant="h3" sx={{lineHeight:'1.5rem', fontSize:'1.125rem',fontWeight:'bold'}} paddingBottom={true}>1.투자 내역</Typography>
                  <Grid container sx={{borderTop:`1px solid ${theme.palette.info.main}`}}>
                    <Grid xs={6} container sx={{
                      borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`,
                    }}>
                      <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                        <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                          <Typography  variant="body1"  >
                            투자기관
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid xs sx={{p:2}}>
                        <Typography  variant="body1"  >
                          씨엔티테크(주)
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid xs={6} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                      <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                        <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                          <Typography  variant="body1"  >
                            투자라운드(직전)
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid xs sx={{p:2}}>
                        <Typography  variant="body1"  >
                          Series A
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid xs={6} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                      <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                        <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                          <Typography  variant="body1"  >
                            투자금액(원)
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid xs sx={{p:2}}>
                        <Typography  variant="body1"  >
                          200,024,160
                        </Typography>
                      </Grid>
                    </Grid>
                    
                    <Grid xs={6} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                      <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                        <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                          <Typography  variant="body1"  >
                            투자일자(직전)
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid xs sx={{p:2}}>
                        <Typography  variant="body1"  >
                          2023-05-25
                        </Typography>
                      </Grid>
                    </Grid>



                    <Grid xs={6} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                      <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                        <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                          <Typography  variant="body1"  >
                            주당가격(원)
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid xs sx={{p:2}}>
                        <Typography  variant="body1"  >
                          49,560
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid xs={6} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                      <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                        <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                          <Typography  variant="body1"  >
                            기업가치(원)
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid xs sx={{p:2}}>
                        <Typography  variant="body1"  >
                          15,660,117,480
                        </Typography>
                      </Grid>
                    </Grid>


                    <Grid xs={6} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                      <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                        <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                          <Typography  variant="body1"  >
                            투자종류
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid xs sx={{p:2}}>
                        <Typography  variant="body1"  >
                          RCPS
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid xs={6} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                      <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                        <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                          <Typography  variant="body1"  >
                            비고
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid xs sx={{p:2}}>
                        <Typography  variant="body1"  >
                          
                        </Typography>
                      </Grid>
                    </Grid>

                  </Grid>

                  
                </Box>

                <Box sx={{flexGrow: 1}}>
                  <Typography variant="h3" sx={{lineHeight:'1.5rem', fontSize:'1.125rem',fontWeight:'bold'}} paddingBottom={true}>2. 담당자 정보</Typography>
                  <Typography variant="body2" paddingBottom={1}>* 담당 심사역 정보</Typography>
                  <Grid container sx={{borderTop:`1px solid ${theme.palette.secondary.main}`}}>
                    <Grid xs={6} container sx={{
                      borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`,
                    }}>
                      <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                        <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                          <Typography  variant="body1"  >
                            이름
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid xs sx={{p:2}}>
                        <Typography  variant="body1"  >
                          김명길
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid xs={6} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                      <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                        <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                          <Typography  variant="body1"  >
                            직책
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid xs sx={{p:2}}>
                        <Typography  variant="body1"  >
                          매니저
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid xs={6} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                      <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                        <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                          <Typography  variant="body1"  >
                            연락처
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid xs sx={{p:2}}>
                        <Typography  variant="body1"  >
                          010-1234-1234
                        </Typography>
                      </Grid>
                    </Grid>
                    
                    <Grid xs={6} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                      <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                        <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                          <Typography  variant="body1"  >
                            이메일
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid xs sx={{p:2}}>
                        <Typography  variant="body1"  >
                          abc@gmail.com
                        </Typography>
                      </Grid>
                    </Grid>


                  </Grid>

                  <Typography variant="body2" paddingTop={4} paddingBottom={1}>* 연락 심사역 정보</Typography>
                  <Grid container sx={{borderTop:`1px solid ${theme.palette.secondary.main}`}}>
                    <Grid xs={6} container sx={{
                      borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`,
                    }}>
                      <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                        <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                          <Typography  variant="body1"  >
                            이름
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid xs sx={{p:2}}>
                        <Typography  variant="body1"  >
                          김명길
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid xs={6} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                      <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                        <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                          <Typography  variant="body1"  >
                            직책
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid xs sx={{p:2}}>
                        <Typography  variant="body1"  >
                          매니저
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid xs={6} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                      <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                        <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                          <Typography  variant="body1"  >
                            연락처
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid xs sx={{p:2}}>
                        <Typography  variant="body1"  >
                          010-1234-1234
                        </Typography>
                      </Grid>
                    </Grid>
                    
                    <Grid xs={6} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                      <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                        <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                          <Typography  variant="body1"  >
                            이메일
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid xs sx={{p:2}}>
                        <Typography  variant="body1"  >
                          abc@gmail.com
                        </Typography>
                      </Grid>
                    </Grid>


                  </Grid>

                  
                </Box>

                <Box sx={{flexGrow: 1}}>
                  <Typography variant="h3" sx={{lineHeight:'1.5rem', fontSize:'1.125rem',fontWeight:'bold'}} paddingBottom={true}>3. 투자사실 증빙 서류 첨부</Typography>

                  <Grid container sx={{borderTop:`1px solid ${theme.palette.secondary.main}`}}>
                    <Grid xs={12} container sx={{
                      borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`,
                    }}>
                      <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                        <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                          <Typography  variant="body1"  >
                            첨부 파일
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid xs sx={{p:2}}>
                        <Typography  variant="body1" sx={{textDecoration:'underline'}} >
                          홈핏 투자 증빙 서류_230513.pdf
                        </Typography>
                      </Grid>
                    </Grid>

                  </Grid>

                </Box>

                <Box sx={{flexGrow: 1}}>
                  <Typography variant="h3" sx={{lineHeight:'1.5rem', fontSize:'1.125rem',fontWeight:'bold'}} paddingBottom={true}>4. 투자분석 보고서(투자심사자료) 첨부</Typography>

                  <Grid container sx={{borderTop:`1px solid ${theme.palette.secondary.main}`}}>
                    <Grid xs={12} container sx={{
                      borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`,
                    }}>
                      <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                        <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                          <Typography  variant="body1"  >
                            첨부 파일
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid xs sx={{p:2}}>
                        <Typography  variant="body1" sx={{textDecoration:'underline'}} >
                          홈핏 투자 증빙 서류_230513.pdf
                        </Typography>
                      </Grid>
                    </Grid>




                  </Grid>



                  
                </Box>

                <Box sx={{flexGrow: 1}}>
                  <Typography variant="h3" sx={{lineHeight:'1.5rem', fontSize:'1.125rem',fontWeight:'bold'}} paddingBottom={true}>5. 기타 파일 첨부</Typography>

                  <Grid container sx={{borderTop:`1px solid ${theme.palette.secondary.main}`}}>
                    <Grid xs={12} container sx={{
                      borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`,
                    }}>
                      <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                        <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                          <Typography  variant="body1"  >
                            첨부 파일
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid xs sx={{p:2}}>
                        <Typography  variant="body1" sx={{textDecoration:'underline'}} >
                          홈핏 투자 증빙 서류_230513.pdf
                        </Typography>
                      </Grid>
                    </Grid>




                  </Grid>



                  
                </Box>                  

              </Stack>

              <Stack direction={'column'} spacing={4}>

                <Stack direction={'column'} spacing={1}>
                  <Stack direction={'row'} spacing={1} alignItems={'center'}>
                    <LensOutlinedIcon color="secondary"/>
                    <Typography 
                      flexGrow={1} variant="h2" 
                      sx={{lineHeight:'1.375rem', fontSize:'1.375rem',fontWeight:'bold'}}
                    >
                      상태 등록
                    </Typography>
                  </Stack>
                  <Grid container sx={{borderTop:`1px solid ${theme.palette.info.main}`}}>
                    <Grid xs={12} container sx={{
                      borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`,
                    }}>
                      <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                        <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                          <Typography  variant="body1"  >
                            투자기관
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid xs sx={{p:2}}>
                        <Stack direction={'row'} spacing={2}>                        
                          <FormControl size='small' sx={{  minWidth: 280 }}>
                            <Select
                              value={statusValue}
                              onChange={handleStatusChange}
                              displayEmpty
                            >
                              <MenuItem value={10}>추천완료</MenuItem>
                              <MenuItem value={20}>보완 요청</MenuItem>
                              <MenuItem value={30}>자료 요청(기업)</MenuItem>
                            </Select>
                          </FormControl>
                          {
                            statusValue === 30 &&
                            <Typography color={'grey'} sx={{textIndent:'-0.5rem', pl:'2rem'}}>
                              * 대출 대상 기업이 혁신투자BOX 로그인 시 대출 서류 제출을 안내합니다.
                            </Typography> 
                          }
                        </Stack>
                      </Grid>
                    </Grid>
                    {
                      statusValue === 20 &&                    
                        <Grid xs={12} container sx={{
                          borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`,
                        }}>
                          <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                            <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                              <Typography  variant="body1"  >
                                투자 기관에<br/>
                                전달할 메시지
                              </Typography>
                            </Stack>
                          </Grid>
                          <Grid xs sx={{p:2}}>
                            <TextField multiline rows={4} size="small" sx={{width:'100%'}}/>
                          </Grid>
                        </Grid>
                    }
                    {
                      statusValue === 30 &&
                      <>
                        <Grid xs={12} container sx={{
                          borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`,
                        }}>
                          <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                            <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                              <Typography  variant="body1"  >
                                대출 대상 기업에<br/>
                                알림 발송
                              </Typography>
                            </Stack>
                          </Grid>
                          <Grid xs sx={{p:2}}>
                            <Stack direction={'row'} spacing={2}>
                              <Button variant='outlined' color='secondary' disableElevation>이메일 재전송</Button>
                              <Button variant='outlined' color='secondary' disableElevation>SMS 제전송</Button>
                            </Stack>
                            <Typography color={'grey'} paddingTop={1}>
                              * 대출 대상 기업에 서류 제출 알림을 보내시려면 위 버튼을 눌러주세요.
                            </Typography> 
                          </Grid>
                        </Grid>

                        <Grid xs={12} container sx={{
                          borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`,
                        }}>
                          <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                            <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                              <Typography  variant="body1"  >
                                자료 제출 여부
                              </Typography>
                            </Stack>
                          </Grid>
                          <Grid xs sx={{p:2}}>
                            <Stack direction={'row'} alignItems={'center'} spacing={2}>
                              <Typography variant="body1"  >
                                <DoneIcon sx={{fontSize:'1rem'}}/> 대출 서류 제출 완료
                              </Typography>
                              <Button variant='contained' color='secondary' disableElevation  sx={{color:theme.palette.white.main}}>상세 내용</Button>
                            </Stack> 
                          </Grid>
                        </Grid>
                      
                      </>
                      
                    }

                    <Grid xs={12}>
                      <Stack direction={'row'}  justifyContent="flex-end"  spacing={1} paddingTop={1} sx={{width:'100%'}}>
                        <Button size="small"color="info" variant="outlined" >출력</Button>
                        <Button size="small"color="info" variant="outlined">PDF 저장</Button>
                        <Button size="small"color="info" variant="outlined">BPR 저장</Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>




                

              </Stack>

            </Stack>
            
          </Stack>
      
          <Stack spacing={2} direction="row" justifyContent="center">
            <Button color={'info'} variant="outlined" size="large" sx={{
              width:120,
              fontWeight:'bold',
              borderRadius:12,
            }}>목록</Button>

            <Button color={'info'} variant="outlined" size="large" sx={{
              width:120,
              fontWeight:'bold',
              borderRadius:12,
              px:0,
            }}>기업 신청 정보</Button>

            <Button color="secondary" variant="contained" size="large" sx={{
              width:120,
              color:theme.palette.white.main,
              fontWeight:'bold',
              borderRadius:12,
              boxShadow:'none',
              '&:hover':{
                boxShadow:'none'
              }
            }}>승인</Button>
            </Stack>          

        </Stack>
      </Box>


    </Stack>
    </Container>

  </>;
};
  
export default VnentrLonSgshPrtRceptDetailView2;