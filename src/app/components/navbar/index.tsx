"use client"
import React from 'react';
import { Drawer, Box, Toolbar, IconButton, Typography, List, ListItemButton, ListItemText, ListItemIcon, ListSubheader } from '@mui/material'
import { KeyboardArrowLeft, KeyboardArrowRight, Logout } from '@mui/icons-material';
import { AppBar } from './components/AppBar';
import { DrawerItems } from './components/config';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function Navbar({ children }: { children: React.ReactNode }) {
  const [isDrawer, setDrawer] = React.useState<boolean>(true);
  const [isPage, setPage] = React.useState<string>('main.dashboard');
  const router = useRouter();

  return (
    <>
      <AppBar
        position='fixed'
        open={isDrawer}
        enableColorOnDark
        color="default"
      >
        <Toolbar
          color="#fffff"
          className='flex justify-between'
        >
          <Box>
            <IconButton onClick={() => setDrawer(!isDrawer)}>
              {isDrawer ? (<KeyboardArrowLeft />) : (<KeyboardArrowRight />)}
            </IconButton>
          </Box>
          <Box className="flex gap-2">
            <IconButton onClick={() => signOut()}>
              <Logout />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        open={isDrawer}
        color="default"
        variant="persistent"
        anchor='left'
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 240,
            boxSizing: 'border-box'
          },
        }}
      >
        <Box sx={{ padding: 2 }}>
          <Typography variant='h4' className='text-center' >{'iStore'}</Typography>
        </Box>
        <List
          subheader={<li />}
        >
          {DrawerItems.map((category, categoryId) => {
            return (
              <li key={`category-${categoryId}`}>
                <ul>
                  <ListSubheader>{category.label}</ListSubheader>
                  {category.items.map((item, itemId) => (
                    <ListItemButton
                      key={`drawer-${categoryId}-${itemId}`}
                      selected={isPage == `${category.name}.${item.name}`}
                      onClick={() => {
                        setPage(`${category.name}.${item.name}`);
                        router.push(item.route);
                      }}
                    >
                      <ListItemIcon>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  ))}
                </ul>
              </li>
            )
          })}
        </List>
      </Drawer>
      <Box
        sx={{
          marginTop: 11,
          marginLeft: isDrawer ? 30 : 1,
          transition: "all 0.25s ease"
        }}
      >
        {children}
      </Box>
    </>
  )
}