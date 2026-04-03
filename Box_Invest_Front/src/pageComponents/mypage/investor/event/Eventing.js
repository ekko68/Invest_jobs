import React, {forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState} from 'react'
import {maxCountStyle} from 'assets/style/AtomicStyle'

import Button from 'components/atomic/Button'
import {MinusBtn} from 'components/atomic/IconButton'
import CalendarWithRange, {CalendarRange} from "components/atomic/CalendarWithRange";

import DateUtils from 'modules/utils/DateUtils'
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey, deepCopyByRecursion} from "modules/utils/CommonUtils";
import {StringUtils} from "modules/utils/StringUtils";
import {CheckYn, FileUploadExtOpt, FileUploadSizeOpt} from "modules/consts/BizConst";

const Eventing = forwardRef((props, ref) => {

    const commonContext = useContext(CommonContext);
    const [list, setList] = useState([]);

    useImperativeHandle(ref, () => ({
        setData,
        getData
    }))

    const setData = (items) => {
        setList(items.map(item => {
            return {...item, key: createKey()};
        }))
    }
    const getData = () => {
        return list.map(item => {
            const {key, ...other} = item;
            return other;
        })
    }

    const onClickRemove = (item) => {
        if (list.length > 0) {
            const temp = []
            for (let i = 0; i < list.length; i++) {
                const listItem = list[i]
                if (listItem['evntSqn'] !== item['evntSqn']) {
                    temp.push(listItem)
                }
            }
            setList(temp)
        }
    }

    const onClickAdd = () => {
        let evntSqn = 0
        if (list.length > 0) evntSqn = list[list.length - 1].evntSqn + 1
        const emptyItem = {
            evntBkmrUrl: '',
            evntCon: '',
            // evntFndt: null,
            evntFndt: DateUtils.customDateFormat(new Date(), 'yyyyMMdd'),
            evntSqn: evntSqn,
            evntStdt: DateUtils.customDateFormat(new Date(), 'yyyyMMdd'),
            evntTtl: '',
            fileId: '',
            fileNm: '',
            imgUrl: '',
            invmCmpExusPageId: '',
            ongoingYn: CheckYn.NO,
            rvsRnum: '',
            utlinsttId: '',

            key: createKey()
        }
        const temp = [...list]
        temp.push(emptyItem)
        setList(temp)
    }

    const setEventListItem = (evntSqn, property, value) => {
        const _list = deepCopyByRecursion(list);
        const target = _list.find(e => e.evntSqn === evntSqn);

        if(target) {
            target[property] = value;
            setList(_list);
        }
    }

    const onChangeDateEvntDt = (selectedDate, item, property) => {
        const _item = {...item};

        const d = DateUtils.customDateFormat(selectedDate, 'yyyyMMdd');
        _item[String(property)] = d;

        const _list = deepCopyByRecursion(list);
        _list[_list.findIndex(e => e.evntSqn === item.evntSqn)] = _item;

        setList(_list);
    }

    return (
        <div className="section section04">
            <div className="card_header">
                <h3 className="ico_title">진행중인 이벤트</h3>
                <div className="btn_wrap">
                    <Button className={'btn_add dashed linear light_grey'} onClick={onClickAdd}>
                        <span className="ico_plus">입력내용추가</span>
                    </Button>
                </div>
            </div>
            <div className="add_table_wrap">
                <div className="event_block_list">{
                    list?.map((item, i) => (
                        <div className="event_block_box" key={item.key}>
                            <div className="form_wrap">
                                {/*form_row start*/}
                                <div className="form_row">
                                    <div className="event_block_th">대표 이미지</div>
                                    <div className="event_block_td">
                                        <div className="input_btn_wrap input_wrap">
                                            <input
                                                id={'EventingFileInput' + item['evntSqn']}
                                                title='이벤트대표이미지파일'
                                                type="file"
                                                name="file"
                                                multiple={false}
                                                accept={FileUploadExtOpt.IMAGE.str}
                                                style={{display: 'none'}}
                                            />
                                            <input
                                                id={'EventingInput' + item['evntSqn']}
                                                title='이벤트대표이미지파일명'
                                                type="text"
                                                className="input"
                                                disabled={CheckYn.YES}
                                                placeholder={FileUploadExtOpt.IMAGE.str}
                                                defaultValue={item['fileNm']}
                                            />
                                            <Button className={'blue linear'}
                                                // onClick={(event) => onClickUploadEvent(item)}>
                                                    onClick={() => {
                                                        commonContext.actions.onClickUploadFile(
                                                            document.querySelector('#EventingFileInput' + item.evntSqn),
                                                            res => {
                                                                const _list = deepCopyByRecursion(list);
                                                                const target = _list.find(e => e.evntSqn === item.evntSqn);
                                                                target.fileId = res.fileId;
                                                                target.imgUrl = res.imgUrl;
                                                                target.fileNm = res.fileNm;

                                                                setList(_list);
                                                            },
                                                            props.alertPopRef,
                                                            {limitSizeOpt: FileUploadSizeOpt.DEFAULT, acceptExtOpt: FileUploadExtOpt.IMAGE}
                                                        );
                                                    }}>
                                                업로드
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="event_block_th">자세히보기</div>
                                    <div className="event_block_td">
                                        <div className="input_wrap">
                                            <input
                                                id={'evntBkmrUrl'}
                                                title='이벤트링크'
                                                type="text"
                                                className="input"
                                                placeholder="링크를 입력해 주세요."
                                                defaultValue={item['evntBkmrUrl']}
                                                onChange={(event) => setEventListItem(item.evntSqn, 'evntBkmrUrl', event.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form_row">
                                    <div className="event_block_th">제목</div>
                                    <div className="event_block_td col3">
                                        <div className="input_wrap">
                                            <input
                                                id={'evntTtl'}
                                                title='이벤트제목'
                                                type="text"
                                                className="input"
                                                placeholder="제목을 입력해 주세요."
                                                defaultValue={item['evntTtl']}
                                                maxLength={100}
                                                onChange={(event) => {
                                                    event.target.value = StringUtils.cutStrByLimit(event.target.value, 100);
                                                    setEventListItem(item.evntSqn, 'evntTtl', event.target.value)
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form_row row_content">
                                    <div className="event_block_th">내용</div>
                                    <div className="event_block_td  col3">
                                        <div className="textarea_wrap">
                                            <textarea
                                                id={'evntCon' + item['evntSqn']}
                                                title='이벤트내용'
                                                className={'textarea'}
                                                placeholder={'내용을 입력해 주세요'}
                                                defaultValue={item['evntCon']}
                                                maxLength={500}
                                                onChange={event => {
                                                    event.target.value = StringUtils.cutStrByLimit(event.target.value, 500);
                                                    document.querySelector('#evntConCount' + item['evntSqn']).innerHTML = event.target.value.length;

                                                    setEventListItem(item.evntSqn, 'evntCon', event.target.value);
                                                }}
                                            />
                                        </div>
                                        <div className="max_count_wrap">
                                            <div className="max_count" css={maxCountStyle}>
                                                <p id={'evntConCount' + item['evntSqn']} className="count">
                                                    {String(item['evntCon']).length}
                                                </p>
                                                <p id={'evntConMax' + item['evntSqn']} className="max">
                                                    {500}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="form_row row_content">
                                    <div className="event_block_th">이벤트 기간</div>
                                    <div className="event_block_td  col3">
                                        <table className="table type02">
                                            <colgroup>
                                                <col width={'100%'}/>
                                            </colgroup>
                                            <tbody>
                                            <tr>
                                                <td style={{border: '0px solid #FFFFFF'}}>
                                                    <div className="input_wrap">
                                                        <div className="input_wrap">
                                                            <CalendarWithRange
                                                                valueType={'dash'}
                                                                startDate={DateUtils.insertYyyyMmDdDash(item['evntStdt'])}
                                                                endDate={DateUtils.insertYyyyMmDdDash(item['evntFndt'])}
                                                                rangeType={CalendarRange.START}
                                                                onChangeDate={(currentDate, item) => onChangeDateEvntDt(currentDate, item, 'evntStdt')}
                                                                item={item}
                                                            />
                                                        </div>
                                                        ~
                                                        <div className="input_wrap">
                                                            <CalendarWithRange
                                                                valueType={'dash'}
                                                                startDate={DateUtils.insertYyyyMmDdDash(item['evntStdt'])}
                                                                endDate={DateUtils.insertYyyyMmDdDash(item['evntFndt'])}
                                                                rangeType={CalendarRange.END}
                                                                onChangeDate={(currentDate, item) => onChangeDateEvntDt(currentDate, item, 'evntFndt')}
                                                                item={item}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="btn_wrap">
                                <MinusBtn onClick={() => onClickRemove(item)}>
                                    <span className="hide">삭제</span>
                                </MinusBtn>
                            </div>
                        </div>
                    ))
                }</div>
            </div>
        </div>
    )
});

export default Eventing;
