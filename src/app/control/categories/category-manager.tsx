'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';

type Category = { id: string; name: string; slug: string; description: string; active: boolean; _count: { products: number } };
type Values = { name: string; slug: string; description: string; active: boolean };
const blank: Values = { name: '', slug: '', description: '', active: false };
export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [values, setValues] = useState<Values>(blank);
  const [editing, setEditing] = useState<string | null>(null);
  const [notice, setNotice] = useState('Loading categories…');
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    try { const response = await fetch('/api/admin/categories', { cache: 'no-store' }); const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Could not load categories.'); setCategories(data.categories); setNotice(''); }
    catch (error) { setNotice(error instanceof Error ? error.message : 'Could not load categories.'); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  function change<K extends keyof Values>(key: K, value: Values[K]) { setValues((current) => ({ ...current, [key]: value })); }
  function edit(category: Category) { setEditing(category.id); setValues({ name: category.name, slug: category.slug, description: category.description, active: category.active }); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setNotice('');
    try { const response = await fetch(editing ? `/api/admin/categories/${editing}` : '/api/admin/categories', { method: editing ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Could not save category.'); setValues(blank); setEditing(null); setNotice(editing ? 'Category updated.' : 'Category created.'); await load(); }
    catch (error) { setNotice(error instanceof Error ? error.message : 'Could not save category.'); }
    finally { setBusy(false); }
  }
  return <><div className="admin-notice" role="status">{notice || 'Categories are owner-managed; only enabled categories are visible on the public catalog.'}</div><form className="product-form category-form" onSubmit={save}><div className="product-form-heading"><div><div className="eyebrow">{editing ? 'EDIT CATEGORY' : 'NEW CATEGORY'}</div><h2>{editing ? 'Update category' : 'Add a category'}</h2></div>{editing && <button className="button button-light" type="button" onClick={() => { setEditing(null); setValues(blank); }}>Cancel</button>}</div><div className="product-form-grid"><label>Category name<input required minLength={2} maxLength={100} value={values.name} onChange={(event) => change('name', event.target.value)} placeholder="e.g. RO filters" /></label><label>URL slug<input maxLength={120} value={values.slug} onChange={(event) => change('slug', event.target.value)} placeholder="Generated from category name if blank" /></label><label className="full-field">Short description<textarea rows={3} maxLength={500} value={values.description} onChange={(event) => change('description', event.target.value)} placeholder="Only accurate, useful category information" /></label><label className="category-toggle"><input type="checkbox" checked={values.active} onChange={(event) => change('active', event.target.checked)} /> Show this category in the public shop</label></div><div className="product-form-actions"><button className="button button-orange" disabled={busy}>{busy ? 'Saving…' : editing ? 'Save category' : 'Create category'}</button><span>Do not publish a category until its real product listings are ready.</span></div></form><div className="admin-table-wrap"><div className="admin-table-head"><h2>Categories ({categories.length})</h2><button className="button button-light" type="button" onClick={() => void load()}>Refresh</button></div>{categories.length === 0 ? <div className="admin-empty">No categories have been seeded or created yet.</div> : <table className="admin-table"><thead><tr><th>Category</th><th>URL slug</th><th>Products</th><th>Visibility</th><th>Actions</th></tr></thead><tbody>{categories.map((category) => <tr key={category.id}><td><b>{category.name}</b><small>{category.description || 'No description set'}</small></td><td>{category.slug}</td><td>{category._count.products}</td><td><span className={`status-pill ${category.active ? 'status-published' : 'status-draft'}`}>{category.active ? 'VISIBLE' : 'HIDDEN'}</span></td><td><div className="table-actions"><button type="button" onClick={() => edit(category)}>Edit</button></div></td></tr>)}</tbody></table>}</div></>;
}
