import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


export const BtaSelect = ({children}) => {
    
    const [value, setValue] = React.useState('10');

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return(
        <Select
          value={value}
          onChange={handleChange}
          displayEmpty
        >
          {children}
        </Select>
    )
}