export interface DrawerItem {
  name: string,
  label: string,
  route: string,
  icon: JSX.Element,
  desc?: string,
  shortcut?: boolean
}

export interface DrawerCategory {
  name: string,
  label: string,
  items: DrawerItem[]
}
