import AndroidIcon from '@mui/icons-material/Android';
import GetAppIcon from '@mui/icons-material/GetApp';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import React from 'react';

const InstallPWA = ({ deferredPrompt, isIOSDevice, isAndroid }) => {
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
    } catch (err) {
      console.error('Error showing install prompt:', err);
    }
  };

  const showIOSInstructions = () => {
    alert(
      'To install this app on iOS:\n\n' +
      '1. Tap the Share button in your browser\n' +
      '2. Scroll down and tap "Add to Home Screen"\n' +
      '3. Tap "Add" to confirm'
    );
  };

  if (!deferredPrompt && !isIOSDevice && !isAndroid) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <button
        onClick={isIOSDevice ? showIOSInstructions : handleInstallClick}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 
                 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300
                 hover:scale-105 active:scale-95"
      >
        {isIOSDevice ? (
          <>
            <PhoneIphoneIcon />
            <span>Install on iOS</span>
          </>
        ) : isAndroid ? (
          <>
            <AndroidIcon />
            <span>Install App</span>
          </>
        ) : (
          <>
            <GetAppIcon />
            <span>Install TaskTame</span>
          </>
        )}
      </button>
    </div>
  );
};

export default InstallPWA; 