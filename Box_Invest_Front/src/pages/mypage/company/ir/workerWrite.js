/** @jsxImportSource @emotion/react */
import React, {useContext, useEffect, useLayoutEffect, useRef, useState} from 'react'
import {useHistory} from 'react-router-dom'

import {cardItem06Style} from 'assets/style/ComponentStyle'
import Header from 'components/header/Header'
import Footer from 'components/common/Footer'
import Gallery01 from 'components/common/Gallery01'
import BreadCrumbs from 'components/common/BreadCrumbs'
import Tab from 'components/common/Tab'
import Button from 'components/atomic/Button'
import {NextBtn, PrevBtn} from 'components/atomic/IconButton'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import CheckCloseAlertPopup from 'pageComponents/common/pop/CheckCloseAlertPopup'
import MoveTabConfirmPopup from 'pageComponents/common/pop/MoveTabConfirmPopup'
import ConfirmPopup from 'pageComponents/common/pop/ConfirmPopup'

import {exeFunc} from 'modules/utils/ReactUtils'
import ResponseUtils from 'modules/utils/ResponseUtils'
import Api from 'modules/consts/Api'
import CommonConst from 'modules/consts/CommonConst'
import CommonAxios from 'modules/utils/CommonAxios'
import {getPostConfig} from 'modules/utils/CommonAxios'
import {AlertLabels, FileUploadExtOpt, FileUploadSizeOpt} from 'modules/consts/BizConst'
import VoUtils from 'modules/utils/VoUtils'
import {CommonContext} from "modules/contexts/common/CommomContext";
import {StringUtils} from "modules/utils/StringUtils";
import {createKey, deepCopyByRecursion} from "modules/utils/CommonUtils";

