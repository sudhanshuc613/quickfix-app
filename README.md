# QuickFix.app — Phase 1 foundation + Phase 2 public-site slice

Starter for the QuickFix RO service and spare-parts business in Patna. **Stack is the one in your spec:** Next.js App Router + TypeScript, PostgreSQL on Neon, Prisma, with a Vercel deployment path.

## What's included in this delivery

- Mobile-first, server-rendered homepage, core service pages (repair, installation, AMC, commercial), 12 brand enquiry pages, About, Contact, FAQ and Reviews pages; sitemap, robots rules, LocalBusiness/Service/FAQ JSON-LD and phone/WhatsApp links.
- Draft Privacy, Terms, Refund, Shipping and Warranty pages are clearly marked owner/legal review required and set noindex until reviewed. Locality landing pages and the full editorial CMS remain future work; we will not invent locality water data, landmarks, reviews, service prices or response promises.
- Owner-only product catalog CRUD (draft/publish/archive, SKU, price, stock, GST/HSN, category, brand, SEO fields) and business-profile settings (name, phone, WhatsApp, email, address, hours), protected API routes and audit entries for product/profile changes. Product images are URL-only in this slice; secure uploads are not yet configured.
- Public spare-parts browse/category/product pages only show admin-published, in-stock items. They are enquiry listings; cart, checkout, delivery estimates and payments are not active.
- Prisma/PostgreSQL starting schema for customers, addresses, admins, localities, brands/models, services, bookings, technicians, products, inventory, orders, payments, banners, settings and audit logs.
- Starter seed data for the 51 requested Patna-area localities, 12 RO brands, 12 product categories and 5 service types. No customer reviews, product records or real prices are invented.
- `/control/login` owner sign-in with password + TOTP and a 30-minute, HttpOnly, Secure-in-production, SameSite=Strict signed cookie. The dashboard is not linked publicly and is set `noindex`.
- Security response headers, sign-in origin check, environment-variable examples, setup scripts and deployment instructions.

**This delivery completes the Phase 1 foundation plus partial public-site, catalog and settings slices; it is not the complete commerce/operations platform.** Locality pages with verified unique editorial content, OTP/SMS customer login, live booking workflow, cart/checkout/Razorpay, shipping, invoices, notifications, secure image storage, persistent rate limiting, full CMS (banners/blog/SEO), production migrations/backups, role management, order/CRM/technician modules and the remaining admin features are not implemented yet. The current public catalog is enquiry-only. Do not accept live orders or store real customer data until the remaining flows are built and tested. No performance score, Google rank, provider approval or production security audit is claimed.

## Requirements

- Node.js 22 LTS or newer
- npm 10+
- Neon PostgreSQL project

## Run locally

1. Extract the project and open a terminal in the `quickfix-app` folder.
2. Install packages:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env.local`. In Neon, create a project and copy its **pooled** connection string to `DATABASE_URL`; copy the **direct** connection string to `DIRECT_URL`. Add `?sslmode=require` if Neon did not include it.
4. Generate auth values:

   ```bash
   node scripts/generate-secrets.mjs
   ```

   Save `SESSION_SECRET` and `ADMIN_TOTP_SECRET` into `.env.local` (and later Vercel). Add `ADMIN_USERNAME=owner`. To set a password hash without putting your password into the shell command history, use the safe prompt and generate a bcrypt hash:

   ```bash
   read -s -p 'New admin password (14+ characters): ' ADMIN_BOOTSTRAP_PASSWORD; echo
   export ADMIN_BOOTSTRAP_PASSWORD
   node scripts/hash-password.mjs
   unset ADMIN_BOOTSTRAP_PASSWORD
   ```

   Copy the printed bcrypt hash into `ADMIN_PASSWORD_HASH`. Never put the raw password or generated secrets into Git. Add `ADMIN_TOTP_SECRET` manually to an authenticator app as a TOTP secret (6 digits, 30-second period); then use the current code at sign-in.
5. Update the public placeholder values in `.env.local`: phone, WhatsApp digits (country code, no `+`), address, and `NEXT_PUBLIC_SITE_URL`.
6. Create the schema and starter data:

   ```bash
   npm run db:push
   npm run db:generate
   npm run db:seed
   ```

7. Start and verify:

   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000`, `/ro-service-in-patna`, `/sitemap.xml`, `/robots.txt` and `/control/login`. After signing in, the starter dashboard is at `/control/dashboard`.

For local database operations, `.env.local` needs both Neon URLs. Never paste real secrets into an issue, chat, public repository, or screenshot.

## Vercel deployment — step by step

### A. Put the project in GitHub (recommended)

Vercel's normal project-import flow connects a Git repository; **do not upload the ZIP as a deployable project**. Extract it first, then push the folder's contents to a private GitHub repository.

1. Download `quickfix-vercel.zip` and extract it.
2. Create a **private** GitHub repository, for example `quickfix-app`. Do not check in `.env.local`, `.env`, credentials, OTP secrets or password hashes. `.gitignore` excludes local env files.
3. In a terminal, enter the extracted `quickfix-app` directory and run:

   ```bash
   git init
   git add .
   git commit -m "QuickFix Phase 1 foundation"
   git branch -M main
   git remote add origin https://github.com/YOUR-ACCOUNT/quickfix-app.git
   git push -u origin main
   ```

   Replace `YOUR-ACCOUNT` with your own GitHub account/organization. If GitHub CLI is installed, `gh repo create quickfix-app --private --source=. --remote=origin --push` is an alternative.

