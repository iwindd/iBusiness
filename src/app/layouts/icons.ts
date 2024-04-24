import { AdminPanelSettingsTwoTone, CategoryTwoTone, ChatTwoTone, HistoryTwoTone, ListTwoTone, PaymentTwoTone, PeopleTwoTone, ReceiptLongTwoTone, ShoppingBagTwoTone, StoreTwoTone } from "@mui/icons-material";
import { ElementType } from "react";

export const navIcons = {
  'chart-pie': ChatTwoTone,
  'product': ListTwoTone,
  'history': HistoryTwoTone,
  'store': StoreTwoTone,
  'employees': PeopleTwoTone,
  'category': CategoryTwoTone,
  'cashier': ShoppingBagTwoTone,
} as Record<string, ElementType>;