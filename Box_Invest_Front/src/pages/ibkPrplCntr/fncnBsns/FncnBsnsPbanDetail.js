import { FileDownloadOutlined } from '@mui/icons-material'
import { Button, Typography, useTheme } from '@mui/material'
import NoResult from 'components/common/NoResult'
import Api from 'modules/consts/Api'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import CommonAxios, { fileDownload, getConfig } from "modules/utils/CommonAxios"
import { exeFunc } from 'modules/utils/ReactUtils'
import { StringUtils } from 'modules/utils/StringUtils'
import moment from 'moment'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { createKey } from 'modules/utils/CommonUtils'

const FncnBsnsPbanDetail = (props) => {
  const theme = useTheme()
  const history = useHistory();
  const fncnBsnsPbanNoRef = useRef('')
  const alertPopRef = useRef('')
  const [detailVo, setDetailVo] = useState({
    fncnBsnsPbanNo : '',
    fncnBsnsPbanTtlNm : '',
    fncnBsnsPbanDcd : '',
    fncnBsnsNm : '',
    pbanYmd : '',
    prdoRccgYmd : '',
    rspbEmn : '',
    rprsCnplCon : '',
    pbanDtlCon : '',
    fileUnqNo : '',
    rgsrNm : '',
    fncnBsnsEnlsFild : [],
    fileList : [],
    iibsFrrgTs : '',
    iibsFrrgId : ''
  })

  // 클립보드 복사 
  const clipboardCopy = async(text)=> {
    await navigator.clipboard.writeText(text)
    exeFunc(alertPopRef, 'open', '클립보드에 링크가 복사되었습니다.')
  }

  const loadDetail = async()=> {
    const url = Api.fncnBsns.pbanDetail + '/' + fncnBsnsPbanNoRef.current
    const res = await CommonAxios(getConfig(url), false)

    if (res && res.status === 200) {
      let str = ''
      if(res.data.data.fncnBsnsPbanDcd === '1') {
        str = '선정공고'
      }else if(res.data.data.fncnBsnsPbanDcd === '2') {
        str = '접수현황'
      }else if(res.data.data.fncnBsnsPbanDcd === '3') {
        str = '선정결과'
      }

      setDetailVo({
        ...detailVo, 
        fncnBsnsPbanNo : res.data.data.fncnBsnsPbanNo,
        fncnBsnsPbanTtlNm : res.data.data.fncnBsnsPbanTtlNm,
        fncnBsnsPbanDcd : str,
        fncnBsnsNm : res.data.data.fncnBsnsNm,
        pbanYmd : moment(res.data.data.pbanYmd).format('YYYY-MM-DD'),
        prdoRccgYmd : moment(res.data.data.prdoRccgYmd).format('YYYY-MM-DD'), 
        rspbEmn : res.data.data.rspbEmn,
        rprsCnplCon : isTelFormat(res.data.data.rprsCnplCon),
        pbanDtlCon : res.data.data.pbanDtlCon,
        fileUnqNo : res.data.data.fileUnqNo,
        rgsrNm : res.data.data.rgsrNm,
        fncnBsnsEnlsFild : res.data.data.fncnBsnsEnlsFild,
        fileList : res.data.data.fileList,
        iibsFrrgTs : res.data.data.iibsFrrgTs,
        iibsFrrgId : res.data.data.iibsFrrgId
      })
    }
  }

  // /* 휴대폰 formating function */
  const isTelFormat = (tel) => {
    if (tel.length === 3) {
      return tel.replace(/(\d{3})/, '$1-')
    } else if (tel.length === 7) {
      return tel.replace(/(\d{3})(\d{4})/, '$1-$2')
    } else if (tel.length === 11) {
      //000-0000-0000
      return tel.replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3')
    }
    return tel
  }
  
  // 파일 다운로드
  const clickFileDownload = async(params)=> {
    await fileDownload(params)
  }

  useEffect(()=> {
    let strHref = window.location.href.toString().split('=')
    fncnBsnsPbanNoRef.current = strHref[1]
    loadDetail()
  },[])

  return (
    <>
      <div className="investBusiness_container">
        <div className="section_header">
          <h3 className={'title'}>출자사업 공고</h3>
          <Button disableElevation color="primary" variant="contained" onClick={() => {clipboardCopy(window.location)}}>
            공유링크 복사
          </Button>
        </div>
        
        <div className="investBusiness_box">
          <Typography variant='h2' sx={{ paddingBottom : '20px', fontWeight : 'bold'}}>
            {'['+ detailVo.fncnBsnsPbanDcd +'] '+detailVo.fncnBsnsPbanTtlNm}
          </Typography>
          <table className="view_table">
            <colgroup>
              <col width={'13%'} />
              <col width={'37%'} />
              <col width={'13%'} />
              <col width={'37%'} />
            </colgroup>
            <tbody>
              {
                detailVo.fncnBsnsPbanDcd === '선정공고' &&
                <>
                  <tr>
                    <th>출자사업명</th>
                    <td>{detailVo.fncnBsnsNm}</td>
                    <th>공고일자</th>
                    <td>{detailVo.pbanYmd}</td>
                  </tr>
                  <tr>
                    <th>제안서 접수마감일</th>
                    <td>{detailVo.prdoRccgYmd}</td>
                    <th>대표연락처</th>
                    <td>{detailVo.rprsCnplCon}</td>
                  </tr>
                  <tr> 
                    <td colSpan={4}>
                      <div className="inner_table_wrap">
                        <table className="inner_table">
                          <colgroup>
                            <col width="10%" />
                            <col width="" />
                            <col width="30%" />
                            <col width="20%" />
                          </colgroup>
                          <tbody>
                            <tr>
                              <th scope="col">구분</th>
                              <th scope="col">지원분야</th>
                              <th scope="col">IBK출자금액(억원)</th>
                              <th scope="col">선정운용사수</th>
                            </tr>
                            {
                              detailVo.fncnBsnsEnlsFild.length > 0 ?
                                detailVo.fncnBsnsEnlsFild.map((item)=> (
                                  <tr key={createKey()}>
                                    <td>{item.rgsnSqn}</td>
                                    <td className="left">{item.fncnBsnsEnlsFildUqnNm}</td>
                                    <td>{StringUtils.comma(item.orcyFncnAmt)}</td>
                                    <td>{item.fncnBsnsChcOpcmCnt}</td>
                                </tr>
                              )): 
                              <tr>
                                <td colSpan={4} className="td_noResult">
                                  <NoResult msg={'등록된 분야가 없습니다.'} />
                                </td>
                              </tr>
                            }
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                </>
              }
              <tr>
                <th>
                  내용
                </th>
                <td colSpan={3}>
                  <div className="textarea_view">
                    {detailVo.pbanDtlCon}
                  </div>
                </td>
              </tr>
              <tr>
                <th>
                  첨부 파일
                </th>
                <td colSpan={3}>
                  <ul className="fileAttach_list">
                    {
                      detailVo.fileList.length > 0 ?
                      detailVo.fileList.map((item)=> (
                        <li className="fileAttach_item">
                          <button type="button" className="fileAttach_download" onClick={()=> clickFileDownload(item)}>
                            <FileDownloadOutlined className="fileAttach_download_icon" />
                            {item.fileNm}
                          </button>
                        </li>
                      )) : 
                      <tr>
                        <NoResult msg={'첨부된 파일이 없습니다.'} />
                      </tr>
                    }
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="bottom_buttons">
            <Button size="large" className="gray_button" variant="contained" disableElevation onClick={()=> {history.push(ROUTER_NAMES.FNCN_BSNS_PBAN_LIST)}}>
              목록
            </Button>
            {
              detailVo.fncnBsnsPbanDcd === '선정공고' &&
              <Button size="large" variant="contained" disableElevation onClick={()=> {history.push(ROUTER_NAMES.FNCN_BSNS_RCIP_WRITE, {...detailVo})}}>
                접수하기
              </Button>
            }
          </div>
        </div>
      </div>
      <AlertPopup ref={alertPopRef} />
    </>
  )
}

export default FncnBsnsPbanDetail
