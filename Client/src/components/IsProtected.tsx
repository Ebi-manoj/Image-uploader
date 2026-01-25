import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../store/store";



export const IsProtected = () => {
    const { user, token } = useSelector((state: RootState) => state.auth);
    if (!user || !token) {
        return <Navigate to="/login" />;
    }
    return <Outlet />;
}