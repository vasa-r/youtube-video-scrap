import { ScanText } from "lucide-react";
import { SignupForm } from "@/components/auth/signup-form";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-green-200/50 relative hidden lg:flex p-5 flex-col">
        <div className="flex items-center gap-1">
          <ScanText className="size-8" />
          <h1 className="text-2xl font-bold font-codystar">TRANSCRIBE</h1>
        </div>
        <div className="flex-1 flex justify-center items-center px-5 sm:px-7 md:px-15">
          <h3 className="text-3xl uppercase font-medium tracking-wider leading-15">
            Create your free account to unlock lightning-fast video breakdowns.
            No ads, no overload—just pure value.
          </h3>
        </div>
        <div className="md:py-5 flex gap-1.5 items-center justify-center md:justify-start absolute bottom-0">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md">
              <ScanText className="size-4" />
            </div>
            <h2 className="text-sm">Transcribe</h2>
          </Link>
          <p>•</p>
          <p className="text-xs">© 2025 Transcribe. All rights reserved</p>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex items-center gap-1 lg:hidden">
          <ScanText className="size-8 text-green-500" />
          <h1 className="text-2xl font-bold font-codystar">TRANSCRIBE</h1>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
        <div className="py-5 flex gap-1.5 items-center justify-center md:justify-start absolute bottom-0 lg:hidden">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md">
              <ScanText className="size-4" />
            </div>
            <h2 className="text-sm">Transcribe</h2>
          </Link>
          <p>•</p>
          <p className="text-xs">© 2025 Transcribe. All rights reserved</p>
        </div>
      </div>
    </div>
  );
}
