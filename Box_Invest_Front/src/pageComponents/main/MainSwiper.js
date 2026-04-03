import React, {forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useState} from 'react'
import MainSwiperCard from "pageComponents/main/mainswiper/MainSwiperCard";

const MainSwiper = forwardRef((props, ref) => {
    const [list, setList] = useState([])

    useImperativeHandle(ref, () => ({
        setData
    }));

    useLayoutEffect(() => {
    }, [])
    useEffect(async () => {
    }, [])

    const defaultImageList = [
        {
            imgUrl: 'images/main_default1.png',
            bnnrLnknUrl: '',
            bnnrPhrsCon: '',
            btnPhrsCon: ''
        },
        {
            imgUrl: 'images/main_default2.png',
            bnnrLnknUrl: '',
            bnnrPhrsCon: '',
            btnPhrsCon: ''
        },
        {
            imgUrl: 'images/main_default3.png',
            bnnrLnknUrl: '',
            bnnrPhrsCon: '',
            btnPhrsCon: ''
        },
    ]

    const setData = (list) => {
        if (list && list.length > 0) setList(list);
        else setList(defaultImageList);
    }
    // return <Slider1 data={list} />
    return <MainSwiperCard data={list}/>
})
export default MainSwiper
