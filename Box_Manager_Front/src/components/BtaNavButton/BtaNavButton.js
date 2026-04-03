import { Button } from "@mui/material"

export const BtaNavButton = ({children,selected}) => {
    return (
        <Button
            sx={{ my: 1.25, color: selected ? 'primary' : '#ffffff' , display: 'block', fontSize: '1rem', fontWeight: 'bold' }}
        >
            {children}
        </Button>
    )
}