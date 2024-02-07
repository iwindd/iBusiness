"use client"
import React, { useState } from 'react';
import { Drawer, Box, Toolbar, IconButton, Typography, List, ListItemButton, ListItemText, ListItemIcon, ListSubheader, DialogTitle, DialogContent, DialogContentText, Button, DialogActions, useMediaQuery, Tooltip, Paper } from '@mui/material';
import { Logout as LogoutIcon, Menu, MenuOpen, PointOfSale, Storefront } from '@mui/icons-material';
import { AppBar } from './components/AppBar';
import { DrawerItems } from './components/config';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { DialogProps, useInterface } from '@/app/providers/InterfaceProvider';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';

const ThemeSwitch = () => {

  return (<></>)


  /* waiting   
  
    const { theme, setTheme } = useInterface()
  
    const Switch = () => {
      setTheme(theme == "light" ? "dark" : "light")
    }
  
    return (
      <IconButton onClick={Switch}>
        {theme == "light" ? <LightMode /> : <DarkMode />}
      </IconButton>
    ) */
}

const ShopSwitch = () => {
  const { data: session, update } = useSession();
  const queryClient = useQueryClient();
  const shop = session?.user.retail ? "retail" : "wholesale";

  const Switch = async () => {
    await update({
      ...session,
      user: {
        ...session?.user,
        retail: shop == "retail" ? false : true
      }
    })
    await queryClient.refetchQueries({ type: 'active', queryKey: ['histories'] });
    await queryClient.refetchQueries({ type: 'active', queryKey: ['products'] });
    await queryClient.refetchQueries({ type: 'active', queryKey: ['AnalysisData'] });
  }

  return (
    <Tooltip title={`สลับเป็น${shop == "retail" ? "ค้าส่ง" : "ค้าปลีก"}`}>
      <IconButton onClick={Switch}>
        {shop == "retail" ? <Storefront /> : <PointOfSale />}
      </IconButton>
    </Tooltip>
  )
}

const Logout = () => {
  const { setDialog, setBackdrop } = useInterface();

  const confirmation = setDialog((props: DialogProps<{}>) => {
    const onLogout = async () => {
      props.onClose();
      setBackdrop(true);
      await signOut();
      setBackdrop(false);
    }

    return (
      <>
        <DialogTitle id="responsive-dialog-title">
          {"แจ้งเตือน"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            คุณต้องการออกจากระบบหรือไม่ ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={props.onClose}>ยกเลิก</Button>
          <Button onClick={onLogout}>ยืนยัน</Button>
        </DialogActions>
      </>
    )
  }, {})

  return (
    <Tooltip title="ออกจากระบบ" >
      <IconButton onClick={confirmation.onOpen}>
        <LogoutIcon />
      </IconButton>
    </Tooltip>
  )
}

const Navbar = ({ children }: { children: React.ReactNode }) => {
  const [isDrawer, setDrawer] = React.useState<boolean>(true);
  const isMobile = useMediaQuery('(max-width: 600px)'); // Adjust the breakpoint as needed
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    // Close the drawer when switching to mobile view
    if (isMobile) {
      setDrawer(false);
    }
  }, [isMobile]);

  return (
    <>
      <AppBar
        position='fixed'
        open={isDrawer}
        enableColorOnDark
        color="default"
        className='m-0 p-0'
      >
        <Toolbar
          color="#fffff"
          className='flex justify-between'
          
        >
          <Box>
            <IconButton onClick={() => setDrawer(!isDrawer)}>
              {isDrawer ? (<MenuOpen />) : (<Menu />)}
            </IconButton>
          </Box>
          <Box className="flex gap-2">
{/*             <ThemeSwitch />
            <ShopSwitch /> */}
            <Logout />
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        open={isDrawer}
        color="default"
        variant={isMobile ? 'temporary' : 'persistent'}
        anchor='left'
        onClose={() => setDrawer(false)}
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
          <Link href="/">
            <Typography variant='h4' className='text-center' >{session?.user.title || "..."}</Typography>
          </Link>
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
                    <Link
                      key={`drawer-${categoryId}-${itemId}`}
                      href={item.route}
                    >
                      <ListItemButton
                        selected={(pathname === "/" && item.route === "/") ? true : (pathname.includes(item.route) && item.route !== "/" ? true : false)}
                      >
                        <ListItemIcon>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.label} />
                      </ListItemButton>
                    </Link>
                  ))}
                </ul>
              </li>
            )
          })}
        </List>
      </Drawer>
      <Box
        sx={{
          paddingTop: 8.2,
          paddingLeft: isDrawer ? 30 : 1,
          transition: "all 0.25s ease",
        }}
      >
        <Paper className='m-2 p-2  bg-transparent border-none '>
          {children}
        </Paper>
      </Box>
    </>
  )
}

export default Navbar 