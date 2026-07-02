import { type ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  RainbowKitProvider,
  getDefaultConfig,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { CHAIN } from '@/lib/contract';

// A WalletConnect projectId enables mobile/QR wallets. Injected browser
// wallets (MetaMask, Rabby, ...) work regardless. Drop your own id in
// frontend/.env as VITE_WC_PROJECT_ID to enable the full wallet list.
const projectId =
  import.meta.env.VITE_WC_PROJECT_ID?.trim() || 'zentinel_demo_project_id';

export const wagmiConfig = getDefaultConfig({
  appName: 'Zentinel',
  projectId,
  chains: [CHAIN],
  ssr: false,
});

const queryClient = new QueryClient();

const theme = darkTheme({
  accentColor: '#22D3EE',
  accentColorForeground: '#04121a',
  borderRadius: 'medium',
  overlayBlur: 'small',
});

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={theme} modalSize="compact">
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