### B. Create and initialize Neon

1. Sign in to Neon and create a PostgreSQL project. Choose a nearby supported region (Mumbai if available for your account; otherwise the closest region).
2. Copy the pooled connection URL into a password manager temporarily. Copy the direct/unpooled URL separately. Do not publish either URL.
3. Before first deploy, initialize the schema from your local machine: create `.env.local` with those two URLs, then run:

   ```bash
   npm install
   npm run db:push
   npm run db:generate
   npm run db:seed
   ```

   Confirm the command succeeds. This starter uses `db push` for initial setup; for a production team workflow, switch to committed Prisma migrations before ongoing schema changes.

### C. Create the Vercel project

1. Sign in to Vercel and choose **Add New → Project**.
2. Import the private GitHub repo. If you placed the app in a subfolder, set **Root Directory** to `quickfix-app`; if you pushed the contents of that folder at repository root, leave it as `./`.
3. Framework preset: **Next.js**. Build command: `npm run build`. Install command: `npm install`. Output directory: leave the Next.js default. Select Node.js 22.x in Project Settings → General if the option is shown.
4. In **Project → Settings → Environment Variables**, add the following for the environments you intend to deploy. Add production values to Production; use separate test values for Preview/Development.

   | Name | Value |
   |---|---|
   | `DATABASE_URL` | Neon pooled URL |
   | `DIRECT_URL` | Neon direct URL |
   | `ADMIN_USERNAME` | Your owner username |
   | `ADMIN_PASSWORD_HASH` | bcrypt hash generated locally |
   | `ADMIN_TOTP_SECRET` | Base32 TOTP secret from the generator |
   | `SESSION_SECRET` | Random secret from the generator |
   | `NEXT_PUBLIC_SITE_URL` | Your final HTTPS URL, e.g. `https://quickfix.in` |
   | `NEXT_PUBLIC_BUSINESS_PHONE` | Real customer-facing phone in international format |
   | `NEXT_PUBLIC_WHATSAPP_NUMBER` | Real WhatsApp number, digits only with country code |
   | `NEXT_PUBLIC_BUSINESS_ADDRESS` | Real public business address or service-area wording |

   Set **Sensitive** for database URLs and auth secrets where Vercel offers that option. Never use the example phone/address in production. Do not enable production traffic until an owner has verified the business identity and legal details.
5. Click **Deploy**. Watch the build log. The build runs `prisma generate && next build`; the database must already have been initialized in step B.
6. When the first deployment is ready, open the generated `*.vercel.app` URL and verify the home page, `/ro-service-in-patna`, `/robots.txt`, and `/sitemap.xml`. Then visit `/control/login`, sign in with password plus your current authenticator code, verify the dashboard, and sign out.
7. Add your real domain under **Project → Settings → Domains**. At your domain registrar, apply the exact DNS records Vercel displays. Wait for Vercel to show the domain as verified and HTTPS active.
8. Update `NEXT_PUBLIC_SITE_URL` to the final canonical HTTPS domain in Production and redeploy. Confirm the canonical URL, sitemap URL and robots response use the final domain.
9. Configure a Vercel Firewall/WAF or another persistent rate-limiting service for `/api/admin/login` before public launch. Serverless instance memory is not a reliable rate limiter. Set up Neon backups/restore testing, alerts and domain email before handling live data.

### D. Deploy later changes

Commit and push changes to GitHub. Vercel automatically creates preview deployments and updates production from the configured production branch (normally `main`). Keep provider keys in Vercel Environment Variables; rotate compromised keys immediately and redeploy.

## ZIP contents and checks

The ZIP contains the complete `quickfix-app/` source folder. After extracting, run:

```bash
npm install
npm run typecheck
npm run build
```

`npm run build` also generates the Prisma client. Database operations (`db:push`, `db:generate`, `db:seed`) are separate; `db:push`/`db:seed` require real Neon credentials in `.env.local`.

## Before production

- Replace all phone/address placeholders. Add real logo, GST details, policies, hours, approved service pricing and owner contact information.
- Configure persistent login rate limiting/WAF; enable and test TOTP; protect account recovery; run a security review.
- Put recurring schema changes on Prisma migrations; test backups and restore.
- Add and verify OTP/WhatsApp/email, Razorpay (test then live), object storage and monitoring integrations before claiming they work.
- Build and QA the next phases: booking, products, cart/checkout, payments, CRM, editable CMS and admin roles. Validate GST, privacy, terms, return, shipping and warranty language with the business and a qualified professional.
- Submit the verified domain sitemap to Search Console and Bing. Keep locality pages genuinely useful and evidence-based; do not invent water-quality claims, reviews, addresses, prices or customer counts.

## Current known limitations

- Homepage and service page are starter content; no 50+ locality landing pages are published. The seed list is database data only.
- Display contact details are environment driven at this phase; no owner settings editor yet.
- Service price values are examples only and must be verified before displaying any binding quote.
- Admin bootstrap identity/2FA secret are environment-configured. User/role management, account recovery, persistent rate limiting, audit logging of actual UI operations and DB-backed admin sign-in are future work.
- Customer OTP, live booking slots, technicians, product pages, inventory operations, checkout, payments, notifications, invoicing and order management are schema/planned, not active flows.
