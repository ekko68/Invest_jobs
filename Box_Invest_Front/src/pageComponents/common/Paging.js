import {forwardRef, useImperativeHandle, useState} from 'react'
import {pagination01Style} from 'assets/style/ComponentStyle'
import {createKey} from "modules/utils/CommonUtils";

const Paging = forwardRef((props, ref) => {
    const {onChangePage, onPrev, onNext, paginationClass} = props
    const [pagingInfo, setPagingInfo] = useState({
        startPage: 1,
        endPage: 1,
        page: 1,
        // total: 1,
        total: 0,
        totalPage: 1,
        record: 5,
        prev: false,
        next: false
    });
    const [readyMount, setReadyMount] = useState(false);
    useImperativeHandle(ref, () => ({
        setPaging,
        getPaging
    }))
    const setPaging = (currentPagingInfo) => {
        setPagingInfo({
            startPage: currentPagingInfo.startPage,
            endPage: currentPagingInfo.endPage,
            page: currentPagingInfo.page,
            total: currentPagingInfo.total,
            totalPage: currentPagingInfo.totalPage,
            record: currentPagingInfo.record,
            prev: currentPagingInfo.prev,
            next: currentPagingInfo.next
        });
        if(!readyMount) setReadyMount(true);
    }
    const getPaging = () => {
        return pagingInfo
    }
    const onClickChangePage = (paramPage) => {
        if (onChangePage) {
            onChangePage(paramPage)
        }
    }
    const onClickPrev = () => {
        if (pagingInfo.prev === false) return
        if (onPrev) {
            if (pagingInfo.startPage > 1) {
                onPrev(pagingInfo.startPage - 1)
            }
        }
    }
    const onClickNext = () => {
        if (pagingInfo.next === false) return
        if (onNext) {
            if (pagingInfo.endPage < pagingInfo.totalPage) {
                onNext(pagingInfo.endPage + 1)
            }
        }
    }

    const getPaginationClass = () => {
        if (paginationClass !== null && paginationClass !== undefined && paginationClass !== '') {
            return paginationClass;
        }
        return 'pagination01';
    }

    const renderPaging = () => {
        let r = []
        for (let i = pagingInfo.startPage; i <= pagingInfo.endPage; i++) {
            let btn = null
            const key = createKey();
            if (i === pagingInfo.page) {
                btn = (
                    <button className="active" key={key}>
                        {i}
                    </button>
                )
            } else {
                btn = (
                    <button key={key} onClick={() => onClickChangePage(i)}>
                        {i}
                    </button>
                )
            }
            r.push(btn)
        }
        return r
    }

    return (
        <>
            {
                (readyMount && pagingInfo?.total > 0) &&
                // <div className="pagination01" css={pagination01Style}>
                //   <div className={getPaginationClass()} css={pagination01Style}>
                <div className={getPaginationClass()}>
                    <button disabled={!pagingInfo.prev} onClick={onClickPrev}>
                        <img src="/images/pagination_left.png" alt="이전"/>
                    </button>
                    {renderPaging()}
                    <button disabled={!pagingInfo.next} onClick={onClickNext}>
                        <img src="/images/pagination_right.png" alt="다음"/>
                    </button>
                </div>
            }
        </>
    )
});
export default Paging;
