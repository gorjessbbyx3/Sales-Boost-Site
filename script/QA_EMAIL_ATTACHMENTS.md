# QA: Admin Email Attachments — End-to-End

This is the canonical procedure for verifying the inbound email → R2 →
admin inbox → forward → sign pipeline against production after any change
to:

- `worker/email-worker/index.js`
- `functions/api/[[route]].ts` (anything under `/api/email/...`)
- `migrations/0023_email_attachments.sql`
- `client/src/components/inbox/EmailAttachments.tsx`

There are **two** ways to run the check. The scripted path is fast and
covers every layer except the actual SMTP intake. The manual path covers
the SMTP intake too, and is the one to run after any change that touches
the live `email()` handler or Cloudflare Email Routing config.

---

## A. Scripted end-to-end (recommended after most changes)

Driver: `script/qa-email-attachments.mjs`. It bypasses Cloudflare Email
Routing by POSTing a synthetic email + attachment to a gated test endpoint
on the email worker (`POST /test-inbound`). Everything downstream — D1
inserts, R2 upload, admin API listing, the auth-gated download proxy,
forward, sign — runs against the same code paths as a real inbound
message. The script tags its rows as `source = email_inbound_test` and
`/test-cleanup` only ever deletes rows with that source, so a leaked
`WORKER_KEY` cannot destroy real inbox data.

### Prereqs

1. **`WORKER_KEY`** — same secret already set on the email worker
   (`cd worker/email-worker && wrangler secret put WORKER_KEY`).
2. **Admin session cookie** — log in to `https://techsavvyhawaii.com/admin`
   in your browser, open devtools → Application → Cookies, copy the value
   of `techsavvy_session`.
3. **Email worker URL** — either the `*.workers.dev` URL of `tight-fog-5031`
   or the custom route mapped to it. Confirm the worker is up:
   ```bash
   curl https://tight-fog-5031.<account>.workers.dev/health
   ```
   `db_bound` and `r2_bound` must both be `true` and the endpoint list
   must include `/test-inbound`. If it doesn't, deploy first
   (`.github/workflows/deploy.yml` does this on every push to `main`).

### Run

```bash
WORKER_KEY='<paste>' \
EMAIL_WORKER_URL='https://tight-fog-5031.<account>.workers.dev' \
ADMIN_BASE_URL='https://techsavvyhawaii.com' \
ADMIN_SESSION_TOKEN='<paste techsavvy_session value>' \
FORWARD_TEST_TO='you@example.com' \
node script/qa-email-attachments.mjs
```

Drop `FORWARD_TEST_TO` if you don't want to send a real email via Resend
during the run (the forward step will be skipped). Set `SKIP_CLEANUP=1`
if you want the test thread to stick around so you can poke at it in the
admin inbox UI.

> **Required for full E2E signoff.** A run that skips forward (because
> `FORWARD_TEST_TO` was unset) does NOT count as a complete pass — it
> leaves the Resend send path, the outbound `email_messages` insert, and
> the outbound attachment linkage unverified. Always set
> `FORWARD_TEST_TO` (a throwaway inbox you control is fine) before
> claiming the pipeline is healthy.

### What "PASS" means

```
[1] Inject synthetic inbound email …  ✅ thread=… message=… attachment=…
[2] Verify thread + attachment via admin API
       ✅ thread visible: subject="[QA TEST …]", folder=inbox, 1 message(s)
       ✅ attachment visible: name="qa-test-…pdf", size=609, url=/api/email/attachments/…/download
[3] Download attachment bytes through auth-gated R2 proxy
       ✅ R2 round-trip OK (609 bytes, content-type=application/pdf)
[4] Forward message to you@example.com   ✅ forwarded — new message id …
[5] Sign attachment via /api/email/attachments/:id/sign
       ✅ signed — new attachment id …, file id …
[6] Cleanup: delete test thread + R2 objects
       ✅ removed 1 thread, 1 message(s), 1 attachment row(s), 1 R2 object(s)

PASS
```

Any ❌ line is a failure — the script exits non-zero.

### Troubleshooting

- **`/test-inbound returned 401`** → `WORKER_KEY` mismatch. Re-set it
  with `wrangler secret put WORKER_KEY` from `worker/email-worker/`.
