# Google OAuth Setup Guide for Supabase

To enable "Continue with Google" in your Aura Beauty app, follow these steps:

## 1. Google Cloud Console Configuration

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Navigate to **APIs & Services** -> **OAuth consent screen**.
   - Select **External**.
   - Fill in the required app information.
   - Add the `.../auth/v1/callback` domain to **Authorized domains**.
4. Navigate to **APIs & Services** -> **Credentials**.
   - Click **Create Credentials** -> **OAuth client ID**.
   - Select **Web application** as the application type.
   - Add `https://<YOUR_PROJECT_ID>.supabase.co` to **Authorized JavaScript origins**.
   - Add `https://<YOUR_PROJECT_ID>.supabase.co/auth/v1/callback` to **Authorized redirect URIs**.
5. Copy the **Client ID** and **Client Secret**.

## 2. Supabase Dashboard Configuration

1. Go to your [Supabase Project Dashboard](https://app.supabase.com/).
2. Navigate to **Authentication** -> **Providers**.
3. Find **Google** in the list and enable it.
4. Paste the **Client ID** and **Client Secret** you copied from Google Cloud Console.
5. Click **Save**.

## 3. Site URL Configuration

1. Navigate to **Authentication** -> **URL Configuration**.
2. Ensure your **Site URL** is set to `http://localhost:5173` for local development.
3. Add `http://localhost:5173/**` to the **Redirect URIs** list.

## 4. Local Testing

1. Run `npm run dev`.
2. Click "Continue with Google" on the login screen.
3. You should be redirected to Google's login page.
4. After selecting your account, you should be redirected back to `http://localhost:5173/home`.
