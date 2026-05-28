import { useContext } from "react";
import { SocketContext } from "./context/SocketContext";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <>
      <div className="app">
        <Dashboard />
      </div>
    </>
  );
}

export default App;
