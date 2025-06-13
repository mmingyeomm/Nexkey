'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ethers } from 'ethers';
import { Web3Provider as EthersWeb3Provider } from '@ethersproject/providers';
import { InjectedConnector } from '@web3-react/injected-connector';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 56, 97, 137, 80001], // Add your supported chain IDs
});

interface Web3ContextType {
  account: string | null;
  provider: EthersWeb3Provider | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnecting: boolean;
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  provider: null,
  connect: async () => {},
  disconnect: () => {},
  isConnecting: false,
});

export const Web3ContextProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<EthersWeb3Provider | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useCallback(async () => {
    try {
      setIsConnecting(true);
      
      if (!window.ethereum) {
        throw new Error('Please install MetaMask or another Web3 wallet to use this feature');
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      
      setAccount(account);
      setProvider(provider);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      if (error instanceof Error) {
        throw new Error(`Wallet connection failed: ${error.message}`);
      }
      throw new Error('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAccount(null);
    setProvider(null);
  }, []);

  return (
    <Web3Context.Provider value={{ account, provider, connect, disconnect, isConnecting }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context); 