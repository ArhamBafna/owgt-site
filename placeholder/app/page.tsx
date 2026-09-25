"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import Image from "next/image";
import { DrawablyButton, DrawablyCheckbox, DrawablyInput, DrawablyUnderline } from "drawably/react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [wantsEarlyAccess, setWantsEarlyAccess] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const validateEmailFormat = (value: string): boolean => {
    const trimmed = value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(trimmed);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (emailError) {
      setEmailError("");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError("Please enter your email first");
      return;
    }

    if (!validateEmailFormat(trimmed)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setEmailError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmed,
          early_access: wantsEarlyAccess,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setEmailError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setIsSubmitted(true);
    } catch {
      setEmailError("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText("https://owgt.org");
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-6 sm:p-8 md:p-10 relative overflow-x-hidden bg-white">
      {/* OWGT Identity - Centered */}
      <header className="w-full text-center flex flex-col items-center justify-center pt-2 sm:pt-4 z-10 mb-2 sm:mb-3">
        <a
          href="https://linktr.ee/owgt"
          target="_blank"
          rel="noopener noreferrer"
          className="header-logo-link cursor-pointer focus:outline-none"
          aria-label="OWGT Linktree - Logo"
        >
          <Image
            src="/owgt-logo.png"
            alt="OWGT Logo"
            width={144}
            height={144}
            priority
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 object-contain header-logo-img"
          />
        </a>
        <a
          href="https://linktr.ee/owgt"
          target="_blank"
          rel="noopener noreferrer"
          className="header-title-link cursor-pointer focus:outline-none mt-1"
          aria-label="OWGT Linktree - OneWorldGreaterTogether"
        >
          <h1 className="text-lg sm:text-xl font-bold tracking-wide text-owgt-blue text-center">
            <DrawablyUnderline className="inline-block">
              OneWorldGreaterTogether
            </DrawablyUnderline>
          </h1>
        </a>
      </header>

      {/* Main Content - Centered */}
      <main className="flex-1 flex flex-col items-center justify-start max-w-xl mx-auto w-full mt-2 sm:mt-4 mb-auto text-center py-2 sm:py-4">
        <div className="w-full space-y-5 sm:space-y-6 text-center flex flex-col items-center">
          {!isSubmitted ? (
            <>
              {/* Headline */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-owgt-red leading-tight tracking-tight text-center">
                oh... you found us early.
              </h2>

              {/* Supporting Copy */}
              <p className="text-base sm:text-lg md:text-xl font-bold text-black/90 leading-relaxed max-w-xl mx-auto text-center">
                we're building something new to{" "}
                <span className="text-owgt-blue">empower</span>{" "}
                <span className="text-owgt-blue">students</span> through education in{" "}
                <span className="text-owgt-blue">technology</span> and{" "}
                <span className="text-owgt-blue">stem</span>.
              </p>

              {/* Transition Text */}
              <div className="pt-1 flex justify-center w-full">
                <DrawablyUnderline className="inline-block">
                  <span className="text-lg sm:text-xl md:text-2xl font-medium text-black text-center">
                    be part of it!
                  </span>
                </DrawablyUnderline>
              </div>

              {/* Signup Form */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-2 w-full flex flex-col items-center" noValidate>
                {/* Checkbox */}
                <div className="flex items-center justify-center gap-3">
                  <DrawablyCheckbox
                    id="early-access"
                    checked={wantsEarlyAccess}
                    onChange={(e) => setWantsEarlyAccess(e.target.checked)}
                    aria-label="i want special early access"
                  />
                  <label
                    htmlFor="early-access"
                    className="text-base sm:text-lg text-black cursor-pointer select-none leading-none text-center"
                  >
                    i want special early access
                  </label>
                </div>

                {/* Email Input */}
                <div className="space-y-2 w-full max-w-lg mx-auto flex flex-col items-center">
                  <DrawablyInput
                    type="email"
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="your@email.com"
                    aria-label="Email address"
                    aria-invalid={emailError ? "true" : "false"}
                    aria-describedby={emailError ? "email-error" : undefined}
                    className="w-full text-base sm:text-lg text-center"
                    style={{ minHeight: "48px" }}
                  />
                  {emailError && (
                    <p id="email-error" className="text-sm font-medium text-owgt-red text-center" role="alert">
                      {emailError}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-center w-full">
                  <DrawablyButton
                    type="submit"
                    variant="solid"
                    disabled={isSubmitting}
                    state={isSubmitting ? "loading" : "idle"}
                    aria-label={isSubmitting ? "saving..." : "count me in!"}
                    className="text-base sm:text-lg font-medium cursor-pointer"
                    style={{
                      minHeight: "48px",
                      minWidth: "160px",
                    }}
                  >
                    <span>{isSubmitting ? "saving..." : "count me in!"}</span>
                  </DrawablyButton>
                </div>
              </form>

              {/* Secondary CTA - Newsletter Link */}
              <div className="pt-2 flex justify-center w-full text-center">
                <a
                  href="https://owgt-newsletter-rewards.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-block text-sm sm:text-base text-black/75 hover:text-black transition-colors text-center"
                >
                  <DrawablyUnderline className="[&_.drawably-svg]:opacity-0 group-hover:[&_.drawably-svg]:opacity-100 [&_.drawably-svg]:transition-opacity">
                    can't wait?
                  </DrawablyUnderline>
                </a>
              </div>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="space-y-5 sm:space-y-6 text-center flex flex-col items-center w-full">
                <div className="space-y-1 sm:space-y-1.5 text-center">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-owgt-red leading-tight tracking-tight text-center">
                    you're in.
                  </h2>

                  <p className="text-lg sm:text-xl md:text-2xl text-black/80 text-center">
                    great timing.
                  </p>
                </div>

                {/* Share Button */}
                <div className="pt-2 flex justify-center w-full">
                  <DrawablyButton
                    onClick={handleShare}
                    variant="outline"
                    aria-label="Share"
                    className="drawably-button--green font-medium cursor-pointer"
                    style={{
                      minHeight: "48px",
                      minWidth: "160px",
                    }}
                  >
                    <span className={isCopied ? "text-sm sm:text-base text-center" : "text-base sm:text-lg text-center"}>
                      {isCopied ? "link copied!" : "Share"}
                    </span>
                  </DrawablyButton>
                </div>

                {/* Secondary CTA - Newsletter Link */}
                <div className="pt-2 flex justify-center w-full text-center">
                  <a
                    href="https://owgt-newsletter-rewards.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-block text-sm sm:text-base text-black/75 hover:text-black transition-colors text-center"
                  >
                    <DrawablyUnderline className="[&_.drawably-svg]:opacity-0 group-hover:[&_.drawably-svg]:opacity-100 [&_.drawably-svg]:transition-opacity">
                      can't wait?
                    </DrawablyUnderline>
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
