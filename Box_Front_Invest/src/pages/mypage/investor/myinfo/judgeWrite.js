/** @jsxImportSource @emotion/react */
import React, {useState, useEffect, useRef, useContext} from 'react'
import {useHistory} from 'react-router-dom'

import {cardItem06Style} from 'assets/style/ComponentStyle'

import Header from 'components/header/Header'
import Footer from 'components/common/Footer'
import Gallery01 from 'components/common/Gallery01'
import BreadCrumbs from 'components/common/BreadCrumbs'
import Button from 'components/atomic/Button'

import ConfirmPopup from 'pageComponents/common/pop/ConfirmPopup'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import CheckCloseAlertPopup from 'pageComponents/common/pop/CheckCloseAlertPopup'
import ProfileImage from "pageComponents/mypage/common/ProfileImage";

import ROUTER_NAMES from 'modules/consts/RouterConst'
import ResponseUtils from 'modules/utils/ResponseUtils'
import Api from 'modules/consts/Api'
import {exeFunc} from 'modules/utils/ReactUtils'
import {AlertLabels, FileUploadExtOpt, FileUploadSizeOpt, UsisType} from 'modules/consts/BizConst'
import ValidateUtils from 'modules/utils/ValidateUtils'
import CommonAxios from 'modules/utils/CommonAxios'
import {getPostConfig} from 'modules/utils/CommonAxios'
import {StringUtils} from "modules/utils/StringUtils";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey, deepCopyByRecursion} from "modules/utils/CommonUtils";
import CheckCloseCallBackAlertPopup from "pageComponents/common/pop/CheckCloseCallBackAlertPopup";

