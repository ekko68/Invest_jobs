/** @jsxImportSource @emotion/react */
import React, {useContext, useEffect, useRef, useState} from 'react'
import {useHistory} from 'react-router-dom'

import Header from 'components/header/Header'
import Footer from 'components/common/Footer'
import Gallery01 from 'components/common/Gallery01'
import BreadCrumbs from 'components/common/BreadCrumbs'
import Button from 'components/atomic/Button'
import CardLayout from 'components/common/card/CardLayout'
import NoResult from "components/common/NoResult";

import ConfirmPopup from 'pageComponents/common/pop/ConfirmPopup'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import ProfileImage from "pageComponents/mypage/common/ProfileImage";

import ROUTER_NAMES from 'modules/consts/RouterConst'
import ResponseUtils from 'modules/utils/ResponseUtils'
import Api from 'modules/consts/Api'
import {exeFunc} from 'modules/utils/ReactUtils'
import ValidateUtils from 'modules/utils/ValidateUtils'
import {AlertLabels, FileUploadExtOpt, FileUploadSizeOpt, UsisType} from 'modules/consts/BizConst'
import CommonAxios from 'modules/utils/CommonAxios'
import {getPostConfig} from 'modules/utils/CommonAxios'
import FormUtils from 'modules/utils/FormUtils'
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey, deepCopyByRecursion} from "modules/utils/CommonUtils";
import CheckCloseCallBackAlertPopup from "pageComponents/common/pop/CheckCloseCallBackAlertPopup";

