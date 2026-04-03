import { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { createKey } from "modules/fns/commonFn";
import { Add, Remove } from "@mui/icons-material";
import { Box, Button, IconButton, Stack, TextField, Typography, useTheme } from '@mui/material';
import { BtContentGrid } from 'components/BtContentGrid';

const ConvrsHnfInfo = forwardRef(({
  rpdirInfoSeq,
  utlinsttId,
  invmHnfNm,
  tpn,
  ead,
  list=[],
  title
}, ref) => {
  const theme = useTheme();
  const scrollRef = useRef()
  const [isUpdate, setIsUpdate] = useState(true)

  useImperativeHandle(ref, () => ({}))
  useEffect(() => {}, [])
  useEffect(() => {}, [list])
  
  const onClickAdd = () => {
    if (list.length >= 20) {
        alert('등록 가능한 인원수를 초과하였습니다.최대 20 입니다.')
        // exeFunc(alertPopRef, 'open', '등록 가능한 인원수를 초과하였습니다.최대 20 입니다.');
        return
    }
    const item = createEmptyItem()
    list.push(item)
    setIsUpdate(!isUpdate)
    // moveToBottom()
  }
  const createEmptyItem = () => {
    const item = {}
    if (list.length > 0) {
      const lastItem = list[list.length - 1]
      item[rpdirInfoSeq] = lastItem[rpdirInfoSeq] + 1
    } else {
      item[rpdirInfoSeq] = 1;
    }
    item[utlinsttId] = ''
    item[invmHnfNm] = ''
    item[tpn] = ''
    item[ead] = ''
    item['key'] = createKey()
    return item
  }

  // item 삭제
  const onClickDelete = (item) => {
    if (list.length > 0) {
      let index = -1
      const seq = item[rpdirInfoSeq]
      for (let i = 0; i < list.length; i++) {
        const listItem = list[i]
        if (listItem[rpdirInfoSeq] === seq) {
          index = i
          break
        }
      }
      if (index > -1) {
        list.splice(index, 1)
      }
      setIsUpdate(!isUpdate)
    }
  }
  //   /** 전화번호 하이픈 및 입력제한 */
  //   const handlePhoneNum = (e,item) => {
  //     const regex = /^[0-9]*$/;
  //     const num = e.target.value.replace(/-/g,'','');
  //     if(regex.test(num) && e.target.value.length < 14 && num.length < 12){
  //         const {
  //             target:{name}
  //         } = e;
  //         let formatRes = isTelFormat(num)
  //         item[name] = formatRes
  //         setIsUpdate(!isUpdate)
  //     }
  // }
  // /* 휴대폰 formating function */
  // const isTelFormat = (tel) => {
  //     console.log("tel="+ tel);
  //     let result = "";
  //     if(tel.length === 3) {
  //       return tel.replace(/(\d{3})/, '$1-');
  //     } else if(tel.length === 7) {
  //       return tel.replace(/(\d{3})(\d{4})/, '$1-$2');
  //     } else if(tel.length === 11) {
  //       //000-0000-0000
  //       return tel.replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3");
  //     }
  //   return tel;
  // }

//   const moveToBottom = () => {
//     setTimeout(() => {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight
//     }, 1)
//   }
  // 투자사 인력 정보
  const renderHnfInfo = useCallback(() => {
    if (list?.length === 0) {
      return <></>
    } else if (list?.length > 0) {
      const rowList = []
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        const row = (
            <BtContentGrid key={item.key} gridXs={12} title={title}>
                <Stack direction={'row'} spacing={2} sx={{width:'100%'}}>
                    <Stack direction={'row'} justifyContent="flex-start" alignItems="center" spacing={1}>
                        <Typography variant="body1">성명</Typography>
                        <TextField
                            id={'invmHnfNm'}
                            size="small"
                            defaultValue={item.invmHnfNm}
                            onChange={(e) => item.invmHnfNm = e.target.value}
                        />  
                    </Stack>
                    <Stack direction={'row'} justifyContent="flex-start" alignItems="center" spacing={1}>
                        <Typography variant="body1">전화번호</Typography>
                        <TextField
                            id={'tpn'}
                            size="small"
                            defaultValue={item.tpn}
                            onChange={(e) => item.tpn = e.target.value}
                        />  
                    </Stack>
                    <Stack flexGrow={1} direction={'row'} justifyContent="flex-start" alignItems="center" spacing={1}>
                        <Typography sx={{width:'3rem'}} variant="body1">이메일</Typography>
                        <TextField
                            id={'ead'}
                            size="small"
                            defaultValue={item.ead}
                            sx={{boxSizing:'border-box', width:'100%'}}
                            onChange={(e) => item.ead = e.target.value}
                        />  
                    </Stack>
                    {
                        (i < 1) ? 
                        <Button onClick={onClickAdd} size="small" color="primary" variant="outlined" endIcon={<Add />}>
                            추가
                        </Button> : 
                        <Box sx={{px:2}}>
                            <IconButton  onClick={() => onClickDelete(item)} size="small" sx={{ border:`1px solid ${theme.palette.text.sub}`}}><Remove/></IconButton>
                        </Box>
                    }
                </Stack>
            </BtContentGrid>
            )
        rowList.push(row)
      }
      return rowList
    }
  })

  return (
    renderHnfInfo()
  )
})

export default memo(ConvrsHnfInfo)
