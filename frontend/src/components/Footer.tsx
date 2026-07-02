import { Github } from 'lucide-react';
import { GITHUB_URL } from '@/lib/contract';

export function Footer() {
  return (
    <footer className="mt-4 border-t border-hairline/70 bg-surface/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-6 text-xs text-content-dim sm:flex-row sm:items-center sm:justify-between">
        <span>
          &copy; {new Date().getFullYear()} Zentinel · confidential collateralization on
          Zama&rsquo;s FHEVM
        </span>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-content-dim transition-colors hover:text-brand"
        >
          <Github className="h-3.5 w-3.5" />
          Source
        </a>
      </div>
    </footer>
  );
}
