import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { Stepper } from '@/components/Stepper';
import { ConfidentialVault } from '@/components/ConfidentialVault';
import { ControlConsole } from '@/components/ControlConsole';
import { Footer } from '@/components/Footer';
import { useZentinel } from '@/hooks/useZentinel';

export default function App() {
  const z = useZentinel();

  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="flex-1">
        <Hero requiredRatio={z.requiredRatio} />

        <section className="mx-auto max-w-6xl px-5">
          <Stepper states={z.steps} />

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            {/* Controls first on mobile so the user can act; vault (payoff) second. */}
            <div className="order-2 lg:order-1">
              <ConfidentialVault z={z} />
            </div>
            <div className="order-1 lg:order-2">
              <ControlConsole z={z} />
            </div>
          </div>
        </section>

        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