- **`/test-inbound returned 0 attachment ids`** → the email worker has no
  R2 binding. Check `[[r2_buckets]]` in `worker/email-worker/wrangler.toml`
  and re-deploy.
- **`Admin API rejected ADMIN_SESSION_TOKEN (401)`** → grab a fresh
  cookie from `https://techsavvyhawaii.com/admin` (it expires after ~24h).
- **`GET /api/email/threads/:id returned 403`** → the test injects
  `to = contact@techsavvyhawaii.com` by default. That address must exist
  in the `email_accounts` table with `owner_id = ''` (global) or with
  `owner_id` matching the session user. Add it via the admin Settings
  → Email Accounts page or pass a different `to` field via a quick edit
  to the script.
- **`forward returned 500`** → almost always a missing/invalid
  `RESEND_API_KEY` on the Pages worker. Check the deployment logs.

---

## B. Real SMTP intake (run after touching email() or Email Routing)

Use this whenever the change could affect how Cloudflare delivers the
raw message to the worker (PostalMime parsing, attachment extraction,
EmailMessage forwarding, etc.). The scripted path skips that layer.

1. From any external mailbox, send a message to
   `contact@techsavvyhawaii.com` with one or more real attachments
   (mix of PDF + image is ideal). Use a unique subject like
   `QA <yyyy-mm-dd> <your-name> attachments smoke test`.

2. Tail the worker logs while it lands:
   ```bash
   cd worker/email-worker
   wrangler tail tight-fog-5031 --format=pretty
   ```
   You should see:
   - `📧 Inbound email from: …`
   - `🏷️ <intent> | <priority> | <sentiment>`
   - `💾 → inbox: thread <uuid>`
   - one `📎 Saved attachment <name> (<bytes>) → email-attachments/<thread>/<id>-<name>` per attachment
   - `📨 Forwarded`

3. Confirm the D1 row from your laptop:
   ```bash
   wrangler d1 execute savvy-admin --remote \
     --config wrangler-workers.toml \
     --command "SELECT id, subject, folder, source FROM email_threads WHERE subject LIKE 'QA%' ORDER BY created_at DESC LIMIT 1;"
   wrangler d1 execute savvy-admin --remote \
     --config wrangler-workers.toml \
     --command "SELECT id, filename, size, r2_key FROM email_attachments WHERE thread_id = '<paste from above>';"
   ```

4. Confirm the R2 object exists:
   ```bash
   wrangler r2 object get techsavvy-assets <r2_key from above> \
     --file /tmp/r2check.bin --remote
   ls -l /tmp/r2check.bin   # should equal the size column
   ```

5. Open `https://techsavvyhawaii.com/admin` → **Inbox**. The new thread
   should appear in `inbox`, with the attachments rendered as chips on
   the message. Click an attachment → it should open inline in a new
   tab (delivered through `/api/email/attachments/:id/download`, NOT
   the raw R2 URL). Click `⬇ Download` on a chip → file should download.

6. Click **Forward** on the message, choose the attachments, send to
   yourself. Confirm receipt and confirm a new outbound row appears in
   the thread.

7. For a PDF attachment, click **Sign**, draw a signature, save. Confirm:
   - a new outbound attachment chip with the `-SIGNED.pdf` suffix,
   - a new row in the **Files** tab under the `Signed Documents` folder.

If anything fails, capture the worker tail output and the relevant D1
row before tearing down — it's hard to reproduce intermittent SMTP
issues after the fact.

---

## C. Cleanup

The scripted path cleans up after itself unless `SKIP_CLEANUP=1` is set.
For the manual path, delete the test thread from the admin inbox UI
(trash icon on the thread). To wipe orphan R2 objects from a botched
manual test:

```bash
wrangler r2 object delete techsavvy-assets "email-attachments/<thread-id>/<file>" --remote
```

To bulk-clean any test thread that the script left behind (e.g. after a
crash with `SKIP_CLEANUP=1`):

```bash
curl -X POST -H "X-Worker-Key: $WORKER_KEY" \
  https://tight-fog-5031.<account>.workers.dev/test-cleanup
```

That endpoint only ever touches rows where `source = email_inbound_test`,
so it cannot harm real inbox data even if the key were leaked.
