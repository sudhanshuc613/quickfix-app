import { redirect } from 'next/navigation';

export const metadata = { title: 'QuickFix Admin Sign In', robots: { index: false, follow: false } };
export default function AdminShortcut() { redirect('/control/login'); }
