#!/usr/bin/env node
/**
 * QA: Admin Email Attachments — End-to-End Smoke Test (production-safe)
 *
 * Exercises the inbound email → R2 → admin inbox → forward → sign pipeline
 * against a live deployment without sending a real SMTP message.
 *
 * Steps:
 *   1. POST /test-inbound on the email worker (gated by WORKER_KEY).
 *      Persists a synthetic email + attachment to D1 + R2 under
 *      source=email_inbound_test, never forwards, never auto-replies.
 *   2. GET /api/email/threads/:id on the admin worker (admin session).
 *      Confirms the message + attachment are visible in the admin inbox.
 *   3. GET /api/email/attachments/:id/download (admin session).
 *      Confirms the bytes round-trip out of R2 via the auth-gated proxy.
 *   4. POST /api/email/messages/:id/forward (admin session, optional).
 *      Confirms the forward path completes when FORWARD_TEST_TO is set.
 *   5. POST /api/email/attachments/:id/sign (admin session).
 *      Confirms the sign endpoint accepts a signed PDF body and registers
 *      a new attachment + admin file row.
 *   6. POST /test-cleanup on the email worker.
 *      Removes the test thread + attachments + R2 objects.
 *
 * Required env:
 *   WORKER_KEY            - same secret set on the email worker via
 *                           `wrangler secret put WORKER_KEY` (also used by
 *                           the AI worker).
 *   EMAIL_WORKER_URL      - e.g. https://tight-fog-5031.<account>.workers.dev
 *                           (or the custom route that hits tight-fog-5031).
 *   ADMIN_BASE_URL        - e.g. https://techsavvyhawaii.com (the Pages
 *                           deployment that serves /api/...).
 *   ADMIN_SESSION_TOKEN   - the value of the techsavvy_session cookie. Grab
 *                           it from your browser devtools after logging in
 *                           at https://techsavvyhawaii.com/admin.
 *
 * Optional env:
 *   FORWARD_TEST_TO       - destination address for the forward step. If
 *                           unset, the forward check is skipped (because it
 *                           would actually send a real email via Resend).
 *   SKIP_CLEANUP=1        - keep the test thread around so you can inspect
 *                           it in the admin UI manually.
 *
 * Usage:
 *   node script/qa-email-attachments.mjs
 */

const WORKER_KEY = required("WORKER_KEY");
const EMAIL_WORKER_URL = required("EMAIL_WORKER_URL").replace(/\/$/, "");
const ADMIN_BASE_URL = required("ADMIN_BASE_URL").replace(/\/$/, "");
const ADMIN_SESSION_TOKEN = required("ADMIN_SESSION_TOKEN");
const FORWARD_TEST_TO = process.env.FORWARD_TEST_TO || "";
const SKIP_CLEANUP = process.env.SKIP_CLEANUP === "1";

const SESSION_COOKIE = `techsavvy_session=${ADMIN_SESSION_TOKEN}`;

function required(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`FATAL: missing required env var ${name}`);
    process.exit(2);
  }
  return v;
}

function pass(label) { console.log(`  ✅ ${label}`); }
function fail(label, detail) {
  console.error(`  ❌ ${label}`);
  if (detail) console.error("     " + String(detail).split("\n").join("\n     "));
  process.exitCode = 1;
}
function step(n, label) { console.log(`\n[${n}] ${label}`); }

