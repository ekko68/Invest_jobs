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

export const BA_NestedListItem = ({title,nestedItems,defaultOpen}) => {



    const [open, setOpen] = React.useState(defaultOpen);

    const handleClick = () => {
      setOpen(!open);
    };

    const theme = useTheme();

    const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
        borderRadius: 8,
        "&.Mui-selected": {
            backgroundColor: `${theme.palette.primary.main}`
        },
        "&.Mui-selected:hover": {
            backgroundColor: `${theme.palette.primary.dark}`
        },
    }));

    const StyledListItemText = styled(ListItemText)(({ theme }) => ({
        '& .MuiListItemText-root': {
          backgroundColor : '#333333'
        },
    }));

    return (
        <>
            <ListItemButton 
                onClick={handleClick}
                sx={{
                    borderRadius: 2
                }}
            >
                <ListItemText primary={title} />
                {open ? <RemoveIcon /> : <AddIcon />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {
                        nestedItems.map((nestedItem) =>
                            <StyledListItemButton 
                                selected={nestedItem.isSelected} 
                                key={nestedItem.name} 
                                sx={{ 
                                    pl: 4, 
        
                                }} 
                            >
                                <ListItemText primary={nestedItem.name} />
                            </StyledListItemButton>
                        
  
                        )   
                    }
                </List>
            </Collapse>

        </>
    )
} 

