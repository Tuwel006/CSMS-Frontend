import { useAuthContexxt } from "@/context/AuthContext";
import AdminLayout from "./AdminLayout";
import PublicLayout from "./PublicLayout";

export default function Layout() {
  const {isAuth, role} = useAuthContexxt();
  if(isAuth && role==='admin') {
    return <AdminLayout />;
  }
  else {
    return <PublicLayout />;
  }
}
