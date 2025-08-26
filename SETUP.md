# Supabase Setup Guide for Trade Journal

This guide will walk you through setting up Supabase for the Trade Journal application.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Basic knowledge of SQL and web development

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `trade-journal` (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose the closest region to your users
5. Click "Create new project"
6. Wait for the project to be created (this may take a few minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

## Step 3: Update Configuration

1. Open `config.js` in your project
2. Replace the placeholder values with your actual Supabase credentials:

```javascript
const SUPABASE_CONFIG = {
    url: 'https://your-project-id.supabase.co', // Your Project URL
    anonKey: 'your-anon-key-here', // Your Anon public key
    serviceRoleKey: 'your-service-role-key' // Optional for server-side operations
};
```

## Step 4: Set Up the Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of `supabase-setup.sql`
3. Paste it into the SQL Editor
4. Click "Run" to execute the SQL commands

This will create:
- The `trades` table with all necessary columns
- Database indexes for better performance
- Row Level Security (RLS) policies
- Automatic timestamp updates

## Step 5: Set Up Storage

1. In your Supabase dashboard, go to **Storage**
2. Click "Create a new bucket"
3. Configure the bucket:
   - **Name**: `trade_media`
   - **Public bucket**: ✅ Check this box
   - **File size limit**: `50MB`
   - **Allowed MIME types**: `image/*, audio/*, video/*`
4. Click "Create bucket"

## Step 6: Configure Storage Policies

1. In the Storage section, click on the `trade_media` bucket
2. Go to the **Policies** tab
3. Click "New Policy"
4. Add the following policies one by one:

### Policy 1: Allow authenticated users to upload files
- **Policy name**: `Users can upload trade media`
- **Allowed operation**: `INSERT`
- **Policy definition**:
```sql
(bucket_id = 'trade_media' AND auth.role() = 'authenticated')
```

### Policy 2: Allow users to view their own files
- **Policy name**: `Users can view own trade media`
- **Allowed operation**: `SELECT`
- **Policy definition**:
```sql
(bucket_id = 'trade_media' AND auth.uid()::text = (storage.foldername(name))[1])
```

### Policy 3: Allow users to update their own files
- **Policy name**: `Users can update own trade media`
- **Allowed operation**: `UPDATE`
- **Policy definition**:
```sql
(bucket_id = 'trade_media' AND auth.uid()::text = (storage.foldername(name))[1])
```

### Policy 4: Allow users to delete their own files
- **Policy name**: `Users can delete own trade media`
- **Allowed operation**: `DELETE`
- **Policy definition**:
```sql
(bucket_id = 'trade_media' AND auth.uid()::text = (storage.foldername(name))[1])
```

## Step 7: Configure Authentication

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Configure the following settings:

### Email Auth Settings
- **Enable email confirmations**: ✅ (recommended for production)
- **Enable email change confirmations**: ✅
- **Enable secure email change**: ✅

### Site URL
- Set your site URL (e.g., `http://localhost:3000` for development)

### Redirect URLs
- Add your application URLs:
  - `http://localhost:3000`
  - `http://localhost:5500`
  - Your production URL when deployed

## Step 8: Test the Application

1. Open `index.html` in your browser
2. You should see the login/signup form
3. Create a new account or sign in
4. Try creating a trade with media attachments
5. Verify that trades are saved and loaded correctly

## Step 9: Environment Variables (Optional)

For production, consider using environment variables:

1. Create a `.env` file (if using a build tool):
```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

2. Update `config.js` to read from environment variables:
```javascript
const SUPABASE_CONFIG = {
    url: process.env.SUPABASE_URL || 'YOUR_SUPABASE_PROJECT_URL',
    anonKey: process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SUPABASE_SERVICE_ROLE_KEY'
};
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your site URL is added to the redirect URLs in Supabase Auth settings

2. **Storage Upload Failures**: Verify that storage policies are correctly configured

3. **Authentication Issues**: Check that RLS policies are enabled and configured correctly

4. **Database Connection Errors**: Verify your Supabase URL and API keys are correct

### Debug Mode

To enable debug logging, add this to your browser console:
```javascript
localStorage.setItem('supabase.debug', 'true');
```

## Security Considerations

1. **Never expose your service role key** in client-side code
2. **Use RLS policies** to ensure users can only access their own data
3. **Validate file uploads** on both client and server side
4. **Use HTTPS** in production
5. **Regularly review and update** your security policies

## Production Deployment

When deploying to production:

1. Update the site URL in Supabase Auth settings
2. Add your production domain to redirect URLs
3. Consider enabling email confirmations
4. Set up proper CORS policies
5. Use environment variables for sensitive configuration
6. Enable Supabase monitoring and logging

## Support

If you encounter issues:

1. Check the [Supabase documentation](https://supabase.com/docs)
2. Review the browser console for error messages
3. Check the Supabase dashboard logs
4. Verify all configuration steps were completed correctly

---

Your Trade Journal application is now fully connected to Supabase and ready to use! 🎉 