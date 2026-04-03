import { FormControl, FormControlLabel, MenuItem, Radio, RadioGroup } from "@mui/material";
import { BtSelect } from "components/bt/BtSelect/BtSelect";
import TextFieldInput from 'components/common/TextFieldInput';
import Api from 'modules/consts/Api';
import CommonAxios, { getConfig } from 'modules/utils/CommonAxios';
import MuiNumberInput from 'pageComponents/common/number/MuiNumberInput';
import FncnEnlsList from "pageComponents/ibkPrplCntr/fncnBsns/FncnEnlsList";
import FnsnInvvHmrsList from 'pageComponents/ibkPrplCntr/fncnBsns/FnsnInvvHmrsList';
import { forwardRef, memo, useEffect, useImperativeHandle, useState } from 'react';
import FncnBsnsPmglList from "./FncnBsnsPmglList";
import FncnChcPrnlList from "./FncnChcPrnlList";

const FncnPrdoInfo = forwardRef((props, ref) => {
    const {vo} = props
    const [rdoYn, setRdoYn] = useState('')
    const [fncnPrdoInfoList, setFncnPrdoInfoList] = useState([])
    const [fncnEnlsList, setFncnEnlsList] = useState([])
    const [pmglList, setPmglList] = useState([])
    const [chcPrnlList, setChcPrnlList] = useState([])
    const [enlsFildUqnList, setEnlsFildUqnList] = useState([])

    useImperativeHandle(ref, () => ({
      prdoInfoResult
    }))

    // 부모에 보낼 값
    const prdoInfoResult = ()=> {
        const resultList = [fncnPrdoInfoList, fncnEnlsList, pmglList, chcPrnlList]
        return resultList
    }

    // 라디오 버튼 컨트롤
    const rdoClickBtn = (e) => {
      setRdoYn(e.target.value)
      vo.sprnFild = e.target.value
      vo.fncnBsnsEnlsFildUqn = e.target.value
      console.log('e.target.value=  ', e.target.value)
    }

    // 펀드구분 셀렉트박스 선택
    const onSelectActive = (sel)=> {
      vo.fncnBsnsCprtDcd = sel
    }

    // 출자금 납부 방식 셀렉트박스 선택
    const onSelActive = (sel)=> {
      vo.fnmnPmntMcd = sel
    }

    // 모집분야 항목 조회
    const searchEnlsFildUqnList = async(id)=> {
      const url = Api.fncnBsns.searchEnlsFildUqnList
      const res = await CommonAxios(getConfig(url, { fncnBsnsPbanCd: id }), false)
      if(res.data.code === '200') {
        setEnlsFildUqnList(res.data.data.list)
      }
    }

    useEffect(()=> {
      console.log(' vo = ', vo)
      searchEnlsFildUqnList(vo.fncnBsnsPbanNo)
      if(vo.fncnBsnsPgrsScd === '1') {
        setRdoYn(vo.fncnBsnsEnlsFildUqn)
        setFncnPrdoInfoList(vo.fncnBsnsInvvHmrs)
        setFncnEnlsList(vo.fncnEnls)
        setPmglList(vo.fncnBsnsPmglItm)
        setChcPrnlList(vo.fncnBsnsChcPrnl)
      }
    },[vo])

    return <>
        <table className="view_table">
            <colgroup>
              <col width={'13%'} />
              <col width={'37%'} />
              <col width={'13%'} />
              <col width={'37%'} />
            </colgroup>
            <tbody>
              <tr>
                <th>
                  지원분야
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td colSpan="3">
                  <FormControl>
                    <RadioGroup row>
                      {
                        enlsFildUqnList.map((item)=>(
                          <FormControlLabel value={item.fncnBsnsEnlsFildUqn} key={item.fncnBsnsEnlsFildUqn} control={<Radio id={'sprnFild01'} onClick={(e) => rdoClickBtn(e)} checked={rdoYn === item.fncnBsnsEnlsFildUqn} />} label={item.fncnBsnsEnlsFildUqnNm} />
                        ))
                      }
                    </RadioGroup>
                  </FormControl>
                </td>
              </tr>
              <tr>
                <th>
                  조합명
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>
                    <TextFieldInput
                        title={'운용사명'}
                        size="small"
                        numberProperty="fundNm"
                        name="fundNm"
                        item={vo}
                        values={vo.fundNm}
                    />
                </td>
                <th>
                  펀드구분
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>
                  <BtSelect defaultValue={vo.fncnBsnsCprtDcd} poHandleChange={onSelectActive}>
                    <MenuItem disabled value={'0'}>
                      선택하세요
                    </MenuItem>
                      <MenuItem value={'1'}>벤처투자조합</MenuItem>
                      <MenuItem value={'2'}>신기술사업투자조합</MenuItem>
                      <MenuItem value={'3'}>기관전용PEF</MenuItem>
                      <MenuItem value={'4'}>기타</MenuItem>
                  </BtSelect>
                </td>
              </tr>
              <tr>
                <th>
                  IBK출자요청액(억원)
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>
                    <MuiNumberInput
                      size="small"
                      item={vo}
                      type={'ibkFncnRqstAmt'}
                      numberProperty="ibkFncnRqstAmt"
                      sx={{ width: '6rem' }}
                      displayValue={vo.ibkFncnRqstAmt}
                    />
                </td>
                <th>
                  펀드결성규모(억원)
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>
                  <MuiNumberInput
                      size="small"
                      item={vo}
                      type={'fundOrgzScdlAmt'}
                      numberProperty="fundOrgzScdlAmt"
                      sx={{ width: '6rem' }}
                      displayValue={vo.fundOrgzScdlAmt}
                    />
                </td>
              </tr>
              <tr>
                <th>
                  존속기간(년)
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>
                  <TextFieldInput
                      title={'존속기간'}
                      size="small"
                      numberProperty="fundAsceTrm"
                      name="fundAsceTrm"
                      item={vo}
                      values={vo.fundAsceTrm}
                  />
                </td>
                <th>
                  출자금 납부방식
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>
                  <BtSelect defaultValue={vo.fnmnPmntMcd} poHandleChange={onSelActive}>
                    <MenuItem disabled value={'0'}>
                      선택하세요
                    </MenuItem>
                    <MenuItem value={'1'}>일시납</MenuItem>
                    <MenuItem value={'2'}>수시납</MenuItem>
                    <MenuItem value={'3'}>분할납</MenuItem>
                  </BtSelect>
                </td>
              </tr>
              <tr>
                <th>
                  기준수익률(%)
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>
                  <TextFieldInput
                      title={'기준수익률(%)'}
                      size="small"
                      numberProperty="baseEnrtCon"
                      name="baseEnrtCon"
                      item={vo}
                      values={vo.baseEnrtCon}
                  />
                </td>
                <th>
                  관리보수(%)
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>
                  <TextFieldInput
                      title={'관리보수(%)'}
                      size="small"
                      numberProperty="mnrmCon"
                      name="mnrmCon"
                      item={vo}
                      values={vo.mnrmCon}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  성과보수(%)
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td colSpan={3}>
                  <TextFieldInput
                      title={'성과보수(%)'}
                      size="small"
                      numberProperty="otcmRmnrCon"
                      name="otcmRmnrCon"
                      item={vo}
                      values={vo.otcmRmnrCon}
                  />
                </td>
              </tr>

              <tr>
                <th>
                  펀드참여인력
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td colSpan={3}>
                  <div className="inner_table_wrap">
                    <table className="inner_table">
                      <colgroup>
                        <col width="" />
                        <col width="" />
                        <col width="" />
                        <col width="" />
                        <col width="" />
                        <col width="" />
                        <col width="" />
                        <col width="8%" />
                      </colgroup>
                      <tbody>
                        <tr>
                          <th scope="col">GP명</th>
                          <th scope="col">인력구분</th>
                          <th scope="col">이름</th>
                          <th scope="col">투자경력(년)</th>
                          <th scope="col">대표번호</th>
                          <th scope="col">휴대폰번호</th>
                          <th scope="col">이메일주소</th>
                          <th scope="col"></th>
                        </tr>
                        <FnsnInvvHmrsList {...fncnPrdoInfoList} list={fncnPrdoInfoList} pageType={vo.fncnBsnsPgrsScd}/>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>

              <tr>
                <th>
                  출자자 모집현황
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                  <br />
                  (GP 포함)
                  <div className="th_guide_text">관련자료 첨부 필수</div>
                </th>
                <td colSpan={3}>
                  <div className="inner_table_wrap">
                    <table className="inner_table">
                      <colgroup>
                        <col width="" />
                        <col width="" />
                        <col width="" />
                        <col width="" />
                        <col width="8%" />
                      </colgroup>
                      <tbody>
                        <tr>
                          <th scope="col">GP명</th>
                          <th scope="col">발급기관명</th>
                          <th scope="col">진행단계</th>
                          <th scope="col">출자금액(억원)</th>
                          <th scope="col"></th>
                        </tr>
                        <FncnEnlsList {...fncnEnlsList} list={fncnEnlsList} pageType={vo.fncnBsnsPgrsScd} />
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>

              <tr>
                <th>
                  주목적 추가항목
                  <br />
                  (선택입력사항)
                </th>
                <td colSpan={3}>
                  <div className="inner_table_wrap">
                    <table className="inner_table">
                      <colgroup>
                        <col width="" />
                        <col width="" />
                        <col width="" />
                      </colgroup>
                      <tbody>
                        <FncnBsnsPmglList {...pmglList} list={pmglList} pageType={vo.fncnBsnsPgrsScd} />
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>

              <tr>
                <th>
                  선정우대 항목
                  <br />
                  (선택입력사항)
                </th>
                <td colSpan={3}>
                  <div className="inner_table_wrap">
                    <table className="inner_table">
                      <colgroup>
                        <col width="" />
                        <col width="" />
                        <col width="8%" />
                      </colgroup>
                      <tbody>
                        <tr >
                          <th scope="col">선정우대 내용</th>
                          <th scope="col">상세 내용</th>
                          <th scope="col"></th>
                        </tr>
                        <FncnChcPrnlList {...chcPrnlList} list={chcPrnlList} pageType={vo.fncnBsnsPgrsScd} />
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </tbody>
        </table>
    </>
})

export default memo(FncnPrdoInfo)