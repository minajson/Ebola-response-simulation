import ControlBar from "@/components/ControlBar";
import { BrandLockup } from "@/components/ui/Brand";

/** Header for non-gameplay screens. */
export default function TopBar({ center, right }: { center?: React.ReactNode; right?: React.ReactNode }) {
  return (
    <header className="flex min-h-[64px] flex-none items-center gap-4 border-b border-line bg-surface px-4 py-2.5 sm:px-6">
      <BrandLockup />
      <div className="flex min-w-0 flex-1 items-center justify-center">{center}</div>
      <div className="flex flex-none items-center gap-3">
        {right}
        <ControlBar />
      </div>
    </header>
  );
}
