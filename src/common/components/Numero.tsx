import { Tooltip } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { FC, useContext, useEffect, useState } from "react";
import { COR_SEXO, STATUS_NUMERO } from "../constants";
import { AppContext } from "../../contexts/AppContext";

interface NumeroProps {
  listaNumeros: string[];
  numero: number;
  tipo: string;
}

const Numero: FC<NumeroProps> = ({ listaNumeros, numero, tipo }) => {
  const { listaNumerosSelecionados, setListaNumerosSelecionados } = useContext(AppContext);

  const [statusNumero, setStatusNumero] = useState(STATUS_NUMERO.DISPONIVEL);

  const definirCor = () => {
    if (listaNumeros.includes(`${tipo}:${numero}`)) {
      setStatusNumero(STATUS_NUMERO.INDISPONIVEL);
    } else if (listaNumerosSelecionados.includes(`${tipo}:${numero}`)) {
      setStatusNumero(STATUS_NUMERO.SELECIONADO);
    } else {
      setStatusNumero(STATUS_NUMERO.DISPONIVEL);
    }
  };

  const selecionarNumero = () => {
    if (statusNumero === STATUS_NUMERO.DISPONIVEL) {
      setStatusNumero(STATUS_NUMERO.SELECIONADO);
      setListaNumerosSelecionados([...listaNumerosSelecionados, `${tipo}:${numero}`]);
    } else if (statusNumero === STATUS_NUMERO.SELECIONADO) {
      setStatusNumero(STATUS_NUMERO.DISPONIVEL);
      setListaNumerosSelecionados(listaNumerosSelecionados.filter((item) => item !== `${tipo}:${numero}`));
    }
  };

  useEffect(() => {
    definirCor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listaNumerosSelecionados, listaNumeros]);

  return (
    <Tooltip title={`Este número está ${statusNumero}`} placement="top">
      <Avatar
        style={{
          backgroundColor: COR_SEXO[tipo][statusNumero],
          cursor: [STATUS_NUMERO.DISPONIVEL, STATUS_NUMERO.SELECIONADO].includes(statusNumero) ? "pointer" : "not-allowed",
        }}
        onClick={selecionarNumero}
        sx={{ width: 48, height: 48 }}
      >
        {`${numero}`.padStart(3, "0")}
      </Avatar>
    </Tooltip>
  );
};

export default Numero;
