import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import styled from '@emotion/styled';
import { useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';


export const BtaNestedListItemButton = ({children,title,defaultOpen}) => {
    const [open, setOpen] = React.useState(defaultOpen);

    const handleClick = () => {
      setOpen(!open);
    };

    const theme = useTheme();

    return (
        <>
            <ListItemButton 
                onClick={handleClick}
                sx={{
                    borderRadius: 2,
                    my:1,
                    py:0.5
                }}
            >
                <ListItemText color={theme.palette.tertiary.main} primary={title} sx={{color:theme.palette.tertiary.main , '.MuiListItemText-primary':{fontWeight:'bold'}}}/>
                {open ? <RemoveIcon fontSize='small' sx={{color:theme.palette.info.main}}/> : <AddIcon fontSize='small' sx={{color:theme.palette.info.main}}/>}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                {children}
            </Collapse>
        </>
    )

}