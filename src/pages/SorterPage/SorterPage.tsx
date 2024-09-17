/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Grid, Typography } from "@mui/material";
import { getDatabase, onValue, ref } from "firebase/database";
import React, { useCallback, useEffect, useState } from "react";
import { COR_SEXO, SEXO, STATUS_NUMERO } from "../../common/constants";
import firebaseApp from "../../configs/firebase-config";
import ConfettiCanvas from "./ConfettiCanvas";

function randomIntFromInterval(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const SorterPage: React.FC = () => {
  const [sortedNumber, setSortedNumber] = useState<number>(0);
  const [sortedUser, setSortedUser] = useState<string>("");
  const [inProgress, setInProgress] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);

  const [listaNumeros, setListaNumeros] = useState<string[]>([]);
  const [allUsers, setAllUsers] = useState<Record<string, any>>({});

  const carregarNumeros = useCallback(() => {
    const db = getDatabase(firebaseApp);
    const numerosRef = ref(db, "apostas");

    onValue(numerosRef, (snapshot) => {
      const data = snapshot.val() || {};
      setAllUsers(data);

      const lista = Object.values(data).flatMap((user: any) => user.listaNumerosSelecionados || []);
      setListaNumeros(lista);
    });
  }, []);

  useEffect(() => {
    carregarNumeros();
  }, [carregarNumeros]);

  const handleSort = async (sexo: string) => {
    setInProgress(true);
    setDone(false);
    setSortedUser("");

    const numbersToSort = listaNumeros.filter((numero) => numero.includes(sexo)).map((numero) => parseInt(numero.split(":")[1])) || [];

    const maxPosition = numbersToSort.length - 1;

    for (let count = 0; count <= 100; count++) {
      const randomInt = randomIntFromInterval(0, maxPosition);
      setSortedNumber(numbersToSort[randomInt]);

      if (count > 96) {
        setDone(true);
      }
      if (count >= 100) {
        const foundUser = Object.keys(allUsers).find((key) =>
          allUsers[key].listaNumerosSelecionados.includes(`${sexo}:${numbersToSort[randomInt]}`)
        );

        setSortedUser(foundUser ? allUsers[foundUser].nome : "");
        setInProgress(false);
        setDone(true);
      }
      await sleep(count > 96 ? 200 : 100);
    }
  };

  return (
    <>
      <Typography variant="h2" align="center">
        Sorteio:
      </Typography>

      <Grid container direction="column" alignItems="center">
        <Typography
          sx={{
            fontSize: done ? 188 : 128,
            fontWeight: done ? 400 : 200,
            color: done ? "green" : "inherit",
            textShadow: done ? "-10px -10px 20px darkgrey" : "none",
            zIndex: 9999,
            userSelect: "none",
          }}
        >
          {`${sortedNumber}`.padStart(3, "0")}
        </Typography>
        {sortedUser && (
          <Typography
            variant="h1"
            sx={{
              marginTop: -6,
              marginBottom: 2,
              textShadow: done ? "-10px -10px 20px darkgrey" : "none",
              zIndex: 9999,
              userSelect: "none",
            }}
          >
            {sortedUser}
          </Typography>
        )}

        {!done && (
          <Grid container justifyContent={"center"} gap={2}>
            <Grid item xs={5}>
              <Button
                sx={{ backgroundColor: COR_SEXO[SEXO.FEMININO][STATUS_NUMERO.DISPONIVEL] }}
                onClick={() => handleSort(SEXO.FEMININO)}
                style={{ zIndex: 999 }}
                disabled={inProgress || !listaNumeros.some((numero) => numero.includes(SEXO.FEMININO))}
              >
                Sortear Feminino
              </Button>
            </Grid>
            <Grid item xs={5}>
              <Button
                sx={{ backgroundColor: COR_SEXO[SEXO.MASCULINO][STATUS_NUMERO.DISPONIVEL] }}
                onClick={() => handleSort(SEXO.MASCULINO)}
                style={{ zIndex: 999 }}
                disabled={inProgress || !listaNumeros.some((numero) => numero.includes(SEXO.MASCULINO))}
              >
                Sortear Masculino
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>

      {inProgress && <audio src="tambor.mp3" autoPlay loop />}
      {!inProgress && done && (
        <>
          <ConfettiCanvas />
          <audio src="ta-da.mp3" autoPlay />
        </>
      )}
    </>
  );
};

export default SorterPage;
