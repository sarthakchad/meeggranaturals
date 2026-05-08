import { useState, useEffect } from "react";

const COUPON_CODE = "WELCOME10";
const STORAGE_KEY = "meegra_first_visit_shown";

export default function WelcomeCouponPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem(STORAGE_KEY);
    if (!hasVisited) {
      // Small delay so the page loads first, then the popup animates in
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem(STORAGE_KEY, "true");
    }, 400);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(COUPON_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = COUPON_CODE;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm transition-opacity duration-400 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleClose}
      />

      {/* Popup */}
      <div
        className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none`}
      >
        <div
          className={`relative pointer-events-auto w-full max-w-md overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 ${
            isClosing
              ? "opacity-0 scale-90 translate-y-4"
              : "opacity-100 scale-100 translate-y-0"
          }`}
          style={{
            background:
              "linear-gradient(135deg, hsl(36,33%,97%) 0%, hsl(36,20%,90%) 100%)",
          }}
        >
          {/* Decorative top accent bar */}
          <div
            className="h-1.5 w-full"
            style={{
              background:
                "linear-gradient(90deg, hsl(84,24%,42%) 0%, hsl(84,24%,55%) 50%, hsl(38,33%,63%) 100%)",
            }}
          />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors text-gray-500 hover:text-gray-800"
            aria-label="Close popup"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Content */}
          <div className="px-8 pt-8 pb-8 text-center">
            {/* Leaf icon */}
            <div className="mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, hsl(84,24%,45%) 0%, hsl(84,30%,55%) 100%)" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            </div>

            {/* Heading */}
            <h2
              className="font-display text-3xl font-semibold mb-2"
              style={{ color: "hsl(24,14%,15%)" }}
            >
              Welcome to Meegra Naturals!
            </h2>

            <p
              className="text-sm mb-6 leading-relaxed"
              style={{ color: "hsl(24,10%,40%)" }}
            >
              We're thrilled to have you here! As a special welcome gift, enjoy{" "}
              <strong style={{ color: "hsl(84,24%,40%)" }}>
                10% OFF
              </strong>{" "}
              on your first order.
            </p>

            {/* Coupon code box */}
            <div
              className="relative mx-auto max-w-xs rounded-xl border-2 border-dashed p-4 mb-6"
              style={{
                borderColor: "hsl(84,24%,48%)",
                background: "hsl(84,24%,48%,0.06)",
              }}
            >
              <p
                className="text-xs uppercase tracking-widest mb-1 font-medium"
                style={{ color: "hsl(24,10%,40%)" }}
              >
                Your Coupon Code
              </p>
              <p
                className="font-mono-alt text-2xl font-bold tracking-[0.15em]"
                style={{ color: "hsl(84,24%,38%)" }}
              >
                {COUPON_CODE}
              </p>

              {/* Sparkle decorations */}
              <div className="absolute -top-2 -right-2 text-yellow-500 animate-pulse text-lg">
                ✦
              </div>
              <div
                className="absolute -bottom-1 -left-1 text-yellow-500 animate-pulse text-sm"
                style={{ animationDelay: "0.5s" }}
              >
                ✦
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3 items-center">
              <button
                onClick={handleCopy}
                className="w-full max-w-xs flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                style={{
                  background: copied
                    ? "linear-gradient(135deg, hsl(142,60%,40%) 0%, hsl(142,50%,50%) 100%)"
                    : "linear-gradient(135deg, hsl(84,24%,42%) 0%, hsl(84,30%,52%) 100%)",
                }}
              >
                {copied ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                    Copy Coupon Code
                  </>
                )}
              </button>

              <button
                onClick={handleClose}
                className="text-xs transition-colors hover:underline"
                style={{ color: "hsl(24,10%,50%)" }}
              >
                No thanks, I'll pay full price
              </button>
            </div>

            {/* Fine print */}
            <p
              className="mt-5 text-[11px] leading-relaxed"
              style={{ color: "hsl(24,10%,55%)" }}
            >
              *Valid for first-time customers only. Cannot be combined with other
              offers. Apply code at checkout.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
