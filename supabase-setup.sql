-- Supabase Database Setup for Trade Journal
-- Run this in your Supabase SQL Editor

-- Create the trades table
CREATE TABLE IF NOT EXISTS trades (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    symbol TEXT NOT NULL,
    entry_price DECIMAL(10,2) NOT NULL,
    exit_price DECIMAL(10,2) NOT NULL,
    pnl DECIMAL(10,2) NOT NULL,
    trade_date DATE NOT NULL,
    image_urls TEXT[], -- Array of image URLs
    voice_urls TEXT[], -- Array of voice URLs
    video_urls TEXT[], -- Array of video URLs
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trades_user_id ON trades(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_symbol ON trades(symbol);
CREATE INDEX IF NOT EXISTS idx_trades_trade_date ON trades(trade_date);
CREATE INDEX IF NOT EXISTS idx_trades_created_at ON trades(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own trades
CREATE POLICY "Users can view own trades" ON trades
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own trades
CREATE POLICY "Users can insert own trades" ON trades
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own trades
CREATE POLICY "Users can update own trades" ON trades
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own trades
CREATE POLICY "Users can delete own trades" ON trades
    FOR DELETE USING (auth.uid() = user_id);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_trades_updated_at 
    BEFORE UPDATE ON trades 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for trade media
-- Note: This needs to be done in the Supabase dashboard under Storage
-- Bucket name: trade_media
-- Public bucket: true
-- File size limit: 50MB
-- Allowed MIME types: image/*, audio/*, video/*

-- Storage policies (run these after creating the bucket in dashboard)
-- Allow authenticated users to upload files
-- CREATE POLICY "Users can upload trade media" ON storage.objects
--     FOR INSERT WITH CHECK (bucket_id = 'trade_media' AND auth.role() = 'authenticated');

-- Allow users to view their own files
-- CREATE POLICY "Users can view own trade media" ON storage.objects
--     FOR SELECT USING (bucket_id = 'trade_media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to update their own files
-- CREATE POLICY "Users can update own trade media" ON storage.objects
--     FOR UPDATE USING (bucket_id = 'trade_media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own files
-- CREATE POLICY "Users can delete own trade media" ON storage.objects
--     FOR DELETE USING (bucket_id = 'trade_media' AND auth.uid()::text = (storage.foldername(name))[1]); 