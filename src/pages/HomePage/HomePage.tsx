import { Button, Divider, Paper, Tab, Tabs, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { getDatabase, onValue, ref } from "firebase/database";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Numeros from "../../common/components/Numeros";
import { SEXO, TOTAL_NUMEROS, VALOR_RIFA } from "../../common/constants";
import firebaseApp from "../../configs/firebase-config";
import { AppContext } from "../../contexts/AppContext";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const { listaNumerosSelecionados } = useContext(AppContext);
  const [sexo, setSexo] = useState(+new Date() % 2 ? SEXO.FEMININO : SEXO.MASCULINO);
  const [colorMyBets, setColorMyBets] = useState<"warning" | "success">("warning");

  const [listaNumeros, setListaNumeros] = useState<string[] | undefined>();

  const carregarNumeros = () => {
    const db = getDatabase(firebaseApp);

    const numerosRef = ref(db, "apostas");

    onValue(numerosRef, (snapshot) => {
      const data = snapshot.val();
      let lista: string[] = [];
      for (const key in data) {
        if (data[key].listaNumerosSelecionados === undefined) {
          continue;
        }
        lista = [...lista, ...data[key].listaNumerosSelecionados];
      }

      setListaNumeros(lista);
    });
  };

  useEffect(() => {
    carregarNumeros();

    const intervalColorMyBets = setInterval(() => {
      setColorMyBets((prev) => (prev === "warning" ? "success" : "warning"));
    }, 200);

    return () => {
      clearInterval(intervalColorMyBets);
    };
  }, []);

  const handleGotoPaymentPix = () => {
    if (listaNumerosSelecionados.length === 0) {
      alert("Selecione pelo menos um número.");
      return;
    }
    navigate("/payment");
  };

  return (
    <Grid container direction={"column"} justifyContent={"center"} gap={3}>
      <Grid>
        <Paper>
          <Typography variant="h6" gutterBottom>
            Olá família e amigos! ✨
          </Typography>
          <Typography variant="body1" gutterBottom>
            <p>Nós estamos muito felizes com a chegada do bebê e queremos que você participe desse momento especial!</p>
            <p>
              Vamos descobrir juntos se vem aí <span style={{ color: "#F8B5B5", fontWeight: 500 }}>Ana Luiza</span> ou{" "}
              <span style={{ color: "#77BDF4", fontWeight: 500 }}>Heitor</span> participando da nossa rifa de Chá Revelação! 🎉
            </p>
          </Typography>

          <Divider />
          <br />

          <Typography variant="h6" gutterBottom>
            Como funciona?
          </Typography>

          <Typography variant="body2" gutterBottom>
            1 - Cada número custa apenas <strong>{VALOR_RIFA.toLocaleString("pt-br", { style: "currency", currency: "BRL" })}</strong> e
            você pode escolher quantos quiser.
          </Typography>
          <Typography variant="body2" gutterBottom>
            2 - Existem <strong>{TOTAL_NUMEROS}</strong> números disponíveis para cada opção (menino ou menina).
          </Typography>
          <Typography variant="body2" gutterBottom>
            3 - O pagamento deve ser feito via <strong>Pix</strong>.
          </Typography>
          <Typography variant="body2" gutterBottom>
            4 - A revelação do sexo e o sorteio do número vencedor acontecerão no dia <strong>22/09/2024</strong>.
          </Typography>
          <Typography variant="body2" gutterBottom>
            5 - O prêmio é de <strong>R$100,00</strong>! Para ganhar, acerte o sexo do bebê e o número sorteado.
          </Typography>
        </Paper>
      </Grid>

      <Paper>
        <Button onClick={() => navigate("my-bets")} variant="outlined" color={colorMyBets}>
          Conferir minhas apostas
        </Button>
      </Paper>

      <div style={{ position: "relative" }}>
        <Tabs
          value={sexo}
          onChange={(event, newValue) => {
            event.preventDefault();
            event.stopPropagation();
            setSexo(newValue);
          }}
          centered
          style={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#f7f7f7", marginBottom: 16 }}
        >
          <Tab label={<Typography>Menina 👧🏻</Typography>} value={SEXO.FEMININO} />
          <Tab label={<Typography>Menino 👦🏻</Typography>} value={SEXO.MASCULINO} />
        </Tabs>

        {!!listaNumerosSelecionados.length && (
          <Grid
            container
            style={{ height: 48, position: "sticky", top: 48, zIndex: 1, backgroundColor: "#f7f7f7", marginBottom: 16 }}
            justifyContent={"space-evenly"}
            alignItems={"center"}
          >
            <Typography>
              <strong>Feminino:</strong> {listaNumerosSelecionados.filter((p) => p.includes(SEXO.FEMININO)).length}
            </Typography>
            <Typography>
              <strong>Masculino:</strong> {listaNumerosSelecionados.filter((p) => p.includes(SEXO.MASCULINO)).length}{" "}
            </Typography>
            <Typography>
              <strong>Valor:</strong>{" "}
              {(listaNumerosSelecionados.length * VALOR_RIFA).toLocaleString("pt-br", {
                style: "currency",
                currency: "BRL",
              })}
            </Typography>
          </Grid>
        )}

        {sexo === SEXO.FEMININO && <Numeros tipo={SEXO.FEMININO} listaNumeros={listaNumeros} />}
        {sexo === SEXO.MASCULINO && <Numeros tipo={SEXO.MASCULINO} listaNumeros={listaNumeros} />}

        <Grid container justifyContent={"center"} style={{ position: "sticky", bottom: 16, marginTop: 16 }}>
          <Button onClick={handleGotoPaymentPix}>Fazer aposta</Button>
        </Grid>
        <br />
        <Button onClick={() => navigate("my-bets")} variant="outlined" color={colorMyBets}>
          Conferir minhas apostas
        </Button>
      </div>
    </Grid>
  );
};

export default HomePage;
