import styled from "@emotion/styled";
import { ListItemButton, ListItemText } from "@mui/material";
import { useTheme } from '@mui/material';



export const BtaListItemButton = ({children,title,selected}) => {

    const theme = useTheme();

    return (
        <ListItemButton  sx={{
            py:0.5, my:1,
            borderRadius: 2,
            "&.Mui-selected": {
                backgroundColor: `${theme.palette.primary.main}`,
            },
            "&.Mui-selected:hover": {
                backgroundColor: `${theme.palette.primary.dark}`
            },
        }} selected={selected}>
            <ListItemText primary={title} sx={{ '.MuiListItemText-primary':{  fontWeight:'bold', color: `${selected? theme.palette.white.main : "inherit"}` }}}/>
        </ListItemButton>
    )
}