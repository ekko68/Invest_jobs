import { ListItemButton, ListItemText } from "@mui/material"
import { useTheme } from '@mui/material';

export const BtaSubListItemButton = ({title, selected}) => {

    const theme = useTheme();

    return(
        <ListItemButton  sx={{
            pl:4, py:0.5, my:1,
            borderRadius: 2,
            "&.Mui-selected": {
                color:'white',
                backgroundColor: `${theme.palette.primary.main}`,
            },
            "&.Mui-selected:hover": {
                backgroundColor: `${theme.palette.primary.dark}`
            },
        }} selected={selected}>
            <ListItemText primary={title} sx={{ '.MuiListItemText-primary':{ color: selected? theme.palette.white.main : theme.palette.info.main , fontSize:'0.85rem', fontWeight:'bold'}}}/>

        </ListItemButton>
    )
}