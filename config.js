// Supabase Configuration
// Replace these values with your actual Supabase project credentials

const SUPABASE_CONFIG = {
    url: 'https://rjfpxvplxhuhuidxxfxx.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqZnB4dnBseGh1aHVpZHh4Znh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMjgyNDEsImV4cCI6MjA3MTgwNDI0MX0.moqDTwzSsmtTLpqG-zGONkb-8xZAALSaSQB-23Fvkb0',
    serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqZnB4dnBseGh1aHVpZHh4Znh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjIyODI0MSwiZXhwIjoyMDcxODA0MjQxfQ.bWeHh9WGWAXje5j1TalkvOgIUSqwux5LqQL8EMYCPOU' // Only for server-side operations
};

// Storage bucket configuration
const STORAGE_CONFIG = {
    bucketName: 'trade_media',
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedAudioTypes: ['audio/wav', 'audio/mp3', 'audio/m4a', 'audio/ogg'],
    allowedVideoTypes: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi']
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SUPABASE_CONFIG, STORAGE_CONFIG };
} else {
    window.SUPABASE_CONFIG = SUPABASE_CONFIG;
    window.STORAGE_CONFIG = STORAGE_CONFIG;
} 