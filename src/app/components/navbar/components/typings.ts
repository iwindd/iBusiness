export interface DrawerItem {
  name: string,
  label: string,
  route: string,
  icon: JSX.Element,
  desc?: string
}

export interface DrawerCategory {
  name: string,
  label: string,
  items: DrawerItem[]
}
