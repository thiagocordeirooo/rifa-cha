import { Box, Button, TextField } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { getDatabase, onValue, ref, set } from "firebase/database";
import { useContext, useEffect } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { normalizePhoneNumber } from "../../common/masks";
import firebaseApp from "../../configs/firebase-config";
import { AppContext } from "../../contexts/AppContext";

const Dados = ({ handleNext }: { handleNext: () => void }) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const { setNome, setTelefone, listaNumerosSelecionados } = useContext(AppContext);

  const phoneValue = watch("telefone");

  useEffect(() => {
    setValue("telefone", normalizePhoneNumber(phoneValue));
  }, [phoneValue, setValue]);

  const handleBack = () => {
    navigate("/");
  };

  const salvarDados = async ({ nome, telefone }: { nome: string; telefone: string }) => {
    try {
      const db = getDatabase(firebaseApp);

      const numerosRef = ref(db, `apostas/${telefone}`);

      let lista: string[] = [];
      let currentVal;

      onValue(numerosRef, (snapshot) => {
        currentVal = snapshot.val();

        if (currentVal) {
          lista = [...listaNumerosSelecionados, ...currentVal.listaNumerosSelecionados];
        } else {
          lista = listaNumerosSelecionados;
        }
      });

      if (lista.length > 0) {
        const json = {
          ...(currentVal || {}),
          nome,
          telefone,
          listaNumerosSelecionados: lista,
          historico: { ...(currentVal || { historico: [] }).historico, [+new Date()]: { ok: false, numeros: listaNumerosSelecionados } },
        };

        set(ref(db, "apostas/" + telefone), json);
      }
    } catch (error) {
      console.error("Erro ao salvar os dados:", error);
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setNome(data.nome);
    setTelefone(data.telefone);

    salvarDados(data as unknown as { nome: string; telefone: string });
    handleNext();
  };

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container direction={"column"} justifyContent={"center"} gap={2}>
          <Grid>
            <TextField
              {...register("nome", { required: true })}
              label="Nome"
              placeholder="Informe o seu nome"
              name="nome"
              error={Boolean(errors.nome)}
              helperText={errors.nome && "Este campo é obrigatório."}
            />
          </Grid>

          <Grid>
            <TextField
              {...register("telefone", { required: true })}
              type="tel"
              label="Telefone"
              placeholder="Informe o seu WhatsApp"
              name="telefone"
              error={Boolean(errors.telefone)}
              helperText={errors.telefone && "Este campo é obrigatório."}
              defaultValue={"48"}
            />
          </Grid>

          <Grid container>
            <Grid xs={6} sx={{ paddingRight: 1 }}>
              <Button type="button" variant="outlined" onClick={handleBack}>
                Voltar
              </Button>
            </Grid>

            <Grid xs={6} sx={{ paddingLeft: 1 }}>
              <Button type="submit" color="primary">
                Próximo
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default Dados;
