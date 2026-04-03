import NoResult from 'components/NoResult'
import PageLayout from 'components/PageLayout'
import Pagination from 'components/Pagination'
import PopupAlert from 'components/PopupAlert'
import PopupConfirm from 'components/PopupConfirm'
import SearchForm from 'components/SearchForm'
import Toggle from "components/Toggle"
import Button from 'components/atomic/Button'
import { InvestContext } from 'modules/common/InvestContext'
import { UserContext } from 'modules/common/UserContext'
import Api from "modules/consts/Api"
import { approveVc, denyVc, getVcList } from 'modules/consts/InvestApi'
import { createKey } from "modules/fns/commonFn"
import { excelDownloadIvtByPostConfigOption, getPostConfig } from "modules/utils/CommonUtils"
import { StringUtils } from "modules/utils/StringUtils"
import moment from "moment"
import LicensePopup from "pageComponents/invest/investUser/LicensePopup"
import { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

/*
 * 상태 코드
 * RCV00000 (대기) : 전환 요청
 * RCV00001 (완료) : 전환 승인
 * RCV00002 (취소) : 반려
 * */

const List = () => {
    const location = useLocation()
    let path = location.pathname
    let category = path.split('/')[2]
    const investContext = useContext(InvestContext)
    const userContext = useContext(UserContext)
    // const filterSelect = useRef(null)

    // ========== states
    const [list, setList] = useState(null)
    const [paging, setPaging] = useState(null)
    const [filter, setFilter] = useState({
        active: investContext.state.vcParam.cnvsRqstSttsCdId !== '' ? investContext.state.vcParam.cnvsRqstSttsCdId : 'all',
        list: [
            {id: 'all', value: 'all', label: '전체'},
            {id: 'RCV00002', value: 'RCV00002', label: '반려'},
            {id: 'RCV00001', value: 'RCV00001', label: '승인'},
            {id: 'RCV00000', value: 'RCV00000', label: '요청'}
        ]
    })
    const [searchInput, setSearchInput] = useState('')
    const [search, setSearch] = useState({
        active: 'bplcNm',
        list: [
            {id: 'bplcNm', value: 'bplcNm', label: '회사명'},
            {id: 'utlinsttId', value: 'utlinsttId', label: '기업ID'}
        ]
    })

    // ========== functions
    // ===== get list
    const getList = async (params) => {
        const res = await getVcList(params)
        if (res.status === 200) {
            const data = res.data.data
            setList(data.list?.map(item => { return {...item, key: createKey() }}))
            setPaging({
                endPage: data.endPage,
                next: data.next,
                page: data.page,
                prev: data.prev,
                record: data.record,
                startPage: data.startPage,
                total: data.total,
                totalPage: data.totalPage
            })
        }
    }

    // ===== filter
    // const onFilterActive = (selected) => {
    //     setFilter({
    //         ...filter,
    //         active: selected
    //     })
    //     investContext.actions.handleVcParam({
    //         ...investContext.state.vcParam,
    //         page: 1,
    //         cnvsRqstSttsCdId: selected === 'all' ? '' : selected
    //     })
    // }

    // ===== search
    const onSelectActive = (selected) => {
        setSearch({
            ...search,
            active: selected
        })
    }
    const handleSearch = () => {
        let params = {}
        if (search.active === 'bplcNm') {
            params = {
                bplcNm: searchInput,
                utlinsttId: ''
            }
        } else {
            params = {
                bplcNm: '',
                utlinsttId: searchInput
            }
        }
        investContext.actions.handleVcParam({
            ...investContext.state.vcParam,
            ...params,
            page: 1
        })
    }

    // ===== Alert
    const [alert, setAlert] = useState({
        status: false,
        msg: ''
    })
    const handleAlertReset = () => {
        setAlert({
            status: false,
            msg: ''
        })
    }

    // ===== paging
    const handlePaging = (param) => {
        let params = {
            ...investContext.state.vcParam,
            ...param
        }
        investContext.actions.handleVcParam(params)
    }

    // ===== reset
    const handleReset = () => {
        investContext.actions.handleVcParam(null)
        setSearchInput('')
        setFilter({
            ...filter,
            active: 'all'
        })
        setSearch({
            ...search,
            active: 'bplcNm'
        })
    }

    // == excel download
    const handleExcelDownload = async () => {
        await excelDownloadIvtByPostConfigOption(
            // content-disposition header 인코딩이 utf-8로 세팅할 경우에도 깨지는 현상 있음 -> 사용자 지정 파일명 세팅
            getPostConfig(Api.invest.convertListExcelDownload, investContext.state.vcParam),
            "투자심사전환목록_" + moment(new Date()).format('YYYYMMDD'));
    }

    // 사업자 등록증 이미지 view 팝업
    const initLicensePop = { isOpen: false, usisId: '', usisNm: '', usisBzn: '' };
    const [licensePopup, setLicensePopup] = useState({...initLicensePop});

    // == 계정 전환
    const initConfirmPop = { isOpen: false, targetId: '', msg: '', useYn: '' };
    const [confirmPop, setConfirmPop] = useState({...initConfirmPop});

    // toggle checkbox handler
    const handleToggle = (e, item) => {
        if(e.target.checked) setConfirmPop({
            ...confirmPop,
            isOpen: true,
            targetId: item.utlinsttId,
            msg: '투자 희망 기업에서 투자사로 기업의 계정을 전환하시겠습니까?',
            useYn: 'Y'
        });
        else setConfirmPop({
            ...confirmPop,
            isOpen: true,
            targetId: item.utlinsttId,
            msg: '투자사에서 투자 희망 기업으로 기업의 계정을 전환하시겠습니까?',
            useYn: 'N'
        });
    }

    const confirmConvert = async (targetId, useYn) => {

        if(!StringUtils.hasLength(targetId)) return;

        const data = {
            params: targetId,
            adminUser: userContext.actions.getIvtAdminUser()
        }

        let _msg = ''
        let result = false;

        if (useYn === 'Y') {
            // 승인 -> 투자사 전환으로 변환
            const res = await approveVc(data)
            if (res.status === 200 && res.data.code == '200') {
                _msg = '해당 투자희망기업의 투자사 전환이 완료되었습니다.';
                result = true;
            }
            else _msg = '시스템오류입니다. 관리자에게 문의하세요';
        } else if(useYn === 'N') {
            // 반려 -> 투자희망기업으로 변환
            const res = await denyVc(data)
            if (res.status === 200 && res.data.code == '200') {
                _msg = '해당 투자사의 투자희망기업 전환이 완료되었습니다.';
                result = true;
            }
            else _msg = '시스템오류입니다. 관리자에게 문의하세요';
        } else {
            return;
        }

        setConfirmPop({...initConfirmPop});
        setAlert({
            status: true,
            msg: _msg
        });
    }

    useEffect(async () => {
        await getList(investContext.state.vcParam)
    }, [investContext.state.vcParam])

    useLayoutEffect(() => {
        if (category !== userContext.state.category) {
            userContext.actions.setCategory(category)
        }
    }, [userContext.state.category])

    return (
        <PageLayout currentMenu={'invest'} currentCate={'investUser'}>


            {
                alert.status &&
                <PopupAlert msg={alert.msg} handlePopup={() => (handleAlertReset(), getList())}/>
            }

            {
                confirmPop.isOpen &&
                <PopupConfirm msg={confirmPop.msg}>
                    <Button className={'full_grey_dark'}
                            onClick={() => setConfirmPop({...initConfirmPop})}>
                        취소
                    </Button>
                    <Button className={'full_blue'}
                            onClick={() => confirmConvert(confirmPop.targetId, confirmPop.useYn)}>
                        확인
                    </Button>
                </PopupConfirm>
            }

            {
                licensePopup.isOpen &&
                    <LicensePopup usisId={licensePopup.usisId}
                                  usisNm={licensePopup.usisNm}
                                  usisBzn={licensePopup.usisBzn}
                                  closePopup={() => setLicensePopup({...initLicensePop})}
                                  handleAlert={_msg => setAlert({status: true, msg: _msg})} />
            }


            <div className="content_inner page_invest_user">
                <div className="page_header">
                    <h4 className="page_title mb_none">투자사 회원 관리</h4>

                    <div className="page_header_right">
                        <button className="excel_down" title={'엑셀다운로드'} onClick={handleExcelDownload}>
                            <img src={require('assets/images/ico_excel.png').default} alt="엑셀 아이콘"/>
                        </button>

                        <div className="btn_group">
                            <button className={'btn_refresh'} title={'새로고침'} onClick={handleReset}>
                                <span className="hide">새로고침</span>
                            </button>
                        </div>
                    </div>

                </div>
                {/*table_wrap start*/}
                <div className="table_wrap ">
                    <table className="table ">
                        <caption>투자사 회원관리 테이블</caption>
                        <colgroup>
                            <col width={'4%'}/>
                            <col width={'*'}/>
                            <col width={'15%'}/>
                            <col width={'15%'}/>
                            <col width={'12%'}/>
                            <col width={'12%'}/>
                            <col width={'12%'}/>
                            <col width={'5%'}/>
                        </colgroup>
                        <thead>
                        <tr>
                            <th>NO</th>
                            <th>회사명</th>
                            <th>기업ID</th>
                            <th>사업자번호</th>
                            <th>최초승인일</th>
                            <th>수정일</th>
                            <th>상태</th>
                            <th>계정전환</th>
                        </tr>
                        </thead>
                        <tbody>
                        {(list?.length > 0)
                            ? list.map((item, idx) => (
                                <tr key={item.key}>

                                    <td className={'ta_center'}>{item.rvsRnum}</td>
                                    <td className={'ta_center'}>{item.bplcNm}</td>
                                    <td className={'ta_center'}>{item.utlinsttId}</td>
                                    <td className={'ta_center'}
                                        style={{cursor: 'pointer'}}
                                        onClick={() => setLicensePopup({
                                            isOpen: true,
                                            usisId: item.utlinsttId,
                                            usisNm: item.bplcNm,
                                            usisBzn: item.bzn
                                        })}
                                    >{item.bzn}</td>
                                    <td className={'ta_center'}>{item.firstAcceptDate}</td>
                                    <td className={'ta_center'}>{item.lastConvertDate}</td>
                                    <td className={'ta_center'}>{item.usisState}</td>

                                    <td className={'ta_center'}>
                                        <Toggle
                                            className="theme_blue2"
                                            data={{id: 'toggle_' + item.key, value: 'on', status: item.useYn === 'Y'}}
                                            onChange={(e) => handleToggle(e, item)}
                                        />
                                    </td>
                                </tr>
                            ))
                            : (
                                <tr>
                                    <td colSpan={8}>
                                        <NoResult/>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/*table_wrap end*/}
                <div className={'paging_wrap'}>{paging && <Pagination pagingData={paging} handlePaging={handlePaging}/>}</div>
                <SearchForm
                    selectList={search}
                    onSelectActive={onSelectActive}
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                    handleSearch={handleSearch}
                />
            </div>
        </PageLayout>
    )
}

export default List
