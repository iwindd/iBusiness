export interface DrawerItem {
  name: string,
  label: string,
  route: string,
  icon: JSX.Element
}

export interface DrawerCategory {
  name: string,
  label: string,
  items: DrawerItem[]
}
