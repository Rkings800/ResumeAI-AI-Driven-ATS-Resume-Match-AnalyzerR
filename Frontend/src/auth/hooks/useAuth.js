import {useContext} from  "react";
import { AuthContext } from "../serives/auth.context.jsx";
import { login, register, logout } from "../serives/auth.api.js";

export const useAuth = () => {
    const context = useContext(AuthContext)
    const {user,setuser,loading,setloading} = context
    

    const handlelogin = async (email, password) => {
    setloading(true);
    try {
        const data = await login({ email, password });
        setuser(data.user);
        return data;
    } finally {
        setloading(false);
    }
};
    const handleRegister = async ({username,email,password}) => {
        setloading(true)
        try {
            const data = await register({username,email,password})
            setuser(data.user)
            return data
        } finally {
            setloading(false)
        }
    }
    const handleLogout = async () => {
        setloading(true)
        try {
            const data = await logout()
            setuser(null)
            return data
        } finally {
            setloading(false)
        }
    }
    return {user,loading,handlelogin,handleRegister,handleLogout}
}