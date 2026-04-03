import React, {useContext, useEffect, useLayoutEffect, useRef, useState} from 'react'
import {useHistory} from 'react-router-dom'

import Footer from 'components/common/Footer'
import Button from 'components/atomic/Button'
import CardLayout from 'components/common/card/CardLayout'
import BreadCrumbs from 'components/common/BreadCrumbs'
import Gallery01 from 'components/common/Gallery01'
import Header from 'components/header/Header'

import MaxLengthCount from 'pageComponents/common/number/MaxLengthCount'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import ConfirmPopup from 'pageComponents/common/pop/ConfirmPopup'
import SequenceTagForm from 'pageComponents/common/SequenceTagForm'
import CheckCloseCallBackAlertPopup from 'pageComponents/common/pop/CheckCloseCallBackAlertPopup'
import ProfileImage from "pageComponents/mypage/common/ProfileImage";

import ROUTER_NAMES from 'modules/consts/RouterConst'
import {exeFunc, getFunc, setFunc} from 'modules/utils/ReactUtils'
import ResponseUtils from 'modules/utils/ResponseUtils'
import QueryUtils from 'modules/utils/QueryUtils'
import Api from 'modules/consts/Api'
import CommonAxios from 'modules/utils/CommonAxios'
import {getPostConfig} from 'modules/utils/CommonAxios'
import {AlertLabels, FileUploadExtOpt, FileUploadSizeOpt, UsisType} from 'modules/consts/BizConst'
import {CommonContext} from "modules/contexts/common/CommomContext";
import {StringUtils} from "modules/utils/StringUtils";

