import { ContentCopy } from "@mui/icons-material";
import { Alert, Avatar, Box, Button, Grid, Paper, Step, StepLabel, Stepper, TextField, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CODIGO_PIX, COR_SEXO, STATUS_NUMERO, VALOR_RIFA } from "../../common/constants";
import { AppContext } from "../../contexts/AppContext";
import Dados from "./Dados";

const steps = ["Seus Dados", "Pagamento"];

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const { listaNumerosSelecionados } = useContext(AppContext);

  useEffect(() => {
    if (listaNumerosSelecionados.length === 0) {
      navigate("/");
    }
  }, [listaNumerosSelecionados, navigate]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

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

  const handleBack = () => {
    window.location.reload();
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => {
            const stepProps = {};
            const labelProps = {};

            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box>
      <br />
      <Grid container direction={"column"} alignItems={"center"}>
        <Typography variant="h5">Números selecionados:</Typography>
        <Typography variant="h6" gutterBottom>
          <strong>Valor Total: </strong>
          {(listaNumerosSelecionados.length * VALOR_RIFA).toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          })}
        </Typography>

        <Grid container justifyContent={"center"} gap={1}>
          {listaNumerosSelecionados.map((numero: string) => {
            return (
              <Avatar
                sx={{
                  backgroundColor: COR_SEXO[numero.split(":")[0]][STATUS_NUMERO.DISPONIVEL],
                  width: 48,
                  height: 48,
                }}
              >
                {numero.split(":")[1].padStart(3, "0")}
              </Avatar>
            );
          })}
        </Grid>
      </Grid>

      <br />

      {activeStep === 0 && <Dados {...{ handleNext }} />}

      {activeStep === 1 && (
        <>
          <Paper>
            <Typography variant="h6" gutterBottom>
              O que fazer agora?
            </Typography>

            <Typography variant="body1" gutterBottom>
              Você deve fazer um <strong>PIX</strong> conforme o valor abaixo para confirmar a sua participação:
            </Typography>

            <Typography variant="h5" gutterBottom>
              <strong>Valor:</strong>{" "}
              {(listaNumerosSelecionados.length * VALOR_RIFA).toLocaleString("pt-br", {
                style: "currency",
                currency: "BRL",
              })}
            </Typography>

            <Alert severity="warning">Se o pagamento não for feito em 24h, os números serão liberados.</Alert>
          </Paper>
          <br />
          <TextField value={CODIGO_PIX} size="small" disabled />
          <Button onClick={handleCopiarCodigo} startIcon={<ContentCopy />} sx={{ marginTop: 1 }}>
            Copiar código PIX
          </Button>
          <br />
          <br />

          <Button variant="text" color="secondary" onClick={handleBack}>
            Voltar para o início
          </Button>
        </>
      )}
    </>
  );
};

export default PaymentPage;
