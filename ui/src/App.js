import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"
import Router from "./containers/router"
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router />
    </ThemeProvider>
  );
}

export default App