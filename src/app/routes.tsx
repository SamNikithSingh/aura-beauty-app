import { createBrowserRouter, Navigate } from "react-router-dom";
import { SplashScreen } from "./components/SplashScreen";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { MobileLayout } from "./components/MobileLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { HomeScreen } from "./screens/HomeScreen";
import { ChatScreen } from "./screens/ChatScreen";
import { SkinCareChatScreen } from "./screens/SkinCareChatScreen";
import { RoutineScreen } from "./screens/RoutineScreen";
import { ProductsScreen } from "./screens/ProductsScreen";
import { ProgressScreen } from "./screens/ProgressScreen";
import { PremiumScreen } from "./screens/PremiumScreen";
import Login from "./screens/Login";

export const router = createBrowserRouter([
  { path: "/", Component: SplashScreen },
  { path: "/onboarding", Component: OnboardingScreen },
  { path: "/login", Component: Login },
  {
    // Protected routes wrapped in ProtectedRoute
    element: <ProtectedRoute />,
    children: [
      {
        Component: MobileLayout,
        children: [
          { path: "/home", Component: HomeScreen },
          { path: "/chat", Component: ChatScreen },
          { path: "/skincare-chat", Component: SkinCareChatScreen },
          { path: "/routine", Component: RoutineScreen },
          { path: "/products", Component: ProductsScreen },
          { path: "/progress", Component: ProgressScreen },
          { path: "/premium", Component: PremiumScreen },
        ],
      },
    ],
  },
  // Fallback for unknown routes
  { path: "*", element: <Navigate to="/home" replace /> }
]);

