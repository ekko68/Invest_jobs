import {RequestStatusLabels, NdaCodeLabels} from 'modules/consts/BizConst'
import { RequestStatusCodeLabels } from 'modules/consts/BizConst'
import ROUTER_NAMES from 'modules/consts/RouterConst'

const LabelUtils = {
  getBadgeStyle: (code) => {
    let className = 'status_complete'
    if (code === RequestStatusLabels.SUGGEST) className = 'status_approval'
    else if (code === RequestStatusLabels.REQUEST) className = 'status_standBy'
    else if (code === RequestStatusLabels.EVALUATE) className = 'status_evaluate'
    else if (code === RequestStatusLabels.COMPLETE) className = 'status_complete'
    else if (code === RequestStatusLabels.EXPIRED) className = 'status_cancel'
    else if (code === RequestStatusLabels.CANCEL) className = 'status_cancel'
    return className
  },

  getNdaBadgeStyle: (code) => {
    if(code === NdaCodeLabels.READY) return 'status_standBy';
    else if(code === NdaCodeLabels.APPROVAL) return 'status_complete';
    else if(code === NdaCodeLabels.CANCEL) return 'status_cancel';
    else return 'status_complete';
  }
}
// EXN00000 : '제안',
// EXN00001 : '요청',
// EXN00002 : '심사중',
// EXN00003 : '심사완료',
// EXN00004 : '기간만료',
// EXN00005 : '요청취소',

export default LabelUtils
