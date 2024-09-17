import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import './App.css';
import { AppContextProvider } from './contexts/AppContext';
import MainRoutes from './routes/main.routes';
import theme from './theme';

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContextProvider>
          <MainRoutes />
        </AppContextProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
