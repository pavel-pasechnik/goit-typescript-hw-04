import React, { createContext, useContext, useMemo, useState } from 'react';
// eslint-disable-next-line n/no-missing-import
import noop from 'lodash/noop';

type MenuIds = 'first' | 'second' | 'last';
type Menu = { id: MenuIds; title: string };

// Додати тип Menu Selected

type SelectedMenu = { id: MenuIds };

type MenuSelected = {
  selectedMenu: SelectedMenu;
};

const MenuSelectedContext = createContext<MenuSelected>({
  selectedMenu: {} as SelectedMenu,
});

// Додайте тип MenuAction

type MenuAction = {
  // eslint-disable-next-line no-unused-vars
  onSelectedMenu(selectedMenu: SelectedMenu): void;
};

const MenuActionContext = createContext<MenuAction>({
  onSelectedMenu: noop,
});

type PropsProvider = {
  children: React.ReactNode; // Додати тип для children
};

function MenuProvider({ children }: PropsProvider) {
  // Додати тип для SelectedMenu він повинен містити { id }
  const [selectedMenu, setSelectedMenu] = useState<SelectedMenu>({} as SelectedMenu);

  const menuContextAction = useMemo(
    () => ({
      onSelectedMenu: setSelectedMenu,
    }),
    []
  );

  const menuContextSelected = useMemo(
    () => ({
      selectedMenu,
    }),
    [selectedMenu]
  );

  return (
    <MenuActionContext.Provider value={menuContextAction}>
      <MenuSelectedContext.Provider value={menuContextSelected}>
        {children}
      </MenuSelectedContext.Provider>
    </MenuActionContext.Provider>
  );
}

type PropsMenu = {
  menus: Menu[]; // Додайте вірний тип для меню
};

function MenuComponent({ menus }: PropsMenu) {
  const { onSelectedMenu } = useContext(MenuActionContext);
  const { selectedMenu } = useContext(MenuSelectedContext);

  return (
    <>
      {menus.map(menu => (
        <button key={menu.id} onClick={() => onSelectedMenu({ id: menu.id })}>
          {menu.title} {selectedMenu.id === menu.id ? 'Selected' : 'Not selected'}
        </button>
      ))}
    </>
  );
}

export function ComponentApp() {
  const menus: Menu[] = [
    {
      id: 'first',
      title: 'first',
    },
    {
      id: 'second',
      title: 'second',
    },
    {
      id: 'last',
      title: 'last',
    },
  ];

  return (
    <MenuProvider>
      <MenuComponent menus={menus} />
    </MenuProvider>
  );
}
