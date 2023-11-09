export interface NavButton {
  type: "button",
  label: string
  onClick: () => void,
}

export interface NavRoute {
  type: "route",
  label: string
  route: string,
}


export interface NavCategories {
  type: "categories",
  label: string
  items: NavRoute[]
}

export interface NavSwitch {
  id?: string,
  type: "switch",
  value: boolean,
  label: string
  active: string,
  unactive: string,
}
