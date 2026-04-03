import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {useHistory} from "react-router-dom";

import Button from "components/atomic/Button";
import NoResult from "components/common/NoResult";

import ResponseUtils from "modules/utils/ResponseUtils";
import {StringUtils} from "modules/utils/StringUtils";
import DateUtils from "modules/utils/DateUtils";


const StampSection = forwardRef((props, ref) => {

    const history = useHistory();
    const {
        searchApiUrl,
        writeRouteUrl
    } = props;

    const [vo, setVo] = useState({
        utlinsttId: '',
        rgslImgFileId: '',
        signBase64File: '',
        rgsnUserId: '',
        amnnUserId: '',
        rgsnTs: '',
        rgsnTsStr: '',
        amnnTs: '',
        amnnTsStr: ''
    });

    useEffect(() => {
    }, []);
    useImperativeHandle(ref, () => ({
        setData
    }));

    const setData = async () => {
        const resDataObj = await ResponseUtils.getSimpleResponse(searchApiUrl);
        if (resDataObj) setVo(resDataObj);
    }

    const onClickStampWrite = () => {
        history.push(writeRouteUrl);
    }

    return (
        <>
            <div className="section_header">
                <div className="section_title_inner">
                    <h3 className="section_title">인감</h3>
                    <div className="info_tooltip_wrap">
                        <button className={'btn_help'}>
                            <span className="hide">정보살펴보기</span>
                        </button>
                        <div className="info_tooltip">
                            <div className="tooltip_inner">
                                <div className="tit_section">
                                    <p className="tit">인감</p>
                                    <button className="btn_delete_grey">
                                        <span className="hide">삭제</span>
                                    </button>
                                </div>
                                <p className="cnt nowrap">
                                    PNG.JPG 형식으로 등록 가능하며&#44;
                                    <br/> 1개의 이미지만 등록 가능합니다&#46;
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <Button className={'blue'} onClick={onClickStampWrite}>수정하기</Button>
            </div>
            {
                StringUtils.hasLength(vo?.rgslImgFileId)
                    ? <div className="stamp_wrap">
                        <div className="stamp">
                            <img src={vo.signBase64File} alt=""/>
                        </div>
                        <div className="update">
                            Update : <span>{StringUtils.hasLength(vo?.amnnTsStr)
                            ? DateUtils.customDateFormat(vo.amnnTsStr, 'yyyy년 MM월 dd일')
                            : StringUtils.hasLength(vo.rgsnTsStr)
                                ? DateUtils.customDateFormat(vo.rgsnTsStr, 'yyyy년 MM월 dd일')
                                : ''
                        }   </span>
                        </div>
                    </div>
                    :   <NoResult msg={'등록된 인감정보가 없습니다.'} />
            }
        </>
    )
});

export default StampSection;