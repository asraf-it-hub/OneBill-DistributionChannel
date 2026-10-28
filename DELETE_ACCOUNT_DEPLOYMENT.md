# Deploying the secure account-deletion page

The `/delete-account` page uses a one-time Supabase email verification link, then invokes the existing authenticated `delete-account` Edge Function with that verified session. It never sends an email address to the deletion function and never exposes a service-role key.

## Cloudflare Pages environment variables

Set these build-time environment variables in the Cloudflare Pages project (Preview and Production), then redeploy:

- `VITE_SUPABASE_URL` — the OneBill Supabase project URL.
- `VITE_SUPABASE_ANON_KEY` — the project's public anon key.
- `VITE_DELETE_REDIRECT_URL` — optional; the exact public deletion-page URL,
  for example `https://your-domain.com/delete-account`. If omitted, the page
  uses the origin where the request was made. Do not request a link from
  `localhost` if you intend to open it on a phone.

Do **not** set `SUPABASE_SERVICE_ROLE_KEY`, a database password, or any other private secret in Cloudflare Pages or a `VITE_` variable.

## Supabase configuration

1. Ensure the Email provider is enabled and can send magic-link emails.
2. Add `https://onebill.app/delete-account` to Supabase Auth's allowed Redirect URLs. Add the corresponding Cloudflare preview URL only if testing there.
3. Deploy the already-audited function and its migration if they are not deployed:

   ```sh
   supabase db push
   supabase functions deploy delete-account
   ```

4. Confirm the function has `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` configured as Edge Function secrets. Those values stay in Supabase and are not browser configuration.

## Verification checklist

- Request a link for a real test account, open it on the same browser, and ensure the page shows the verified account email.
- Confirm cancellation never invokes the function.
- Confirm a value other than `DELETE` leaves the destructive button disabled.
- Confirm the success state appears only after the function returns `{ "success": true }`.
- Test an expired/invalid link and an Edge Function failure; the page must show an error and not call the result a deletion.

The Cloudflare Pages production URL cannot be claimed as deployed until these settings are applied and the production build is verified.
