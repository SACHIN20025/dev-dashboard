import React from "react";
import { Flame } from "lucide-react";
import { theme, } from "../theme";
import { PULSE } from "../data";

export default function PulseGraph({ loading }) {
  const max = 4;
  return (
    <div className="lg:col-span-1 rounded-xl p-4 flex flex-col gap-3" style={{ background: theme.surface, border: `1px solid ${theme.border}` }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium flex items-center gap-1.5" style={{ color: theme.textPrimary }}>
          <Flame size={13} style={{ color: theme.amber }} /> Commit pulse
        </span>
        <span className="text-[10px]" style={{ color: theme.textMuted, fontFamily: "ui-monospace, monospace" }}>4wk</span>
      </div>
      {loading ? (
        <div className="h-24 rounded animate-pulse" style={{ background: theme.borderSoft }} />
      ) : (
        <div className="flex items-center justify-center py-2">
          <div className="grid grid-flow-col gap-1" style={{ gridTemplateRows: "repeat(7, 1fr)" }}>
            {PULSE.map((v, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-[3px]"
                style={{
                  background: v === 0 ? theme.borderSoft : theme.green,
                  opacity: v === 0 ? 1 : 0.25 + (v / max) * 0.75,
                }}
                title={`${v} completions`}
              />
            ))}
          </div>
        </div>
      )}
      <p className="text-[11px]" style={{ color: theme.textMuted }}>
        Daily task completions across the team, last 4 weeks.
      </p>
    </div>
  );
}
