import React, {useContext, useEffect, useRef, useState} from 'react';
import {useHistory} from "react-router-dom";

import Header from "components/header/Header";
import Footer from "components/common/Footer";
import Gallery01 from "components/common/Gallery01";
import BreadCrumbs from "components/common/BreadCrumbs";

import ProfileImage from "pageComponents/mypage/common/ProfileImage";
import MessageList from "pageComponents/mypage/common/message/MessageList";

import {CommonContext} from "modules/contexts/common/CommomContext";
import {setPromiseFunc} from "modules/utils/ReactUtils";
import {createKey} from "modules/utils/CommonUtils";
import ROUTER_NAMES from "modules/consts/RouterConst";
import Api from "modules/consts/Api";

const ReceiveMessage = (props) => {

    const history = useHistory();
    const commonContext = useContext(CommonContext);

    const galleryData = {
        title: '마이페이지',
        img: '/images/gallery02_img1.png'
    }

    const [tabList, setTabList] = useState({
        active: 'receive',
        list: [
            {id: 'receive', label: '받은 메시지', count: '0', router: ROUTER_NAMES.MY_PAGE_COMPANY_MESSAGE_RECEIVE_VIEW},
            {id: 'send', label: '보낸 메시지', count: '0', router: ROUTER_NAMES.MY_PAGE_COMPANY_MESSAGE_SEND_VIEW}
        ]
    });

    const messageListRef = useRef();
    const isMounted = useRef(false);

    useEffect(() => {
        if(commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
            isMounted.current = true;

            commonContext.actions.pageMountPathCheck(history, async () => {
                await setPromiseFunc(messageListRef, 'setData');
            });
        }
    }, [commonContext.state.user]);

    useEffect(() => {
        return () => isMounted.current = false;
    }, []);

    const listProps = {
        tableTitle: '받은메시지함', // 받은메시지함
        listType: 'receive',
        apiProps: {
            loadListApi: Api.my.company.messageReceiveList,
            readAllApi: Api.my.company.messageReadAll + '/receive',

            detailApi: Api.my.company.messageDetail,
            replyApi: Api.my.company.messageReply
        },
        pagePropsParam: {
            record: 10,
            pageSize: 5
        }
    };

    return (
        <>
            <Header/>
            <div className="page_container">
                <div className="wrap mypage_wrap msg_list_wrap mypage_common bg02">
                    <div className="gallery_logo_wrap">
                        <Gallery01 data={galleryData}/>
                        <ProfileImage/>
                    </div>
                    <BreadCrumbs {...props} />
                    <div className="container default_size02">
                        <div className="section section01">
                            <div className="section_header">
                                <div className="tab_wrap">
                                    {
                                        tabList.list?.map((item, idx) => (
                                            <button
                                                className={`btn_tab ${tabList.active === item.id ? 'active' : ''}`}
                                                key={createKey()}
                                                onClick={() => history.push(item.router)}>
                                                <span className="text">{item.label}</span>
                                            </button>
                                        ))
                                    }
                                </div>
                            </div>

                            <MessageList ref={messageListRef} {...props} {...listProps} />
                        </div>
                    </div>
                    <Footer/>
                </div>
            </div>
        </>
    )
}

export default ReceiveMessage;