const ProdWrite = (props) => {

    const history = useHistory()
    const commonContext = useContext(CommonContext);

    const galleryData = {
        title: '마이페이지',
        img: '/images/gallery02_img1.png'
    }

    const prdtChrcRef = useRef()
    const prdtDescRef = useRef()
    const [vo, setVo] = useState({
        fileId: '',
        keywordList: [],
        prdtId: '',
        prdtChrc: '',
        prdtDesc: '',
        imgUrl: '',
        prdtNm: '',
        prdtPtrn: '',
        utlinsttId: ''
    })

    const keywordRef = useRef();
    const alertPopRef = useRef();
    const confirmPopRef = useRef();
    const confirmPopDeleteRef = useRef();
    const checkCloseCallBackAlertPopupRef = useRef();

    const convertKeywordList = () => {
        let r = []
        const keywordList = getFunc(keywordRef, 'getData')
        if (keywordList.length > 0) {
            for (let i = 0; i < keywordList.length; i++) {
                const keywordListItem = keywordList[i]
                const item = {
                    kwrNm: keywordListItem['kwrNm']
                }
                r.push(item)
            }
        }
        return r
    }

    const onClickUpload = () => {
        commonContext.actions.onClickUploadFile(
            document.querySelector('#ProductWrite'),
            res => setVo({...vo, fileId: res.fileId, imgUrl: res.imgUrl}),
            alertPopRef,
            {limitSizeOpt: FileUploadSizeOpt.DEFAULT, acceptExtOpt: FileUploadExtOpt.IMAGE}
        );
    }

    const onClickRemove = () => {
        if (vo.fileId !== '' || vo.imgUrl !== '') {
            setVo({...vo, fileId: '', imgUrl: ''});
        }
    }

    const getDeleteButtonRender = () => {
        const query = QueryUtils.getQuery(props)
        if (query.hasOwnProperty('prdtId')) {
            return (
                <Button className={'blue'} onClick={onClickDelete}>
                    삭제
                </Button>
            )
        } else {
            return <></>
        }
    }

    /** Cancel Button */

    const onClickCancel = async () => {
        history.replace(ROUTER_NAMES.MY_PAGE_COMPANY_INFO);
    }

    /** Save Button */

    const onClickSave = async () => {
        const keywordListStatus = getFunc(keywordRef, 'getCurrentStatus')
        if (keywordListStatus.contains('active')) {
            const currentInputValue = getFunc(keywordRef, 'getCurrentInputValue')
            if (currentInputValue.value === '') {
                if (
                    currentInputValue.value === undefined ||
                    currentInputValue.value === '' ||
                    currentInputValue.value === null
                ) {
                    exeFunc(alertPopRef, 'open', '키워드에 입력 상태입니다. 키워드를 입력하세요.');
                    return
                }
            }
        }
        if (String(vo.prdtNm).trim() === '') {
            exeFunc(alertPopRef, 'open', '제품명을 입력하세요.');
            return
        }
        if (String(vo.prdtDesc).trim() === '') {
            exeFunc(alertPopRef, 'open', '설명을 입력하세요.');
            return
        }
        if (String(vo.prdtChrc).trim() === '') {
            exeFunc(alertPopRef, 'open', '특징 및 차별성을 입력하세요.');
            return
        }
        const keywordList = convertKeywordList()
        if (keywordList.length === 0) {
            exeFunc(alertPopRef, 'open', '키워드를 추가하세요.');
            return
        }
        if (vo.imgUrl !== '') {
            exeFunc(confirmPopRef, 'open', '저장 하시겠습니까?');
        } else {
            exeFunc(confirmPopRef, 'open', '제품정보 이미지가 없습니다. 저장 하시겠습니까?');
        }
    }

    /** Delete Button */

    const onClickDelete = () => {
        exeFunc(confirmPopDeleteRef, 'open', AlertLabels.askDelete);
    }

    /** pop ref confirm */

    const autoCloseCallBack = () => {
        history.push(ROUTER_NAMES.MY_PAGE_COMPANY_INFO)
    }

    const onConfirmSave = async () => {
        await commonContext.actions.callbackAfterSessionRefresh(save, true, true);
        // await save()
    }

    const onConfirmDelete = async () => {
        await commonContext.actions.callbackAfterSessionRefresh(async () => {
            // const url = Api.my.company.productDelete + '/' + vo.prdtId
            const params = {
                id: vo.prdtId
            }
            const res = await CommonAxios(getPostConfig(Api.my.company.productDelete, params), false)
            if (res && res.status === 200) {
                if (res.data.hasOwnProperty('code') && res.data.code !== '200') {
                    exeFunc(alertPopRef, 'open', AlertLabels.notDeleted);
                    return;
                }
                exeFunc(checkCloseCallBackAlertPopupRef, 'open', AlertLabels.deleted);
            } else {
                exeFunc(alertPopRef, 'open', AlertLabels.notDeleted);
            }
        }, true, true);
    }

    const save = async () => {
        vo.keywordList = getFunc(keywordRef, 'getData')
        let isSaveComplete = true
        const saveRes = await CommonAxios(getPostConfig(Api.my.company.productSave, vo), false)
        if (saveRes && saveRes.status === 200) {
            if (saveRes.data.hasOwnProperty('code') && saveRes.data.code !== '200') {
                isSaveComplete = false;
            }
        } else {
            isSaveComplete = false
        }
        if (isSaveComplete) {
            exeFunc(checkCloseCallBackAlertPopupRef, 'open', AlertLabels.saved);
        } else {
            exeFunc(alertPopRef, 'open', AlertLabels.notSaved);
        }
    }

    const loadProductDetail = (url) => {
        const res = ResponseUtils.getSimpleResponse(url, null, false)
        return res
    }

    const isMounted = useRef(false);

    useEffect(() => {
        if(commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
            isMounted.current = true;
            window.scrollTo(window.scrollX, 0)

            const query = QueryUtils.getQuery(props)
            if (query.hasOwnProperty('prdtId')) {
                const url = Api.my.company.productDetail + '/' + query.prdtId;

                commonContext.actions.pageMountPathCheck(history, async () => {
                    const res = await loadProductDetail(url);
                    setVo(res);
                    setFunc(keywordRef, 'setData', res.keywordList);
                });
            }
        }
    }, [commonContext.state.user]);

    useEffect(() => {
        return () => isMounted.current = false;
    }, []);

    return (
        <>
            <Header/>
            <div className="page_container">
                <div className="wrap mypage_wrap info_wrap write company bg02">
                    <div className="gallery_logo_wrap">
                        <Gallery01 data={galleryData}/>
                        <ProfileImage/>
                    </div>

                    <BreadCrumbs {...props} />

                    <div className="container default_size02">
                        {/*section02 start*/}
                        <div className="section section02">
                            <div className="section_header">
                                <h3 className="section_title">주요제품</h3>
                                <div className="btn_group">
                                    <Button onClick={onClickCancel}>취소</Button>
                                    <Button className={'blue'} onClick={onClickSave}>
                                        저장
                                    </Button>
                                    {getDeleteButtonRender()}
                                </div>
                            </div>
                            <CardLayout>
                                <div className="prod_info_wrap">
                                    <div className="card_header">
                                        <h3 className="ico_title title">제품정보</h3>
                                    </div>
                                    <div className="prod_content">
                                        <div className="prod_inner">
                                            <div className="img_list_wrap">
                                                <input
                                                    type="file"
                                                    name="file"
                                                    id={'ProductWrite'}
                                                    multiple={false}
                                                    accept={FileUploadExtOpt.IMAGE.str}
                                                    style={{display: 'none'}}
                                                    title="제품이미지"
                                                />
                                                {
                                                    StringUtils.hasLength(vo.imgUrl)
                                                        ?   <div className="img_wrap">
                                                            <img src={vo.imgUrl} alt=""/>
                                                            <div className="edit_wrap">
                                                                <button className="btn_edit" onClick={onClickUpload}>
                                                                    <span className="hide">수정</span>
                                                                </button>
                                                                <button className="btn_delete" onClick={onClickRemove}>
                                                                    <span className="hide">삭제</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        :   <div className="img_wrap add_new">
                                                            <div className="edit_wrap">
                                                                <button className="btn_add" onClick={onClickUpload}>
                                                                    Upload
                                                                </button>
                                                            </div>
                                                        </div>
                                                }
                                                {/*ADD_NEW end*/}
                                            </div>
                                            <div className="info_table">
                                                <table className="table type03">
                                                    <caption>주요제품 등록 수정 테이블</caption>
                                                    <colgroup>
                                                        <col width={'20%'}/>
                                                        <col width={'80%'}/>
                                                    </colgroup>
                                                    <tbody>
                                                    <tr>
                                                        <th>제품명</th>
                                                        <td>
                                                            <div className="input_wrap">
                                                                <input
                                                                    type="text"
                                                                    id={'prdtNm'}
                                                                    className="input"
                                                                    defaultValue={vo.prdtNm}
                                                                    title="제품명"
                                                                    maxLength={100}
                                                                    onChange={(event) => {
                                                                        event.target.value = StringUtils.cutStrByLimit(event.target.value, 100);
                                                                        setVo({...vo, prdtNm: event.target.value});
                                                                    }}
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>설명</th>
                                                        <td>
                                                            <div className="textarea_box desc">
                                                                <textarea
                                                                    className="textarea"
                                                                    maxLength={200}
                                                                    defaultValue={vo.prdtDesc}
                                                                    id={'prdtDesc'}
                                                                    title="설명"
                                                                    onChange={(event) => {
                                                                        event.target.value = StringUtils.cutStrByLimit(event.target.value, 200);
                                                                        setVo({...vo, prdtDesc: event.target.value});
                                                                    }}
                                                                />
                                                                <div className="max_count_wrap">
                                                                    <MaxLengthCount
                                                                        ref={prdtDescRef}
                                                                        max={200}
                                                                        defaultCount={String(vo.prdtDesc).length}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>특징 및 차별성</th>
                                                        <td>
                                                            <div className="textarea_box differ">
                                                                <textarea
                                                                    id={'prdtChrc'}
                                                                    className="textarea"
                                                                    maxLength={1000}
                                                                    defaultValue={vo.prdtChrc}
                                                                    title="특징 및 차별성"
                                                                    onChange={(event) => {
                                                                        event.target.value = StringUtils.cutStrByLimit(event.target.value, 1000);
                                                                        setVo({...vo, prdtChrc: event.target.value});
                                                                    }}
                                                                />
                                                                <div className="max_count_wrap">
                                                                    <MaxLengthCount
                                                                        ref={prdtChrcRef}
                                                                        max={1000}
                                                                        defaultCount={String(vo.prdtChrc).length}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>키워드</th>
                                                        <td>
                                                            <SequenceTagForm
                                                                ref={keywordRef}
                                                                property={'kwrNm'}
                                                                placeholder={'키워드'}
                                                                maxCount={5}
                                                                properties={['kwrNm', 'kwrSqn', 'prdtId', 'utlinsttId']}
                                                                seqProperty={'kwrSqn'}
                                                                title="키워드"
                                                            />
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardLayout>
                        </div>
                        {/*section02 end*/}
                    </div>
                    <Footer/>
                </div>
            </div>
            <AlertPopup ref={alertPopRef}/>
            <ConfirmPopup ref={confirmPopRef} onConfirm={onConfirmSave}/>
            <ConfirmPopup ref={confirmPopDeleteRef} onConfirm={onConfirmDelete}/>
            <CheckCloseCallBackAlertPopup ref={checkCloseCallBackAlertPopupRef} callBack={autoCloseCallBack}/>
        </>
    )
}

export default ProdWrite
