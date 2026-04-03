import React, {useEffect, useState} from 'react';
import Api from "modules/consts/Api";
import {deepCopyByRecursion} from "modules/utils/CommonUtils";
import CommonAxios, {getPostConfig} from "modules/utils/CommonAxios";

const CodeContext = React.createContext({
    state: {},
    actions: {}
});

const {Provider} = CodeContext;

const CodeContextProvider = ({children}) => {

    const initIvtCodeInfo = {
        isLoaded: false,

        categoryList: [],
        techList: [],
        regionList: [],
        prmrInvmTpbsList: [],

        companyTypeList: [],
        companyShapeList: [],
        vcTypeList: [],

        investStepList: [],
        investAmountList: [],

        consultingTypeList: [],
        consultingStepList: [],

        messageTypeList: [],

        irDomesticList: [],
        irIpStatusList: [],
        irIndexList: [],

        qaStatusList: [],
        qaTypeList: [],

        vcConvertStatusList: [],

        auditStepTypeList: [],
        auditResultTypeList: []
    }

    const [ivtCodeInfo, setIvtCodeInfo] = useState({...initIvtCodeInfo});

    const actions = {
        getCategoryList: () => { return deepCopyByRecursion(ivtCodeInfo.categoryList); },
        getTechList: () => { return deepCopyByRecursion(ivtCodeInfo.techList); },
        getRegionList: () => { return deepCopyByRecursion(ivtCodeInfo.regionList); },
        getPrmrInvmTpbsList: () => { return deepCopyByRecursion(ivtCodeInfo.prmrInvmTpbsList);},
 
        getCompanyTypeList: () => { return deepCopyByRecursion(ivtCodeInfo.companyTypeList); },
        getCompanyShapeList: () => { return deepCopyByRecursion(ivtCodeInfo.companyShapeList); },
        getVcTypeList: () => { return deepCopyByRecursion(ivtCodeInfo.vcTypeList); },

        getInvestStepList: () => { return deepCopyByRecursion(ivtCodeInfo.investStepList); },
        getInvestAmountList: () => { return deepCopyByRecursion(ivtCodeInfo.investAmountList); },

        getConsultingTypeList: () => { return deepCopyByRecursion(ivtCodeInfo.consultingTypeList); },
        getConsultingStepList: () => { return deepCopyByRecursion(ivtCodeInfo.consultingStepList); },

        getMessageTypeList: () => { return deepCopyByRecursion(ivtCodeInfo.messageTypeList); },

        getIrDomesticList: () => { return deepCopyByRecursion(ivtCodeInfo.irDomesticList); },
        getIrIpStatusList: () => { return deepCopyByRecursion(ivtCodeInfo.irIpStatusList); },
        getIrIndexList: () => { return deepCopyByRecursion(ivtCodeInfo.irIndexList); },

        getQaStatusList: () => { return deepCopyByRecursion(ivtCodeInfo.qaStatusList); },
        getQaTypeList: () => { return deepCopyByRecursion(ivtCodeInfo.qaTypeList); },

        getVcConvertStatusList: () => { return deepCopyByRecursion(ivtCodeInfo.vcConvertStatusList); },

        getAuditStepTypeList: () => { return deepCopyByRecursion(ivtCodeInfo.auditStepTypeList); },
        getAuditResultTypeList: () => { return deepCopyByRecursion(ivtCodeInfo.auditResultTypeList); },
    }

    const loadIvtCodeInfo = async () => {
        const res = await CommonAxios(getPostConfig(Api.common.codeAll));
        if(res?.data?.code == '200') {
            const temp = deepCopyByRecursion(ivtCodeInfo);
            const resData = res.data.data;

            for(let key in resData) if(resData[key]?.length > 0) temp[key] = resData[key];

            temp.isLoaded = true;
            setIvtCodeInfo(temp);
        }
    }

    useEffect(() => {
        console.log('code context load!!');
        loadIvtCodeInfo();
    }, []);

    const contextValue = {
        state: { isLoaded: ivtCodeInfo.isLoaded },
        actions: actions
    }

    return <Provider value={contextValue}>{children}</Provider>
}

export {CodeContext, CodeContextProvider}