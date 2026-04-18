export type InventoryItem = {
  id: string;
  name: string;
  group?: string;
  expiry?: string;
  quantity?: string;
};

export type ShoppingItem = {
  id: string;
  name: string;
  quantity?: string;
};

export type AppData = {
  inventory: InventoryItem[];
  shopping: ShoppingItem[];
};
