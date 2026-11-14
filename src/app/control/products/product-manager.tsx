'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminLogout } from '../dashboard/logout';

type Category = { id: string; name: string };
type Brand = { id: string; name: string };
type Product = { id: string; name: string; slug: string; sku: string; description: string; price: number; mrp: number | null; stock: number; gstPercent: number; hsn: string | null; status: 'DRAFT'|'PUBLISHED'|'ARCHIVED'; categoryId: string | null; brandId: string | null; category?: Category | null; brand?: Brand | null; imageUrl: string | null; seoTitle: string | null; seoDescription: string | null };
type FormValues = { name: string; slug: string; sku: string; description: string; price: string; mrp: string; stock: string; gstPercent: string; hsn: string; categoryId: string; brandId: string; imageUrl: string; status: 'DRAFT'|'PUBLISHED'|'ARCHIVED'; seoTitle: string; seoDescription: string };
const emptyForm: FormValues = { name: '', slug: '', sku: '', description: '', price: '', mrp: '', stock: '0', gstPercent: '18', hsn: '', categoryId: '', brandId: '', imageUrl: '', status: 'DRAFT', seoTitle: '', seoDescription: '' };

export function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [notice, setNotice] = useState('Loading products…');
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/products', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not load products.');
      setProducts(data.products); setCategories(data.categories); setBrands(data.brands); setNotice('');
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Could not load products.'); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  function setField<K extends keyof FormValues>(key: K, value: FormValues[K]) { setForm((prev) => ({ ...prev, [key]: value })); }
  function beginEdit(p: Product) {
    setEditing(p.id); setForm({ name: p.name, slug: p.slug, sku: p.sku, description: p.description, price: String(p.price), mrp: p.mrp == null ? '' : String(p.mrp), stock: String(p.stock), gstPercent: String(p.gstPercent), hsn: p.hsn || '', categoryId: p.categoryId || '', brandId: p.brandId || '', imageUrl: p.imageUrl || '', status: p.status, seoTitle: p.seoTitle || '', seoDescription: p.seoDescription || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setNotice('');
    try {
      const res = await fetch(editing ? `/api/admin/products/${editing}` : '/api/admin/products', { method: editing ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save product.');
      setForm(emptyForm); setEditing(null); setNotice(editing ? 'Product updated.' : 'Product saved.'); await load();
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Could not save product.'); }
    finally { setBusy(false); }
  }
  async function archive(id: string) {
    if (!window.confirm('Archive this product? It will no longer be available as an active listing.')) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' }); const data = await res.json();
    setNotice(res.ok ? 'Product archived.' : data.error || 'Could not archive product.'); await load();
  }
  return <main className="dashboard"><header className="dash-head"><Link className="brand" href="/control/dashboard"><span className="brandmark">Q<span>F</span></span><span>quickfix<span className="branddot">.</span><small>OWNER CONSOLE</small></span></Link><nav className="admin-nav"><Link href="/control/dashboard">Dashboard</Link><Link href="/control/products">Products</Link><Link href="/control/settings">Settings</Link></nav><AdminLogout /></header><section className="dash-main admin-main-wide"><div className="eyebrow">CATALOG MANAGEMENT</div><h1>Products</h1><p>Add products when your verified catalog, prices, stock and images are ready. New items default to Draft.</p>{notice && <div className="admin-notice" role="status">{notice}</div>}
    <form className="product-form" onSubmit={save}><div className="product-form-heading"><div><div className="eyebrow">{editing ? 'EDIT LISTING' : 'NEW LISTING'}</div><h2>{editing ? 'Update product' : 'Add a product'}</h2></div>{editing && <button type="button" className="button button-light" onClick={() => { setEditing(null); setForm(emptyForm); }}>Cancel edit</button>}</div>
      <div className="product-form-grid"><label>Product name<input required minLength={2} maxLength={160} value={form.name} onChange={(e) => setField('name', e.target.value)} placeholder="e.g. RO membrane 75 GPD" /></label><label>SKU<input required maxLength={80} value={form.sku} onChange={(e) => setField('sku', e.target.value)} placeholder="Unique stock code" /></label><label>URL slug<input value={form.slug} onChange={(e) => setField('slug', e.target.value)} placeholder="Leave blank to create from name" /></label><label>Category<select value={form.categoryId} onChange={(e) => setField('categoryId', e.target.value)}><option value="">Choose category</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label><label>Brand<select value={form.brandId} onChange={(e) => setField('brandId', e.target.value)}><option value="">Generic / unbranded</option>{brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></label><label>Sale price (₹)<input type="number" min="0" step="1" required value={form.price} onChange={(e) => setField('price', e.target.value)} /></label><label>MRP (₹)<input type="number" min="0" step="1" value={form.mrp} onChange={(e) => setField('mrp', e.target.value)} /></label><label>Available stock<input type="number" min="0" step="1" required value={form.stock} onChange={(e) => setField('stock', e.target.value)} /></label><label>GST %<input type="number" min="0" max="100" step="0.01" value={form.gstPercent} onChange={(e) => setField('gstPercent', e.target.value)} /></label><label>HSN code<input value={form.hsn} onChange={(e) => setField('hsn', e.target.value)} /></label><label>Status<select value={form.status} onChange={(e) => setField('status', e.target.value as FormValues['status'])}><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option><option value="ARCHIVED">Archived</option></select></label><label>Product image URL<input type="url" value={form.imageUrl} onChange={(e) => setField('imageUrl', e.target.value)} placeholder="Image upload/storage integration comes later" /></label><label className="full-field">Description<textarea rows={4} maxLength={12000} value={form.description} onChange={(e) => setField('description', e.target.value)} /></label><label>SEO title<input maxLength={160} value={form.seoTitle} onChange={(e) => setField('seoTitle', e.target.value)} /></label><label>SEO description<input maxLength={320} value={form.seoDescription} onChange={(e) => setField('seoDescription', e.target.value)} /></label></div><div className="product-form-actions"><button className="button button-orange" disabled={busy}>{busy ? 'Saving…' : editing ? 'Save changes' : 'Save draft'}</button><span>Do not publish until stock, tax, compatibility and price are verified.</span></div>
    </form>
    <div className="admin-table-wrap"><div className="admin-table-head"><h2>Catalog ({products.length})</h2><button className="button button-light" onClick={() => void load()} type="button">Refresh</button></div>{products.length === 0 ? <div className="admin-empty">No products yet. Add verified items above; the store should remain empty until you add real catalog data.</div> : <table className="admin-table"><thead><tr><th>Product</th><th>SKU</th><th>Category / brand</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead><tbody>{products.map((p) => <tr key={p.id}><td><b>{p.name}</b><small>{p.slug}</small></td><td>{p.sku}</td><td>{p.category?.name || '—'}<small>{p.brand?.name || 'Generic'}</small></td><td>₹{p.price.toLocaleString('en-IN')}</td><td>{p.stock}</td><td><span className={`status-pill status-${p.status.toLowerCase()}`}>{p.status}</span></td><td><div className="table-actions"><button type="button" onClick={() => beginEdit(p)}>Edit</button>{p.status !== 'ARCHIVED' && <button type="button" className="danger-link" onClick={() => void archive(p.id)}>Archive</button>}</div></td></tr>)}</tbody></table>}</div>
  </section></main>;
}
