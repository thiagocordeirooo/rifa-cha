import { createContext, FC, useState } from 'react';

interface AppContextProps {
  listaNumeros: string[];
  setListaNumeros: React.Dispatch<React.SetStateAction<string[]>>;

  listaNumerosSelecionados: string[];
  setListaNumerosSelecionados: React.Dispatch<React.SetStateAction<string[]>>;

  nome: string;
  setNome: React.Dispatch<React.SetStateAction<string>>;

  telefone: string;
  setTelefone: React.Dispatch<React.SetStateAction<string>>;
}

export const AppContext = createContext<AppContextProps>({} as AppContextProps);

export const AppContextProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [listaNumeros, setListaNumeros] = useState<string[]>([]);
  const [listaNumerosSelecionados, setListaNumerosSelecionados] = useState<
    string[]
  >([]);

  const [nome, setNome] = useState<string>('');
  const [telefone, setTelefone] = useState<string>('');

  const value: AppContextProps = {
    listaNumeros,
    setListaNumeros,

    listaNumerosSelecionados,
    setListaNumerosSelecionados,

    nome,
    setNome,
    telefone,
    setTelefone,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
