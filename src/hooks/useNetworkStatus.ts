import { useEffect, useState } from 'react';
import { Network } from '@capacitor/network';

const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState({
    connected: false,
    connectionType: 'unknown'
  });

  useEffect(() => {
    const getStatus = async () => {
      const status = await Network.getStatus();
      setNetworkStatus(status);
    };

    getStatus();

    const addNetworkListener = async () => {
      const handler = await Network.addListener('networkStatusChange', (status) => {
        setNetworkStatus(status);
      });

      // Clean up the listener when the component unmounts
      return () => {
        handler.remove();
      };
    };

    const setupListener = async () => {
      const cleanup = await addNetworkListener();
      return cleanup;
    };

    const cleanupPromise = setupListener();

    return () => {
      cleanupPromise.then((cleanup) => cleanup());
    };
  }, []);

  return networkStatus;
};

export default useNetworkStatus;
