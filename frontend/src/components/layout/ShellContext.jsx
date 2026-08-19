import { createContext, useContext } from 'react';

export const ShellContext = createContext({ navOpen: false, setNavOpen: () => {} });

export function useShell() {
  return useContext(ShellContext);
}
