import { useState, useEffect } from "react";

const InstallPWAButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS (since it does not support beforeinstallprompt)
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);

    // Listen for beforeinstallprompt event
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault(); // Prevent auto prompt
      setDeferredPrompt(event);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", (event) =>
        setDeferredPrompt(null)
      );
    };
  }, []);

  // Install PWA handler
  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choice) => {
        if (choice.outcome === "accepted") {
          console.log("PWA installed");
        }
        setDeferredPrompt(null);
      });
    }
  };

  return (
    <>

    </>
  );
};

export default InstallPWAButton;
