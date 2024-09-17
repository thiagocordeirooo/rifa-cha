export const STATUS_NUMERO = {
  DISPONIVEL: "Disponível",
  INDISPONIVEL: "Indisponível",
  SELECIONADO: "Selecionado",
  PROPRIO: "Próprio",
};

export const SEXO = {
  MASCULINO: "M",
  FEMININO: "F",
};

export const COR_SEXO = {
  [SEXO.MASCULINO]: {
    [STATUS_NUMERO.DISPONIVEL]: "#77BDF4",
    [STATUS_NUMERO.SELECIONADO]: "#135B7C",
    [STATUS_NUMERO.INDISPONIVEL]: "#dddddd",
  },
  [SEXO.FEMININO]: {
    [STATUS_NUMERO.DISPONIVEL]: "#F8B5B5",
    [STATUS_NUMERO.SELECIONADO]: "#813D3D",
    [STATUS_NUMERO.INDISPONIVEL]: "#dddddd",
  },
};

const { VITE_APP_CODIGO_PIX } = import.meta.env;

export const TOTAL_NUMEROS = 1000;
export const VALOR_RIFA = 1;
export const CODIGO_PIX = VITE_APP_CODIGO_PIX;
