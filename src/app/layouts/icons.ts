import { CategoryTwoTone, ChatTwoTone, HistoryTwoTone, ListTwoTone, PeopleTwoTone, ShoppingBagTwoTone, StoreTwoTone, AllInboxTwoTone } from "@mui/icons-material";
import { ElementType } from "react";

export const navIcons = {
  'chart-pie': ChatTwoTone,
  'product': ListTwoTone,
  'stock': AllInboxTwoTone,
  'history': HistoryTwoTone,
  'store': StoreTwoTone,
  'employees': PeopleTwoTone,
  'category': CategoryTwoTone,
  'cashier': ShoppingBagTwoTone,
} as Record<string, ElementType>;