import { HomeOutlined } from '@mui/icons-material'
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Typography,
  useTheme
} from '@mui/material'
import { BtNavSelect } from 'components/bt/BtNavSelect'
// import Grid from '@mui/material/Unstable_Grid2';

import ROUTER_NAMES from 'modules/consts/RouterConst'
import { useHistory } from 'react-router-dom'

import Header from 'components/header/Header'

import RcmdEnprListViewDetail from 'pageComponents/ibkPrplCntr/prplcm/RcmdEnprListViewDetail';

const RcmdEnprListView = () => {
  const theme = useTheme()
  const history = useHistory()

  return (
    <RcmdEnprListViewDetail/>
  )
}

export default RcmdEnprListView
