import { createBrowserRouter } from "react-router-dom";

import Login from "./auth/Pages/Login";
import Register from "./auth/Pages/Register";
import Protected from "./auth/Components/protected";
import Home from "./interview/pages/Home";
import Interview from "./interview/pages/Interview";

export const authRouter = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path : "/",
    element :<Protected> <Home/> </Protected> 
  },
  {
    path: "/interview",
    element: <Protected> <Interview/> </Protected>
  },
]);