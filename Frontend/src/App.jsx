import "./style.scss";
import { RouterProvider } from "react-router-dom";

import { authRouter } from "./app.routes.jsx";
import { AuthProvider } from "./auth/serives/auth.context.jsx";
import { InterviewProvider } from "./interview/services/interview.context.jsx";

function App() {
    return (
        <AuthProvider>
            <InterviewProvider> 
<RouterProvider router={authRouter} />
            </InterviewProvider>
        </AuthProvider>
    );
}

export default App;