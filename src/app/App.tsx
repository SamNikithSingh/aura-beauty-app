import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { AuthProvider } from "./hooks/useAuth";
import { ProfileProvider } from "./hooks/useUserProfile";

export default function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <RouterProvider router={router} />
      </ProfileProvider>
    </AuthProvider>
  );
}
