"use client"
import React, { memo, useState } from 'react';
import { Drawer, Box, Toolbar, IconButton, Typography, List, ListItemButton, ListItemText, ListItemIcon, ListSubheader, DialogTitle, DialogContent, DialogContentText, Button, DialogActions } from '@mui/material';
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
  const { shop, setShop } = useInterface()
  const { data: session, update } = useSession();
  const [isLoading, setLoading] = useState<boolean>(true);
  const queryClient = useQueryClient();

  const Switch = async () => {
    setShop(shop == "retail" ? "wholesale" : "retail");
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


  React.useEffect(() => {
    if (session?.user.retail == undefined) {
      setLoading(true);
    } else {
      setLoading(false)
    }

    if (session?.user.retail == false && shop == "retail") {
      setShop(session.user.retail ? "retail" : "wholesale")
    }
  }, [session])

  if (isLoading) {
    return
  }

  return (
    <IconButton onClick={Switch}>
      {shop == "retail" ? <Storefront /> : <PointOfSale />}
    </IconButton>
  )
}

const Logout = () => {
  const { useDialog, useBackdrop } = useInterface();

  const confirmation = useDialog((props: DialogProps<{}>) => {
    const onLogout = async () => {
      props.onClose();
      useBackdrop(true);
      await signOut();
      useBackdrop(false);
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
    <IconButton onClick={confirmation.onOpen}>
      <LogoutIcon />
    </IconButton>
  )
}

const Navbar = memo(({ children }: { children: React.ReactNode }) => {
  const [isDrawer, setDrawer] = React.useState<boolean>(true);
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

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
              {isDrawer ? (<MenuOpen />) : (<Menu />)}
            </IconButton>
          </Box>
          <Box className="flex gap-2">
            <ThemeSwitch />
            <ShopSwitch />
            <Logout />
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
                    <ListItemButton
                      key={`drawer-${categoryId}-${itemId}`}
                      selected={pathname === item.route || (item.route === '/' && pathname === '/')}
                      onClick={() => {
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
          paddingTop: 9,
          paddingLeft: isDrawer ? 30 : 1,
          transition: "all 0.25s ease",
        }}
      >
        <div className="container p-4">
          {children}
        </div>
      </Box>
    </>
  )
})

export default Navbar 