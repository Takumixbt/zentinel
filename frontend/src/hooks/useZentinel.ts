import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useSignTypedData,
  useWriteContract,
} from 'wagmi';
import { toHex } from 'viem';
import {
  ZENTINEL_ABI,
  ZENTINEL_ADDRESS,
  CHAIN_ID,
  isZeroHandle,
} from '@/lib/contract';
import { lookupHandle, sleep } from '@/lib/utils';
import { useFhevm } from '@/providers/FhevmProvider';

export type StepState = 'idle' | 'active' | 'done';
export type ActivityKind = 'pending' | 'success' | 'error' | 'info';

export interface Activity {
  id: number;
  kind: ActivityKind;
  text: string;
  detail?: string;
}

export interface PlainPosition {
  collateral?: bigint;
  debt?: bigint;
}

let activitySeq = 0;

export function useZentinel() {
  const { address, isConnected, chainId } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const { signTypedDataAsync } = useSignTypedData();
  const { instance, status: fhevmStatus } = useFhevm();

  const correctChain = chainId === CHAIN_ID;
  const ready = isConnected && correctChain && fhevmStatus === 'ready' && !!instance;

  // ---- persisted-on-chain facts -------------------------------------------
  const [submittedDone, setSubmittedDone] = useState(false);
  const [computedDone, setComputedDone] = useState(false);

  // ---- decrypted / revealed values ----------------------------------------
  const [verdict, setVerdict] = useState<boolean | null>(null);
  const [plain, setPlain] = useState<PlainPosition>({});

  // ---- input --------------------------------------------------------------
  const [collateral, setCollateral] = useState('12000');
  const [debt, setDebt] = useState('5000');

  // ---- transient action flags ---------------------------------------------
  const [phase, setPhase] = useState<
    'idle' | 'encrypting' | 'submitting' | 'computing' | 'revealing' | 'decrypting'
  >('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [log, setLog] = useState<Activity[]>([]);

  const pushLog = useCallback((kind: ActivityKind, text: string, detail?: string) => {
    const id = ++activitySeq;
    setLog((l) => [...l, { id, kind, text, detail }]);
    return id;
  }, []);
  const settleLog = useCallback(
    (id: number, kind: ActivityKind, text?: string, detail?: string) => {
      setLog((l) =>
        l.map((a) =>
          a.id === id
            ? { ...a, kind, text: text ?? a.text, detail: detail ?? a.detail }
            : a,
        ),
      );
    },
    [],
  );

  // Required collateralization ratio (immutable, e.g. 150%).
  const { data: ratioRaw } = useReadContract({
    address: ZENTINEL_ADDRESS,
    abi: ZENTINEL_ABI,
    functionName: 'requiredRatioPercent',
    chainId: CHAIN_ID,
    query: { staleTime: Infinity },
  });
  const requiredRatio = ratioRaw ? Number(ratioRaw) : undefined;

  // Whether this wallet already has a position on-chain.
  const { data: hasPositionRaw } = useReadContract({
    address: ZENTINEL_ADDRESS,
    abi: ZENTINEL_ABI,
    functionName: 'hasPosition',
    args: address ? [address] : undefined,
    chainId: CHAIN_ID,
    query: { enabled: !!address && correctChain },
  });

  // Resume prior state when a returning wallet connects.
  const resumedFor = useRef<string | null>(null);
  useEffect(() => {
    if (!address || !correctChain || !publicClient) return;
    if (hasPositionRaw === undefined) return;
    const key = `${address}:${hasPositionRaw}`;
    if (resumedFor.current === key) return;
    resumedFor.current = key;

    if (!hasPositionRaw) {
      setSubmittedDone(false);
      setComputedDone(false);
      setVerdict(null);
      setPlain({});
      return;
    }
    setSubmittedDone(true);
    (async () => {
      try {
        const handle = (await publicClient.readContract({
          address: ZENTINEL_ADDRESS,
          abi: ZENTINEL_ABI,
          functionName: 'getVerdict',
          args: [address],
        })) as string;
        setComputedDone(!isZeroHandle(handle));
      } catch {
        /* ignore */
      }
    })();
  }, [address, correctChain, hasPositionRaw, publicClient]);

  const resetOnDisconnect = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (address !== resetOnDisconnect.current) {
      resetOnDisconnect.current = address;
      setVerdict(null);
      setPlain({});
      setPhase('idle');
      setErrorMsg(null);
      setLog([]);
    }
  }, [address]);

  // ---- actions ------------------------------------------------------------

  const encryptAndSubmit = useCallback(async () => {
    if (!ready || !instance || !address) return;
    setErrorMsg(null);
    let c: bigint;
    let d: bigint;
    try {
      c = BigInt(collateral || '0');
      d = BigInt(debt || '0');
    } catch {
      setErrorMsg('Collateral and debt must be whole numbers.');
      return;
    }
    if (c <= 0n) {
      setErrorMsg('Collateral must be greater than zero.');
      return;
    }
    if (d < 0n) {
      setErrorMsg('Debt cannot be negative.');
      return;
    }
    const MAX = (1n << 63n); // keep collateral*100 & debt*ratio inside euint64
    if (c > MAX || d > MAX) {
      setErrorMsg('Values are too large for a 64-bit encrypted integer.');
      return;
    }

    const encId = pushLog('pending', 'Encrypting position client-side…', 'add64(collateral), add64(debt)');
    try {
      setPhase('encrypting');
      const input = instance.createEncryptedInput(ZENTINEL_ADDRESS, address);
      input.add64(c);
      input.add64(d);
      const { handles, inputProof } = await input.encrypt();
      settleLog(encId, 'success', 'Position encrypted', 'Ciphertext + ZK input proof generated');

      const txId = pushLog('pending', 'Submitting encrypted position…', 'Confirm in your wallet');
      setPhase('submitting');
      const hash = await writeContractAsync({
        address: ZENTINEL_ADDRESS,
        abi: ZENTINEL_ABI,
        functionName: 'submitPosition',
        args: [toHex(handles[0]), toHex(handles[1]), toHex(inputProof)],
      });
      settleLog(txId, 'pending', 'Waiting for confirmation…', hash);
      await publicClient?.waitForTransactionReceipt({ hash });
      settleLog(txId, 'success', 'Position stored on-chain', hash);
      setSubmittedDone(true);
      setComputedDone(false);
      setVerdict(null);
      setPlain({});
    } catch (e) {
      const msg = readableError(e);
      settleLog(encId, 'error', 'Submission failed', msg);
      setErrorMsg(msg);
    } finally {
      setPhase('idle');
    }
  }, [ready, instance, address, collateral, debt, pushLog, settleLog, writeContractAsync, publicClient]);

  const computeVerdict = useCallback(async () => {
    if (!ready || !address) return;
    setErrorMsg(null);
    const id = pushLog('pending', 'Computing verdict on ciphertext…', 'collateral × 100 ≥ debt × ratio');
    try {
      setPhase('computing');
      const hash = await writeContractAsync({
        address: ZENTINEL_ADDRESS,
        abi: ZENTINEL_ABI,
        functionName: 'computeVerdict',
        args: [],
      });
      settleLog(id, 'pending', 'Waiting for confirmation…', hash);
      await publicClient?.waitForTransactionReceipt({ hash });
      settleLog(id, 'success', 'Verdict computed & made publicly decryptable', hash);
      setComputedDone(true);
    } catch (e) {
      const msg = readableError(e);
      settleLog(id, 'error', 'Compute failed', msg);
      setErrorMsg(msg);
    } finally {
      setPhase('idle');
    }
  }, [ready, address, pushLog, settleLog, writeContractAsync, publicClient]);

  const revealVerdict = useCallback(async () => {
    if (!ready || !instance || !address || !publicClient) return;
    setErrorMsg(null);
    const id = pushLog(
      'pending',
      "Requesting public decryption from Zama's KMS…",
      'This can take ~15–20s',
    );
    try {
      setPhase('revealing');
      const handle = (await publicClient.readContract({
        address: ZENTINEL_ADDRESS,
        abi: ZENTINEL_ABI,
        functionName: 'getVerdict',
        args: [address],
      })) as string;
      if (isZeroHandle(handle)) {
        throw new Error('No verdict has been computed yet.');
      }

      // The relayer may need a moment to index a freshly-published handle.
      let clear: boolean | undefined;
      for (let attempt = 0; attempt < 6; attempt++) {
        try {
          const res = await instance.publicDecrypt([handle]);
          const v = lookupHandle(
            res.clearValues as unknown as Record<string, unknown>,
            handle,
          );
          clear = typeof v === 'boolean' ? v : Boolean(v);
          break;
        } catch (err) {
          if (attempt === 5) throw err;
          await sleep(2500);
        }
      }
      setVerdict(clear ?? false);
      settleLog(
        id,
        'success',
        `Verdict revealed: ${clear ? 'SAFE' : 'UNSAFE'}`,
        'Only the yes/no answer was decrypted',
      );
    } catch (e) {
      const msg = readableError(e);
      settleLog(id, 'error', 'Decryption failed', msg);
      setErrorMsg(msg);
    } finally {
      setPhase('idle');
    }
  }, [ready, instance, address, publicClient, pushLog, settleLog]);

  const revealMyPosition = useCallback(async () => {
    if (!ready || !instance || !address || !publicClient) return;
    setErrorMsg(null);
    const id = pushLog(
      'pending',
      'Decrypting your private figures…',
      'Sign the EIP-712 request in your wallet',
    );
    try {
      setPhase('decrypting');
      const [cHandle, dHandle] = (await publicClient.readContract({
        address: ZENTINEL_ADDRESS,
        abi: ZENTINEL_ABI,
        functionName: 'getMyPosition',
        account: address,
      })) as [string, string];

      if (isZeroHandle(cHandle) && isZeroHandle(dHandle)) {
        throw new Error('No position found for this wallet.');
      }

      const keypair = instance.generateKeypair();
      const startTimestamp = Math.floor(Date.now() / 1000);
      const durationDays = 1;
      const eip712 = instance.createEIP712(
        keypair.publicKey,
        [ZENTINEL_ADDRESS],
        startTimestamp,
        durationDays,
      );

      // viem derives EIP712Domain itself, so pass only the primary type.
      const signature = await signTypedDataAsync({
        domain: eip712.domain,
        types: {
          UserDecryptRequestVerification:
            eip712.types.UserDecryptRequestVerification,
        },
        primaryType: 'UserDecryptRequestVerification',
        message: eip712.message,
      } as any);

      const handles = [
        { handle: cHandle, contractAddress: ZENTINEL_ADDRESS },
        { handle: dHandle, contractAddress: ZENTINEL_ADDRESS },
      ];
      const res = await instance.userDecrypt(
        handles,
        keypair.privateKey,
        keypair.publicKey,
        signature.replace(/^0x/, ''),
        [ZENTINEL_ADDRESS],
        address,
        startTimestamp,
        durationDays,
      );

      const resRec = res as unknown as Record<string, unknown>;
      const cVal = lookupHandle(resRec, cHandle);
      const dVal = lookupHandle(resRec, dHandle);
      setPlain({
        collateral: cVal !== undefined ? BigInt(cVal as bigint) : undefined,
        debt: dVal !== undefined ? BigInt(dVal as bigint) : undefined,
      });
      settleLog(id, 'success', 'Private figures decrypted locally', 'Visible only to you');
    } catch (e) {
      const msg = readableError(e);
      settleLog(id, 'error', 'Private decryption failed', msg);
      setErrorMsg(msg);
    } finally {
      setPhase('idle');
    }
  }, [ready, instance, address, publicClient, signTypedDataAsync, pushLog, settleLog]);

  const startOver = useCallback(() => {
    setVerdict(null);
    setPlain({});
    setErrorMsg(null);
    setSubmittedDone(false);
    setComputedDone(false);
    resumedFor.current = null;
    pushLog('info', 'Ready for a new position', 'Enter figures and submit again');
  }, [pushLog]);

  // ---- derived step model -------------------------------------------------
  const steps = useMemo(() => {
    const connectDone = ready;
    const submitStep: StepState = !connectDone
      ? 'idle'
      : submittedDone
        ? 'done'
        : 'active';
    const computeStep: StepState = !submittedDone
      ? 'idle'
      : computedDone
        ? 'done'
        : 'active';
    const revealStep: StepState =
      !computedDone ? 'idle' : verdict !== null ? 'done' : 'active';
    return {
      connect: (connectDone ? 'done' : 'active') as StepState,
      submit: submitStep,
      compute: computeStep,
      reveal: revealStep,
    };
  }, [ready, submittedDone, computedDone, verdict]);

  return {
    // wallet / env
    address,
    isConnected,
    correctChain,
    fhevmStatus,
    ready,
    requiredRatio,
    // data
    submittedDone,
    computedDone,
    verdict,
    plain,
    // input
    collateral,
    setCollateral,
    debt,
    setDebt,
    // status
    phase,
    errorMsg,
    log,
    steps,
    // actions
    encryptAndSubmit,
    computeVerdict,
    revealVerdict,
    revealMyPosition,
    startOver,
  };
}

function readableError(e: unknown): string {
  if (!e) return 'Unknown error';
  const msg = e instanceof Error ? e.message : String(e);
  if (/user rejected|denied|rejected the request/i.test(msg)) {
    return 'Request rejected in wallet.';
  }
  if (/insufficient funds/i.test(msg)) {
    return 'Insufficient Sepolia ETH for gas.';
  }
  // Trim overly long RPC dumps.
  return msg.length > 160 ? msg.slice(0, 157) + '…' : msg;
}
