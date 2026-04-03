import {
    Button,
    Container,
    Divider,
    Grid,
    Paper,
    Stack,
    Typography,
    useTheme
} from '@mui/material'
import Api from 'modules/consts/Api'
import { CheckYn, CompanyListSortType } from "modules/consts/BizConst"
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import { createKey } from 'modules/utils/CommonUtils'
import ResponseUtils from 'modules/utils/ResponseUtils'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'



const RcmdEnprListViewDetail = () => {
    const theme = useTheme()
    const history = useHistory()

    const [rcmdList, setRcmdList] = useState([])
    const isMounted = useRef(false) // useEffect에서 mount 유무 동기확인을 위함
    const commonContext = useContext(CommonContext)

    const loadRecommendCompanyList = async () => {
        const params = {
            page: 1,
            // record: 6,

            rcmdEnprStupYn: CheckYn.YES,
            sortType: CompanyListSortType.SORT_PREFERENCE
        }

        const recommendCompanyList = await ResponseUtils.getList(Api.company.infoList, params)
        console.log('recommendCompanyList = ', recommendCompanyList)
        return recommendCompanyList
    }

    useEffect(() => {
        if (commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
            isMounted.current = true

            commonContext.actions.pageMountPathCheck(history, async () => {
                // api 조회
                const resultObj = await loadRecommendCompanyList()
                console.log('resultObj = ', resultObj)
                setRcmdList(resultObj)
            })
        }
    }, [commonContext.state.user])

    console.log("rcmdList >>> "+ JSON.stringify(rcmdList));

    return (
        <>
            <Container maxWidth="false" disableGutters sx={{ maxWidth: '1280px', px: '1.25rem' }}>
                <Stack spacing={8} direction={'column'} sx={{ py: 5 }}>
                    {/* 추천기업 */}
                    <Stack spacing={2}>
                        <Stack spacing={1}>
                            <Stack direction={'row'} alignItems="flex-end" spacing={1}>
                                <Typography variant="h2" flexGrow={1}>
                                    IBK 추천기업 리스트
                                </Typography>
                            </Stack>
                            <Divider />
                        </Stack>

                        <Grid container spacing={2} sx={{ mt: 0, position: 'relative', left: '-1rem' }}>
                            {rcmdList.slice(0, 6).map((item, i) => (
                                <Grid item xs={2} key={createKey()}>
                                    <Paper sx={{ p: 2 }}>
                                        <Stack direction={'column'} spacing={1}>
                                            <img height={120} src={item.logoImageUrl} style={{ objectFit: 'contain' }} />
                                            <Typography variant="body2" sx={{ color: theme.palette.text.sub }}>
                                                {item.invmStgNm}
                                            </Typography>
                                            <Typography variant="h2" sx={{ fontWeight: 500 }}>
                                                {item.bplcNm.length > 7 ? `${item.bplcNm.slice(0, 7)}...` : item.bplcNm}
                                            </Typography>
                                            {/* <Typography variant="body2" sx={{ color: theme.palette.text.sub }}>
                                                Seed | {item.invmAmtNm}
                                            </Typography> */}
                                        </Stack>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>

                        <Stack direction={'row'} alignItems="center">
                            <Typography variant="h7" flexGrow={1}>
                                {rcmdList?.length}개 기업이 투자를 기다리고 있습니다.
                            </Typography>
                            <Button variant="outlined" onClick={() => history.push(ROUTER_NAMES.COMPANY)}>
                                더보기
                            </Button>
                        </Stack>
                    </Stack>

                    <Stack direction={'row'} justifyContent={'center'} alignItems={'center'}>
                        <Button
                            size="large"
                            variant="contained"
                            onClick={() => history.push(ROUTER_NAMES.FUND_PRPL_INFO_LIST_VIEW)}
                            disableElevation
                        >
                            확인
                        </Button>
                    </Stack>
                </Stack>
            </Container>
        </>
    )
}

export default RcmdEnprListViewDetail
