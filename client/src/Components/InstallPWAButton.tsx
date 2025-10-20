import { useEffect, useState } from "react";
import { Button } from "@mantine/core";

function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault(); // Prevent the mini-infobar from appearing
      setDeferredPrompt(e);
      setShowButton(true); // Show the button
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt(); // Show the install dialog
    const choiceResult = await deferredPrompt.userChoice;
    console.log("User choice:", choiceResult.outcome); // 'accepted' or 'dismissed'

    setDeferredPrompt(null); // Hide button after prompt
    setShowButton(false);
  };

  if (!showButton) return null;

  return <Button onClick={handleClick}>Install App</Button>;
}

export default InstallPWAButton;
