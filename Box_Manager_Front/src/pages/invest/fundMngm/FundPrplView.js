
import LensOutlinedIcon from '@mui/icons-material/LensOutlined';
import { Box, Stack, useTheme } from "@mui/material";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import { grey } from "@mui/material/colors";
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import PageLayout from 'components/PageLayout';
import PopupAlert from 'components/PopupAlert';
import { InvestContext } from "modules/common/InvestContext";
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { BtaSelect_copy } from "../../../components/BtaSelect/BtaSelect_copy";
import Api from '../../../modules/consts/Api';
import CommonAxios from '../../../modules/utils/CommonAxios';
import { generateKey, getConfig, getPostConfig } from '../../../modules/utils/CommonUtils';
import ROUTER_NAMES from './../../../modules/consts/RouterConst';
import { fileDownload } from '../../../modules/utils/CommonUtils'
import { StringUtils } from '../../../modules/utils/StringUtils';

const FundPrplView = (props) => {
  
  const [cmscAmtTot, setCmscAmtTot] = useState(0);
  const [prraTot, setPrraTot] = useState(0);
  const [opratnHnfNmTot, setOpratnHnfNm] = useState(0);
  const [nowHffcYnTot, setNowHffcYnTot] = useState(0);
  const [nameTot, setNameTot] = useState(0);
  const [rmdpTot, setRmdpTot] = useState(0);
  const [alertChk, setAlertChk] = useState(false)
  const investContext = useContext(InvestContext);
  const history = useHistory();

  // 기본데이터 셋팅
  const [table1Rows, setTable1Rows] = useState([
    {tableNm: '자산총계', amt : '', amt1y : '',  amt2y: ''},
    {tableNm: '부채총계', amt : '', amt1y : '',  amt2y: ''},
    {tableNm: '자본총계', amt : '', amt1y : '',  amt2y: ''},
    {tableNm: '영업수익', amt : '', amt1y : '',  amt2y: ''},
    {tableNm: '영업비용', amt : '', amt1y : '',  amt2y: ''},
    {tableNm: '당기순이익', amt : '', amt1y : '',  amt2y: ''},
  ]);
  // 주요 주주 구성
  const [table2Rows, setTable2Rows] = useState([]);

  // 제안 펀드 참여 운용 인력
  const [table3Rows, setTable3Rows] = useState([]);

  // 운용인력 유지율
  const [table4Rows, setTable4Rows] = useState([]);

  // 관리인력 정보
  const [table5Rows, setTable5Rows] = useState([]);
  
  const pages = ['투자BOX', '커머스BOX', '관리자계정'];
  const [vo, setVo] = useState({
    utlinsttId : ''
    ,prnNm : ''
    ,fundId : ''
    ,fundNm : ''
    ,bzn : ''
    ,rprNm : ''
    ,adres : ''
    ,incrYmd : ''
    ,fundOprTs : ''
    ,cptsTtsm : ''
    ,payCapl: ''
    ,dscplYn : ''
    ,astTtsmAmt : ''
    ,lbltCpstAmt: ''
    ,cptsTtsmAmt: ''
    ,bsnErn: ''
    ,bsnCt: ''
    ,ctnpAmt: ''
    ,astTtsmAmt1y : ''
    ,astTtsmAmt2y : ''
    ,lbltCpstAmt1y : ''
    ,lbltCpstAmt2y : ''
    ,cptsTtsmAmt1y : ''
    ,cptsTtsmAmt2y : ''
    ,bsnErn1y : ''
    ,bsnErn2y : ''
    ,bsnCt1y : ''
    ,bsnCt2y : ''
    ,ctnpAmt1y : ''
    ,ctnpAmt2y : ''
    ,progrsStg : ''
    ,opratnScaleCo : ''
    ,opratnScaleAm : ''
    ,blindCo : ''
    ,blindAm : ''
    ,prjctCo : ''
    ,prjctAm : ''
    ,lqdFundErnrt : ''
    ,fundExhsRt : ''
    ,opratnHnfInfoTotCo : ''
    ,opratnHnfInfoMngrNm : ''
    ,opratnHnfInfoDscplYn : ''
    ,manageHnfInfoTotCo : ''
    ,manageHnfInfoHnf : ''
    ,managedtaAtchmnfl : [] // 첨부파일 등록
    ,manageHnfInfo : '' // 운용인력 징계여부
    ,rgsnTs : ''
    ,rgsnUserId : ''
    ,amnnTs : ''
    ,amnnUserId : ''
    ,auditStg : ''
    ,rplyCon : ''
  });
  
  const [fileData, setFileData] = useState([]);

  // 상세 조회
  const loadAdminFundDetail = async()=> {
    const url = Api.adminFund.fundPrplInfoDetail + '/' + props.location.state.fundId
    const res = await CommonAxios('IVT', getConfig(url), false);

    if (res && res.status === 200) {
        return res.data.data
    }
  }

  // 주요 주주 데이터 셋팅
  const stockListSetFunc = (getStockList)=> {
      const stockResult = [];
      let total1 = 0;
      let total2 = 0;

      for(let i=0 ; i<getStockList.length ; i++) {
        const resObj = {
          stchSqn : getStockList.length, 
          stchNm  : getStockList[i].stchNm, 
          cmscAmt : getStockList[i].cmscAmt, 
          prra    : getStockList[i].prra, 
          rmrk    : getStockList[i].rmrk
        }
        stockResult.push(resObj);
        total1 += getStockList[i].cmscAmt;
        total2 += getStockList[i].prra;
      }

      setCmscAmtTot(total1);
      setPrraTot(total2);
      setTable2Rows(stockResult);
  }
  // 제안펀드 참여 운용인력 데이터 셋팅
  const proFundListSetFunc = (getProFundList)=> {
      const proFundResult = [];

      for(let i=0 ; i<getProFundList.length ; i++) {
        const resObj = {
          sqn : getProFundList.length, 
          partcptnNm : getProFundList[i].partcptnNm, 
          invtCareer : getProFundList[i].invtCareer,  
          cnwkYyCnt : getProFundList[i].cnwkYyCnt, 
          fiveFyerInvmAmt : getProFundList[i].fiveFyerInvmAmt, 
          tenFyerInvmRtrvlacrsInvt: getProFundList[i].tenFyerInvmRtrvlacrsInvt, 
          tenFyerInvmRtrvlacrsRtrvl : getProFundList[i].tenFyerInvmRtrvlacrsRtrvl
        }
        proFundResult.push(resObj);
      }

      setTable3Rows(proFundResult);
  }
  // 운용인력 유지율 데이터 셋팅
  const opratnHmfMntncSetFunc = (getOpratnHmfMntnc)=> {
      const opratnHmfResult = [];
      let total1 = 0;
      let total2 = 0;

      for(let i=0 ; i<getOpratnHmfMntnc.length ; i++) {
        const resObj = {
          sqn         : getOpratnHmfMntnc.length, 
          opratnHnfNm : getOpratnHmfMntnc[i].opratnHnfNm, 
          nowHffcYn   : getOpratnHmfMntnc[i].nowHffcYn, 
          rm          : getOpratnHmfMntnc[i].rm, 
          hmrsMngmDsnc : getOpratnHmfMntnc[i].hmrsMngmDsnc
        };

        opratnHmfResult.push(resObj);
        total1 += getOpratnHmfMntnc[i].opratnHnfNm !== '' ? 1 : 0;
        total2 += getOpratnHmfMntnc[i].nowHffcYn !== '' ? 1 : 0;
      }

      setOpratnHnfNm(total1);
      setNowHffcYnTot(total2);
      setTable4Rows(opratnHmfResult);
  }
  // 관리인력 정보 데이터 셋팅
  const manageHnfInfoSetFunc = (getManageHnfInfo)=> {
      const manageHnfResult = [];
      let total1 = 0;
      let total2 = 0;

      for(let i=0 ; i<getManageHnfInfo.length ; i++) {
        const resObj = {
          sqn     : getManageHnfInfo[i].sqn, 
          name    : getManageHnfInfo[i].name, 
          rmdp    : getManageHnfInfo[i].rmdp,
          rmrk    : getManageHnfInfo[i].rmrk
        }
        manageHnfResult.push(resObj);
        total1 += getManageHnfInfo[i].name !== '' ? 1 : 0;
        total2 += getManageHnfInfo[i].rmdp !== '' ? 1 : 0;
      }

      setNameTot(total1);
      setRmdpTot(total2);
      setTable5Rows(manageHnfResult);
  }

  const onSelectActive = (selected)=> {
    setVo({...vo, auditStg : selected, progrsStg : selected})
  }

  // 답변 저장
  const saveReplyCon = async()=> {
    console.log("result save data = ", vo);

    const param = {
      rplyCon     : vo.rplyCon,
      auditStg    : vo.auditStg,
      progrsStg   : vo.progrsStg,
      fundId      : vo.fundId,
      utlinsttId  : vo.utlinsttId
    }
    const url = Api.adminFund.fundPrplInfoSave + "/" + vo.fundId;

    const saveRes = await CommonAxios('IVT', getPostConfig(url, param));
    console.log("saveRes ==== ", saveRes);

    if (saveRes) {
        if (saveRes.data.code === "200") {
          setAlertChk(true);
        }
    }

  }
  
  // 파일 다운로드
  const handleFileDownload = async(file) => {
    await fileDownload(file)
  }
  const isMountedRef = useRef(false);

  useEffect(async() => {
    if(investContext.state.codeInfo.isLoaded && !isMountedRef.current) {
      isMountedRef.current = true;
      if(props.location.state != undefined) {
        const resultDetail = await loadAdminFundDetail();
        console.log("resultDetail === ", resultDetail);
        let dataStr = resultDetail.list[0][0].fundOprTs.toString()
        let year = dataStr.slice(0, 4)
        let month = dataStr.slice(4, 6)
        let date = dataStr.slice(6, 8)
        let dates = `${year}-${month}-${date}`
        resultDetail.list[0][0].fundOprTs = dates;

        let dataStr1 = resultDetail.list[0][0].incrYmd.toString()
        let year1 = dataStr1.slice(0, 4)
        let month1 = dataStr1.slice(4, 6)
        let date1 = dataStr1.slice(6, 8)
        let dates1 = `${year1}-${month1}-${date1}`
        resultDetail.list[0][0].incrYmd = dates1;

        let bznNo = resultDetail.list[0][0].bzn.toString()
        let str1 = bznNo.slice(0, 3)
        let str2 = bznNo.slice(3, 5)
        let str3 = bznNo.slice(5, 10)
        let bzn = `${str1}-${str2}-${str3}`
        resultDetail.list[0][0].bzn = bzn;

        setVo(resultDetail.list[0][0])
        // 기본 데이터 
        const getData          = resultDetail.list[0][0];
        // 주주
        const getStockList     = resultDetail.list[1];
        // 지원
        const getProFundList   = resultDetail.list[2];
        // 운용인력
        const getOpratnHmfMntnc = resultDetail.list[3];
        // 관리인력
        const getManageHnfInfo = resultDetail.list[4];
        // 파일정보
        if(resultDetail.list[5][0] !== null) {
          setFileData(resultDetail.list[5]);
        }
  
        const table1RowSetData = [
          {tableNm: '자산총계',   amt : getData.astTtsmAmt, amt1y : getData.astTtsmAmt1y,  amt2y: getData.astTtsmAmt2y},
          {tableNm: '부채총계',   amt : getData.lbltCpstAmt, amt1y : getData.lbltCpstAmt1y,  amt2y: getData.lbltCpstAmt2y},
          {tableNm: '자본총계',   amt : getData.cptsTtsmAmt, amt1y : getData.cptsTtsmAmt1y,  amt2y: getData.cptsTtsmAmt2y},
          {tableNm: '영업수익',   amt : getData.bsnErn, amt1y : getData.bsnErn1y,  amt2y: getData.bsnErn2y},
          {tableNm: '영업비용',   amt : getData.bsnCt, amt1y : getData.bsnCt2y,  amt2y: getData.bsnCt2y},
          {tableNm: '당기순이익', amt : getData.ctnpAmt, amt1y : getData.ctnpAmt1y,  amt2y: getData.ctnpAmt2y},
        ]
        setTable1Rows(table1RowSetData);
  
        stockListSetFunc(getStockList);
        proFundListSetFunc(getProFundList);
        opratnHmfMntncSetFunc(getOpratnHmfMntnc);
        manageHnfInfoSetFunc(getManageHnfInfo);
      }else {
        setVo({...vo, auditStg : 'AUD01001'})
      }
    }
  }, [investContext.state.codeInfo]);

  const theme = useTheme();

    return <>
      {/* Header */}
      <PageLayout currentMenu={'invest'} currentCate={'fundMngm'} currentPage={'fundPrplView'}>
     
      <Stack direction='row' spacing={8}>
        {/* Side Menu */}
        {/* End of Side Menu */}
        <Box sx={{width:'100%'}}>

          <Breadcrumbs aria-label="breadcrumb" sx={{mb:3}}>
          </Breadcrumbs>

          <Stack  direction={'column'} spacing={4}  alignItems="center">

            <Stack direction={'column'} spacing={2} sx={{width:'100%'}}>
            
              <Stack direction={'row'} alignItems="center" spacing={1}>
                <Typography flexGrow={1} variant="h1" sx={{lineHeight:'2.375rem', fontSize:'1.875rem',fontWeight:'bold'}}>
                  제안받은 펀드
                </Typography>
              </Stack>

              <Divider/>

              <Stack direction={'column'} spacing={6} >

                <Stack direction={'column'} spacing={2}>
                  <Stack direction={'row'} spacing={1} alignItems={'center'}>
                    <LensOutlinedIcon color="secondary"/>
                    <Typography 
                      flexGrow={1} variant="h2" 
                      sx={{lineHeight:'1.375rem', fontSize:'1.375rem',fontWeight:'bold'}}
                    >
                      운용사 정보
                    </Typography>
                  </Stack>
                  
                  <Box sx={{flexGrow: 1}}>
                    <Grid container sx={{borderTop:`1px solid ${theme.palette.secondary.main}`}}>

                      <Grid xs={6} container sx={{
                        borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`,
                      }}>
                        <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                          <Typography  variant="body1"  >
                            운용사명
                          </Typography>
                        </Grid>
                        <Grid xs sx={{p:2}}>
                          <Typography  variant="body1"  >
                            {vo.prnNm}
                          </Typography>
                        </Grid>
                      </Grid>

                      <Grid xs={6} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                        <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                          <Typography  variant="body1"  >
                            사업자번호
                          </Typography>
                        </Grid>
                        <Grid xs sx={{p:2}}>
                          <Typography  variant="body1"  >
                            {vo.bzn}
                          </Typography>
                        </Grid>
                      </Grid>

                      <Grid xs={6} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                        <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                          <Typography  variant="body1"  >
                            대표이사
                          </Typography>
                        </Grid>
                        <Grid xs sx={{p:2}}>
                          <Typography  variant="body1"  >
                            {vo.rprNm}
                          </Typography>
                        </Grid>
                      </Grid>
                      
                      <Grid xs={6} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                        <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                          <Typography  variant="body1"  >
                            회사 소재지
                          </Typography>
                        </Grid>
                        <Grid xs sx={{p:2}}>
                          <Typography  variant="body1"  >
                            {vo.adres}
                          </Typography>
                        </Grid>
                      </Grid>

                      <Grid xs={6} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                        <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                          <Typography  variant="body1"  >
                            설립년월일
                          </Typography>
                        </Grid>
                        <Grid xs sx={{p:2}}>
                          <Typography  variant="body1"  >
                            {vo.incrYmd}
                          </Typography>
                        </Grid>
                      </Grid>

                      <Grid xs={6} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                        <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                          <Typography  variant="body1"  >
                            펀드운용 시작일
                          </Typography>
                        </Grid>
                        <Grid xs sx={{p:2}}>
                          <Typography  variant="body1"  >
                            {vo.fundOprTs}
                          </Typography>
                        </Grid>
                      </Grid>

                      <Grid xs={12} container sx={{height:'10rem' , borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                        <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                          <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                            <Typography  variant="body1"  >
                              징계여부
                            </Typography>
                          </Stack>
                          
                        </Grid>
                        <Grid xs sx={{p:2}}>
                          <Typography  variant="body1"  >
                            {vo.dscplYn}
                          </Typography>
                        </Grid>
                      </Grid>

                      <Grid xs={12} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                        <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                          <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                            <Typography  variant="body1"  >
                              재무정보
                            </Typography>
                          </Stack>
                          
                        </Grid>
                        <Grid xs sx={{p:2}}>
                          
                          <TableContainer component={Paper} sx={{borderRadius:0, boxShadow:'none'}}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                              <TableHead sx={{
                                borderTop:`1px solid ${grey[300]}`,
                                backgroundColor:grey[50]
                              }}>
                                <TableRow>
                                  <TableCell align="center">구분 / 연도</TableCell>
                                  <TableCell align="center" sx={{borderLeft: `1px solid ${grey[300]}`}}>최근 회계연도</TableCell>
                                  <TableCell align="center" sx={{borderLeft: `1px solid ${grey[300]}`}}>-1Y</TableCell>
                                  <TableCell align="center" sx={{borderLeft: `1px solid ${grey[300]}`}}>-2Y</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {table1Rows.map((row) => (
                                  <TableRow
                                    key={generateKey()}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                  >
                                    <TableCell align="center" component="th" scope="row">
                                      {row.tableNm}
                                    </TableCell>
                                    <TableCell align="center">{StringUtils.comma(row.amt)}</TableCell>
                                    <TableCell align="center">{StringUtils.comma(row.amt1y)}</TableCell>
                                    <TableCell align="center">{StringUtils.comma(row.amt2y)}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Grid>
                      </Grid>

                      <Grid xs={12} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                        <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                          <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                            <Typography  variant="body1"  >
                              주요 주주 구성
                            </Typography>
                          </Stack>
                        </Grid>
                        <Grid xs sx={{p:2}}>
                          
                          <TableContainer component={Paper} sx={{borderRadius:0, boxShadow:'none'}}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                              <TableHead sx={{
                                borderTop:`1px solid ${grey[300]}`,
                                backgroundColor:grey[50]
                              }}>
                                <TableRow>
                                  <TableCell align="center">주주명</TableCell>
                                  <TableCell align="center" sx={{borderLeft: `1px solid ${grey[300]}`}}>지분액(원)</TableCell>
                                  <TableCell align="center" sx={{borderLeft: `1px solid ${grey[300]}`}}>지분율(%)</TableCell>
                                  <TableCell align="center" sx={{borderLeft: `1px solid ${grey[300]}`}}>비고</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {table2Rows.map((row) => (
                                  <TableRow
                                    key={generateKey()}
                                    sx={{ height:'3.5rem', '&:last-child td, &:last-child th': { border: 0 } }}
                                  >
                                    <TableCell align="center" component="th" scope="row">
                                      {row.stchNm}
                                    </TableCell>
                                    <TableCell align="center">{StringUtils.comma(row.cmscAmt)}</TableCell>
                                    <TableCell align="center">{row.prra}</TableCell>
                                    <TableCell align="center">{StringUtils.comma(row.rmrk)}</TableCell>
                                  </TableRow>
                                ))}
                                <TableRow  
                                    sx={{ height:'3.5rem', '&:last-child td, &:last-child th': { border: 0 } }}
                                  >
                                    <TableCell align="center">합계</TableCell>
                                    <TableCell align="center">{StringUtils.comma(cmscAmtTot)} 원</TableCell>
                                    <TableCell align="center">{prraTot}%</TableCell>
                                    <TableCell align="center"></TableCell>
                                  </TableRow>

                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Grid>
                      </Grid>
                    </Grid>  
                  </Box>
                </Stack>

                <Stack direction={'column'} spacing={2}>
                  <Stack direction={'row'} spacing={1} alignItems={'center'}>
                    <LensOutlinedIcon color="secondary"/>
                    <Typography 
                      flexGrow={1} variant="h2" 
                      sx={{lineHeight:'1.375rem', fontSize:'1.375rem',fontWeight:'bold'}}
                    >
                      기운용 펀드 정보
                    </Typography>
                  </Stack>
                  
                  <Box sx={{flexGrow: 1}}>
                    <Grid container sx={{borderTop:`1px solid ${theme.palette.secondary.main}`}}>
                      
                      <Grid xs={6} container>
                        <Grid xs={12} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>     
                          <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                            <Typography  variant="body1"  >
                              운용규모
                            </Typography>
                          </Grid>
                          <Grid xs sx={{p:2}}>
                            <Typography  variant="body1"  >
                              {vo.opratnScaleCo} 개 펀드 {StringUtils.comma(vo.opratnScaleAm)} 억원
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid xs={12} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}> 
                          <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                            <Typography  variant="body1"  >
                              블라인드
                            </Typography>
                          </Grid>
                          <Grid xs sx={{p:2}}>
                            <Typography  variant="body1"  >
                              {vo.blindCo} 개 펀드 {StringUtils.comma(vo.blindAm)} 억원
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid xs={12} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}> 
                          <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                            <Typography  variant="body1"  >
                              프로젝트
                            </Typography>
                          </Grid>
                          <Grid xs sx={{p:2}}>
                            <Typography  variant="body1"  >
                              {vo.prjctCo} 개 펀드 {StringUtils.comma(vo.prjctAm)} 억원
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid xs={6} container sx={{
                        borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`,
                      }}>
                        <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                          <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                            <Typography  variant="body1"  >
                              청산펀드<br/>수익률 IRR
                            </Typography>
                          </Stack>
                        </Grid>
                        <Grid xs sx={{p:2}}>
                          <Typography  variant="body1"  >
                            {vo.lqdFundErnrt} %
                          </Typography>
                        </Grid>
                      </Grid>

                      <Grid xs={12} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                        <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                          <Typography  variant="body1"  >
                            펀드 소진율
                          </Typography>
                        </Grid>
                        <Grid xs sx={{p:2}}>
                          <Typography  variant="body1"  >
                            {vo.fundExhsRt}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>             
                  </Box>
                </Stack>

                <Stack direction={'column'} spacing={2}>
                  <Stack direction={'row'} spacing={1} alignItems={'center'}>
                    <LensOutlinedIcon color="secondary"/>
                    <Typography 
                      flexGrow={1} variant="h2" 
                      sx={{lineHeight:'1.375rem', fontSize:'1.375rem',fontWeight:'bold'}}
                    >
                      운용인력 정보
                    </Typography>
                  </Stack>

                  <Box sx={{flexGrow: 1}}>
                    <Grid container sx={{borderTop:`1px solid ${theme.palette.secondary.main}`}}>
                      <Grid xs={6} container sx={{
                        borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`,
                      }}>
                        <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                          <Typography  variant="body1"  >
                            총 운용인력 수
                          </Typography>
                        </Grid>
                        <Grid xs sx={{p:2}}>
                          <Typography  variant="body1"  >
                            {vo.opratnHnfInfoTotCo}
                          </Typography>
                        </Grid>
                      </Grid>

                      <Grid xs={6} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                        <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                          <Typography  variant="body1"  >
                            대표 펀드 매니저
                          </Typography>
                        </Grid>
                        <Grid xs sx={{p:2}}>
                          <Typography  variant="body1"  >
                            {vo.opratnHnfInfoMngrNm}
                          </Typography>
                        </Grid>
                      </Grid>


                      <Grid xs={12} container sx={{height:'10rem' , borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                        <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                          <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                            <Typography  variant="body1"  >
                              운용인력<br/>
                              징계여부
                            </Typography>
                          </Stack>
                          
                        </Grid>
                        <Grid xs sx={{p:2}}>
                          <Typography  variant="body1"  >
                            {vo.opratnHnfInfoDscplYn}
                          </Typography>
                        </Grid>
                      </Grid>

                      <Grid xs={12} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                        <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                          <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                            <Typography  variant="body1"  >
                              제안펀드<br/>
                              참여 운용인력
                            </Typography>
                          </Stack>
                          
                        </Grid>
                        <Grid xs sx={{p:2}}>
                          
                          <TableContainer component={Paper} sx={{borderRadius:0, boxShadow:'none'}}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                              <TableHead sx={{
                                borderTop:`1px solid ${grey[300]}`,
                                backgroundColor:grey[50]
                              }}>
                                <TableRow>
                                  <TableCell align="center">이름</TableCell>
                                  <TableCell align="center" sx={{borderLeft: `1px solid ${grey[300]}`}}>투자경력</TableCell>
                                  <TableCell align="center" sx={{borderLeft: `1px solid ${grey[300]}`}}>근속연수</TableCell>
                                  <TableCell align="center" sx={{borderLeft: `1px solid ${grey[300]}`}}>5년간 투자금액</TableCell>
                                  <TableCell align="center" sx={{borderLeft: `1px solid ${grey[300]}`}}>10년간 투자 중 완전회수 실적</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {table3Rows.map((row) => (
                                  <TableRow key={generateKey()} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell align="center" component="th" scope="row"> {row.partcptnNm} </TableCell>
                                    <TableCell align="center">{row.invtCareer}</TableCell>
                                    <TableCell align="center">{row.cnwkYyCnt}</TableCell>
                                    <TableCell align="center">{StringUtils.comma(row.fiveFyerInvmAmt)}억원</TableCell>
                                    <TableCell align="center">투자  {row.tenFyerInvmRtrvlacrsInvt}  회수 {row.tenFyerInvmRtrvlacrsRtrvl}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Grid>
                      </Grid>

                      <Grid xs={12} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                        <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                          <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                            <Typography  variant="body1"  >
                              운용인력 유지율
                            </Typography>
                          </Stack>
                        </Grid>
                        <Grid xs sx={{p:2}}>
                          
                          <TableContainer component={Paper} sx={{borderRadius:0, boxShadow:'none'}}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                              <TableHead sx={{
                                borderTop:`1px solid ${grey[300]}`,
                                backgroundColor:grey[50]
                              }}>
                                <TableRow>
                                  <TableCell align="center">운용인력명</TableCell>
                                  <TableCell align="center" sx={{borderLeft: `1px solid ${grey[300]}`}}>현재 재직 여부</TableCell>
                                  <TableCell align="center" sx={{borderLeft: `1px solid ${grey[300]}`}}>비고</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {table4Rows.map((row) => (
                                  <TableRow
                                    key={generateKey()}
                                    sx={{ height:'3.5rem', '&:last-child td, &:last-child th': { border: 0 } }}
                                  >
                                    <TableCell align="center" component="th" scope="row">
                                      {row.opratnHnfNm}
                                    </TableCell>
                                    <TableCell align="center">{row.nowHffcYn}</TableCell>
                                    <TableCell align="center">{row.rm}</TableCell>
                                  </TableRow>
                                ))}
                                <TableRow sx={{ height:'3.5rem', '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell align="center">총 {opratnHnfNmTot}명</TableCell>
                                    <TableCell align="center">현재 재직 {nowHffcYnTot}명</TableCell>
                                    <TableCell align="center"></TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                </Stack>

                <Stack direction={'column'} spacing={2}>
                  <Stack direction={'row'} spacing={1} alignItems={'center'}>
                    <LensOutlinedIcon color="secondary"/>
                    <Typography 
                      flexGrow={1} variant="h2" 
                      sx={{lineHeight:'1.375rem', fontSize:'1.375rem',fontWeight:'bold'}}
                    >
                      관리인력 정보
                    </Typography>
                  </Stack>

                  <Box sx={{flexGrow: 1}}>
                    <Grid container sx={{borderTop:`1px solid ${theme.palette.secondary.main}`}}>
                      <Grid xs={6} container sx={{
                        borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`,
                      }}>
                        <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                          <Typography  variant="body1"  >
                            총 관리인력 수
                          </Typography>
                        </Grid>
                        <Grid xs sx={{p:2}}>
                          <Typography  variant="body1"  >
                            {vo.manageHnfInfoHnf}
                          </Typography>
                        </Grid>
                      </Grid>

                      <Grid xs={6} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                        <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                          <Typography  variant="body1"  >
                            전문자격증<br/>
                            보유인력
                          </Typography>
                        </Grid>
                        <Grid xs sx={{p:2}}>
                          <Typography  variant="body1"  >
                            {vo.manageHnfInfoTotCo}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid xs={12} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                        <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                          <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                            <Typography  variant="body1"  >
                              운용인력<br/>
                              징계여부  
                            </Typography>
                          </Stack>
                          
                        </Grid>
                        <Grid xs sx={{p:2}}>
                          
                          <TableContainer component={Paper} sx={{borderRadius:0, boxShadow:'none'}}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                              <TableHead sx={{
                                borderTop:`1px solid ${grey[300]}`,
                                backgroundColor:grey[50]
                              }}>
                                <TableRow>
                                  <TableCell align="center">이름</TableCell>
                                  <TableCell align="center" sx={{borderLeft: `1px solid ${grey[300]}`}}>리스크 관리경력</TableCell>
                                  <TableCell align="center" sx={{borderLeft: `1px solid ${grey[300]}`}}>비고</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {table5Rows.map((row) => (
                                  <TableRow
                                    key={generateKey()}
                                    sx={{ height:'3.5rem', '&:last-child td, &:last-child th': { border: 0 } }}
                                  >
                                    <TableCell align="center" component="th" scope="row">
                                      {row.name}
                                    </TableCell>
                                    <TableCell align="center">{row.rmdp}</TableCell>
                                    <TableCell align="center">{row.rmrk}</TableCell>
                                  </TableRow>
                                ))}
                                <TableRow
                                    sx={{ height:'3.5rem', '&:last-child td, &:last-child th': { border: 0 } }}
                                  >
                                    <TableCell align="center">총 {nameTot}명</TableCell>
                                    <TableCell align="center">현재 재직 {rmdpTot}명</TableCell>
                                    <TableCell align="center"></TableCell>
                                  </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Grid>
                      </Grid>
                    </Grid>    
                  </Box>
                </Stack>

                <Stack direction={'column'} spacing={2}>
                  <Stack direction={'row'} spacing={1} alignItems={'center'}>
                    <LensOutlinedIcon color="secondary"/>
                    <Typography 
                      flexGrow={1} variant="h2" 
                      sx={{lineHeight:'1.375rem', fontSize:'1.375rem',fontWeight:'bold'}}
                    >
                      관련자료
                    </Typography>
                  </Stack>

                  <Box sx={{flexGrow: 1}}>
                    <Grid container sx={{borderTop:`1px solid ${theme.palette.secondary.main}`}}>
                      <Grid xs={12} container sx={{
                        borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`,
                      }}>
                        <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                          <Typography  variant="body1"  >
                            첨부 파일
                          </Typography>
                        </Grid>
                        <Grid xs sx={{p:2}}>
                          {(fileData.length > 0)?
                                fileData && fileData.map(item => {
                                return (  
                                    <div key={generateKey()}>
                                        <Typography  variant="body1" sx={{textDecoration:'underline', cursor: 'pointer'}} ><a onClick={()=> handleFileDownload(item)}>{item.fileNm}</a></Typography>
                                    </div>
                                    )
                                }): <Typography></Typography>
                            }
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                </Stack>

                <Stack direction={'column'} spacing={2}>
                  <Stack direction={'row'} spacing={1} alignItems={'center'}>
                    <LensOutlinedIcon color="secondary"/>
                    <Typography 
                      flexGrow={1} variant="h2" 
                      sx={{lineHeight:'1.375rem', fontSize:'1.375rem',fontWeight:'bold'}}
                    >
                      심사 답변 등록
                    </Typography>
                  </Stack>

                  <Box sx={{flexGrow: 1}}>
                    <Grid container sx={{borderTop:`1px solid ${theme.palette.secondary.main}`}}>

                      <Grid xs={12} container sx={{
                        borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`,
                      }}>
                        <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                          <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                            <Typography  variant="body1"  >
                              심사 단계
                            </Typography>
                          </Stack>
                        </Grid>
                        <Grid xs sx={{p:2}}>
                          <FormControl size='small' sx={{  minWidth:'20rem' }}>
                            <BtaSelect_copy defaultValue={vo.auditStg} poHandleChange={onSelectActive}>
                              <MenuItem value={'AUD01001'}>제출완료</MenuItem>
                              <MenuItem value={'AUD01002'}>심사중</MenuItem>
                              <MenuItem value={'AUD01003'}>심사 완료 - 수락</MenuItem>
                              <MenuItem value={'AUD01004'}>심사 완료 - 일부 수락</MenuItem>
                              <MenuItem value={'AUD01005'}>심사 완료 - 거절</MenuItem>
                              <MenuItem value={'AUD01006'}>심사 완료 - 보류</MenuItem>
                            </BtaSelect_copy>
                          </FormControl>
                        </Grid>
                      </Grid>

                      <Grid xs={12} container sx={{borderBottom:`1px solid ${theme.palette.lightBlueGrey.dark}`}}>
                        <Grid backgroundColor={theme.palette.lightBlueGrey.main}  width={150} sx={{p:2}}>
                          <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} >
                            <Typography  variant="body1"  >
                              답변  
                            </Typography>
                          </Stack>
                          
                        </Grid>
                        <Grid xs sx={{p:2}}>
                          <TextField
                            size="small"
                            multiline
                            rows={4}
                            sx={{width:'100%'}}
                            onChange={(e)=> setVo({...vo, rplyCon : e.target.value})}
                            value={vo.rplyCon}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                </Stack>

                <Stack spacing={2} direction="row" justifyContent="center">
                  <Button color={'info'} variant="outlined" size="large" sx={{
                    width:120,
                    fontWeight:'bold',
                    borderRadius:12,
                  }} onClick={()=>history.push(ROUTER_NAMES.INVEST_FUNDMNGM_FUNDPRPLINFO)}>목록</Button>
                  <Button color="secondary" variant="contained" size="large" sx={{
                    width:120,
                    color:theme.palette.white.main,
                    fontWeight:'bold',
                    borderRadius:12,
                    boxShadow:'none',
                    '&:hover':{
                      boxShadow:'none'
                    }
                  }}onClick={saveReplyCon}>저장</Button>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Stack>
      </PageLayout>
      {alertChk && (
        <PopupAlert
          msg={'저장되었습니다.'}
          handlePopup={()=> history.push(ROUTER_NAMES.INVEST_FUNDMNGM_FUNDPRPLINFO)}
        />
      )}
    </>;
  };
  
export default FundPrplView;