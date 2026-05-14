import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Crown, X, Sparkles, Share2, Copy, Check, CreditCard, Shield, Zap } from "lucide-react";
import { useUserProfile } from "../hooks/useUserProfile";
import { PREMIUM_FEATURES } from "../data/mockData";

const PLANS = [
  {
    id: "monthly",
    label: "Monthly",
    price: "$9.99",
    period: "/mo",
    badge: null,
    saving: null,
    perDay: "$0.33/day",
  },
  {
    id: "yearly",
    label: "Yearly",
    price: "$59.99",
    period: "/yr",
    badge: "Best Value",
    saving: "Save 50%",
    perDay: "$0.16/day",
  },
];

export function PremiumScreen() {
  const navigate = useNavigate();
  const { profile } = useUserProfile();
  const [selectedPlan, setSelectedPlan] = useState("yearly");
  const [copiedCode, setCopiedCode] = useState(false);
  const [showReferral, setShowReferral] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(profile.referralCode || "AUR-XXXXX");
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handlePayment = () => {
    setPaymentLoading(true);
    // TODO: Integrate Stripe or RevenueCat here
    // stripe.redirectToCheckout({ priceId: selectedPlan === "yearly" ? "price_yearly_id" : "price_monthly_id" })
    setTimeout(() => {
      setPaymentLoading(false);
      alert("Stripe/RevenueCat integration coming soon! Replace this with your payment provider.");
    }, 1200);
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #1A0A4E 0%, #3D1080 45%, #5B21A3 75%, #7B3FC4 100%)" }}
    >
      {/* Ambient glows */}
      <div
        className="absolute rounded-full blur-3xl opacity-25 pointer-events-none"
        style={{ width: 300, height: 300, background: "radial-gradient(#C084FC, transparent)", top: "-5%", right: "-15%" }}
      />
      <div
        className="absolute rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ width: 250, height: 250, background: "radial-gradient(#E879F9, transparent)", bottom: "10%", left: "-10%" }}
      />

      {/* Close button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-14 right-5 z-10 flex items-center justify-center rounded-full"
        style={{ width: 36, height: 36, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
      >
        <X size={16} color="rgba(255,255,255,0.8)" />
      </button>

      <div className="px-5 pt-14 pb-32 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{
              background: "linear-gradient(135deg, rgba(255,215,0,0.3), rgba(255,165,0,0.2))",
              border: "1px solid rgba(255,215,0,0.4)",
              boxShadow: "0 0 30px rgba(255,215,0,0.25)",
            }}
          >
            <Crown size={28} color="#FFD700" />
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 30,
              fontWeight: 700,
              color: "white",
              lineHeight: 1.2,
              textShadow: "0 0 30px rgba(192, 132, 252, 0.5)",
            }}
          >
            Aura Premium
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.6)", marginTop: 8, lineHeight: 1.5 }}>
            Unlock your full beauty potential with<br />AI-powered personalized skincare
          </p>
        </motion.div>

        {/* Trust badges */}
        <div className="flex justify-center gap-4 mb-8">
          {[
            { icon: Shield, label: "Secure payment" },
            { icon: Zap, label: "Instant access" },
            { icon: CreditCard, label: "Cancel anytime" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-1.5">
                <Icon size={12} color="rgba(192, 132, 252, 0.9)" />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.55)" }}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Features */}
        <div className="mb-8">
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.45)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12, textAlign: "center" }}>
            Everything Included
          </p>
          <div className="flex flex-col gap-3">
            {PREMIUM_FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, duration: 0.35 }}
                className="flex items-start gap-3 rounded-2xl p-3.5"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(192, 132, 252, 0.2)",
                    border: "1px solid rgba(192, 132, 252, 0.3)",
                    fontSize: 18,
                  }}
                >
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13, color: "white" }}>
                    {feature.title}
                  </p>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2, lineHeight: 1.5 }}>
                    {feature.desc}
                  </p>
                </div>
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(192, 132, 252, 0.25)" }}>
                  <Check size={11} color="#C084FC" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-6">
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.45)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12, textAlign: "center" }}>
            Choose Your Plan
          </p>
          <div className="flex gap-3">
            {PLANS.map((plan) => (
              <motion.button
                key={plan.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedPlan(plan.id)}
                className="flex-1 rounded-2xl p-4 relative overflow-hidden text-left"
                style={{
                  background: selectedPlan === plan.id
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(255,255,255,0.06)",
                  border: selectedPlan === plan.id
                    ? "2px solid rgba(192, 132, 252, 0.7)"
                    : "1px solid rgba(255,255,255,0.1)",
                  boxShadow: selectedPlan === plan.id ? "0 0 30px rgba(192, 132, 252, 0.2)" : "none",
                  backdropFilter: "blur(8px)",
                }}
              >
                {plan.badge && (
                  <div
                    className="absolute top-2 right-2 px-2 py-0.5 rounded-full"
                    style={{ background: "linear-gradient(135deg, #FFD700, #FFA500)" }}
                  >
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, fontWeight: 700, color: "#1A0A4E" }}>
                      {plan.badge}
                    </span>
                  </div>
                )}
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.55)", marginBottom: 4 }}>
                  {plan.label}
                </p>
                <div className="flex items-baseline gap-0.5">
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: selectedPlan === plan.id ? "#C084FC" : "white" }}>
                    {plan.price}
                  </span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                    {plan.period}
                  </span>
                </div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
                  {plan.perDay}
                </p>
                {plan.saving && (
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#C084FC", marginTop: 4, fontWeight: 600 }}>
                    {plan.saving}
                  </p>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Payment CTA */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handlePayment}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 mb-2 relative overflow-hidden"
          style={{
            background: paymentLoading ? "rgba(255,255,255,0.15)" : "linear-gradient(135deg, #C084FC 0%, #7B3FC4 50%, #5421B5 100%)",
            boxShadow: paymentLoading ? "none" : "0 8px 32px rgba(192, 132, 252, 0.4)",
          }}
        >
          {paymentLoading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles size={17} color="rgba(255,255,255,0.7)" />
              </motion.div>
              <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 16, color: "rgba(255,255,255,0.7)" }}>
                Processing...
              </span>
            </>
          ) : (
            <>
              <Crown size={17} color="white" />
              <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 16, color: "white" }}>
                Start Free 7-Day Trial
              </span>
            </>
          )}
        </motion.button>

        {/* Payment methods */}
        <div className="flex items-center justify-center gap-3 mb-4">
          {["💳 Stripe", "📱 RevenueCat", "🔒 Secure"].map((item) => (
            <span key={item} style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.35)" }}>
              {item}
            </span>
          ))}
        </div>

        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "center", marginBottom: 20 }}>
          Cancel anytime · No commitment · Secure Stripe checkout
        </p>

        {/* Referral Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl overflow-hidden"
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(8px)",
          }}
        >
          <button
            onClick={() => setShowReferral((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3.5"
          >
            <div className="flex items-center gap-2">
              <Share2 size={15} color="#C084FC" />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "white" }}>
                Invite Friends, Get Premium Free
              </span>
            </div>
            <motion.div animate={{ rotate: showReferral ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <Sparkles size={14} color="rgba(192, 132, 252, 0.6)" />
            </motion.div>
          </button>

          <AnimatePresence>
            {showReferral && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="px-4 py-4">
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: 12 }}>
                    Share your code and earn{" "}
                    <span style={{ color: "#C084FC", fontWeight: 600 }}>100 Glow Points</span> for every friend who joins!
                  </p>

                  {/* Referral code display */}
                  <div
                    className="flex items-center gap-3 rounded-xl px-4 py-3 mb-4"
                    style={{ background: "rgba(192, 132, 252, 0.12)", border: "1px solid rgba(192, 132, 252, 0.3)" }}
                  >
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 700, color: "#C084FC", letterSpacing: 3, flex: 1 }}>
                      {profile.referralCode || "AUR-XXXXX"}
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={copyCode}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                      style={{ background: copiedCode ? "rgba(34, 197, 94, 0.2)" : "rgba(192, 132, 252, 0.2)" }}
                    >
                      {copiedCode ? (
                        <Check size={13} color="#4ADE80" />
                      ) : (
                        <Copy size={13} color="#C084FC" />
                      )}
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: copiedCode ? "#4ADE80" : "#C084FC" }}>
                        {copiedCode ? "Copied!" : "Copy"}
                      </span>
                    </motion.button>
                  </div>

                  {/* Points explanation */}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "You Earn", value: "100 Glow Points", emoji: "🎁" },
                      { label: "Friend Gets", value: "100 Glow Points", emoji: "🎀" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-xl p-3 text-center"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                      >
                        <span style={{ fontSize: 20 }}>{item.emoji}</span>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>{item.label}</p>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 700, color: "#C084FC", marginTop: 1 }}>{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: 10 }}>
                    Use Glow Points to unlock premium features & exciting rewards.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
