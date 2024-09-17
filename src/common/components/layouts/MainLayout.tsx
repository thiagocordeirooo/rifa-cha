import { Container, Grid } from "@mui/material";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Container maxWidth="lg" sx={{ paddingTop: 4, paddingBottom: 4 }}>
        <Grid container justifyContent={"center"}>
          <img src="/fundo.png" width="100%" alt="baby" style={{ maxWidth: 350 }} />
        </Grid>
        <br />
        <br />
        <Outlet />
      </Container>
    </>
  );
};
export default MainLayout;
