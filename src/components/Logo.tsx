type LogoSize = 'sm' | 'md' | 'lg';

const sizeConfig: Record<LogoSize, { icon: number; text: string; gap: string; radius: string; fontSize: string }> = {
  sm: { icon: 28, text: 'text-[15px]', gap: 'gap-2', radius: 'rounded-md', fontSize: 'text-sm' },
  md: { icon: 34, text: 'text-[17px]', gap: 'gap-2.5', radius: 'rounded-lg', fontSize: 'text-[17px]' },
  lg: { icon: 44, text: 'text-xl', gap: 'gap-3', radius: 'rounded-xl', fontSize: 'text-xl' },
};

export function Logo({ size = 'md', showText = true, brand }: { size?: LogoSize; showText?: boolean; brand?: string | null }) {
  const s = sizeConfig[size];

  // Cotorra brand — jade dot + lowercase wordmark
  if (brand === 'cotorra') {
    const dot = Math.round(s.icon * 0.4);
    return (
      <span className={`flex items-center ${s.gap}`}>
        <span className="inline-block rounded-full bg-[#0F9A66]" style={{ width: dot, height: dot }} />
        {showText && (
          <span className={`${s.text} font-bold text-[#16150F] tracking-tight lowercase`}>cotorra</span>
        )}
      </span>
    );
  }

  // Default — Supportive AI
  return (
    <span className={`flex items-center ${s.gap}`}>
      <span
        className={`flex items-center justify-center ${s.radius} bg-gradient-to-br from-[#1a2e3b] to-[#2a4a5e] text-white font-extrabold ${s.fontSize}`}
        style={{ width: s.icon, height: s.icon }}
      >
        S
      </span>
      {showText && (
        <span className={`${s.text} font-bold text-[#1a2e3b] tracking-tight`}>
          Supportive AI
        </span>
      )}
    </span>
  );
}
