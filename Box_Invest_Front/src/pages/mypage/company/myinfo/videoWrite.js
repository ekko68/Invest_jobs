/** @jsxImportSource @emotion/react */
import React, {useEffect, useState, useRef, useContext} from 'react'
import {useHistory} from 'react-router-dom'

import Header from 'components/header/Header'
import Footer from 'components/common/Footer'
import Gallery01 from 'components/common/Gallery01'
import BreadCrumbs from 'components/common/BreadCrumbs'
import Button from 'components/atomic/Button'
import CardLayout from 'components/common/card/CardLayout'
import ResponseUtils from 'modules/utils/ResponseUtils'
import Api from 'modules/consts/Api'

import ConfirmPopup from 'pageComponents/common/pop/ConfirmPopup'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import ProfileImage from "pageComponents/mypage/common/ProfileImage";
import CheckCloseCallBackAlertPopup from "pageComponents/common/pop/CheckCloseCallBackAlertPopup";

import FormUtils from 'modules/utils/FormUtils'
import {AlertLabels} from 'modules/consts/BizConst'
import ValidateUtils from 'modules/utils/ValidateUtils'
import CommonAxios from 'modules/utils/CommonAxios'
import {getPostConfig} from 'modules/utils/CommonAxios'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import {exeFunc} from "modules/utils/ReactUtils";
import {RegexConst} from "modules/consts/Regex";
import NoResult from "components/common/NoResult";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey} from "modules/utils/CommonUtils";
import {isNumber} from "modules/utils/NumberUtils";

