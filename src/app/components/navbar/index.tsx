"use client"
import React, { useState } from 'react';
import { Drawer, Box, Toolbar, IconButton, Typography, List, ListItemButton, ListItemText, ListItemIcon, ListSubheader } from '@mui/material'
import { Logout, Menu, MenuOpen, PointOfSale, Storefront } from '@mui/icons-material';
import { AppBar } from './components/AppBar';
import { DrawerItems } from './components/config';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useInterface } from '@/app/providers/InterfaceProvider';
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

export default function Navbar({ children }: { children: React.ReactNode }) {
  const [isDrawer, setDrawer] = React.useState<boolean>(true);
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
          <Link href="/">
            <Typography variant='h4' className='text-center' >{'iStore'}</Typography>
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
                      selected={pathname.search(item.route) ? false: true}
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
}