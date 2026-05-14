import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { Home, MessageCircle, Sun, ShoppingBag, TrendingUp } from "lucide-react";

const NAV_ITEMS = [
  { path: "/home", icon: Home, label: "Home" },
  { path: "/routine", icon: Sun, label: "Routine" },
  { path: "/chat", icon: MessageCircle, label: "Chat" },
  { path: "/products", icon: ShoppingBag, label: "Shop" },
  { path: "/progress", icon: TrendingUp, label: "Progress" },
];

export function MobileLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const hideNav = location.pathname === "/premium" || location.pathname === "/skincare-chat";

  return (
    <div
      className="relative flex flex-col min-h-screen"
      style={{
        background: "#F8F5FF",
        maxWidth: 430,
        margin: "0 auto",
      }}
    >
      <div className={`flex-1 overflow-y-auto ${hideNav ? "" : "pb-24"}`}>
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      {!hideNav && (
        <div
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full px-3 pb-5 pt-2"
          style={{ maxWidth: 430, zIndex: 50 }}
        >
          <div
            className="flex items-center justify-around rounded-3xl px-2 py-3"
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(123, 63, 196, 0.1)",
              boxShadow: "0 -4px 32px rgba(107, 33, 168, 0.1), 0 2px 0 rgba(255,255,255,0.8)",
            }}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.path}
                  whileTap={{ scale: 0.88 }}
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center gap-1 px-3 py-1 rounded-2xl transition-all duration-300"
                >
                  <div className="relative flex items-center justify-center" style={{ width: 32, height: 32 }}>
                    {isActive && (
                      <motion.div
                        layoutId="nav-glow"
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: "rgba(123, 63, 196, 0.12)",
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <Icon
                      size={20}
                      color={isActive ? "#7B3FC4" : "#A9A4C0"}
                      strokeWidth={isActive ? 2 : 1.5}
                    />
                  </div>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 10,
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? "#7B3FC4" : "#A9A4C0",
                      letterSpacing: 0.2,
                    }}
                  >
                    {item.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
