/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button, Card, Checkbox, Divider, Grid, Paper, Typography } from "@mui/material";
import { getDatabase, onValue, ref, set } from "firebase/database";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { VALOR_RIFA } from "../../common/constants";
import firebaseApp from "../../configs/firebase-config";

const ReportPage: React.FC = () => {
  const navigate = useNavigate();

  const [data, setDate] = useState<any>();
  const [totals, setTotals] = useState<any>();

  const calcularTotais = (dataHistory: any) => {
    const totalsTemp = { F: 0, M: 0 };

    for (const phone in dataHistory) {
      const selectedNumbers = dataHistory[phone].listaNumerosSelecionados;

      selectedNumbers.forEach((item: any) => {
        const [key] = item.split(":");
        if (key === "F") {
          totalsTemp.F += 1;
        } else if (key === "M") {
          totalsTemp.M += 1;
        }
      });
    }

    setTotals(totalsTemp);
  };

  const getBets = async () => {
    const db = getDatabase(firebaseApp);

    const numerosRef = ref(db, `apostas`);

    onValue(numerosRef, (snapshot) => {
      const currentVal = snapshot.val();
      if (currentVal) {
        setDate(currentVal);
        calcularTotais(currentVal);
      }
    });
  };

  useEffect(() => {
    getBets();
  }, []);

  const onChangeOK = (currentData: any, keyHistorico: string, newValue: boolean) => {
    const db = getDatabase(firebaseApp);
    const numerosRef = ref(db, `apostas/${currentData.telefone}/historico/${keyHistorico}`);
    set(numerosRef, { ...currentData.historico[keyHistorico], ok: newValue });
  };

  return (
    <>
      <Grid container gap={2}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Apostas ({totals?.M + totals?.F})
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body1">
            <strong>Feminino:</strong> {totals?.F}
          </Typography>

          <Typography variant="body1">
            <strong>Masculino:</strong> {totals?.M}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Total:</strong>{" "}
            {((totals?.M + totals?.F) * VALOR_RIFA).toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
            })}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Button onClick={() => navigate("/")} variant="text">
            Voltar
          </Button>
        </Grid>

        <Grid item container xs={12} gap={2} justifyContent={"center"}>
          {data &&
            Object.keys(data).map((keyUsuario) => (
              <Grid item xs={12} md={4} key={keyUsuario}>
                <Card>
                  <Grid container justifyContent="space-between" alignItems={"center"}>
                    <Typography gutterBottom>
                      <a href={`https://api.whatsapp.com/send?phone=55${data[keyUsuario].telefone.replace(/\D/g, "")}`}>
                        {data[keyUsuario].telefone}
                      </a>{" "}
                      ({data[keyUsuario].nome})
                    </Typography>
                  </Grid>
                  <Link to={`/my-bets/${keyUsuario.replace(/\D/g, "")}`}>Comprovante</Link>
                  <br />
                  <Divider />
                  <br />
                  {Object.keys(data[keyUsuario].historico).map((keyHistorico: any) => (
                    <Paper
                      key={keyHistorico}
                      sx={{ padding: 1, marginBottom: 1 }}
                      variant="outlined"
                      style={{ backgroundColor: !data[keyUsuario].historico[keyHistorico].ok ? "lightyellow" : "" }}
                    >
                      <Grid container alignItems={"center"}>
                        <Checkbox
                          color="success"
                          checked={!!data[keyUsuario].historico[keyHistorico].ok}
                          onChange={(_, newValue) => onChangeOK(data[keyUsuario], keyHistorico, newValue)}
                        />
                        <Typography>
                          {keyHistorico}{" "}
                          <strong>
                            {(data[keyUsuario].historico[keyHistorico]?.numeros.length * VALOR_RIFA).toLocaleString("pt-br", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </strong>
                        </Typography>
                      </Grid>

                      <Typography>{data[keyUsuario].historico[keyHistorico].numeros.join(" ")}</Typography>
                    </Paper>
                  ))}
                </Card>
              </Grid>
            ))}
        </Grid>
      </Grid>
    </>
  );
};

export default ReportPage;
