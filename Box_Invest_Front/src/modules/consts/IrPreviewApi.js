import Api from "./Api";

const IrPreviewApi = {

    vcAudit: {
        basic : Api.vc.auditIrPreview + '?tabType=BASIC',
        history : Api.vc.auditIrPreview + '?tabType=HISTORY',
        worker : Api.vc.auditIrPreview + '?tabType=MEMBER',
        stock : Api.vc.auditIrPreview + '?tabType=STOCKHOLDER',
        finance : Api.vc.auditIrPreview + '?tabType=FINANCE',
        extra : Api.vc.auditIrPreview + '?tabType=EXTRA',
        plan : Api.vc.auditIrPreview + '?tabType=PLAN',
    },

    myCompanyAudit: {
        basic : Api.my.company.auditIrPreview + '?tabType=BASIC',
        history : Api.my.company.auditIrPreview + '?tabType=HISTORY',
        worker : Api.my.company.auditIrPreview + '?tabType=MEMBER',
        stock : Api.my.company.auditIrPreview + '?tabType=STOCKHOLDER',
        finance : Api.my.company.auditIrPreview + '?tabType=FINANCE',
        extra : Api.my.company.auditIrPreview + '?tabType=EXTRA',
        plan : Api.my.company.auditIrPreview + '?tabType=PLAN',
    },

    myVcAudit: (invmExntRqstId) => {
        return {
            basic : Api.my.vc.auditIrPreview + '?invmExntRqstId=' + invmExntRqstId + '&tabType=BASIC',
            history : Api.my.vc.auditIrPreview + '?invmExntRqstId=' + invmExntRqstId + '&tabType=HISTORY',
            worker : Api.my.vc.auditIrPreview + '?invmExntRqstId=' + invmExntRqstId + '&tabType=MEMBER',
            stock : Api.my.vc.auditIrPreview + '?invmExntRqstId=' + invmExntRqstId + '&tabType=STOCKHOLDER',
            finance : Api.my.vc.auditIrPreview + '?invmExntRqstId=' + invmExntRqstId + '&tabType=FINANCE',
            extra : Api.my.vc.auditIrPreview + '?invmExntRqstId=' + invmExntRqstId + '&tabType=EXTRA',
            plan : Api.my.vc.auditIrPreview + '?invmExntRqstId=' + invmExntRqstId + '&tabType=PLAN',
        }
    },
}

export default IrPreviewApi;