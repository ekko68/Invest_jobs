import React, {useEffect, useLayoutEffect, useState} from 'react'
import {deepCopyByRecursion} from "../fns/commonFn";
import CommonAxios from "../utils/CommonAxios";
import {getConfig, getPostConfig} from "../utils/CommonUtils";
import Api from "../consts/Api";
import {StringUtils} from "../utils/StringUtils";

const InvestContext = React.createContext({})
const { Provider } = InvestContext

//  board params
const boardParamData = {
  searchContent: '', // 제목
  searchUser: '', // 작성자
  page: 1
}

// invest user
const vcParamData = {
  page: 1,
  bplcNm: '', // 기업명
  utlinsttId: '', // 기업ID
  cnvsRqstSttsCdId: '' // 전환상태
}

// init invest code info
const initIvtCodeInfo = {
  isLoaded: false,

  categoryList: [],
  techList: [],
  regionList: [],

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
}

const InvestProvider = ({ children }) => {
  // board search
  const [boardParam, setBoardParam] = useState(boardParamData)

  // vc param
  const [vcParam, setVcParam] = useState(vcParamData)

  const [codeInfo, setCodeInfo] = useState({...initIvtCodeInfo});
  const [pagePath, setPagePath] = useState('');

  const [vcType, setVcType] = useState('');

  // ====== board handler
  const handleSetSearch = (props) => {
    setBoardParam({ ...props })
  }

  // ====== vc param handler
  const handleVcParam = (props) => {
    if (props) {
      setVcParam({
        ...vcParam,
        ...props
      })
    } else {
      setVcParam(vcParamData)
    }
  }

  const handlePagePath = (history) => {
    if(StringUtils.hasLength(history?.location?.pathname)) setPagePath(history.location.pathname);
  }

  const initialize = () => {
    setBoardParam(boardParamData)
  }

  /* 투자박스 코드 설정 */
  const loadCodeInfo = async () => {
    const res = await CommonAxios('IVT', getPostConfig(Api.invest.codeInfo));

    if(res?.data?.code === '200') {
      const temp = deepCopyByRecursion(codeInfo);
      temp.isLoaded = true;
      for(let key in res.data.data) if(res.data.data[key]?.length > 0) temp[key] = res.data.data[key];

      setCodeInfo(temp);
    }
  }

  useEffect(() => {
    if(pagePath?.startsWith('/invest') && !codeInfo.isLoaded) {
      loadCodeInfo();
    }
  }, [pagePath]);

  const value = {
    state: { boardParam, vcParam, codeInfo ,vcType },
    actions: { handleSetSearch, initialize, handleVcParam, handlePagePath, setVcType }
  }
  return <Provider value={value}>{children}</Provider>
}

export { InvestContext, InvestProvider }
