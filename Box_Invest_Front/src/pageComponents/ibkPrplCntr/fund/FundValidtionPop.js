import { Box, Button, Divider, IconButton, Modal, Stack, Typography, useTheme } from "@mui/material"
import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { BtModal } from "components/bt/BtModal";
import { exeFunc } from 'modules/utils/ReactUtils'
import { Close } from '@mui/icons-material';

const FundValidtionPop = forwardRef((props, ref)=> {
    const [isOpen, setIsOpen] = useState(false)
    const {theme, emptyVal} = props;

    useImperativeHandle(ref, () => ({
        open,
        close
    }));

    const open = () => {
        setIsOpen(true);
    }
    const close = () => {
        setIsOpen(false);
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: 4,
        pb:1,
    };
    
    return <>
        {
        isOpen &&
        <Modal open={isOpen} onClose={close}>
            <Box sx={style}>
            
                <Stack 
                    direction={'row'} 
                    justifyContent="flex-end" 
                    alignItems="center" 
                    sx={{width:'100%', px:1, pt:1, boxSizing:'border-box'}}>
                    <IconButton onClick={close}>
                        <Close/>
                    </IconButton>
                </Stack>
                <Stack direction={'column'} sx={{width:400}}>
                    <Stack direction={'column'} spacing={2} sx={{px:2, pb:2}}>
                        <Typography variant="body1" align="center" sx={{color:theme.palette.text.sub}}>{emptyVal}은(는) 필수 입력 항목입니다.</Typography>
                    </Stack>
                    
                    <Divider/>
                    <Stack direction={'row'} spacing={1} justifyContent="center" alignItems="center" sx={{px:2, py:2}}>
                        <Button variant="contained" color="primary" onClick={close} disableElevation>확인</Button>
                    </Stack>
                </Stack>
            </Box>
        </Modal>
        }
    </>

})

export default FundValidtionPop