// A tiny, valid 1-page PDF (~470 bytes). Used as the inbound attachment AND
// as the "signed" payload for the sign step. Built once at module load.
const TINY_PDF = Buffer.from(
  "JVBERi0xLjQKJeLjz9MKMyAwIG9iago8PC9MZW5ndGggMzcvRmlsdGVyL0ZsYXRlRGVjb2RlPj5z" +
    "dHJlYW0KeJwr5HIK4dJUMFCwsAQS5lwaCsZK+lwBXGHcXACd6gXVCmVuZHN0cmVhbQplbmRvYmoK" +
    "MSAwIG9iago8PC9UeXBlL1BhZ2UvUGFyZW50IDQgMCBSL1Jlc291cmNlczw8L0ZvbnQ8PC9GMSA1" +
    "IDAgUj4+L1Byb2NTZXRbL1BERi9UZXh0XT4+L01lZGlhQm94WzAgMCA1OTUgODQyXS9Db250ZW50" +
    "cyAzIDAgUj4+CmVuZG9iago1IDAgb2JqCjw8L1R5cGUvRm9udC9TdWJ0eXBlL1R5cGUxL0Jhc2VG" +
    "b250L0hlbHZldGljYS9FbmNvZGluZy9XaW5BbnNpRW5jb2Rpbmc+PgplbmRvYmoKNCAwIG9iago8" +
    "PC9UeXBlL1BhZ2VzL0NvdW50IDEvS2lkc1sxIDAgUl0+PgplbmRvYmoKMiAwIG9iago8PC9UeXBl" +
    "L0NhdGFsb2cvUGFnZXMgNCAwIFI+PgplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBm" +
    "IAowMDAwMDAwMTI3IDAwMDAwIG4gCjAwMDAwMDA0MDAgMDAwMDAgbiAKMDAwMDAwMDAxNSAwMDAw" +
    "MCBuIAowMDAwMDAwMzQ1IDAwMDAwIG4gCjAwMDAwMDAyNTYgMDAwMDAgbiAKdHJhaWxlcgo8PC9T" +
    "aXplIDYvUm9vdCAyIDAgUj4+CnN0YXJ0eHJlZgo0NDcKJSVFT0YK",
  "base64",
);

const TS = new Date().toISOString().replace(/[:.]/g, "-");
const SUBJECT = `[QA TEST ${TS}] Inbound attachment smoke test`;
const FROM = `qa-bot+${Date.now()}@example.com`;
const FILENAME = `qa-test-${TS}.pdf`;

let injected = null;