const JudgeWrite = (props) => {

    const history = useHistory()
    const commonContext = useContext(CommonContext);

    const galleryData = {
        title: '마이페이지',
        img: '/images/gallery02_img1.png'
    }

    const confirmPopRemoveRef = useRef()
    const alertPopRef = useRef()
    const confirmPopRef = useRef()
    const checkCloseAlertPopupRef = useRef()

    const [list, setList] = useState([])

    const onChangeInput = (key, property, value) => {
        const _list = deepCopyByRecursion(list);
        _list.find(e => e.key === key)[property] = value;

        setList(_list);
    }

    const onClickRemoveItem = (item) => {
        exeFunc(confirmPopRemoveRef, 'openParams', AlertLabels.askDelete, item)
    }

    const onClickUpload = (event, item) => {
        commonContext.actions.onClickUploadFile(
            document.querySelector('#JudgeWriteUploadInput' + item.key),
            res => {
                const _list = deepCopyByRecursion(list);
                const target = _list.find(e => e.key === item.key);

                target.fileId = res.fileId;
                target.imgUrl = res.imgUrl;

                setList(_list);
            },
            alertPopRef,
            {limitSizeOpt: FileUploadSizeOpt.DEFAULT, acceptExtOpt: FileUploadExtOpt.IMAGE}
        );
    }

    const onClickRemoveImage = (item) => {
        const _list = deepCopyByRecursion(list);
        const target = _list.find(e => e.key === item.key);

        target.fileId = '';
        target.imgUrl = '';

        setList(_list);
    }

    const onClickAdd = () => {
        if (list.length > 0) {
            if (list.length >= 10) {
                exeFunc(alertPopRef, 'open', '등록 가능한 인원수를 초과하였습니다.');
                return
            }
        }
        const emptyItem = {
            crrCon: '',
            fileId: '',
            imgUrl: '',
            rprsCrofId: '',
            rprsCrofJbcl: '',
            rprsCrofNm: '',
            utlinsttId: '',

            key: createKey()
        }
        const _list = deepCopyByRecursion(list);
        _list.push(emptyItem);
        setList(_list);
    }

    const onConfirmRemove = (item) => {
        setList(list.filter(e => e.key !== item.key));
    }

    /** Validation */
    const validateIsEmpty = (showAlert = true) => {
            let r = false
            for (let i = 0; i < list.length; i++) {
                const item = list[i]
                // const isEmpty = ValidateUtils.isListItemEmpty(item, ['rprsCrofJbcl', 'rprsCrofNm', 'crrCon'])
                const isEmpty = ValidateUtils.isListItemEmpty(item, ['rprsCrofNm'])
                if (isEmpty) {
                    r = true
                    break
                }
            }
            return r
        }

    /** Cancel Button */
    const onClickCancel = async () => {
        history.replace(ROUTER_NAMES.MY_PAGE_INVESTOR_INFO)
    }

    /** Save Button */
    const onClickSave = async () => {
        if (validateIsEmpty()) {
            exeFunc(alertPopRef, 'open', '대표심사역 이름을 입력해주세요.');
            return
        }
        exeFunc(confirmPopRef, 'open', '저장 하시겠습니까?')
    }

    /** pop ref confirm */

    const onConfirmSave = async () => {
        await commonContext.actions.callbackAfterSessionRefresh(save, true, true);
        // await save()
    }

    const save = async () => {
        let isSaveComplete = true
        const saveRes = await CommonAxios(getPostConfig(Api.my.vc.memberSave, list))
        if (saveRes && saveRes.status === 200) {
            if (saveRes.data.hasOwnProperty('code') && saveRes.data.code !== '200') {
                isSaveComplete = false
            }
        } else {
            isSaveComplete = false
        }
        if (isSaveComplete) {
            exeFunc(checkCloseAlertPopupRef, 'open', AlertLabels.saved) // '저장되었습니다.'
        } else {
            exeFunc(alertPopRef, 'open', AlertLabels.notSaved) // '저장되지 않았습니다. 관리자에게 문의하세요'
        }
    }

    const isMounted = useRef(false);

    useEffect(() => {
        if(commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
            isMounted.current = true;

            commonContext.actions.pageMountPathCheck(history, async () => {
                const memberList = await ResponseUtils.getList(Api.my.vc.memberList, null, 'list', false);
                setList(memberList.map(item => {
                    return {...item, key: createKey()};
                }));
            });
        }
    }, [commonContext.state.user]);

    useEffect(() => {
        return () => isMounted.current = false;
    }, []);

    return (
        <>
            <Header/>
            <div className="page_container">
                <div className="wrap mypage_wrap info_wrap write investor bg02">
                    <div className="gallery_logo_wrap">
                        <Gallery01 data={galleryData}/>
                        <ProfileImage/>
                    </div>
                    <BreadCrumbs {...props} />
                    <div className="container default_size02">
                        <div className="section section03">
                            <div className="section_header">
                                <h3 className="section_title">대표심사역</h3>
                                <div className="btn_group">
                                    <Button onClick={onClickCancel}>취소</Button>
                                    <Button className={'blue'} onClick={onClickSave}>
                                        저장
                                    </Button>
                                </div>
                            </div>
                            <div className="judge_list_wrap">
                                <ul className="judge_list">
                                    {
                                        list?.map((item, index) => (
                                            <li className="judge_item" key={item.key}>
                                                <div className={'carditem06 write'} css={cardItem06Style}>
                                                    <button className="btn_card_delete" onClick={() => onClickRemoveItem(item)}>
                                                        <span className="hide">인력카드삭제</span>
                                                    </button>
                                                    {
                                                        StringUtils.hasLength(item?.imgUrl)
                                                            ? <div className="img_wrap img_cover">
                                                                <input
                                                                    type="file"
                                                                    title='대표심사역이미지'
                                                                    name="file"
                                                                    multiple={false}
                                                                    id={'JudgeWriteUploadInput' + item.key}
                                                                    accept={FileUploadExtOpt.IMAGE.str}
                                                                    style={{display: 'none'}}
                                                                />
                                                                <div className="edit_group">
                                                                    <button className="btn_edit" onClick={(event) => onClickUpload(event, item)}>
                                                                        <span className="hide">편집</span>
                                                                    </button>
                                                                    <button className="btn_delete" onClick={() => onClickRemoveImage(item)}>
                                                                        <span className="hide">삭제</span>
                                                                    </button>
                                                                </div>
                                                                <img src={item.imgUrl} alt=""/>
                                                            </div>

                                                            : <div className="img_wrap no_image">
                                                                <div className="upload_wrap">
                                                                    <input
                                                                        type="file"
                                                                        title='대표심사역이미지'
                                                                        name="file"
                                                                        multiple={false}
                                                                        id={'JudgeWriteUploadInput' + item.key}
                                                                        accept={FileUploadExtOpt.IMAGE.str}
                                                                        style={{display: 'none'}}
                                                                    />
                                                                    <button className="btn_upload" onClick={(event) => onClickUpload(event, item)}>
                                                                        Upload
                                                                    </button>
                                                                </div>
                                                            </div>
                                                    }
                                                    <div className="content">
                                                        <div className="content_inner scroll_lightgrey">
                                                            <div className="inputs_wrap">
                                                                <p className="name">
                                                                    <input
                                                                        type="text"
                                                                        title='이름'
                                                                        id={'rprsCrofNm'}
                                                                        name={'rprsCrofNm'}
                                                                        defaultValue={item['rprsCrofNm']}
                                                                        placeholder={'이름'}
                                                                        className="input"
                                                                        onChange={(event) => onChangeInput(item.key, 'rprsCrofNm', event.target.value)}
                                                                    />
                                                                </p>
                                                                <p className="position">
                                                                    <input
                                                                        id={'rprsCrofJbcl'}
                                                                        title='심사역'
                                                                        type="text"
                                                                        name={'rprsCrofJbcl'}
                                                                        defaultValue={item['rprsCrofJbcl']}
                                                                        placeholder={'심사역'}
                                                                        className="input"
                                                                        onChange={(event) => onChangeInput(item.key, 'rprsCrofJbcl', event.target.value)}
                                                                    />
                                                                </p>
                                                            </div>
                                                            <p className="info">
                                                                <textarea
                                                                    id={'crrCon'}
                                                                    title='경력내용'
                                                                    name={'crrCon'}
                                                                    defaultValue={item['crrCon']}
                                                                    className="textarea scroll"
                                                                    placeholder={'경력을 입력해 주세요.'}
                                                                    maxLength={200}
                                                                    onChange={(event) => {
                                                                        event.target.value = StringUtils.cutStrByLimit(event.target.value, 200);
                                                                        onChangeInput(item.key, 'crrCon', event.target.value);
                                                                    }}
                                                                />
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))
                                    }
                                    <li className="judge_item card_add_wrap">
                                        <button className="btn_card_add" onClick={onClickAdd}>
                                            <span className="hide">인력 카드 추가</span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <Footer/>
                </div>
            </div>
            <ConfirmPopup ref={confirmPopRemoveRef} onConfirm={onConfirmRemove}/>
            <AlertPopup ref={alertPopRef}/>
            <ConfirmPopup ref={confirmPopRef} onConfirm={onConfirmSave}/>
            <CheckCloseCallBackAlertPopup ref={checkCloseAlertPopupRef}
                                          callBack={() => history.push(ROUTER_NAMES.MY_PAGE_INVESTOR_INFO)}/>
        </>
    )
}
export default JudgeWrite
