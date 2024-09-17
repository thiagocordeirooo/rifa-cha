/* eslint-disable @typescript-eslint/no-explicit-any */

import { ContentCopy } from "@mui/icons-material";
import { Alert, Avatar, Button, Card, Grid, TextField, Typography } from "@mui/material";
import { getDatabase, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CODIGO_PIX, COR_SEXO, STATUS_NUMERO, VALOR_RIFA } from "../../common/constants";
import { normalizePhoneNumber } from "../../common/masks";
import firebaseApp from "../../configs/firebase-config";

const MyBetsPage: React.FC = () => {
  const navigate = useNavigate();
  const { phone } = useParams();
  const [data, setDate] = useState<{ nome: string; telefone: string; historico: any }>();
  const [telefone, setTelefone] = useState(phone ? normalizePhoneNumber(phone) : "");

  const getBets = async () => {
    if (!telefone) {
      return;
    }
    const db = getDatabase(firebaseApp);

    const numerosRef = ref(db, `apostas/${telefone}`);

    onValue(numerosRef, (snapshot) => {
      const currentVal = snapshot.val();
      if (currentVal) {
        console.log(currentVal);
        setDate(currentVal);
      } else {
        alert("Nenhuma aposta encontrada para este número de telefone.");
        navigate("/");
      }
    });
  };

  useEffect(() => {
    getBets();
  }, []);

  const handleCopiarCodigo = async () => {
    if (typeof window !== "undefined" && window.navigator.clipboard) {
      try {
        await window.navigator.clipboard.writeText(CODIGO_PIX);
        alert("Código PIX copiado!\n\nProsiga para seu aplicativo de banco para efetuar o pagamento.");
      } catch (err) {
        console.error("Falha ao copiar texto: ", err);
      }
    }
  };

  return (
    <>
      <Grid container gap={2}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Minhas apostas
          </Typography>
          <Typography gutterBottom>Informe seu número de telefone para buscar suas apostas:</Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            type="tel"
            label="Telefone"
            placeholder="Informe o seu WhatsApp"
            value={telefone}
            onChange={(event) => setTelefone(normalizePhoneNumber(event.target.value))}
          />
        </Grid>
        <Grid item xs={12}>
          <Button onClick={getBets}>Buscar</Button>
        </Grid>
        <Grid item xs={12}>
          <Button onClick={() => navigate("/")} variant="text">
            Voltar
          </Button>
        </Grid>

        <Grid item xs={12}>
          {data && (
            <Grid container gap={2}>
              <Grid item xs={12}>
                <Typography variant="h5">Apostas encontradas:</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>
                  <strong>Nome:</strong> {data.nome}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>
                  <strong>Telefone:</strong> {data.telefone}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                {Object.keys(data.historico).map((key, index: number) => (
                  <Card key={index} sx={{ marginBottom: 2 }}>
                    <Grid container justifyContent="space-between" alignItems="center">
                      <Typography variant="button">{new Date(+key).toLocaleString()}</Typography>
                      {data.historico[key].numeros.length > 0 && (
                        <Typography variant="button">
                          {(data.historico[key].numeros.length * VALOR_RIFA).toLocaleString("pt-br", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </Typography>
                      )}
                    </Grid>
                    <br />
                    <Grid container gap={1}>
                      {data.historico[key].numeros.map((numero: string) => {
                        return (
                          <Avatar
                            sx={{
                              backgroundColor: COR_SEXO[numero.split(":")[0]][STATUS_NUMERO.DISPONIVEL],
                            }}
                          >
                            {numero.split(":")[1].padStart(3, "0")}
                          </Avatar>
                        );
                      })}
                    </Grid>

                    {!data.historico[key].ok && (
                      <>
                        <br />
                        <Alert severity="warning">Aguardando a confirmação do pagamento.</Alert>

                        <Button size="small" variant="text" onClick={handleCopiarCodigo} startIcon={<ContentCopy />} sx={{ marginTop: 1 }}>
                          Copiar código PIX
                        </Button>
                      </>
                    )}
                    {data.historico[key].ok && (
                      <>
                        <br />
                        <Alert severity="success">Pagamento confirmado!</Alert>
                      </>
                    )}
                  </Card>
                ))}
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default MyBetsPage;
