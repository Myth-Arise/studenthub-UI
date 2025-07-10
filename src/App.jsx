/* eslint-disable no-unused-vars */
import { Routes, Route, useLocation } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import AuthForm from "./components/AuthForm";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const location = useLocation();
  const isAuthPath = ["/login", "/sign-up"].includes(location.pathname);

  return (
    <>
      {!isAuthPath && <NavigationBar />}
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<AuthForm isLogin={true} />} />
        <Route path="/sign-up" element={<AuthForm isLogin={false} />} />
      </Routes>
    </>
  );
}

export default App;
