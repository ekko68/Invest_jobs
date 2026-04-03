import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import { BtaListItemButton } from '../BtaListItemButton';
import { ListItemText } from '@mui/material';
import { BtaNestedListItemButton } from '../BtaNestedListItemButton/BtaNestedListItemButton';

export const BA_SideBar = () => {

    return (
      <List
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            투자BOX
          </ListSubheader>
        }
      >

        <BtaNestedListItemButton title='베너관리' defaultOpen={false}>
            <List component="div" disablePadding>
              <BtaListItemButton sx={{pl:4}}>
                <ListItemText primary='서브아이템 1' />
              </BtaListItemButton>
              <BtaListItemButton sx={{pl:4}}>
                <ListItemText primary='서브아이템 2' />
              </BtaListItemButton>
            </List>
        </BtaNestedListItemButton>

        <BtaNestedListItemButton title='공지사항' defaultOpen={false}>
            <List component="div" disablePadding>
              <BtaListItemButton sx={{pl:4}}>
                <ListItemText primary='서브아이템 1' />
              </BtaListItemButton>
              <BtaListItemButton sx={{pl:4}}>
                <ListItemText primary='서브아이템 2' />
              </BtaListItemButton>
            </List>
        </BtaNestedListItemButton>

        <BtaNestedListItemButton title='컨설팅' defaultOpen={false}>
            <List component="div" disablePadding>
              <BtaListItemButton sx={{pl:4}}>
                <ListItemText primary='서브아이템 1' />
              </BtaListItemButton>
              <BtaListItemButton sx={{pl:4}}>
                <ListItemText primary='서브아이템 2' />
              </BtaListItemButton>
            </List>
        </BtaNestedListItemButton>

        <BtaNestedListItemButton title='문서관리' defaultOpen={false}>
            <List component="div" disablePadding>
              <BtaListItemButton sx={{pl:4}}>
                <ListItemText primary='서브아이템 1' />
              </BtaListItemButton>
              <BtaListItemButton sx={{pl:4}}>
                <ListItemText primary='서브아이템 2' />
              </BtaListItemButton>
            </List>
        </BtaNestedListItemButton>

        <BtaNestedListItemButton title='Q&A' defaultOpen={false}>
            <List component="div" disablePadding>
              <BtaListItemButton sx={{pl:4}}>
                <ListItemText primary='서브아이템 1' />
              </BtaListItemButton>
              <BtaListItemButton sx={{pl:4}}>
                <ListItemText primary='서브아이템 2' />
              </BtaListItemButton>
            </List>
        </BtaNestedListItemButton>

        <BtaNestedListItemButton title='통계' defaultOpen={false}>
            <List component="div" disablePadding>
              <BtaListItemButton sx={{pl:4}}>
                <ListItemText primary='서브아이템 1' />
              </BtaListItemButton>
              <BtaListItemButton sx={{pl:4}}>
                <ListItemText primary='서브아이템 2' />
              </BtaListItemButton>
            </List>
        </BtaNestedListItemButton>

        <BtaListItemButton>
          <ListItemText primary='VC관리' />
        </BtaListItemButton>

        <BtaNestedListItemButton title='추천기업 관리' defaultOpen={false}>
            <List component="div" disablePadding>
              <BtaListItemButton sx={{pl:4}}>
                <ListItemText primary='서브아이템 1' />
              </BtaListItemButton>
              <BtaListItemButton sx={{pl:4}}>
                <ListItemText primary='서브아이템 2' />
              </BtaListItemButton>
            </List>
        </BtaNestedListItemButton>

        <BtaNestedListItemButton title='펀드 관리' defaultOpen={true}>
            <List component="div" disablePadding>
              <BtaListItemButton sx={{pl:4}} selected={true}>
                <ListItemText primary='제안받은 펀드' />
              </BtaListItemButton>
              <BtaListItemButton sx={{pl:4}}>
                <ListItemText primary='펀드 평가 결과 등록' />
              </BtaListItemButton>
            </List>
        </BtaNestedListItemButton>

      </List>
    );
}