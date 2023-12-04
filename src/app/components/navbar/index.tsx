"use client"
import React, { useState } from 'react';
import { Drawer, Box, Toolbar, IconButton, Typography, List, ListItemButton, ListItemText, ListItemIcon, ListSubheader } from '@mui/material'
import { DarkMode, KeyboardArrowLeft, KeyboardArrowRight, LightMode, Logout, PointOfSale, Storefront } from '@mui/icons-material';
import { AppBar } from './components/AppBar';
import { DrawerItems } from './components/config';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useInterface } from '@/app/providers/InterfaceProvider';
import { useQueryClient } from '@tanstack/react-query';

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
            <ThemeSwitch />
            <ShopSwitch />
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
}