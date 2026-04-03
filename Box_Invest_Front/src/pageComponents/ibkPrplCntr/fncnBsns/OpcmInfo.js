import { FormControl, FormControlLabel, MenuItem, Radio, RadioGroup } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { BtSelect } from "components/bt/BtSelect/BtSelect";
import TextFieldInput from 'components/common/TextFieldInput';
import DateUtils from 'modules/utils/DateUtils';
import AlertPopup from 'pageComponents/common/pop/AlertPopup';
import FncnComGPInfoList from 'pageComponents/ibkPrplCntr/fncnBsns/FncnComGPInfoList';
import { forwardRef, memo, useEffect, useImperativeHandle, useRef, useState } from 'react';
import dayjs from 'dayjs';
import {StringUtils} from "modules/utils/StringUtils";

const OpcmInfo = forwardRef((props, ref) => {
    const {vo} = props
    const alertPopRef = useRef()
    const [opcmInfoList, setOpcmInfoList] = useState([])
    const [cogpYn, setCogpYn] = useState('')

    useImperativeHandle(ref, () => ({
        opcmInfoResult
    }))

    // 부모에 보낼 값
    const opcmInfoResult = ()=> {
        return opcmInfoList
    }

    // 회사형태 셀렉트박스 선택
    const onSelectActive = (sel)=> {
        vo.opcmLicsKcd = sel
    }

    // 설립일자 셋팅
    const onDatePickerChange = (currentDate) => {
        const year = currentDate.$y
        const month = currentDate.$M < 10 ? '0' + Number(currentDate.$M + 1) : currentDate.$M
        const day = currentDate.$D < 10 ? '0' + currentDate.$D : currentDate.$D
        const ymd = year + month + day
        vo.opcmIncrYmd = DateUtils.customDateFormat(ymd, 'yyyy-MM-dd')
    }

    // 라디오 버튼 컨트롤
    const rdoClickBtn = (e) => {
        if (e.target.id === 'cogpY') {
            setCogpYn('Y')
        } else if (e.target.id === 'cogpN') {
            setCogpYn('N')
        }
        vo.jntOpcmYn = e.target.value
    }

    useEffect(()=> {
        if(vo.fncnBsnsPgrsScd === '1') {
            if(vo.jntOpcmYn === 'N') {
                setCogpYn('N')
            }else {
                setCogpYn('Y')
            }
            setOpcmInfoList(vo.fncnBsnsJntOpcm)
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
                        운용사명
                        <span className="required" aria-label="필수요소">
                        *
                        </span>
                    </th>
                    <td>
                        <TextFieldInput
                            title={'운용사명'}
                            size="small"
                            numberProperty="opcmNm"
                            name="opcmNm"
                            item={vo}
                            values={vo.opcmNm}
                        />
                    </td>
                    <th>
                        대표자명
                        <span className="required" aria-label="필수요소">
                        *
                        </span>
                    </th>
                    <td>
                        <TextFieldInput
                            title={'대표자명'}
                            size="small"
                            numberProperty="opcmRpprNm"
                            name="opcmRpprNm"
                            item={vo}
                            values={vo.opcmRpprNm}
                        />
                    </td>
                </tr>

                <tr>
                    <th>
                        설립일자
                        <span className="required" aria-label="필수요소">
                        *
                        </span>
                    </th>
                    <td>
                        <DatePicker
                            name="opcmIncrYmd"
                            title={'설립일자'}
                            format="YYYY-MM-DD"
                            sx={{ width: '100%' }}
                            selected={vo.opcmIncrYmd}
                            value={dayjs(vo.opcmIncrYmd)}
                            onChange={(currentDate) => onDatePickerChange(currentDate, 'opcmIncrYmd')}
                        />
                    </td>
                    <th>
                        회사 형태
                        <span className="required" aria-label="필수요소">
                        *
                        </span>
                    </th>
                    <td>
                        <BtSelect defaultValue={vo.opcmLicsKcd} poHandleChange={onSelectActive}>
                            <MenuItem value={'0'}>
                                선택하세요
                            </MenuItem>
                            <MenuItem value={'1'}>창업투자회사</MenuItem>
                            <MenuItem value={'2'}>신기술사업금융업자</MenuItem>
                            <MenuItem value={'3'}>LLC</MenuItem>
                            <MenuItem value={'4'}>창업기획자(AC)</MenuItem>
                            <MenuItem value={'5'}>자산운용사</MenuItem>
                            <MenuItem value={'6'}>사모집합투자기구운용사</MenuItem>
                            <MenuItem value={'7'}>기타</MenuItem>
                        </BtSelect>
                    </td>
                    </tr>

                    <tr>
                    <th>
                        사업자등록번호
                        <span className="required" aria-label="필수요소">
                        *
                        </span>
                    </th>
                    <td>
                        <TextFieldInput
                            title={'사업자등록번호'}
                            size="small"
                            numberProperty="opcmBzn"
                            name="opcmBzn"
                            item={vo}
                            values={vo.fncnBsnsPgrsScd ==='1' ? StringUtils.formatBusinessNumber(vo.opcmBzn) : vo.opcmBzn}
                            maxLength={13}
                        />
                    </td>
                    <th>
                        담당자
                        <span className="required" aria-label="필수요소">
                        *
                        </span>
                    </th>
                    <td>
                        <TextFieldInput
                            title={'담당자'}
                            size="small"
                            numberProperty="opcmRsprNm"
                            name="opcmRsprNm"
                            item={vo}
                            values={vo.opcmRsprNm}
                        />
                    </td>
                    </tr>

                    <tr>
                    <th>
                        연락처
                        <span className="required" aria-label="필수요소">
                        *
                        </span>
                    </th>
                    <td>
                        <TextFieldInput
                            title={'연락처'}
                            size="small"
                            numberProperty="opcmCnplCon"
                            name="opcmCnplCon"
                            item={vo}
                            values={vo.fncnBsnsPgrsScd ==='1' ? StringUtils.isTelFormat(String(vo.opcmCnplCon)) : vo.opcmCnplCon}
                            maxLength={13}
                        />
                    </td>
                    <th>
                        이메일
                        <span className="required" aria-label="필수요소">
                        *
                        </span>
                    </th>
                    <td>
                        <TextFieldInput
                            title={'이메일'}
                            size="small"
                            numberProperty="opcmEad"
                            name="opcmEad"
                            item={vo}
                            values={vo.opcmEad}
                        />
                    </td>
                    </tr>

                    <tr>
                    <th>
                        공동GP여부
                        <span className="required" aria-label="필수요소">
                        *
                        </span>
                    </th>
                    <td colSpan={3}>
                        <FormControl>
                        <RadioGroup row>
                            <FormControlLabel value="Y" control={<Radio id={'cogpY'} onClick={(e) => rdoClickBtn(e)} checked={cogpYn === 'Y'} />} label="Y" />
                            <FormControlLabel value="N" control={<Radio id={'cogpN'} onClick={(e) => rdoClickBtn(e)} checked={cogpYn === 'N'} />} label="N" />
                        </RadioGroup>
                        </FormControl>
                    </td>
                </tr>

                <tr>
                    {
                        cogpYn === 'Y' ? 
                        <>
                            <th>
                                공동GP정보
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
                                        <th scope="col">공동GP명</th>
                                        <th scope="col">대표자명</th>
                                        <th scope="col">설립일자</th>
                                        <th scope="col">사업자등록번호</th>
                                        <th scope="col">담당자</th>
                                        <th scope="col">연락처</th>
                                        <th scope="col">이메일</th>
                                        <th scope="col"></th>
                                    </tr>
                                        <FncnComGPInfoList {...opcmInfoList} list={opcmInfoList} pageType={vo.fncnBsnsPgrsScd} />
                                    </tbody>
                                </table>
                                </div>
                            </td>
                        </> : <></>
                    }
                </tr>
            </tbody>
        </table>
        <AlertPopup ref={alertPopRef} />
    </>
})

export default memo(OpcmInfo)