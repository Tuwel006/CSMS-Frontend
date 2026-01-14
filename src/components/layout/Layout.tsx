import { useAuthContexxt } from "@/context/AuthContext";
import MobileAdminLayout from "./MobileAdminLayout";
import PublicLayout from "./PublicLayout";

export default function Layout() {
  const {isAuth, role} = useAuthContexxt();
  if(isAuth && role==='admin') {
    return <MobileAdminLayout />;
  }
  else {
    return <PublicLayout />;
  }
}
