import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Stack } from '@mui/material';
import { useTheme } from '@mui/material';




export const BtaModal = ({buttonTitle,contents,cancelEnabled}) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const theme = useTheme();

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 280,
    bgcolor: 'background.paper',
    border: `1px solid ${theme.palette.secondary.main}`,
    boxShadow: 24,
  };

  return (
    <div>
      <Button color='secondary' onClick={handleOpen}>{buttonTitle}</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby={contents}
      >
        <Box sx={style}>
            <Box py={4} px={8}>
                <Typography sx={{textAlign:'center', lineBreak:'strict'}}>
                    {contents}
                </Typography>
            
            </Box>
            <Stack direction={'row'}>
       
                {cancelEnabled? <Button variant='contained' color='blueGrey' sx={{color:theme.palette.white.main,width:'100%', borderRadius:0 }} onClick={handleClose} disableElevation>취소</Button> : ''}
  
                
                <Button variant='contained' color='secondary' sx={{color:theme.palette.white.main, width:'100%', borderRadius:0}} disableElevation>확인</Button>
            </Stack>
        </Box>
        
      </Modal>
    </div>
  );
}