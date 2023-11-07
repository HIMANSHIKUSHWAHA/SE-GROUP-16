import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"
import Router from "./containers/router"
import { ThemeProvider } from '@mui/material/styles';
import { UserProvider } from "./context";
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
        <UserProvider>
      <Router />
        </UserProvider>
    </ThemeProvider>
  );
}

export default App