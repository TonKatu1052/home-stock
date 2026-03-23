import { Storage } from './storage';
import { Inventory } from './inventory';
import { Shopping } from './shopping';
import { ModalUI, UI } from './ui';
import { NotificationService } from './notification';
import { getNotifyItems } from './expiry';

export const App = {
  data: Storage.load(),

  init() {
    this.bindEvents();
    this.checkAllExpiry();
    this.render();
  },

  bindEvents() {
    const addBtn = document.getElementById('addBtn')!;
    const nameInput = document.getElementById('itemName') as HTMLInputElement;
    const groupInput = document.getElementById('group') as HTMLInputElement;
    const expiryInput = document.getElementById('expiry') as HTMLInputElement;

    const addShoppingBtn = document.getElementById('addShoppingBtn')!;
    const shoppingInput = document.getElementById('shoppingName') as HTMLInputElement;

    const inventoryTab = document.getElementById('inventoryTab')!;
    const shoppingTab = document.getElementById('shoppingTab')!;
    const inventoryView = document.getElementById('inventoryView')!;
    const shoppingView = document.getElementById('shoppingView')!;

    // 在庫追加
    addBtn.onclick = () => {
      if (!nameInput.value.trim()) return;

      Inventory.add(this.data, {
        id: createId(),
        name: nameInput.value.trim(),
        group: groupInput.value.trim(),
        expiry: expiryInput.value,
      });

      this.save();

      nameInput.value = '';
      groupInput.value = '';
      expiryInput.value = '';
      nameInput.focus();
    };

    // 買い物追加
    addShoppingBtn.onclick = () => {
      if (!shoppingInput.value.trim()) return;

      Shopping.add(this.data, {
        id: createId(),
        name: shoppingInput.value.trim(),
      });

      this.save();

      shoppingInput.value = '';
      shoppingInput.focus();
    };

    // タブ切り替え
    const toggleTab = (isInventory: boolean) => {
      inventoryView.classList.toggle('d-none', !isInventory);
      shoppingView.classList.toggle('d-none', isInventory);

      inventoryTab.classList.toggle('active', isInventory);
      shoppingTab.classList.toggle('active', !isInventory);
    };

    inventoryTab.onclick = () => toggleTab(true);
    shoppingTab.onclick = () => toggleTab(false);
  },

  // 使用処理（UIから呼ばれる）
  async useItem(id: string) {
    const item = Inventory.removeById(this.data, id);
    if (!item) return;

    const addToShopping = await ModalUI.confirmAddToShopping(item.name);

    if (addToShopping) {
      Shopping.add(this.data, {
        id: createId(),
        name: item.name,
      });
    }

    this.save();
  },

  // 買い物削除（UIから呼ばれる）
  removeShopping(id: string) {
    Shopping.removeById(this.data, id);
    this.save();
  },

  // 在庫編集
  async editInventory(id: string) {
    const item = this.data.inventory.find((i) => i.id === id);
    if (!item) return;

    const result = await ModalUI.openInventoryEdit(item);
    if (!result) return;

    Inventory.updateById(this.data, id, {
      name: result.name.trim(),
      group: result.group.trim(),
      expiry: result.expiry || undefined,
    });

    this.save();
  },

  // 買い物編集
  async editShopping(id: string) {
    const item = this.data.shopping.find((i) => i.id === id);
    if (!item) return;

    const result = await ModalUI.openShoppingEdit(item);
    if (!result) return;

    Shopping.updateById(this.data, id, {
      name: result.name.trim(),
    });

    this.save();
  },

  // 期限チェック（起動時）
  checkAllExpiry() {
    const notifyItems = getNotifyItems(this.data.inventory);

    notifyItems.forEach((item) => {
      NotificationService.notify(item.title, item.body);
    });
  },

  save() {
    Storage.save(this.data);
    this.render();
  },

  render() {
    UI.renderInventory(this.data);
    UI.renderShopping(this.data);
  },
};

function createId(): string {
  return crypto.randomUUID();
}