try {
  step(1, `Inject synthetic inbound email via ${EMAIL_WORKER_URL}/test-inbound`);
  const injectRes = await fetch(`${EMAIL_WORKER_URL}/test-inbound`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Worker-Key": WORKER_KEY,
    },
    body: JSON.stringify({
      from: FROM,
      to: "contact@techsavvyhawaii.com",
      subject: SUBJECT,
      text: `Automated end-to-end test at ${TS}.`,
      attachments: [
        {
          filename: FILENAME,
          contentType: "application/pdf",
          base64: TINY_PDF.toString("base64"),
        },
      ],
    }),
  });
  const injectJson = await injectRes.json().catch(() => ({}));
  if (!injectRes.ok || !injectJson.success) {
    fail(`/test-inbound returned ${injectRes.status}`, JSON.stringify(injectJson));
    process.exit(1);
  }
  injected = injectJson;
  if (!injected.threadId || !injected.messageId) {
    fail("/test-inbound did not return threadId/messageId", JSON.stringify(injected));
    process.exit(1);
  }
  if (!Array.isArray(injected.attachmentIds) || injected.attachmentIds.length === 0) {
    fail("/test-inbound returned 0 attachment ids — R2 binding probably missing on the worker", JSON.stringify(injected));
    process.exit(1);
  }
  pass(`thread=${injected.threadId}  message=${injected.messageId}  attachment=${injected.attachmentIds[0]}`);

  step(2, `Verify thread + attachment via admin API`);
  const threadRes = await fetch(`${ADMIN_BASE_URL}/api/email/threads/${injected.threadId}`, {
    headers: { Cookie: SESSION_COOKIE },
  });
  if (threadRes.status === 401) {
    fail("Admin API rejected ADMIN_SESSION_TOKEN (401). Re-grab the techsavvy_session cookie after logging in.");
    process.exit(1);
  }
  if (!threadRes.ok) {
    const body = await threadRes.text();
    fail(`GET /api/email/threads/:id returned ${threadRes.status}`, body.slice(0, 500));
    process.exit(1);
  }
  const thread = await threadRes.json();
  const msg = (thread.messages || []).find((m) => m.id === injected.messageId);
  if (!msg) {
    fail("Injected message id not found in thread.messages", JSON.stringify(thread));
    process.exit(1);
  }
  pass(`thread visible: subject="${thread.subject}", folder=${thread.folder}, ${thread.messages.length} message(s)`);
  const att = (msg.attachments || []).find((a) => a.id === injected.attachmentIds[0]);
  if (!att) {
    fail("Injected attachment id not found on message", JSON.stringify(msg));
    process.exit(1);
  }
  pass(`attachment visible: name="${att.name || att.filename}", size=${att.size}, url=${att.url}`);

  step(3, `Download attachment bytes through auth-gated R2 proxy`);
  const dlRes = await fetch(`${ADMIN_BASE_URL}/api/email/attachments/${injected.attachmentIds[0]}/download`, {
    headers: { Cookie: SESSION_COOKIE },
    redirect: "manual",
  });
  if (!dlRes.ok) {
    fail(`download returned ${dlRes.status}`, await dlRes.text().catch(() => ""));
  } else {
    const buf = Buffer.from(await dlRes.arrayBuffer());
    if (buf.length !== TINY_PDF.length) {
      fail(`download size mismatch — got ${buf.length} bytes, expected ${TINY_PDF.length}`);
    } else if (!buf.equals(TINY_PDF)) {
      fail("download bytes did not match the PDF we injected");
    } else {
      pass(`R2 round-trip OK (${buf.length} bytes, content-type=${dlRes.headers.get("content-type")})`);
    }
  }

  step(4, FORWARD_TEST_TO ? `Forward message to ${FORWARD_TEST_TO}` : "Forward step (skipped — set FORWARD_TEST_TO to enable)");
  if (FORWARD_TEST_TO) {
    const fwdRes = await fetch(`${ADMIN_BASE_URL}/api/email/messages/${injected.messageId}/forward`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: SESSION_COOKIE },
      body: JSON.stringify({
        to: FORWARD_TEST_TO,
        note: `QA forward test at ${TS}. Safe to ignore.`,
        includeAttachmentIds: injected.attachmentIds,
      }),
    });
    const fwdBody = await fwdRes.json().catch(() => ({}));
    if (!fwdRes.ok || !fwdBody.success) {
      fail(`forward returned ${fwdRes.status}`, JSON.stringify(fwdBody));
    } else {
      pass(`forwarded — new message id ${fwdBody.messageId}`);
    }
  } else {
    pass("skipped");
  }

  step(5, `Sign attachment via /api/email/attachments/:id/sign`);
  // The endpoint just stores whatever bytes we send as the "signed" PDF —
  // it does not validate the signature. Re-using the same tiny PDF is fine.
  const signRes = await fetch(`${ADMIN_BASE_URL}/api/email/attachments/${injected.attachmentIds[0]}/sign`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: SESSION_COOKIE },
    body: JSON.stringify({ signedBase64: TINY_PDF.toString("base64") }),
  });
  const signBody = await signRes.json().catch(() => ({}));
  if (!signRes.ok || !signBody.success) {
    fail(`sign returned ${signRes.status}`, JSON.stringify(signBody));
  } else {
    pass(`signed — new attachment id ${signBody.attachmentId}, file id ${signBody.fileId}`);
  }
} finally {
  if (SKIP_CLEANUP) {
    console.log(`\n[6] Cleanup skipped (SKIP_CLEANUP=1). Inspect thread ${injected?.threadId} in the admin inbox, then re-run with cleanup enabled.`);
  } else if (injected?.threadId) {
    step(6, `Cleanup: delete test thread + R2 objects`);
    try {
      const cleanRes = await fetch(`${EMAIL_WORKER_URL}/test-cleanup`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Worker-Key": WORKER_KEY },
        body: JSON.stringify({ threadId: injected.threadId }),
      });
      const cleanBody = await cleanRes.json().catch(() => ({}));
      if (!cleanRes.ok || !cleanBody.success) {
        fail(`cleanup returned ${cleanRes.status}`, JSON.stringify(cleanBody));
      } else {
        pass(`removed ${cleanBody.deletedThreads} thread, ${cleanBody.deletedMessages} message(s), ${cleanBody.deletedAttachments} attachment row(s), ${cleanBody.deletedR2} R2 object(s)`);
      }
    } catch (e) {
      fail("cleanup threw", e?.message || String(e));
    }
  }
}

console.log(process.exitCode ? "\nFAIL" : "\nPASS");
