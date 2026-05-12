import Home from "./home/page";
import Login from "./login/page";

export default function Index() {

  const isLoggedIn = false; // Simulación de estado de autenticación

  return (
    <>
      {isLoggedIn ? <Home /> : <Login />}
    </>
  );
}
