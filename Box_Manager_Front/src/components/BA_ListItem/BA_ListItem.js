import { ListItemButton, ListItemText } from "@mui/material"
import { useTheme } from '@mui/material';

export const BA_ListItem = ({title, isSelected}) => {

    // const title = 'title';
    const theme = useTheme();

    return (
        <ListItemButton
            selected = {isSelected}
            sx={{ 
                borderRadius: 2,
                "&.Mui-selected": {
                    backgroundColor: `${theme.palette.primary.main}`
                },
                "&.Mui-selected:hover": {
                    backgroundColor: `${theme.palette.primary.dark}`
                },
            }} 
        >
            <ListItemText primary={title} />
        </ListItemButton>
    )
}