'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Copy, Check, Plus, ExternalLink, MousePointerClick } from 'lucide-react';

const ADMIN_EMAIL = 'larsbeurskens@gmail.com';

const VERTICAL_OPTIONS = [
  { value: 'plumbing', label: '🔧 Plumbing', destination: '/plumbing#hear-it' },
  { value: 'window-cleaning', label: '🪟 Window Cleaning', destination: '/window-cleaning#hear-it' },
  { value: 'hvac', label: '❄️ HVAC', destination: '/hvac#hear-it' },
  { value: 'homepage', label: '🏠 Homepage', destination: '/#hear-it' },
];

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://supportiveai.com';

interface LinkClick {
  id: string;
  createdAt: string;
  ip: string | null;
  userAgent: string | null;
}

interface TrackedLink {
  id: string;
  createdAt: string;
  slug: string;
  label: string;
  destination: string;
  vertical: string | null;
  clicks: LinkClick[];
  _count: { clicks: number };
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#faf9f7] border border-[#e5e0da] hover:bg-[#f0eeeb] transition-colors text-[12px] font-semibold text-[#2a4a5e] cursor-pointer"
    >
      {copied ? <Check size={13} className="text-[#059669]" /> : <Copy size={13} />}
      {copied ? 'Copied!' : 'Copy link'}
    </button>
  );
}

