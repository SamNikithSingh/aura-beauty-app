# Supabase Numeric OTP Configuration Guide

To ensure your app sends 6-digit numeric codes instead of magic links, you must configure your Supabase project as follows:

## 1. Update Email Template

1. Go to the [Supabase Dashboard](https://app.supabase.com/).
2. Select your project.
3. Navigate to **Authentication** -> **Email Templates**.
4. Open the **Magic Link** tab (Supabase uses this same template for OTP codes).
5. Update the **Message Body** to use the `{{ .Token }}` variable.

**Recommended Template:**
```html
<h2>Login Code</h2>
<p>Your 6-digit numeric login code for Aura Beauty is:</p>
<h1 style="font-size: 32px; letter-spacing: 5px; color: #7B3FC4;">{{ .Token }}</h1>
<p>This code will expire in 5 minutes.</p>
```

## 2. Disable Magic Link Redirects (Optional but Recommended)

If you want to strictly use OTP and prevent users from clicking a link:
1. Ensure the template above does **NOT** contain a link like `<a href="{{ .ConfirmationURL }}">...</a>`.
2. Supabase will still generate the URL internally, but if you don't show it in the email, users will have to use the 6-digit code.

## 3. Verify OTP Settings

1. Navigate to **Authentication** -> **Providers** -> **Email**.
2. Ensure **Confirm Email** is enabled if you want to verify emails on first signup.
3. Set **OTP Length** to `6` (usually the default).
4. Set **OTP Expiry** to a reasonable time (e.g., `300` seconds).

## 4. Localhost Compatibility

The app is already configured to work on `localhost:5173`. When testing locally:
- Supabase will send the email to the address you provide.
- If you are using a test email, you can also check the **Authentication** -> **Logs** in the Supabase dashboard to see the generated code if the email delivery is slow.
