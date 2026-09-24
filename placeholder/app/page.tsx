"use client";

import { useState, FormEvent } from "react";
import { DrawablyButton, DrawablyCheckbox, DrawablyInput, DrawablyUnderline } from "drawably/react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [wantsEarlyAccess, setWantsEarlyAccess] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [shareMessage, setShareMessage] = useState("");

  const validateEmail = (value: string): boolean => {
    // Basic email validation: must contain @ and .
    const hasAt = value.includes("@");
    const hasDot = value.includes(".");
    const isValid = hasAt && hasDot && value.length > 3;
    
    if (!isValid && value.length > 0) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
    
    return isValid;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value.length > 0) {
      validateEmail(value);
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    // Dummy submission - no backend yet
    console.log("Signup:", { email, wantsEarlyAccess });
    
    // Transition to success state
    setIsSubmitted(true);
  };

  const handleShare = async () => {
    const shareData = {
      title: "OWGT - Coming Soon",
      text: "Check out OWGT - empowering students through technology, STEM, and education!",
      url: window.location.href,
    };

    // Try Web Share API first (mobile)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShareMessage("Thanks for sharing!");
        setTimeout(() => setShareMessage(""), 3000);
      } catch (err) {
        // User cancelled or error occurred
        if ((err as Error).name !== "AbortError") {
          console.error("Share failed:", err);
        }
      }
    } else {
      // Fallback to clipboard (desktop)
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShareMessage("Link copied to clipboard!");
        setTimeout(() => setShareMessage(""), 3000);
      } catch (err) {
        console.error("Copy failed:", err);
        setShareMessage("Unable to copy link");
        setTimeout(() => setShareMessage(""), 3000);
      }
    }
  };

  return (
    <div className="min-h-screen sm:h-screen w-full flex flex-col justify-between sm:justify-center p-6 sm:p-8 md:p-12 relative overflow-x-hidden sm:overflow-hidden bg-white">
      {/* OWGT Identity - Centered */}
      <header className="w-full text-center flex flex-col items-center justify-center sm:absolute sm:top-8 md:top-10 sm:left-0 sm:right-0 sm:mx-auto z-10 mb-6 sm:mb-0">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-owgt-blue leading-none tracking-tight text-center">
            OWGT
          </h1>
          <p className="text-xs sm:text-sm font-medium text-owgt-blue mt-1 text-center">
            OneWorldGreaterTogether
          </p>
        </div>
      </header>

      {/* Main Content - Centered */}
      <main className="flex-1 sm:flex-none flex items-center justify-center max-w-xl mx-auto w-full my-auto text-center">
        <div className="w-full space-y-5 sm:space-y-6 text-center flex flex-col items-center">
          {!isSubmitted ? (
            <>
              {/* Headline */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black leading-tight tracking-tight text-center">
                Oh... you found us early.
              </h2>

              {/* Supporting Copy */}
              <p className="text-base sm:text-lg md:text-xl text-black/80 leading-relaxed max-w-lg mx-auto text-center">
                We're building something new to empower students through technology, STEM, and education.
              </p>

              {/* Transition Text */}
              <div className="pt-1 flex justify-center w-full">
                <DrawablyUnderline className="inline-block">
                  <span className="text-lg sm:text-xl md:text-2xl font-medium text-black text-center">
                    Be part of it.
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
                    aria-label="I want VERY early special access"
                  />
                  <label 
                    htmlFor="early-access" 
                    className="text-base sm:text-lg text-black cursor-pointer select-none leading-none text-center"
                  >
                    I want VERY early special access
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
                    required
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
                    disabled={!email || !!emailError}
                    aria-label="Count me in"
                    className="text-base sm:text-lg font-medium"
                    style={{ 
                      minHeight: "48px",
                      minWidth: "160px",
                    }}
                  >
                    Count me in →
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
                    Can't wait? Check out the newsletter →
                  </DrawablyUnderline>
                </a>
              </div>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="space-y-5 sm:space-y-6 text-center flex flex-col items-center w-full">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black leading-tight tracking-tight text-center">
                  You're in.
                </h2>
                
                <p className="text-lg sm:text-xl md:text-2xl text-black/80 text-center">
                  Good timing.
                </p>

                {/* Share Button */}
                <div className="pt-2 flex justify-center w-full">
                  <DrawablyButton
                    onClick={handleShare}
                    variant="outline"
                    tone="neutral"
                    aria-label="Share OWGT"
                    className="text-base sm:text-lg font-medium"
                    style={{ 
                      minHeight: "48px",
                      minWidth: "160px",
                    }}
                  >
                    Share OWGT →
                  </DrawablyButton>
                </div>

                {/* Share Confirmation Message */}
                {shareMessage && (
                  <p 
                    className="text-sm sm:text-base font-medium text-owgt-blue text-center"
                    role="status"
                    aria-live="polite"
                  >
                    {shareMessage}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
