import {forwardRef, useEffect, useImperativeHandle, useState} from 'react'
import Button from 'components/atomic/Button'
import {MinusBtn} from 'components/atomic/IconButton'

import {maxCountStyle} from 'assets/style/AtomicStyle'
import {createKey, deepCopyByRecursion} from "modules/utils/CommonUtils";
import {StringUtils} from "modules/utils/StringUtils";

const Faq = forwardRef((props, ref) => {
    const [list, setList] = useState([])

    useEffect(() => {
    }, [])

    useImperativeHandle(ref, () => ({
        setData,
        getData
    }))

    const setData = (temp) => {
        setList(temp.map(item => {
            return {...item, key: createKey()};
        }))
    }

    const getData = () => {
        return list.map(item => {
            const {key, ...other} = item;
            return other;
        })
    }

    const onClickAdd = () => {
        let faqSqn = 0
        if (list.length > 0) faqSqn = list[list.length - 1].faqSqn + 1
        const emptyItem = {
            faqQstn: '',
            faqRply: '',
            faqSqn: faqSqn,
            invmCmpExusPageId: '',
            rvsRnum: '',
            utlinsttId: '',

            key: createKey()
        }
        const temp = [...list]
        temp.push(emptyItem)
        setList(temp)
    }
    const onClickRemove = (item) => {
        if (list.length > 0) {
            const temp = []
            for (let i = 0; i < list.length; i++) {
                const listItem = list[i]
                if (listItem['faqSqn'] !== item['faqSqn']) {
                    temp.push(listItem)
                }
            }
            setList(temp)
        }
    }

    const setFaqListItem = (faqSqn, property, value) => {
        const _list = deepCopyByRecursion(list);
        const target = _list.find(e => e.faqSqn === faqSqn);

        if(target) {
            target[property] = value;
            setList(_list);
        }
    }

    return (
        <div className="section section05">
            <div className="card_header">
                <h3 className="ico_title">FAQ</h3>
                <div className="btn_wrap">
                    {
                        (list.length < 10)
                            ? <Button className={'btn_add dashed linear light_grey'} onClick={onClickAdd}>
                                <span className="ico_plus">입력내용추가</span>
                            </Button>
                            : <></>
                    }
                </div>
            </div>
            <div className="add_table_wrap">{
                list?.map((item, i) => (
                    <div className="event_block_box" key={item.key}>
                        <div className="form_wrap">
                            <div className="form_row">
                                <div className="event_block_th">질문</div>
                                <div className="event_block_td col3">
                                    <div className="input_wrap">
                                        <input
                                            id={'faqQstn'}
                                            title='FAQ질문'
                                            type="text"
                                            className="input"
                                            placeholder="질문을 입력해 주세요."
                                            defaultValue={item['faqQstn']}
                                            maxLength={100}
                                            onChange={event => {
                                                event.target.value = StringUtils.cutStrByLimit(event.target.value, 100);
                                                setFaqListItem(item.faqSqn, 'faqQstn', event.target.value);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form_row row_content">
                                <div className="event_block_th">답변</div>
                                <div className="event_block_td  col3">
                                    <div className="textarea_wrap">
                                <textarea
                                    id={'faqRply' + item['faqSqn']}
                                    title='FAQ답변'
                                    className={'textarea'}
                                    placeholder={'답변을 입력해 주세요.'}
                                    defaultValue={item['faqRply']}
                                    maxLength={500}
                                    onChange={event => {
                                        event.target.value = StringUtils.cutStrByLimit(event.target.value, 500);
                                        document.querySelector('#faqRplyCount' + item['faqSqn']).innerHTML = event.target.value.length;
                                        setFaqListItem(item.faqSqn, 'faqRply', event.target.value);
                                    }}
                                />
                                    </div>
                                    <div className="max_count_wrap">
                                        <div className="max_count" css={maxCountStyle}>
                                            <p id={'faqRplyCount' + item['faqSqn']} className="count">
                                                {String(item['faqRply']).length}
                                            </p>
                                            <p id={'faqRplyMax' + item['faqSqn']} className="max">
                                                {500}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="btn_wrap">
                            <MinusBtn onClick={() => onClickRemove(item)}>
                                <span className="hide">삭제</span>
                            </MinusBtn>
                        </div>
                    </div>
                ))
            }</div>
        </div>
    )
});

export default Faq;