function VerticalBadge({ vertical }: { vertical: string | null }) {
  const map: Record<string, { label: string; color: string }> = {
    'plumbing': { label: '🔧 Plumbing', color: 'bg-[#eef2ff] text-[#3730a3]' },
    'window-cleaning': { label: '🪟 Window Cleaning', color: 'bg-[#f0fdf4] text-[#166534]' },
    'hvac': { label: '❄️ HVAC', color: 'bg-[#eff6ff] text-[#1e40af]' },
    'homepage': { label: '🏠 Homepage', color: 'bg-[#faf9f7] text-[#5a7184]' },
  };
  const v = map[vertical ?? ''] ?? { label: vertical ?? '—', color: 'bg-[#faf9f7] text-[#94a7b8]' };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${v.color}`}>
      {v.label}
    </span>
  );
}

export default function OutreachPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [links, setLinks] = useState<TrackedLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Form state
  const [formLabel, setFormLabel] = useState('');
  const [formVertical, setFormVertical] = useState('plumbing');
  const [formSlugOverride, setFormSlugOverride] = useState('');

  function derivedSlug() {
    if (formSlugOverride) return formSlugOverride;
    return formLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function derivedDestination() {
    return VERTICAL_OPTIONS.find(v => v.value === formVertical)?.destination ?? '/';
  }

  async function fetchLinks() {
    try {
      const res = await fetch('/api/links');
      const data = await res.json();
      setLinks(data);
    } catch { } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email !== ADMIN_EMAIL) {
      router.replace('/dashboard');
    }
  }, [status, session, router]);

  useEffect(() => { fetchLinks(); }, []);

  async function handleCreate() {
    setCreating(true);
    setCreateError('');
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: derivedSlug(),
          label: formLabel,
          destination: derivedDestination(),
          vertical: formVertical,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        setCreateError(err.error ?? 'Something went wrong');
        return;
      }
      setFormLabel('');
      setFormSlugOverride('');
      setFormVertical('plumbing');
      setShowCreate(false);
      fetchLinks();
    } catch {
      setCreateError('Network error — try again');
    } finally {
      setCreating(false);
    }
  }

  const totalClicks = links.reduce((sum, l) => sum + l._count.clicks, 0);
  const linksWithClicks = links.filter(l => l._count.clicks > 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#1a2e3b]">Outreach links</h1>
          <p className="text-[13px] text-[#94a7b8] mt-1">
            Personalised tracked links for cold outreach — see exactly who clicked and when
          </p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 bg-[#e8930c] text-white px-4 py-2.5 rounded-lg text-[13px] font-bold hover:bg-[#d17f00] transition-colors cursor-pointer border-none"
        >
          <Plus size={15} /> New link
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total links', value: links.length },
          { label: 'Total clicks', value: totalClicks },
          { label: 'Links opened', value: `${linksWithClicks} / ${links.length}` },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#e5e0da] px-5 py-4">
            <div className="text-[24px] font-extrabold text-[#1a2e3b]">{s.value}</div>
            <div className="text-[12px] text-[#94a7b8] font-medium mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="bg-white rounded-xl border border-[#e8930c] p-6">
          <h3 className="text-[15px] font-bold text-[#1a2e3b] mb-4">Create new link</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[12px] font-semibold text-[#5a7184] mb-1.5">Contact / business name</label>
              <input
                type="text"
                placeholder="e.g. Mike Reynolds – ABC Plumbing"
                value={formLabel}
                onChange={e => setFormLabel(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-[#d1ccc6] text-[14px] text-[#1a2e3b] placeholder-[#94a7b8] focus:outline-none focus:border-[#e8930c]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#5a7184] mb-1.5">Vertical (destination)</label>
              <select
                value={formVertical}
                onChange={e => setFormVertical(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-[#d1ccc6] text-[14px] text-[#1a2e3b] bg-white focus:outline-none focus:border-[#e8930c]"
              >
                {VERTICAL_OPTIONS.map(v => (
                  <option key={v.value} value={v.value}>{v.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-[12px] font-semibold text-[#5a7184] mb-1.5">
              URL slug <span className="font-normal text-[#94a7b8]">(auto-generated, or override)</span>
            </label>
            <div className="flex items-center gap-0">
              <span className="px-3 py-2.5 bg-[#faf9f7] border border-r-0 border-[#d1ccc6] rounded-l-lg text-[13px] text-[#94a7b8] whitespace-nowrap">
                supportiveai.com/for/
              </span>
              <input
                type="text"
                placeholder={derivedSlug() || 'auto'}
                value={formSlugOverride}
                onChange={e => setFormSlugOverride(e.target.value)}
                className="flex-1 px-3 py-2.5 border border-[#d1ccc6] rounded-r-lg text-[14px] text-[#1a2e3b] placeholder-[#94a7b8] focus:outline-none focus:border-[#e8930c]"
              />
            </div>
            <p className="text-[11px] text-[#94a7b8] mt-1.5">
              → Destination: <span className="text-[#5a7184] font-medium">{SITE_URL}{derivedDestination()}</span>
            </p>
          </div>
          {createError && <p className="text-[13px] text-red-500 mb-3">{createError}</p>}
          <div className="flex gap-3">
            <button
              onClick={handleCreate}
              disabled={!formLabel || creating}
              className="bg-[#e8930c] text-white px-5 py-2.5 rounded-lg text-[13px] font-bold hover:bg-[#d17f00] transition-colors disabled:opacity-50 cursor-pointer border-none"
            >
              {creating ? 'Creating…' : 'Create link'}
            </button>
            <button
              onClick={() => { setShowCreate(false); setCreateError(''); }}
              className="px-5 py-2.5 rounded-lg text-[13px] font-semibold text-[#5a7184] bg-[#faf9f7] border border-[#e5e0da] hover:bg-[#f0eeeb] transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Links table */}
      <div className="bg-white rounded-xl border border-[#e5e0da] overflow-hidden">
        <div className="px-5 py-3 border-b border-[#e5e0da] flex items-center gap-2">
          <span className="text-[12px] font-bold text-[#5a7184] uppercase tracking-wider">
            {links.length} link{links.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <div className="p-10 text-center">
            <div className="w-5 h-5 border-2 border-[#1a2e3b] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : links.length === 0 ? (
          <div className="p-10 text-center">
            <MousePointerClick size={32} className="text-[#d1ccc6] mx-auto mb-3" />
            <p className="text-[14px] font-semibold text-[#5a7184]">No links yet</p>
            <p className="text-[13px] text-[#94a7b8] mt-1">Create your first personalised link above</p>
          </div>
        ) : (
          <div className="divide-y divide-[#f0eeeb]">
            {links.map(link => {
              const fullUrl = `${SITE_URL}/for/${link.slug}`;
              const lastClick = link.clicks[0];
              const isExpanded = expandedId === link.id;

              return (
                <div key={link.id}>
                  <div
                    className="px-5 py-4 hover:bg-[#faf9f7] transition-colors cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : link.id)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      {/* Left: label + URL */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2.5 mb-1">
                          <span className="text-[14px] font-bold text-[#1a2e3b] truncate">{link.label}</span>
                          <VerticalBadge vertical={link.vertical} />
                        </div>
                        <span className="text-[12px] text-[#94a7b8] font-mono truncate block">
                          supportiveai.com/for/{link.slug}
                        </span>
                      </div>

                      {/* Right: stats + actions */}
                      <div className="flex items-center gap-4 flex-shrink-0">
                        {/* Click count */}
                        <div className="text-center min-w-[48px]">
                          <div className={`text-[20px] font-extrabold ${link._count.clicks > 0 ? 'text-[#059669]' : 'text-[#d1ccc6]'}`}>
                            {link._count.clicks}
                          </div>
                          <div className="text-[10px] text-[#94a7b8] font-medium">click{link._count.clicks !== 1 ? 's' : ''}</div>
                        </div>

                        {/* Last seen */}
                        <div className="text-right min-w-[80px]">
                          {lastClick ? (
                            <>
                              <div className="text-[12px] font-semibold text-[#1a2e3b]">{timeAgo(lastClick.createdAt)}</div>
                              <div className="text-[10px] text-[#94a7b8]">last click</div>
                            </>
                          ) : (
                            <div className="text-[12px] text-[#d1ccc6]">Not opened</div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                          <CopyButton text={fullUrl} />
                          <a
                            href={fullUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-1.5 rounded-lg hover:bg-[#f0eeeb] transition-colors text-[#94a7b8] hover:text-[#1a2e3b]"
                          >
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded click log */}
                  {isExpanded && (
                    <div className="px-5 pb-4 bg-[#faf9f7] border-t border-[#f0eeeb]">
                      <div className="flex items-center justify-between mb-3 pt-3">
                        <p className="text-[12px] font-bold text-[#5a7184] uppercase tracking-wider">Click history</p>
                        <span className="text-[12px] text-[#94a7b8]">Created {formatDate(link.createdAt)}</span>
                      </div>
                      {link._count.clicks === 0 ? (
                        <p className="text-[13px] text-[#94a7b8] py-2">No clicks yet — send the link to get started.</p>
                      ) : (
                        <ClickLog linkId={link.id} />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Lazy-loads full click history only when row is expanded
function ClickLog({ linkId }: { linkId: string }) {
  const [clicks, setClicks] = useState<LinkClick[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/links/${linkId}/clicks`)
      .then(r => r.json())
      .then(data => { setClicks(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [linkId]);

  if (loading) return <div className="py-2"><div className="w-4 h-4 border-2 border-[#1a2e3b] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
      {clicks.map((c, i) => (
        <div key={c.id} className="flex items-center gap-3 py-1.5 border-b border-[#e5e0da] last:border-0">
          <div className="w-5 h-5 rounded-full bg-[#eef9f0] flex items-center justify-center flex-shrink-0">
            <MousePointerClick size={11} className="text-[#059669]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-[#1a2e3b]">{timeAgo(c.createdAt)}</span>
              <span className="text-[11px] text-[#94a7b8]">·</span>
              <span className="text-[11px] text-[#94a7b8]">{new Date(c.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
            </div>
            {c.userAgent && (
              <p className="text-[11px] text-[#94a7b8] truncate mt-0.5">{c.userAgent.slice(0, 80)}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