const WorkerWrite = (props) => {

    const history = useHistory()
    const commonContext = useContext(CommonContext);

    const galleryData = {
        title: '마이페이지',
        img: '/images/gallery02_img1.png'
    }

    const [progress, setProgress] = useState(0)
    const [list, setList] = useState([])

    const [tabList, setTabList] = useState({
        active: ROUTER_NAMES.MY_PAGE_IR_WORKER_WRITE,
        list: CommonConst.IR_TAB_WRITE_LIST
    });

    const alertPopRef = useRef()
    const checkCloseAlertPopupRef = useRef()
    const moveTabConfirmRef = useRef()
    const moveTabEmptyConfirmRef = useRef()
    const confirmPopRef = useRef()

    const loadSetData = async () => {
        const resProgress = await loadProgress()
        setProgress(resProgress.progress)
        let resWorkerList = await ResponseUtils.getList(Api.my.company.irMemberList);
        VoUtils.setListVoNullToEmpty(resWorkerList, ['tmmbSqn']);

        resWorkerList = resWorkerList.map(item => {
            return {...item, key: createKey()};
        });
        setList(resWorkerList)
    }

    const loadProgress = async () => {
        const resProgress = await ResponseUtils.getSimpleResponse(Api.my.company.irProgress)
        return resProgress
    }

    const setWorkerListItem = (tmmbSqn, property, value) => {
        const _list = deepCopyByRecursion(list);
        _list.find(e => e.tmmbSqn === tmmbSqn)[property] = value;

        setList(_list);
    }

    const onClickAdd = () => {
        let tmmbSqn = 0
        if (list.length > 0) {
            const lastItem = list[list.length - 1]
            tmmbSqn = lastItem.tmmbSqn + 1
        }
        const newItem = {
            utlinsttId: '',
            tmmbSqn: tmmbSqn,
            tmmbNm: '',
            tmmbJbcl: '',
            crrCon: '',
            imgUrl: '',
            fileId: '',

            key: createKey()
        }

        const _list = list.slice(0, list.length);
        _list.push(newItem);
        setList(_list);
    }

    const onClickDelete = (event, item) => {
        const index = list.findIndex(e => e.tmmbSqn === item.tmmbSqn);

        if (index > -1) {
            const _list = deepCopyByRecursion(list);
            _list.splice(index, 1);
            setList(_list);
        }
    }

    const onClickUpload = (item) => {
        commonContext.actions.onClickUploadFile(
            document.querySelector('#IrWorkerCreateFileInput' + item.tmmbSqn),
            res => {
                const _list = deepCopyByRecursion(list);
                const target = _list.find(e => e.tmmbSqn === item.tmmbSqn);
                target.fileId = res.fileId;
                target.imgUrl = res.imgUrl;

                setList(_list);
            },
            alertPopRef,
            {limitSizeOpt: FileUploadSizeOpt.DEFAULT, acceptExtOpt: FileUploadExtOpt.IMAGE}
        );
    }

    const onClickRemoveImage = (item) => {
        // item.imgUrl = ''
        // setReload(!reload)

        const _list = deepCopyByRecursion(list);
        const target = _list.find(e => e.tmmbSqn === item.tmmbSqn);
        target.fileId = '';
        target.imgUrl = '';

        setList(_list);
    }

    /** Validation */

    const validateFirst = () => {
        if (list.length === 0) return false
        return true
    }

    const validateCompare = async () => {
        let r = true
        const resWorkerList = await ResponseUtils.getList(Api.my.company.irMemberList);
        VoUtils.setListVoNullToEmpty(resWorkerList, ['tmmbSqn'])

        const compareList = deepCopyByRecursion(list).map(item => {
            const {key, ...other} = item;
            return other;
        })

        if (JSON.stringify(resWorkerList) !== JSON.stringify(compareList)) {
            r = false
        }
        return r
    }


    /** Move */

    const onClickMove = async (url) => {
        await commonContext.actions.callbackAfterSessionRefresh(async () => {
            if ((await onBeforeTabMove(url)) === false) {
                return
            }
            history.replace(url)
        }, true, true);
    }

    const onBeforeTabMove = async (url) => {
        if (progress === 0) {
            if (validateFirst()) {
                exeFunc(moveTabConfirmRef, 'open', AlertLabels.notSaveMove, url);
                return false
            }
        } else if (progress > 0) {
            if ((await validateCompare()) === false) {
                exeFunc(moveTabConfirmRef, 'open', AlertLabels.askEditSaveBeforeCancel, url);
                return false
            }
        }
        // if (progress === 0) {
        //     exeFunc(moveTabConfirmRef, 'open', AlertLabels.notSaveMove, url);
        //     return false
        // } else if (progress > 0) {
        //     exeFunc(moveTabConfirmRef, 'open', AlertLabels.askEditSaveBeforeCancel, url);
        //     return false
        // }
        return true
    }

    /** Tab Move */

    const handleTabList = (url) => {
        onClickMove(url);
    }
    const onClickPrev = () => {
        onClickMove(ROUTER_NAMES.MY_PAGE_IR_HISTORY_WRITE);
    }

    const onClickNext = () => {
        onClickMove(ROUTER_NAMES.MY_PAGE_IR_STOCK_WRITE);
    }

    /** Cancel Button */

    const onClickCancel = () => {
        if (progress === 0) {
            onClickMove(ROUTER_NAMES.MY_PAGE_IR);
        } else if (progress > 0) {
            onClickMove(ROUTER_NAMES.MY_PAGE_IR_WORKER);
        }
    }

    /** Save Button */

    const onClickSave = () => {
        if (progress === 0) {
            if (list.length === 0) {
                exeFunc(alertPopRef, 'open', AlertLabels.noData);
                return
            }
        }
        exeFunc(confirmPopRef, 'open', AlertLabels.saveIt);
    }

    /** pop ref confirm */

    const onConfirmMoveTab = async (url) => {
        await commonContext.actions.callbackAfterSessionRefresh(async () => {
            if ((await saveBeforeTabMove()) === false) {
                return
            }
            setTimeout(() => {
                location.replace(url)
            }, 500)
        }, true, true);
    }

    const onCancelMoveTab = (url) => {
        location.replace(url)
    }
    const onConfirmMoveTabEmpty = async (url) => {
        location.replace(url)
    }

    const onConfirmSave = async () => {
        await commonContext.actions.callbackAfterSessionRefresh(save, true, true);
        // await save()
    }

    const save = async () => {
        let isSaveComplete = true
        const saveRes = await CommonAxios(getPostConfig(Api.my.company.irMemberSave, list))
        if (saveRes) {
            if (saveRes.status !== 200) {
                isSaveComplete = false
            }
        } else {
            isSaveComplete = false
        }

        if (isSaveComplete) {
            exeFunc(checkCloseAlertPopupRef, 'open', AlertLabels.saved);
            await loadSetData();

        } else {
            exeFunc(alertPopRef, 'open', AlertLabels.notSaved);
        }
    }

    const saveBeforeTabMove = async () => {
        let isSaveComplete = true
        const saveRes = await CommonAxios(getPostConfig(Api.my.company.irMemberSave, list))
        if (saveRes) {
            if (saveRes.status !== 200) {
                isSaveComplete = false
            }
        } else {
            isSaveComplete = false
        }
        if (isSaveComplete) {
            exeFunc(checkCloseAlertPopupRef, 'open', AlertLabels.saved);
        } else {
            exeFunc(alertPopRef, 'open', AlertLabels.notSaved);
        }
        return isSaveComplete
    }

    const isMounted = useRef(false);

    useEffect(() => {
        if(commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
            isMounted.current = true;
            commonContext.actions.pageMountPathCheck(history, loadSetData);
        }
    }, [commonContext.state.user]);

    useEffect(() => {
        return () => isMounted.current = false;
    }, []);

    return (
        <div className="layout">
            <Header/>
            <div className="page_container">
                <div className="wrap mypage_wrap ir_wrap bg02">
                    <div className="gallery_logo_wrap">
                        <Gallery01 data={galleryData}/>
                    </div>

                    <BreadCrumbs {...props} />

                    <div className="container default_size02">
                        {/*section start*/}
                        <div className="section section01">
                            <div className="section_header writing_wrap">
                                <h3 className="section_title">
                                    IR 작성<strong className="progress highlight_blue">&#40;{progress}%&#41;</strong>
                                </h3>
                                <p className="main_writing_title">* 표시항목은 주요 작성사항입니다.</p>
                            </div>
                            <div className="tab_header">
                                <Tab handleTabActive={handleTabList} data={tabList}/>
                                <div className="btn_group">
                                    <Button onClick={onClickCancel}>
                                        취소
                                    </Button>
                                    <Button className={'blue'} onClick={onClickSave}>
                                        저장
                                    </Button>
                                </div>
                            </div>
                            {/*ir_section_wrap start*/}
                            <div className="ir_section_wrap ">
                                <div className="ir_worker_write">
                                    <div className="section section01">
                                        <ul className="worder_list">
                                            {
                                                list?.map((item, index) => (
                                                    <li className="worker_item" key={item.key}>
                                                        {
                                                            index === 0 &&
                                                            <span className="essen_ico2">*</span>
                                                        }
                                                        <input
                                                            title='인력카드이미지'
                                                            type="file"
                                                            name="file"
                                                            multiple={false}
                                                            id={'IrWorkerCreateFileInput' + item.tmmbSqn}
                                                            accept={FileUploadExtOpt.IMAGE.str}
                                                            style={{display: 'none'}}
                                                        />
                                                        <div className={'carditem06 write'} css={cardItem06Style}>
                                                            <button className="btn_card_delete" onClick={(event) => onClickDelete(event, item)}>
                                                                <span className="hide">인력카드삭제</span>
                                                            </button>
                                                            {
                                                                StringUtils.hasLength(item.imgUrl)
                                                                    ? <div className="img_wrap img_cover">
                                                                        <div className="edit_group">
                                                                            <button className="btn_edit" onClick={(event) => onClickUpload(item)}>
                                                                                <span className="hide">편집</span>
                                                                            </button>
                                                                            <button className="btn_delete" onClick={(event) => onClickRemoveImage(item)}>
                                                                                <span className="hide">삭제</span>
                                                                            </button>
                                                                        </div>
                                                                        <img id={'IrWorkerCreateImage' + item.tmmbSqn} src={item.imgUrl} alt=""/>
                                                                    </div>

                                                                    : <div className="img_wrap no_image">
                                                                        <div className="upload_wrap">
                                                                            <button className="btn_upload" onClick={(event) => onClickUpload(item)}>
                                                                                Upload
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                            }
                                                            <div className="content">
                                                                <div className="content_inner scroll_lightgrey">
                                                                    <div className="inputs_wrap">
                                                                        <p className="position">
                                                                            <input
                                                                                title='직급'
                                                                                type="text"
                                                                                name={'position'}
                                                                                // value={inputs.position}
                                                                                defaultValue={item.tmmbJbcl}
                                                                                placeholder={'직급'}
                                                                                className="input"
                                                                                onChange={(event) => setWorkerListItem(item.tmmbSqn, 'tmmbJbcl', event.target.value)}
                                                                            />
                                                                        </p>
                                                                        <p className="name">
                                                                            <input
                                                                                title='이름'
                                                                                type="text"
                                                                                name={'name'}
                                                                                // value={inputs.name}
                                                                                defaultValue={item.tmmbNm}
                                                                                placeholder={'이름'}
                                                                                className="input"
                                                                                onChange={(event) => setWorkerListItem(item.tmmbSqn, 'tmmbNm', event.target.value)}
                                                                            />
                                                                        </p>
                                                                    </div>
                                                                    <p className="info">
                                                                        <textarea
                                                                            title='내용'
                                                                            name={'info'}
                                                                            // value={inputs.info}
                                                                            defaultValue={item.crrCon}
                                                                            className="textarea scroll"
                                                                            placeholder={'내용'}
                                                                            maxLength={200}
                                                                            onChange={event => {
                                                                                event.target.value = StringUtils.cutStrByLimit(event.target.value, 200);
                                                                                setWorkerListItem(item.tmmbSqn, 'crrCon', event.target.value);
                                                                            }}
                                                                        />
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))
                                            }
                                            <li className="worker_item card_add_wrap">
                                                <button className="btn_card_add" onClick={onClickAdd}>
                                                    <span className="hide">인력 카드 추가</span>
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="prev_next_wrap">
                                        <PrevBtn onClick={onClickPrev}/>
                                        <NextBtn onClick={onClickNext}/>
                                    </div>
                                </div>
                            </div>
                            {/*ir_section_wrap end*/}
                        </div>
                        {/*section end*/}
                    </div>
                </div>
                <Footer/>
            </div>
            <AlertPopup ref={alertPopRef}/>
            <CheckCloseAlertPopup ref={checkCloseAlertPopupRef}/>
            <MoveTabConfirmPopup
                ref={moveTabConfirmRef}
                // onConfirm={onConfirmMoveTab}
                onConfirm={onConfirmSave}
                onCancel={onCancelMoveTab}
            />
            <MoveTabConfirmPopup ref={moveTabEmptyConfirmRef} onConfirm={onConfirmMoveTabEmpty}/>
            <ConfirmPopup ref={confirmPopRef} onConfirm={onConfirmSave}/>
        </div>
    )
}
export default WorkerWrite
