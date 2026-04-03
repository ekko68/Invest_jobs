import { KeyboardArrowDown } from '@mui/icons-material';
import { Select, useTheme } from "@mui/material";
import { useEffect, useState } from 'react';

export const BtSelect = ({children, defaultValue, disabled}) => {
    const [value,setValue] = useState(defaultValue);
    const handleChange = (event) => {
        setValue(event.target.value);
    };
    const theme = useTheme();

    useEffect(()=>{
        if(defaultValue){
            setValue(defaultValue)
        }
    },[defaultValue])

    return(
        <Select
            value={value}
            onChange={handleChange}
            IconComponent={() => (
                <KeyboardArrowDown sx={{mr:1}} />
            )}
            disabled = {disabled? true : false}
            size='small'
            sx={{
                width:'100%',
                backgroundColor:  disabled? theme.palette.disabled.lighter : 'transparent'
            }}
        >
            {children}
        </Select>
    )
}