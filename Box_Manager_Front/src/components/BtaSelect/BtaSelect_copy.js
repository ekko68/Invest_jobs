import React, {useEffect} from 'react';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


export const BtaSelect_copy = ({poHandleChange, defaultValue, disabledChk, children}) => {
    const [value, setValue] = React.useState(defaultValue);

    const handleChange = (event) => {
        setValue(event.target.value);
        poHandleChange(event.target.value);
    };

    useEffect(()=>{
      if(defaultValue){
          setValue(defaultValue)
      }
  },[defaultValue])

    return(
        <Select
          value={value}
          onChange={handleChange}
          displayEmpty
          disabled={disabledChk}
        >
          {children}
        </Select>
    )
}