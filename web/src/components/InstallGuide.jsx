"use client";

import { useState } from "react";
import { ChevronDown, Smartphone } from "lucide-react";

const INSTALL_STEPS = {
  android: [
    {
      step: 1,
      text: (
        <>
          Open in <strong>Chrome</strong>
        </>
      ),
    },
    {
      step: 2,
      text: (
        <>
          Tap the <strong>⋮ menu</strong> in the top right
        </>
      ),
    },
    {
      step: 3,
      text: (
        <>
          Tap <strong>&quot;Add to Home screen&quot;</strong>
        </>
      ),
    },
  ],
  ios: [
    {
      step: 1,
      text: (
        <>
          Open in <strong>Safari</strong>
        </>
      ),
    },
    {
      step: 2,
      text: (
        <>
          Tap the <strong>Share</strong> button at the bottom
        </>
      ),
    },
    {
      step: 3,
      text: (
        <>
          Tap <strong>&quot;Add to Home Screen&quot;</strong>
        </>
      ),
    },
  ],
  desktop: [
    {
      step: 1,
      text: (
        <>
          Open in <strong>Chrome</strong> or <strong>Edge</strong>
        </>
      ),
    },
    {
      step: 2,
      text: (
        <>
          Click the <strong>install icon</strong> in the address bar
        </>
      ),
    },
    {
      step: 3,
      text: (
        <>
          Click <strong>&quot;Install&quot;</strong>
        </>
      ),
    },
  ],
};

const OS_TABS = [
  { key: "android", label: "Android" },
  { key: "ios", label: "iPhone" },
  { key: "desktop", label: "Desktop" },
];

export default function InstallGuide() {
  const [open, setOpen] = useState(false);
  const [os, setOs] = useState("android");

  return (
    <div className="border-t border-border p-2">
      <button onClick={() => setOpen((prev) => !prev)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted transition-colors cursor-pointer" aria-expanded={open}>
        <Smartphone size={18} aria-hidden="true" />
        <span>Install app</span>
        <ChevronDown size={14} className={`ml-auto transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`} aria-hidden="true" />
      </button>

      <div className={`grid transition-all duration-300 ease-in-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <div className="mt-2 rounded-xl border border-border bg-muted/50 p-3">
            <p className="mb-2 text-xs font-medium text-foreground">Install Job Tracker</p>

            <div className="mb-3 flex gap-1">
              {OS_TABS.map(({ key, label }) => (
                <button key={key} onClick={() => setOs(key)} className={`rounded-lg px-2.5 py-1 text-xs transition-colors cursor-pointer ${os === key ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:bg-muted"}`}>
                  {label}
                </button>
              ))}
            </div>

            <ol className="space-y-2">
              {INSTALL_STEPS[os].map(({ step, text }) => (
                <li key={step} className="flex items-start gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground mt-0.5">{step}</span>
                  <span className="text-xs leading-relaxed text-muted-foreground/90">{text}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
