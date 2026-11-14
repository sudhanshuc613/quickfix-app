# QuickFix.app — Vercel + Neon setup (Hinglish, beginner-friendly)

Yeh guide **is ZIP ke Phase 1 project** ke liye hai. Isme home page, `/ro-service-in-patna`, base Prisma schema, seed data aur owner sign-in starter hai. Booking, customer OTP, cart/checkout, Razorpay aur admin CMS abhi live nahi hain. Production booking/orders abhi mat lena.

## Pehle samjho: kaunsi cheez kahan set hogi?

```text
Aapka laptop
  ├── project code (ZIP extract karke)
  ├── .env.local (local secrets; GitHub par kabhi upload nahi)
  └── commands: npm install / db:push / db:seed / dev
           │
           ├── Git push ───────────► Private GitHub repository
           │                                  │
           │                                  └── Vercel import + automatic builds
           │                                      ├── Environment Variables (secrets)
           │                                      └── HTTPS website + optional custom domain
           │
           └── Prisma CLI ─────────► Neon PostgreSQL
                                       ├── DIRECT_URL: schema setup/CLI
                                       └── DATABASE_URL: app runtime, pooled
```

**Neon URL ka simple rule:** app/Vercel server ke liye pooled URL (hostname mein `-pooler` hota hai); schema push/migration ke liye direct URL (hostname mein `-pooler` nahi). Is project mein `.env.local`/Vercel mein pooled `DATABASE_URL`, direct `DIRECT_URL` naam se set karna hai. Neon docs bhi app/serverless ke liye pooled aur schema operations ke liye direct URL batate hain: [Neon connection pooling](https://neon.tech/docs/get-started-with-neon/connection-pooling), [Neon + Prisma](https://neon.tech/docs/guides/prisma-migrate).

---

## 0. Kya chahiye

- ZIP: `quickfix-vercel.zip`
- GitHub account (repo **Private** rakho)
- Vercel account
- Neon account
- Node.js **22 LTS** (is project ki dependency ke liye)
- Git
- Real business phone/WhatsApp/address. GST, policies, photos aur service prices launch se pehle verify karne honge.

Install ke baad terminal mein check karo:

```bash
node -v
npm -v
git --version
```

Node version `v22...` dikhni chahiye.

---

## 1. ZIP extract aur terminal project folder mein kholo

1. ZIP download karke Extract All karo.
2. Extract hui `quickfix-app` folder kholo. Isi folder mein `package.json`, `README.md` aur `prisma/` dikhna chahiye.
3. Isi folder mein terminal kholna hai—not uske parent folder mein.

**Windows PowerShell example:**

```powershell
cd "$HOME\Downloads\quickfix-app"
Get-ChildItem
```

Agar unzip se folder `quickfix-vercel\quickfix-app` bana hai, toh `cd` path uske mutabik badlo. `Get-ChildItem package.json` file dikhaye toh sahi folder hai.

**macOS/Linux example:**

```bash
cd ~/Downloads/quickfix-app
ls
```

Packages install karo:

```bash
npm install
```

---

## 2. Neon mein database banao — screen-by-screen

1. Browser mein [Neon Console](https://console.neon.tech/) kholo, sign in/sign up karo.
2. **Create project** chuno.
3. Project name, jaise `quickfix-patna`, rakho. Region mein Mumbai option mile toh choose karo; nahi mile toh closest available region. Project create karo.
4. Project ke andar **Connect** button/menu kholo.
5. Connect dialog mein branch, database, role select karo (new project ke defaults usually theek hote hain).
6. Pehle **Connection pooling ON** karke URL copy karo. Iska hostname aam taur par `...-pooler....neon.tech` hota hai. Yeh `DATABASE_URL` hoga.
7. Ab pooling toggle OFF karke doosra URL copy karo. Hostname mein `-pooler` nahi hota. Yeh `DIRECT_URL` hoga.
8. Dono URLs private rakho—password-containing URLs ko screenshot/chat/GitHub mein mat dalo.

Neon `Connect` dialog branch, compute, database aur role choose karne deta hai; pooling toggle on/off se pooled/direct URL copy hota hai. [Neon docs](https://neon.tech/docs/get-started-with-neon/connection-pooling).

### Connection URL ka pehchaan format

```text
Pooled: postgresql://USER:PASSWORD@ep-...-pooler....neon.tech/DB?sslmode=require
Direct: postgresql://USER:PASSWORD@ep-........neon.tech/DB?sslmode=require
```

Actual URLs Neon se copy karo—upar wale sirf format examples hain. Password mein `@`, `#`, `%` jaise special characters hon toh URL ko khud edit mat karna; Neon ka copied URL use karo.

---

## 3. Local environment file banao

`quickfix-app` root mein `.env.example` ki copy bana kar uska naam `.env.local` rakho. File ka naam **exact** `.env.local` ho—`.env.local.txt` nahi. Isme actual values bhar do:

```dotenv
DATABASE_URL="YAHAN_NEON_POOLED_URL"
DIRECT_URL="YAHAN_NEON_DIRECT_URL"

ADMIN_USERNAME="owner"
ADMIN_PASSWORD_HASH="HASH_YAHAN_BANAYENGE"
ADMIN_TOTP_SECRET="SECRET_SCRIPT_SE_DEKHENGE"
SESSION_SECRET="SECRET_SCRIPT_SE_DEKHENGE"

NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_BUSINESS_PHONE="+91-APNA-ACTUAL-NUMBER"
NEXT_PUBLIC_WHATSAPP_NUMBER="91APNAWHATSAPPNUMBER"
NEXT_PUBLIC_BUSINESS_ADDRESS="APNA-REAL-PUBLIC-ADDRESS-YA-SERVICE-AREA"
```

- Phone: international format, jaise `+91-98XXXXXXXX`.
- WhatsApp: country code ke saath **digits only**—`+`, spaces, dashes nahi. Number WhatsApp par active hona chahiye.
- Address placeholder ko actual verified business address/service area se replace karo.
- `.env.local` GitHub par nahi jaana chahiye. `.gitignore` ise ignore karta hai.

### 3A. Admin session + TOTP secret generate karo

```bash
node scripts/generate-secrets.mjs
```

Do generated lines screen par aayengi: `SESSION_SECRET=...` aur `ADMIN_TOTP_SECRET=...`. Dono values copy karke `.env.local` mein daalo. Kisi ko forward mat karo.

**Authenticator app set up:** Google Authenticator ya koi TOTP-compatible authenticator kholo → account manually add/“Enter setup key” option → account name `QuickFix Owner` → script se bani `ADMIN_TOTP_SECRET` key daalo → time-based/6-digit option ho toh wahi chuno. App ka current 6-digit code sign-in ke waqt dena hota hai. Secret lose ho gaya toh app aur Vercel dono mein secret ko carefully rotate/reconfigure karna padega.

### 3B. Password hash banao

Password kam-se-kam 14 characters ka, unique aur doosri sites se alag rakho.

**macOS/Linux/Git Bash (password terminal mein hide hota hai):**

```bash
read -s -p 'Admin password (14+ characters): ' ADMIN_BOOTSTRAP_PASSWORD; echo
export ADMIN_BOOTSTRAP_PASSWORD
node scripts/hash-password.mjs
unset ADMIN_BOOTSTRAP_PASSWORD
```

Printed bcrypt hash ko `.env.local` ke `ADMIN_PASSWORD_HASH` mein paste karo. Raw password save/commit mat karo.

**Windows PowerShell:**

```powershell
$env:ADMIN_BOOTSTRAP_PASSWORD = Read-Host "Admin password (14+ characters)"
node scripts/hash-password.mjs
Remove-Item Env:ADMIN_BOOTSTRAP_PASSWORD
```

PowerShell ka prompt text echo karega—screen share/recording band rakho. Hash output `.env.local` mein daalo. `.env.local` ko Notepad/VS Code mein save karte waqt “Save as type: All files” aur exact filename check karo.

---

## 4. Database tables aur starter data banao

**Pehle confirm karo:** `.env.local` mein correct `DIRECT_URL` aur `DATABASE_URL` hain, aur `DATABASE_URL` pooled hai. Phir project root se:

```bash
npm run db:push
```

Yeh starter Prisma schema se tables banata hai. Expected result success/“database is now in sync” jaisa hona chahiye. Is command ko galat database URL ke saath chalaya toh galat database mein schema ban sakta hai—URL ke project name/host ko check karna.

Ab generated Prisma client banao (ye step seed command ko CJS/top-level-await error se bachata hai):

```bash
npm run db:generate
```

Phir seed data load karo:

```bash
npm run db:seed
```

Success message mein 51 localities, 12 brands aur 5 service types aane chahiye. Seed prices **examples** hain; production price list nahi. Database table/view ke liye:

```bash
npm run db:studio
```

Prisma Studio khulne par local browser mein tables dekho. Band karne ke liye terminal mein `Ctrl+C`.

> Initial starter setup `db:push` use karta hai. Ongoing production schema changes ke liye reviewed, committed Prisma migrations par shift karo; har deploy par production DB par `db:push` blindly mat chalao.

---

## 5. Laptop par local website chalao aur check karo

```bash
npm run typecheck
npm run build
npm run dev
```

`npm run dev` ke baad terminal mein URL aayega—aksar `http://localhost:3000`.

Check:

- `http://localhost:3000/` — homepage
- `http://localhost:3000/ro-service-in-patna` — service landing page
- `http://localhost:3000/robots.txt`
- `http://localhost:3000/sitemap.xml`
- `http://localhost:3000/control/login` — admin sign-in

Admin sign-in mein `.env.local` wala username, original password (hash nahi), aur authenticator ka current 6-digit code use karo. Dashboard `/control/dashboard` par khulega. Sign out bhi test karo. Secrets incomplete hon toh sign-in par “not configured” error aayega—`.env.local` values aur server restart check karo.

Server stop: terminal mein `Ctrl+C`.

---

## 6. GitHub par code upload karo (Private repo)

ZIP extract karne ke baad terminal `quickfix-app` ke **andar** ho. GitHub par naya **Private** repository banao, example `quickfix-app`. README/license/gitignore GitHub par initialize karna zaroori nahi—project mein README/gitignore already hain.

```bash
git init
git add .
git status --short
```

**`git status` mein `.env.local` nahi dikhna chahiye.** Agar dikh raha hai toh commit mat karo; `.gitignore` check karo.

```bash
git commit -m "QuickFix Phase 1 foundation"
git branch -M main
git remote add origin https://github.com/YOUR-GITHUB-NAME/quickfix-app.git
git push -u origin main
```

`YOUR-GITHUB-NAME` apne account/org se replace karo. GitHub login prompt aaye toh GitHub authentication follow karo; GitHub account password ko command prompt mein mat daalo.

### GitHub browser upload alternative

Private repo create karke **Add file → Upload files** se files upload kar sakte ho, par folder upload/hidden files mein galti ho sakti hai. `.env.local` ko kabhi select na karo. Git commands preferred hain.

---

## 7. Vercel project banao

1. [Vercel Dashboard](https://vercel.com/dashboard) → **Add New → Project**.
2. GitHub connect/authorize karo, private `quickfix-app` repository ke paas **Import** dabao.
3. Agar Git commands `quickfix-app` folder ke andar chalaye the, GitHub repo root par `package.json` hoga; Vercel **Root Directory `./`** rakho. Agar GitHub repo mein `quickfix-app/` naam ka nested folder upload hua ho aur `package.json` uske andar ho, Root Directory `quickfix-app` set karo.
4. Framework **Next.js** detect hona chahiye. Build command `npm run build`, Install command `npm install`; Output Directory default rehne do. Node 22 use ho—project `package.json` mein Node `>=22` set hai.
5. Deploy karne se pehle Environment Variables add karo (next section). Environment select karte waqt Production ko sahi production Neon database se map karo. Preview ke liye ho sake toh separate Neon branch/database aur separate admin secrets rakho.
6. **Deploy** dabao. Build logs ka last error dekho; successful hone par Vercel preview URL deta hai.

---

## 8. Vercel mein secrets/Environment Variables set karo

Vercel project → **Settings → Environment Variables**. Har variable add karte waqt value local `.env.local` se copy karo, but `NEXT_PUBLIC_SITE_URL` ko deployed URL ke mutabik update karo.

| Variable | Value kahan se | Scope |
|---|---|---|
| `DATABASE_URL` | Neon pooled URL, hostname mein `-pooler` | Runtime DB; Production + Preview (alag DB recommended) |
| `DIRECT_URL` | Neon direct URL, `-pooler` ke bina | Prisma CLI/build environment |
| `ADMIN_USERNAME` | Apna owner username | Private config |
| `ADMIN_PASSWORD_HASH` | Step 3B ka bcrypt output; raw password nahi | Private secret |
| `ADMIN_TOTP_SECRET` | Step 3A ka Base32 secret | Private secret—Vercel masked/sensitive rakho |
| `SESSION_SECRET` | Step 3A ka random output | Private secret—Vercel masked/sensitive rakho |
| `NEXT_PUBLIC_SITE_URL` | Pehle `https://YOUR-PROJECT.vercel.app`; custom domain baad mein | Public canonical URL |
| `NEXT_PUBLIC_BUSINESS_PHONE` | Real customer phone, `+91...` | Public |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp digits, `91...`, no plus/spaces | Public |
| `NEXT_PUBLIC_BUSINESS_ADDRESS` | Verified public address/service-area wording | Public |

**Environment checkboxes:** Production ko zaroor select karo. Preview ko select karna ho toh demo/test credentials aur non-production DB use karo. Production database URL ko random preview deployments se share na karna better hai. `NEXT_PUBLIC_` values browser mein visible hoti hain—sirf public phone/address ke liye. `DATABASE_URL`, `DIRECT_URL`, hashes/2FA/session secrets kabhi `NEXT_PUBLIC_` prefix se nahi.

Vercel Environment Variables badalne ke baad **new deployment/redeploy** zaroori hota hai; purani deployment automatically naye env values nahi leti.

---

## 9. Vercel deploy ke baad exact test

Vercel project → **Deployments** → latest successful deployment → **Visit**.

1. Homepage khulti hai; phone/WhatsApp links actual business number dikhate hain.
2. `/ro-service-in-patna` 200 page khulta hai.
3. `/robots.txt` sitemap ke liye deployed host dikhata hai; `/sitemap.xml` khulta hai.
4. `/control/login` khulta hai aur `noindex` page hai.
5. Correct username + password + TOTP se sign in; `/control/dashboard` khulta hai. Sign out ke baad direct dashboard visit login par redirect hona chahiye.
6. Wrong code/password reject hona chahiye.
7. Browser DevTools mein public page source/Network check karo: database URL/session secret/password hash browser ko nahi jaane chahiye.

Vercel firewall/WAF ya persistent login rate limiting setup ke bina admin sign-in ko production mein public launch mat karo. Serverless memory-based limiter reliable nahi hota; is starter mein persistent rate limiter bundled nahi.

---

## 10. Apna domain jodo

1. Vercel project → **Settings → Domains** → apna domain, jaise `quickfix.in`, add karo.
2. Vercel jo exact DNS records dikhaye wahi domain registrar/DNS provider par add karo. Guess karke records mat dalo; provider/host ke mutabik records alag ho sakte hain.
3. Vercel status **Valid Configuration / Verified** aur HTTPS/SSL active hone tak wait karo.
4. Project Environment Variables mein Production `NEXT_PUBLIC_SITE_URL=https://quickfix.in` update karo.
5. Redeploy karo; phir `/robots.txt`, `/sitemap.xml` aur canonical metadata mein custom HTTPS domain verify karo.

---

## 11. Aam errors aur fix

### `npm install` mein Node/engine warning
`node -v` dekho. Node 22 LTS install/activate karo, phir project mein `npm install` dobara.

### `Environment variable not found: DIRECT_URL` ya Prisma config error
Root folder ki `.env.local` spelling check karo; dono DB variables present hon. Terminal/server restart karo. Vercel par Settings → Environment Variables check karke redeploy karo.

### `P1001` / connection refused / TLS error
Neon project/branch active hai? URL mein username, password, database name check karo. URLs Neon se fresh copy karo. SSL query `sslmode=require` hona chahiye. Direct URL `DIRECT_URL` mein, pooled `DATABASE_URL` mein—mix mat karo.

### `db:push` chalta nahi
Yeh `DIRECT_URL` se connect karta hai. Direct host mein `-pooler` nahi hona chahiye. Neon project/database/role select sahi karo. Command project root mein chalao.

### `db:seed` connect error
Yeh runtime adapter se `DATABASE_URL` (pooled URL) use karta hai. Pooled string check karo. Pehle `npm run db:push` successful hua ho.

### Build mein Prisma Client/generated file missing
Root directory mein correct project hai? `package.json` build script Prisma generate chalata hai. Local check: `npm run db:generate` then `npm run typecheck`. Vercel Root Directory ko us folder par set karo jisme `package.json` hai.

### Admin login says not configured (503)
Vercel Production env mein `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `ADMIN_TOTP_SECRET`, `SESSION_SECRET` teeno/four values complete hain? Secret spaces/quotes ghalat copy na hue hon? Env update ke baad redeploy kiya?

### Admin says incorrect details
Username exact match, original password (hash nahi), current TOTP code. Phone ka automatic time/date on karo; code har 30 sec badalta hai. `.env.local` ke `ADMIN_TOTP_SECRET` aur authenticator app ka secret same hai check karo.

### Vercel par old/placeholder phone dikh raha
`NEXT_PUBLIC_BUSINESS_PHONE`/WhatsApp/address Production environment mein set karke redeploy karo. Build-time public variables update hone ke liye fresh deployment chahiye.

---

## 12. Launch se pehle stop-check

- Placeholder phone/address, sample service pricing, GST, legal policies verify/replace.
- Actual DB backup aur restore test.
- Persistent login rate limiting, MFA recovery, audit/security review.
- OTP/SMS/WhatsApp, booking flow, Razorpay test mode, invoice/GST, returns/shipping, support workflows—build and test before accepting payments/orders.
- GBP, Search Console, product catalog aur real local reviews baad ke phases mein setup karo. Fake review, address, price, water-quality claim mat publish karo.

**Production guarantee nahi:** Vercel/Neon account, DNS, billing, business verification, API providers aur live credentials aapke account mein configure karne honge. Is guide mein secret values jaan-boojhkar nahi hain.
