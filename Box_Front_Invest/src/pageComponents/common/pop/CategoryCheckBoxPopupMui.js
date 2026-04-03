import React, {forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState} from 'react'

import {CloseBtn} from 'components/atomic/IconButton'
import Checkbox from 'components/atomic/Checkbox'
import Button from 'components/atomic/Button'

import {createKey, deepCopyByRecursion} from "modules/utils/CommonUtils";
import {CodeContext} from "modules/contexts/common/CodeContext";
import { Box, Divider, FormGroup, Grid, IconButton, Modal, Stack, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import { BtCheckbox } from 'components/bt/BtCheckbox';
import { BtEctCheckbox } from 'components/bt/BtEctCheckbox';


const CategoryCheckBoxPopup = forwardRef((props, ref) => {

    const {
        onComplete = null,
        onAlert = null,
        title = '',
        getCodeContextFunc = null,

        ...other
    } = props;

    const codeContext = useContext(CodeContext);

    const selectedCountRef = useRef(0);

    const [list, setList] = useState([])
    const [isOpen, setIsOpen] = useState(false)

    const getData = () => {
        return list
    }

    const setDataOpen = (selectedList=[]) => {
        selectedCountRef.current = 0;
        const tempList = [];

        if(list.length > 0) {
            for(let item of list) {
                const _item = deepCopyByRecursion(item);
                _item.status = false;

                for(let t_item of selectedList) {
                    if(_item.id === t_item.id) {
                        _item.status = true;
                        selectedCountRef.current++;
                    }
                }

                tempList.push(_item);
            }
        }
        setList(tempList);
        setIsOpen(true);
        document.body.classList.add("popupScrollLock");
    }

    const close = () => {
        setIsOpen(false)
        document.body.classList.remove("popupScrollLock");
    }

    useImperativeHandle(ref, () => ({
        setDataOpen,
        close,
        getData
    }));

    const onChangeCheckBox = (event) => {
        if(event.target.checked) {
            if(selectedCountRef.current >= 5) {
                if(onAlert !== null) onAlert('최대 5개까지 복수 선택 가능합니다.');
                return;
            }
            selectedCountRef.current++;
        }
        else selectedCountRef.current--;

        const tempList = [];
        for(let item of list) {
            const _item = deepCopyByRecursion(item);
            if(_item.id === event.target.id) _item.status = event.target.checked;
            tempList.push(_item);
        }

        setList(tempList);
    }

    const onClickComplete = () => {
        const selectedItems = [];

        for(let item of list) {
            const _item = deepCopyByRecursion(item);
            if(_item.status) selectedItems.push(_item);
        }

        if (selectedItems.length === 0) {
            if(onAlert !== null) onAlert('선택된 항목이 없습니다.')
            return
        }

        if (onComplete !== null) onComplete(selectedItems);
        close();
    }

    const isMountedRef = useRef(false);

    useEffect(() => {
        if(codeContext.state.isLoaded && !isMountedRef.current) {
            isMountedRef.current = true;

            // const categoryList = codeContext.actions.getCategoryList();
            let categoryList = [];
            if(getCodeContextFunc) categoryList = getCodeContextFunc();

            for (let i = 0; i < categoryList.length; i++) {
                const item = categoryList[i]
                item.status = false
            }
            setList(categoryList);
        }
    }, [codeContext.state.isLoaded]);

    return (
        <>
            {
                isOpen &&
                <>
                    <Button color='primary' onClick={handleOpen}>{buttonTitle}</Button>
                    <Modal open={isOpen} onClose={handleClose}>
                        <Box sx={style}>
                            <Stack 
                                direction={'row'} 
                                justifyContent="flex-end" 
                                alignItems="center" 
                                sx={{width:'100%', px:1, pt:1, boxSizing:'border-box'}}>
                                {modalTitle && 
                                    <Stack spacing={1} direction={'row'} alignItems="flex-end"  sx={{pt:0.5, pl:2, width:'100%'}}>
                                        <Typography variant='h3'>
                                            {modalTitle}
                                        </Typography>
                                        {multiSelect && 
                                            <Typography sx={{color:theme.palette.primary.main}}>
                                                *복수선택가능
                                            </Typography>
                                        }
                                    </Stack>
                                }
                                <IconButton onClick={handleClose}>
                                    <Close/>
                                </IconButton>
                            </Stack>
                            {modalTitle &&
                                <Divider sx={{pb:1}}/>
                            }
                            <Stack direction={'column'} sx={{width:600}}>    
                                <FormGroup>
                                    <Grid container spacing={2} sx={{ py:2, px:3}}>
                                        <Grid item xs={4}>
                                            <Stack direction={'column'}>
                                                <BtCheckbox label="ICT 서비스" />
                                                <BtCheckbox label="영상・공연・음반" />
                                                <BtCheckbox label="게임" />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Stack direction={'column'}>
                                                <BtCheckbox label="ICT 제조" />
                                                <BtCheckbox label="전기・기계・장비" />
                                                <BtCheckbox label="화학・소재" />         
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Stack direction={'column'}>
                                                <BtCheckbox label="바이오・의료" />
                                                <BtCheckbox label="유통・서비스" />
                                                <BtEctCheckbox />              
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </FormGroup>
                                <Divider/>
                                <Stack direction={'row'} spacing={1} justifyContent="center" alignItems="center" sx={{px:2, py:2}}>
                                    <Button variant="contained" disableElevation sx={{backgroundColor:theme.palette.disabled.light, color:theme.palette.text.sub,'&:hover':{backgroundColor:theme.palette.disabled.main } }}>취소</Button>
                                    <Button variant="contained" color="primary" disableElevation>선택 완료</Button>
                                </Stack>
                            </Stack>
                            
                        </Box>
                    </Modal>
                </>
                // <div className="popup_wrap popup_biz" {...other}>
                //     <div className="popup_layout" onClick={close}>
                //         &nbsp;
                //     </div>
                //     <div className="popup_container scroll ">
                //         <div className="popup_header">
                //             <div className="popup_header_inner">
                //                 <div className="title">{title}</div>
                //                 <p className="sub_title">* 최대 5개까지 복수 선택 가능</p>
                //             </div>
                //             <CloseBtn onClick={close}/>
                //         </div>
                //         <div className="popup_content">
                //             <ul className="biz_sel_list">
                //                 {list?.map((item, i) => (
                //                     <li className="biz_sel_item" key={createKey()}>
                //                         <Checkbox className={'type02'} checkbox={item} onChange={onChangeCheckBox} checked={item.status}/>
                //                     </li>
                //                 ))}
                //             </ul>
                //         </div>
                //         <div className="popup_footer ">
                //             <Button className={'light_grey'} onClick={close}>
                //                 취소
                //             </Button>
                //             <Button className={'blue'} onClick={onClickComplete}>
                //                 선택 완료
                //             </Button>
                //         </div>
                //     </div>
                // </div>
            }
        </>
    )
});

export default CategoryCheckBoxPopup;