const VideoWrite = (props) => {

    const history = useHistory()
    const commonContext = useContext(CommonContext);

    const galleryData = {
        title: '마이페이지',
        img: '/images/gallery02_img1.png'
    }

    const [list, setList] = useState([]);
    const listLengthCheckRef = useRef(0);

    const alertPopRef = useRef()
    const confirmPopRef = useRef()
    const checkCloseAlertPopupRef = useRef()


    const onChangeInput = (event, item) => {
        FormUtils.setVoInput(item, event.target.id, event.target.value)
    }

    const onClickRemove = (item) => {
        setList(list.filter(e => e.tempSqn !== item.tempSqn));
    }

    const onClickAdd = () => {
        let tempSqn = 0;
        if(listLengthCheckRef.current >= 5) {
            exeFunc(alertPopRef, 'open', '등록 가능한 수를 초과하였습니다.');
            return;
        }

        if (list.length > 0) tempSqn = list[list.length - 1].tempSqn + 1;

        const createItem = {
            tempSqn: tempSqn,
            inrdPictTtl: '',
            inrdPictUrl: '',
            utlinsttId: ''
        }
        const temp = [...list]
        temp.push(createItem)

        listLengthCheckRef.current += 1;
        setList(temp)
    }

    /** Validation */

    const validateIsEmpty = (showAlert = true) => {
            let r = ValidateUtils.hasListItemEmpty(list, ['inrdPictTtl', 'inrdPictUrl'])
            if (r) {
                if (showAlert) {
                    exeFunc(alertPopRef, 'open', AlertLabels.emptyValueInData);
                }
            } else {
                r = false
            }
            return r
        }

    const validationLink = (showAlert = true) => {
        if (list && list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                if (item.hasOwnProperty('inrdPictUrl') && String(item.inrdPictUrl).trim() !== '' && String(item.inrdPictUrl).search(RegexConst.URL_CHECK_REGEX) === -1) {
                    if (showAlert) {
                        exeFunc(alertPopRef, 'open', '동영상 URL을 확인해주세요');
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /** Cancel Button */

    const onClickCancel = async () => {
        history.replace(ROUTER_NAMES.MY_PAGE_COMPANY_INFO);
    }

    /** Save Button */

    const onClickSave = async () => {
        await commonContext.actions.callbackAfterSessionRefresh(async () => {
            if (validateIsEmpty()) {
                return;
            }
            if (validationLink()) {
                return;
            }
            exeFunc(confirmPopRef, 'open', AlertLabels.saveIt);
        }, true, true);
    }

    /** pop ref confirm */

    const onConfirmSave = async () => {
        await commonContext.actions.callbackAfterSessionRefresh(save, true, true);
        // await save()
    }
    const save = async () => {
        let isSaveComplete = true
        const saveRes = await CommonAxios(getPostConfig(Api.my.company.introMediaSave, list), false)
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
            exeFunc(alertPopRef, 'open', AlertLabels.askAdmin);
        }
    }

    const loadVideoList = async () => {
        const list = await ResponseUtils.getList(Api.my.company.introMediaList, null, 'list', false)
        if (list) list.forEach((e, i) => e.tempSqn = i + 1);
        return list
    }

    const isMounted = useRef(false);

    useEffect(() => {
        listLengthCheckRef.current = isNumber(list.length) ? list.length : 0;
    }, [list]);

    useEffect(() => {
        if(commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
            isMounted.current = true;

            commonContext.actions.pageMountPathCheck(history, async () => {
                const introMediaList = await loadVideoList();
                setList(introMediaList);
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
                <div className="wrap mypage_wrap info_wrap write company bg02">
                    <div className="gallery_logo_wrap">
                        <Gallery01 data={galleryData}/>
                        <ProfileImage/>
                    </div>

                    <BreadCrumbs {...props} />

                    <div className="container default_size02">
                        {/*section02 start*/}
                        <div className="section section03">
                            <div className="section_header">
                                <h3 className="section_title">소개영상</h3>
                                <div className="btn_group">
                                    <Button onClick={onClickCancel}>취소</Button>
                                    <Button className={'blue'} onClick={onClickSave}>
                                        저장
                                    </Button>
                                </div>
                            </div>
                            <CardLayout>
                                <div className="video_info_wrap">
                                    <div className="card_header">
                                        <h3 className="ico_title title">영상</h3>
                                        <Button type={'dashed'} className={'btn_add'} onClick={onClickAdd}>
                                            <span className="ico_plus">소개영상추가</span>
                                        </Button>
                                    </div>
                                    <div className="prod_content">
                                        <div className="prod_inner hope">
                                            <div className="info_table ">
                                                <table className="table type03">
                                                    <caption>소개영상 정보 수정 테이블</caption>
                                                    <colgroup>
                                                        <col width={'12%'}/>
                                                        <col width={'38%'}/>
                                                        <col width={'12%'}/>
                                                        <col width={'38%'}/>
                                                    </colgroup>
                                                    <tbody>
                                                    {
                                                        list?.length > 0
                                                            // ? list?.map((item, i) => <VideoItem item={item} index={i} key={`company_video_${i}`}/>)
                                                            ? list.map((item, index) => (
                                                                <tr key={createKey()}>
                                                                    <th>영상제목</th>
                                                                    <td>
                                                                        <p className="input_wrap">
                                                                            <input
                                                                                type="text"
                                                                                title='영상제목'
                                                                                id={'inrdPictTtl'}
                                                                                className="input"
                                                                                defaultValue={item['inrdPictTtl']}
                                                                                onChange={(event) => onChangeInput(event, item)}
                                                                            />
                                                                        </p>
                                                                    </td>
                                                                    <th>영상링크</th>
                                                                    <td>
                                                                        <p className="input_btn_wrap">
                                                                            <input
                                                                                type="text"
                                                                                title='영상링크'
                                                                                id={'inrdPictUrl'}
                                                                                className="input"
                                                                                defaultValue={item['inrdPictUrl']}
                                                                                onChange={(event) => onChangeInput(event, item)}
                                                                            />
                                                                            <button className="btn_delete btn_minus" onClick={() => onClickRemove(item)}>
                                                                                <span className="hide">삭제</span>
                                                                            </button>
                                                                        </p>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                            : <tr>
                                                                <td colSpan={4}><NoResult msg={'등록된 소개영상 정보가 없습니다.'}/></td>
                                                            </tr>
                                                    }
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
            <CheckCloseCallBackAlertPopup ref={checkCloseAlertPopupRef}
                                          callBack={() => history.push(ROUTER_NAMES.MY_PAGE_COMPANY_INFO)}/>
            <ConfirmPopup ref={confirmPopRef} onConfirm={onConfirmSave}/>
        </>
    )
}
export default VideoWrite