const TeamInfo = (props) => {
    const history = useHistory()
    const commonContext = useContext(CommonContext);

    const galleryData = {
        title: '마이페이지',
        img: '/images/gallery02_img1.png'
    }

    const [list, setList] = useState([])

    const confirmPopRef = useRef();
    const alertPopRef = useRef();
    const checkCloseAlertPopupRef = useRef();

    const onClickUpload = (item) => {
        commonContext.actions.onClickUploadFile(
            document.querySelector('#MemberFileInput' + item.key),
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

    const onClickRemoveFile = (item) => {
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
        const createItem = {
            utlinsttId: '',
            tmmbId: '',
            tmmbNm: '',
            tmmbJbcl: '',
            crrCon: '',
            fileId: '',
            imgUrl: '',

            key: createKey()
        }
        const temp = [...list]
        temp.push(createItem)
        setList(temp)
    }

    const onClickRemoveItem = (item) => {
        setList(list.filter(element => element.key !== item.key));
    }

    const onChangeInput = (key, property, value) => {
        const _list = deepCopyByRecursion(list);
        _list.find(e => e.key === key)[property] = value;

        setList(_list);
    }

    /** Validation */

    const validateIsEmpty = (showAlert = true) => {
            // let r = ValidateUtils.hasListItemEmpty(list, ['tmmbNm', 'tmmbJbcl', 'crrCon'])
            let r = ValidateUtils.hasListItemEmpty(list, ['tmmbNm'])
            if (r) {
                if (showAlert) {
                    exeFunc(alertPopRef, 'open', '팀원명을 입력해주세요.');
                }
            } else {
                r = false
            }
            return r
        }

    /** Cancel Button */

    const onClickCancel = () => {
        history.replace(ROUTER_NAMES.MY_PAGE_COMPANY_INFO);
    }

    /** Save Button */

    const onClickSave = async () => {
        await commonContext.actions.callbackAfterSessionRefresh(async () => {
            if (validateIsEmpty()) {
                return
            }
            exeFunc(confirmPopRef, 'open', AlertLabels.saveIt);
        }, true, true);
    }

    /** pop ref confirm */

    const onConfirmSave = async () => {
        // await save()
        await commonContext.actions.callbackAfterSessionRefresh(save, true, true);
    }

    const save = async () => {
        let isSaveComplete = true
        const saveRes = await CommonAxios(getPostConfig(Api.my.company.memberSave, list), false)
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
    }


    const isMounted = useRef(false);

    useEffect(() => {
        if(commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
            isMounted.current = true;
            commonContext.actions.pageMountPathCheck(history,async () => {
                const memberList = await ResponseUtils.getList(Api.my.company.memberList, null);
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
                <div className="wrap mypage_wrap info_wrap write company bg02">
                    <div className="gallery_logo_wrap">
                        <Gallery01 data={galleryData}/>
                        <ProfileImage/>
                    </div>

                    <BreadCrumbs {...props} />

                    <div className="container default_size02">
                        {/*section02 start*/}
                        <div className="section section04">
                            <div className="section_header">
                                <h3 className="section_title">팀원정보</h3>
                                <div className="btn_group">
                                    <Button onClick={onClickCancel}>취소</Button>
                                    <Button className={'blue'} onClick={onClickSave}>
                                        저장
                                    </Button>
                                </div>
                            </div>
                            <CardLayout>
                                <div className="prod_info_wrap">
                                    <div className="card_header">
                                        <h3 className="ico_title title">팀원</h3>
                                        <Button type={'dashed'} className={'btn_add'} onClick={onClickAdd}>
                                            <span className="ico_plus">입력내용추가</span>
                                        </Button>
                                    </div>
                                    <div className="team_content">
                                        <div className="team_inner hope">
                                            <div className="info_table ">
                                                <table className="table type03">
                                                    <caption>팀원 정보 수정 테이블</caption>
                                                    <colgroup>
                                                        <col width={'3%'}/>
                                                        <col width={'12%'}/>
                                                        <col width={'25%'}/>
                                                        <col width={'60%'}/>
                                                    </colgroup>
                                                    <thead>
                                                    <tr>
                                                        <th>No</th>
                                                        <th>이름</th>
                                                        <th>직급</th>
                                                        <th>경력</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        (list?.length > 0)
                                                            ? list.map((item, index) =>
                                                                // <TeamMember item={item} index={index} key={`TeamMember_${index}`}/>
                                                                <tr key={item.key}>
                                                                    <td className="number">{index + 1}</td>
                                                                    <td className="name">
                                                                        <div className="name_wrap">
                                                                            <input
                                                                                type="file"
                                                                                name="file"
                                                                                title='팀원이미지파일'
                                                                                multiple={false}
                                                                                id={'MemberFileInput' + item.key}
                                                                                accept={FileUploadExtOpt.IMAGE.str}
                                                                                style={{display: 'none'}}
                                                                            />


                                                                            {item.imgUrl ? (
                                                                                <div className="img_wrap img_cover">
                                                                                    <div className="edit_group">
                                                                                        <button className="btn_edit" onClick={() => onClickUpload(item)}>
                                                                                            <span className="hide">편집</span>
                                                                                        </button>
                                                                                        <button className="btn_delete" onClick={() => onClickRemoveFile(item)}>
                                                                                            <span className="hide">삭제</span>
                                                                                        </button>
                                                                                    </div>
                                                                                    <img src={item.imgUrl} alt="팀원정보"/>
                                                                                </div>
                                                                            ) : (
                                                                                <div className="img_wrap">
                                                                                    <div className="upload_wrap">
                                                                                        <button className="btn_upload" onClick={() => onClickUpload(item)}>
                                                                                            &nbsp;
                                                                                        </button>
                                                                                    </div>
                                                                                    <div className="img_wrap">&nbsp;</div>
                                                                                    <p className="name">&nbsp;</p>
                                                                                </div>
                                                                            )}


                                                                            <div className="text">
                                                                                <input
                                                                                    type="text"
                                                                                    title='팀원명'
                                                                                    id={'tmmbNm'}
                                                                                    className={'input'}
                                                                                    defaultValue={item.tmmbNm}
                                                                                    onChange={(event) => onChangeInput(item.key, 'tmmbNm', event.target.value)}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="rank">
                                                                        <div className="rank_wrap">
                                                                            <input
                                                                                type="text"
                                                                                title='직급'
                                                                                id={'tmmbJbcl'}
                                                                                className={'input'}
                                                                                defaultValue={item.tmmbJbcl}
                                                                                onChange={(event) => onChangeInput(item.key, 'tmmbJbcl', event.target.value)}
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                    <td className="career">
                                                                        <div className="career_wrap">
                                                                            <input
                                                                                type="text"
                                                                                title='경력'
                                                                                id={'crrCon'}
                                                                                className={'input'}
                                                                                defaultValue={item.crrCon}
                                                                                onChange={(event) => onChangeInput(item.key, 'crrCon', event.target.value)}
                                                                            />
                                                                            <button className={'btn_row_delete btn_minus'} onClick={() => onClickRemoveItem(item)}>
                                                                                <span className="hide">삭제</span>
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )
                                                            : <tr>
                                                                <td colSpan={4}><NoResult msg={'등록된 팀원 정보가 없습니다.'}/></td>
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
            <ConfirmPopup ref={confirmPopRef} onConfirm={onConfirmSave}/>
            <AlertPopup ref={alertPopRef}/>
            <CheckCloseCallBackAlertPopup ref={checkCloseAlertPopupRef}
                                          callBack={() => history.push(ROUTER_NAMES.MY_PAGE_COMPANY_INFO)}/>
        </>
    )
}
export default TeamInfo
