import { Box, Grid, InputAdornment, Stack, TextField, Typography, useTheme } from "@mui/material";
import { BtContentGrid } from "components/bt/BtContentGrid";
import MuiNumberInput from 'pageComponents/common/number/MuiNumberInput'
import React from 'react'
import TextFieldInput from 'components/common/TextFieldInput';

const OprtorFundInfo = (props) => {
    const {vo, copy, theme} = props;

    return <>
        <Stack direction={'column'} >
            <Stack direction={'row'}>
                <Grid container sx={{borderTop:`1px solid ${theme.palette.divider}`}}>

                    <BtContentGrid gridXs={12} title={'운용규모'} >
                        <Stack direction={'row'} spacing={2} >
                            <MuiNumberInput size="small" item={vo} type="fundNum" name="opratnScaleCo" numberProperty='opratnScaleCo' sx={{width:'12rem', boxSizing:'border-box'}} displayValue={vo['opratnScaleCo']} disabled={copy === 'view'} />
                            <MuiNumberInput size="small" item={vo} type="hundMilliwon" numberProperty='opratnScaleAm' sx={{width:'12rem'}} displayValue={vo['opratnScaleAm']} disabled={copy === 'view'}/>
                        </Stack>
                    </BtContentGrid>

                    <BtContentGrid gridXs={12} title={'블라인드'} >
                        <Stack direction={'row'} spacing={2} >
                            <MuiNumberInput size="small" item={vo} type="fundNum" name="blindCo" numberProperty='blindCo' sx={{width:'12rem', boxSizing:'border-box'}} displayValue={vo['blindCo']} disabled={copy === 'view'}/>
                            <MuiNumberInput size="small" item={vo} type="hundMilliwon" name="blindAm" numberProperty='blindAm' sx={{width:'12rem'}} displayValue={vo['blindAm']} disabled={copy === 'view'}/>
                        </Stack>
                    </BtContentGrid>

                    <BtContentGrid gridXs={12} title={'프로젝트'} >
                        <Stack direction={'row'} spacing={2} >
                            <MuiNumberInput size="small" item={vo} type="fundNum" name="prjctCo" numberProperty='prjctCo' sx={{width:'12rem', boxSizing:'border-box'}} displayValue={vo['prjctCo']} disabled={copy === 'view'}/>
                            <MuiNumberInput size="small" item={vo} type="hundMilliwon" name="prjctAm" numberProperty='prjctAm' sx={{width:'12rem'}} displayValue={vo['prjctAm']} disabled={copy === 'view'}/>
                        </Stack>
                    </BtContentGrid>
                </Grid>
                <Grid container sx={{borderTop:`1px solid ${theme.palette.divider}`,borderBottom:`1px solid ${theme.palette.divider}`}}>

                    <Stack direction={'row'} sx={{width:'100%'}}>
                        <Box p={1.5} sx={{width:'10rem'}}>
                            <Stack direction='column' spacing={1} alignItems={"flex-start"} justifyContent="center" sx={{height:'100%'}}>
                                <Stack direction="row" spacing={0.75} justifyContent="flex-start" alignItems="center" sx={{height:'100%'}}>
                                    <Typography variant="body1" sx={{color:theme.palette.text.sub}}>
                                        청산펀드 수익률 IRR
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Box>
                        <Box p={1.5} flexGrow={1}>
                            <Stack direction="column" justifyContent="center" alignItems="flex-start" sx={{height:'100%'}} spacing={2}>
                                <MuiNumberInput size="small" item={vo} type="percent" name="lqdFundErnrt" numberProperty='lqdFundErnrt' sx={{width:'100%'}} displayValue={vo['lqdFundErnrt']} disabled={copy === 'view'} />
                                <Typography variant="body1" sx={{color:theme.palette.text.sub}}>
                                    최근 5년내 청산펀드 기준, 납입총액 가중평균
                                </Typography>
                            </Stack>
                        </Box>
                    </Stack>
                </Grid>
            </Stack>
            <BtContentGrid gridXs={12} title={"펀드 소진율"}>
                <TextFieldInput size="small" numberProperty='fundExhsRt' name="fundExhsRt" item={vo} values={vo.fundExhsRt} placeholder="(활동 펀드. 중 최저 소진율 펀드) 펀드명/ 결성금액/ 투자금액" disabled={copy === 'view'}/>
            </BtContentGrid>
        </Stack>
    </>
}

export default React.memo(OprtorFundInfo);