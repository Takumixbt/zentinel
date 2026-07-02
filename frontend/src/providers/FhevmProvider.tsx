import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  initSDK,
  createInstance,
  SepoliaConfig,
  type FhevmInstance,
} from '@zama-fhe/relayer-sdk/web';
import { CHAIN_ID } from '@/lib/contract';

type FhevmStatus = 'idle' | 'loading' | 'ready' | 'error';

interface FhevmContextValue {
  instance: FhevmInstance | null;
  status: FhevmStatus;
  error: string | null;
  retry: () => void;
}

const FhevmContext = createContext<FhevmContextValue | null>(null);

export function FhevmProvider({ children }: { children: ReactNode }) {
  const [instance, setInstance] = useState<FhevmInstance | null>(null);
  const [status, setStatus] = useState<FhevmStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    // Guard React 18 StrictMode double-invoke; allow explicit retry via nonce.
    if (startedRef.current && nonce === 0) return;
    startedRef.current = true;
    let cancelled = false;

    (async () => {
      setStatus('loading');
      setError(null);
      try {
        // Loads the TFHE + KMS WASM. Slow on first paint — hence the gate.
        await initSDK();
        const provider =
          typeof window !== 'undefined' && (window as any).ethereum
            ? (window as any).ethereum
            : 'https://ethereum-sepolia-rpc.publicnode.com';
        const inst = await createInstance({
          ...SepoliaConfig,
          network: provider,
          chainId: CHAIN_ID,
        });
        if (cancelled) return;
        setInstance(inst);
        setStatus('ready');
      } catch (e) {
        if (cancelled) return;
        console.error('[fhevm] init failed', e);
        setError(e instanceof Error ? e.message : 'Failed to initialize FHE runtime');
        setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [nonce]);

  return (
    <FhevmContext.Provider
      value={{ instance, status, error, retry: () => setNonce((n) => n + 1) }}
    >
      {children}
    </FhevmContext.Provider>
  );
}

export function useFhevm(): FhevmContextValue {
  const ctx = useContext(FhevmContext);
  if (!ctx) throw new Error('useFhevm must be used within FhevmProvider');
  return ctx;
}
