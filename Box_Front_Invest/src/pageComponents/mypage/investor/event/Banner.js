import React, {forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState} from 'react'
import ConfirmPopup from 'pageComponents/common/pop/ConfirmPopup'

import ResponseUtils from 'modules/utils/ResponseUtils'
import {exeFunc} from 'modules/utils/ReactUtils'
import {AlertLabels, FileUploadExtOpt, FileUploadSizeOpt} from 'modules/consts/BizConst'
import {StringUtils} from "modules/utils/StringUtils";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey, deepCopyByRecursion} from "modules/utils/CommonUtils";

const Banner = forwardRef((props, ref) => {

    const commonContext = useContext(CommonContext);

    const [list, setList] = useState([])

    const fileUploadRef = useRef()
    const confirmPopRemoveRef = useRef()

    useImperativeHandle(ref, () => ({
        setData,
        getData
    }))

    const setData = (temp) => {
        setList(temp)
    }
    const getData = () => {
        return list
    }

    const onClickRemove = (item) => {
        exeFunc(confirmPopRemoveRef, 'openParams', AlertLabels.askDelete, item)
    }

    const add = (fileId, fileNm, imgUrl) => {
        let bnnrSqn = 0
        if (list.length > 0) bnnrSqn = list[list.length - 1].bnnrSqn + 1
        const emptyItem = {
            bnnrSqn: bnnrSqn,
            fileId: fileId,
            fileNm: fileNm,
            imgUrl: imgUrl,
            invmCmpExusPageId: '',
            rvsRnum: '',
            utlinsttId: ''
        }
        const temp = [...list]
        temp.push(emptyItem)
        setList(temp)
    }

    const onConfirmRemove = (item) => {
        if (list.length > 0) {
            const temp = []
            for (let i = 0; i < list.length; i++) {
                const listItem = list[i]
                if (listItem['bnnrSqn'] !== item['bnnrSqn']) {
                    temp.push(listItem)
                }
            }
            setList(temp)
        }
    }

    return (
        <>
            <div className="section section06">
                <div className="card_header">
                    <h3 className="ico_title">배너등록</h3>
                </div>
                <input
                    ref={fileUploadRef}
                    id={'BannerListFileUpload'}
                    title='투자사로고파일'
                    type="file"
                    name="file"
                    multiple={false}
                    accept={FileUploadExtOpt.IMAGE.str}
                    style={{display: 'none'}}
                />
                <div className="add_table_wrap">
                    <div className="event_block_list">
                        <div className="event_block_box">
                            <div className="form_wrap">
                                <div className="logo_form_row">
                                    <div className="event_block_th">투자사로고</div>
                                    <div className="event_block_td col3">
                                        <ul className="logo_list">
                                            {list?.map((item, i) => (
                                                <li className="logo_item" key={createKey()}>
                                                    <div className="img_wrap">
                                                        <>
                                                            <input
                                                                id={'bannerFileUploadId_' + item['bnnrSqn']}
                                                                title='투자사로고파일'
                                                                type="file"
                                                                name="file"
                                                                multiple={false}
                                                                accept={FileUploadExtOpt.IMAGE.str}
                                                                style={{display: 'none'}}
                                                            />
                                                            {
                                                                !StringUtils.hasLength(item['imgUrl'])
                                                                    ?   <img src={require('assets/images/no_img.jpg').default} alt="이미지없음"/>
                                                                    :   <img src={item['imgUrl']} alt="투자사로고"/>
                                                            }
                                                            <div className="edit_group">
                                                                <button className="btn_edit"
                                                                        onClick={() => commonContext.actions.onClickUploadFile(
                                                                            document.querySelector('#bannerFileUploadId_' + item['bnnrSqn']),
                                                                            res => {
                                                                                const _list = deepCopyByRecursion(list);
                                                                                const target = _list.find(e => e.bnnrSqn === item.bnnrSqn);

                                                                                target.fileId = res.fileId;
                                                                                target.imgUrl = res.imgUrl;
                                                                                target.fileNm = res.fileNm;

                                                                                setList(_list);
                                                                            },
                                                                            props.alertPopRef,
                                                                            {limitSizeOpt: FileUploadSizeOpt.DEFAULT, acceptExtOpt: FileUploadExtOpt.IMAGE}
                                                                        )}>
                                                                    <span className="hide">편집</span>
                                                                </button>
                                                                <button className="btn_delete" onClick={() => onClickRemove(item)}>
                                                                    <span className="hide">삭제</span>
                                                                </button>
                                                            </div>
                                                        </>
                                                    </div>
                                                </li>
                                            ))}
                                            {
                                                (list.length < 5)
                                                    ?   <li className="logo_item">
                                                        <button className={'btn_upload'}
                                                                // onClick={onClickUpload}>
                                                                onClick={() => commonContext.actions.onClickUploadFile(
                                                                    fileUploadRef.current,
                                                                    res => add(res.fileId, res.fileNm, res.imgUrl),
                                                                    props.alertPopRef,
                                                                    {limitSizeOpt: FileUploadSizeOpt.DEFAULT, acceptExtOpt: FileUploadExtOpt.IMAGE}
                                                                )}>
                                                            Upload
                                                        </button>
                                                    </li>
                                                    :   <></>
                                            }
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmPopup ref={confirmPopRemoveRef} onConfirm={onConfirmRemove}/>
        </>
    )
});

export default Banner;
