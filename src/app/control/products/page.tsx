import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-session';
import { ProductManager } from './product-manager';
export const dynamic = 'force-dynamic';
export default async function ProductsPage() {
  if (!(await getAdminSession())) redirect('/control/login');
  return <ProductManager />;
}
