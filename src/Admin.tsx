import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Edit2, Copy, Check, Globe, X, ExternalLink } from "lucide-react";

type ClientConfig = {
  id: string;
  name: string;
  logoUrl?: string;
  locale: 'en-GB' | 'en-US';
  defaultCurrency: 'GBP' | 'EUR' | 'USD' | 'JPY';
};

type FormState = {
  name: string;
  domain: string;
  logoUrl: string;
  locale: 'en-GB' | 'en-US';
  defaultCurrency: 'GBP' | 'EUR' | 'USD' | 'JPY';
};

const emptyForm: FormState = { name: '', domain: '', logoUrl: '', locale: 'en-GB', defaultCurrency: 'GBP' };

export default function Admin({ adminKey }: { adminKey: string }) {
  const [clients, setClients] = useState<ClientConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoLoading, setLogoLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const logoTimeout = useRef<ReturnType<typeof setTimeout>>();

  const headers = { 'Content-Type': 'application/json', 'x-admin-key': adminKey };

  useEffect(() => {
    fetch('/api/admin/clients', { headers })
      .then(r => {
        if (r.status === 401) { setAuthError(true); setLoading(false); return null; }
        return r.json();
      })
      .then(data => {
        if (!data) return;
        const list = Object.entries(data).map(([id, cfg]: [string, any]) => ({ id, ...cfg }));
        setClients(list);
        setLoading(false);
      })
      .catch(() => { setLoading(false); });
  }, []);

  const fetchLogo = (domain: string) => {
    if (!domain.trim()) { setLogoPreview(null); return; }
    setLogoLoading(true);
    const url = `https://logo.clearbit.com/${domain.trim()}`;
    const img = new Image();
    img.onload = () => {
      setLogoPreview(url);
      setForm(f => ({ ...f, logoUrl: url }));
      setLogoLoading(false);
    };
    img.onerror = () => { setLogoPreview(null); setLogoLoading(false); };
    img.src = url;
  };

  const handleDomainChange = (domain: string) => {
    setForm(f => ({ ...f, domain }));
    clearTimeout(logoTimeout.current);
    logoTimeout.current = setTimeout(() => fetchLogo(domain), 600);
  };

  const openAdd = () => {
    setForm(emptyForm);
    setLogoPreview(null);
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (c: ClientConfig) => {
    setForm({ name: c.name, domain: '', logoUrl: c.logoUrl ?? '', locale: c.locale, defaultCurrency: c.defaultCurrency });
    setLogoPreview(c.logoUrl ?? null);
    setEditing(c.id);
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditing(null); setForm(emptyForm); setLogoPreview(null); };

  const save = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    const payload = { name: form.name.trim(), logoUrl: form.logoUrl || undefined, locale: form.locale, defaultCurrency: form.defaultCurrency };
    try {
      if (editing) {
        const r = await fetch(`/api/admin/clients/${editing}`, { method: 'PUT', headers, body: JSON.stringify(payload) });
        const updated = await r.json();
        setClients(cs => cs.map(c => c.id === editing ? { ...updated } : c));
      } else {
        const r = await fetch('/api/admin/clients', { method: 'POST', headers, body: JSON.stringify(payload) });
        const created = await r.json();
        setClients(cs => [...cs, created]);
      }
      closeForm();
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const remove = async (id: string) => {
    await fetch(`/api/admin/clients/${id}`, { method: 'DELETE', headers });
    setClients(cs => cs.filter(c => c.id !== id));
    setDeleteConfirm(null);
  };

  const copyUrl = (id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/?c=${id}`);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const inp = (extra = {}) => ({
    style: { width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, color: '#0f172a', background: '#fff', boxSizing: 'border-box' as const, outline: 'none', ...extra }
  });

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'system-ui' }}>
      <p style={{ color: '#94a3b8', fontWeight: 600 }}>Loading…</p>
    </div>
  );

  if (authError) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'system-ui' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
        <p style={{ color: '#f43f5e', fontWeight: 700, fontSize: 16 }}>Invalid admin key</p>
        <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 6 }}>Check the URL and try again.</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, background: '#0f172a', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🔧</div>
            <div>
              <div style={{ fontWeight: 800, color: '#0f172a', fontSize: 16, lineHeight: 1.2 }}>Client Manager</div>
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>ROI Engine Admin</div>
            </div>
          </div>
          <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            <Plus size={14} /> Add Client
          </button>
        </div>
      </div>

      {/* Client list */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px' }}>
        {clients.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 0', color: '#94a3b8' }}>
            <Globe size={40} style={{ marginBottom: 16, opacity: 0.25 }} />
            <p style={{ fontWeight: 700, fontSize: 15, margin: '0 0 6px' }}>No clients yet</p>
            <p style={{ fontSize: 13, margin: 0 }}>Add your first client to generate a shareable URL.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {clients.map(c => (
              <div key={c.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
                {/* Logo */}
                <div style={{ width: 44, height: 44, borderRadius: 8, border: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                  {c.logoUrl
                    ? <img src={c.logoUrl} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }} />
                    : <span style={{ fontSize: 18, fontWeight: 800, color: '#cbd5e1' }}>{c.name[0]}</span>
                  }
                </div>

                {/* Name + badges */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 15, marginBottom: 5 }}>{c.name}</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#475569', background: '#f1f5f9', padding: '2px 8px', borderRadius: 999 }}>
                      {c.locale === 'en-GB' ? 'British English' : 'American English'}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#475569', background: '#f1f5f9', padding: '2px 8px', borderRadius: 999 }}>
                      {c.defaultCurrency}
                    </span>
                  </div>
                </div>

                {/* Shareable URL */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '7px 10px', fontSize: 12, color: '#64748b', fontFamily: 'monospace', minWidth: 0, maxWidth: 320, flexShrink: 1 }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                    {window.location.origin}/?c={c.id}
                  </span>
                  <button onClick={() => copyUrl(c.id)} title="Copy URL" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: copied === c.id ? '#059669' : '#94a3b8', flexShrink: 0, display: 'flex' }}>
                    {copied === c.id ? <Check size={13} /> : <Copy size={13} />}
                  </button>
                  <a href={`/?c=${c.id}`} target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8', display: 'flex', flexShrink: 0 }}>
                    <ExternalLink size={13} />
                  </a>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button onClick={() => openEdit(c)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '7px 12px', background: '#f1f5f9', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#475569' }}>
                    <Edit2 size={12} /> Edit
                  </button>
                  {deleteConfirm === c.id ? (
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => remove(c.id)} style={{ padding: '7px 12px', background: '#f43f5e', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#fff' }}>Confirm</button>
                      <button onClick={() => setDeleteConfirm(null)} style={{ padding: '7px 12px', background: '#f1f5f9', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#475569' }}>Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(c.id)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '7px 12px', background: 'none', border: '1px solid #fecaca', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#f43f5e' }}>
                      <Trash2 size={12} /> Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Slide-in form drawer */}
      {showForm && (
        <>
          <div onClick={closeForm} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', zIndex: 100 }} />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 440, background: '#fff', zIndex: 101, boxShadow: '-4px 0 32px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column' }}>
            {/* Drawer header */}
            <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 18, color: '#0f172a' }}>{editing ? 'Edit Client' : 'Add Client'}</div>
              <button onClick={closeForm} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4, display: 'flex' }}><X size={20} /></button>
            </div>

            {/* Drawer body */}
            <div style={{ padding: 24, flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Company name */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: 6 }}>Company Name</label>
                <input {...inp()} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Vodafone VOIS" />
              </div>

              {/* Domain → logo suggestion (add mode only) */}
              {!editing && (
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: 6 }}>
                    Company Domain <span style={{ fontWeight: 400, color: '#94a3b8' }}>— for logo suggestion</span>
                  </label>
                  <input {...inp()} value={form.domain} onChange={e => handleDomainChange(e.target.value)} placeholder="e.g. vodafone.com" />
                  <div style={{ marginTop: 10, minHeight: 44, display: 'flex', alignItems: 'center', gap: 10 }}>
                    {logoLoading && <span style={{ fontSize: 12, color: '#94a3b8' }}>Looking up logo…</span>}
                    {!logoLoading && logoPreview && (
                      <>
                        <div style={{ width: 44, height: 44, border: '1px solid #e2e8f0', borderRadius: 8, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                          <img src={logoPreview} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }} />
                        </div>
                        <span style={{ fontSize: 12, color: '#059669', fontWeight: 700 }}>✓ Logo found — pre-filled below</span>
                      </>
                    )}
                    {!logoLoading && !logoPreview && form.domain && (
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>No logo found — enter URL manually below</span>
                    )}
                  </div>
                </div>
              )}

              {/* Logo URL */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: 6 }}>
                  Logo URL <span style={{ fontWeight: 400, color: '#94a3b8' }}>— optional</span>
                </label>
                <input {...inp({ fontFamily: 'monospace', fontSize: 12 })} value={form.logoUrl}
                  onChange={e => { setForm(f => ({ ...f, logoUrl: e.target.value })); setLogoPreview(e.target.value || null); }}
                  placeholder="https://logo.clearbit.com/company.com"
                />
                {form.logoUrl && (
                  <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 40, height: 40, border: '1px solid #e2e8f0', borderRadius: 6, background: '#f8fafc', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={form.logoUrl} alt="preview"
                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }}
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                    <span style={{ fontSize: 11, color: '#64748b' }}>Preview</span>
                  </div>
                )}
              </div>

              {/* Language */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: 6 }}>Language</label>
                <select {...inp()} value={form.locale} onChange={e => setForm(f => ({ ...f, locale: e.target.value as any }))}>
                  <option value="en-GB">British English</option>
                  <option value="en-US">American English</option>
                </select>
              </div>

              {/* Currency */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: 6 }}>Default Currency</label>
                <select {...inp()} value={form.defaultCurrency} onChange={e => setForm(f => ({ ...f, defaultCurrency: e.target.value as any }))}>
                  <option value="GBP">£ — British Pound</option>
                  <option value="EUR">€ — Euro</option>
                  <option value="USD">$ — US Dollar</option>
                  <option value="JPY">¥ — Japanese Yen</option>
                </select>
              </div>
            </div>

            {/* Drawer footer */}
            <div style={{ padding: '20px 24px', borderTop: '1px solid #f1f5f9', flexShrink: 0 }}>
              <button onClick={save} disabled={!form.name.trim() || saving}
                style={{ width: '100%', padding: 13, background: form.name.trim() ? '#0f172a' : '#e2e8f0', color: form.name.trim() ? '#fff' : '#94a3b8', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: form.name.trim() ? 'pointer' : 'not-allowed', transition: 'background 0.15s' }}>
                {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Client'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
