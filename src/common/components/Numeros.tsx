import Grid from "@mui/material/Unstable_Grid2";
import { FC } from "react";
import { TOTAL_NUMEROS } from "../constants";
import Numero from "./Numero";
import LoadingSpinner from "./lotties/LoadingSpinner";

interface NumerosProps {
  tipo: string;
  listaNumeros: string[] | undefined;
}

const Numeros: FC<NumerosProps> = ({ tipo, listaNumeros }) => {
  return (
    <Grid container justifyContent={"center"} gap={2}>
      {!listaNumeros && <LoadingSpinner />}

      {listaNumeros &&
        [...Array(TOTAL_NUMEROS)].map((_, i) => {
          return (
            <Numero
              numero={i + 1}
              {...{
                listaNumeros,
                tipo,
              }}
              key={i}
            />
          );
        })}
    </Grid>
  );
};

export default Numeros;
