// Supabase Service for Trade Journal
// Handles all database and storage operations

class SupabaseService {
    constructor() {
        this.supabase = null;
        this.user = null;
        this.initializeSupabase();
    }

    initializeSupabase() {
        try {
            // Initialize Supabase client
            this.supabase = supabase.createClient(
                SUPABASE_CONFIG.url,
                SUPABASE_CONFIG.anonKey
            );

            // Set up auth state listener
            this.supabase.auth.onAuthStateChange((event, session) => {
                this.user = session?.user || null;
                if (event === 'SIGNED_IN') {
                    console.log('User signed in:', this.user.email);
                    this.onAuthStateChange('signedIn');
                } else if (event === 'SIGNED_OUT') {
                    console.log('User signed out');
                    this.onAuthStateChange('signedOut');
                }
            });

            console.log('Supabase initialized successfully');
        } catch (error) {
            console.error('Error initializing Supabase:', error);
        }
    }

    // Authentication methods
    async signUp(email, password) {
        try {
            const { data, error } = await this.supabase.auth.signUp({
                email,
                password
            });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Sign up error:', error);
            return { success: false, error: error.message };
        }
    }

    async signIn(email, password) {
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Sign in error:', error);
            return { success: false, error: error.message };
        }
    }

    async signOut() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            return { success: false, error: error.message };
        }
    }

    async getCurrentUser() {
        try {
            const { data: { user } } = await this.supabase.auth.getUser();
            this.user = user;
            return user;
        } catch (error) {
            console.error('Get current user error:', error);
            return null;
        }
    }

    // Trade CRUD operations
    async createTrade(tradeData) {
        try {
            if (!this.user) {
                throw new Error('User not authenticated');
            }

            const { data, error } = await this.supabase
                .from('trades')
                .insert([{
                    ...tradeData,
                    user_id: this.user.id
                }])
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Create trade error:', error);
            return { success: false, error: error.message };
        }
    }

    async getTrades() {
        try {
            if (!this.user) {
                throw new Error('User not authenticated');
            }

            const { data, error } = await this.supabase
                .from('trades')
                .select('*')
                .eq('user_id', this.user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Get trades error:', error);
            return { success: false, error: error.message };
        }
    }

    async updateTrade(tradeId, updates) {
        try {
            if (!this.user) {
                throw new Error('User not authenticated');
            }

            const { data, error } = await this.supabase
                .from('trades')
                .update(updates)
                .eq('id', tradeId)
                .eq('user_id', this.user.id)
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Update trade error:', error);
            return { success: false, error: error.message };
        }
    }

    async deleteTrade(tradeId) {
        try {
            if (!this.user) {
                throw new Error('User not authenticated');
            }

            const { error } = await this.supabase
                .from('trades')
                .delete()
                .eq('id', tradeId)
                .eq('user_id', this.user.id);

            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Delete trade error:', error);
            return { success: false, error: error.message };
        }
    }

               // File upload methods
           async uploadFile(file, tradeId, fileType) {
               try {
                   if (!this.user) {
                       throw new Error('User not authenticated');
                   }
       
                   // Validate file type
                   if (!this.isValidFileType(file, fileType)) {
                       throw new Error(`Invalid file type for ${fileType}`);
                   }
       
                   // Validate file size
                   if (file.size > STORAGE_CONFIG.maxFileSize) {
                       throw new Error('File size exceeds limit');
                   }
       
                   // Generate file path
                   const fileExtension = file.name.split('.').pop();
                   const fileName = `${fileType}_${Date.now()}.${fileExtension}`;
                   const filePath = `${this.user.id}/${tradeId}/${fileName}`;
       
                   // Upload file to Supabase storage
                   const { data, error } = await this.supabase.storage
                       .from(STORAGE_CONFIG.bucketName)
                       .upload(filePath, file, {
                           cacheControl: '3600',
                           upsert: false
                       });
       
                   if (error) throw error;
       
                   // Get public URL
                   const { data: { publicUrl } } = this.supabase.storage
                       .from(STORAGE_CONFIG.bucketName)
                       .getPublicUrl(filePath);
       
                   return { success: true, url: publicUrl };
               } catch (error) {
                   console.error('Upload file error:', error);
                   return { success: false, error: error.message };
               }
           }
           
           // Add media to existing trade
           async addMediaToTrade(tradeId, file, fileType) {
               try {
                   if (!this.user) {
                       throw new Error('User not authenticated');
                   }
                   
                   // Upload the file
                   const uploadResult = await this.uploadFile(file, tradeId, fileType);
                   if (!uploadResult.success) {
                       throw new Error(uploadResult.error);
                   }
                   
                   // Get current trade to see existing media
                   const { data: trade, error: fetchError } = await this.supabase
                       .from('trades')
                       .select('*')
                       .eq('id', tradeId)
                       .eq('user_id', this.user.id)
                       .single();
                   
                   if (fetchError) throw fetchError;
                   
                   // Prepare update data
                   const updateData = {};
                   const urlField = `${fileType}_urls`;
                   
                   // Initialize array if it doesn't exist, or add to existing array
                   if (!trade[urlField] || !Array.isArray(trade[urlField])) {
                       updateData[urlField] = [uploadResult.url];
                   } else {
                       updateData[urlField] = [...trade[urlField], uploadResult.url];
                   }
                   
                   // Update the trade
                   const { error: updateError } = await this.supabase
                       .from('trades')
                       .update(updateData)
                       .eq('id', tradeId)
                       .eq('user_id', this.user.id);
                   
                   if (updateError) throw updateError;
                   
                   return { success: true, url: uploadResult.url };
               } catch (error) {
                   console.error('Add media to trade error:', error);
                   console.error('Error details:', {
                       message: error.message,
                       details: error.details,
                       hint: error.hint,
                       code: error.code
                   });
                   
                   // Return a more descriptive error message
                   let errorMessage = 'Unknown error occurred';
                   if (error.message) {
                       errorMessage = error.message;
                   } else if (error.details) {
                       errorMessage = error.details;
                   } else if (error.hint) {
                       errorMessage = error.hint;
                   }
                   
                   return { success: false, error: errorMessage };
               }
           }

    async deleteFile(filePath) {
        try {
            if (!this.user) {
                throw new Error('User not authenticated');
            }

            const { error } = await this.supabase.storage
                .from(STORAGE_CONFIG.bucketName)
                .remove([filePath]);

            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Delete file error:', error);
            return { success: false, error: error.message };
        }
    }

    // Helper methods
    isValidFileType(file, fileType) {
        const allowedTypes = {
            image: STORAGE_CONFIG.allowedImageTypes,
            voice: STORAGE_CONFIG.allowedAudioTypes,
            video: STORAGE_CONFIG.allowedVideoTypes
        };

        return allowedTypes[fileType]?.includes(file.type);
    }

    // Auth state change callback (can be overridden)
    onAuthStateChange(state) {
        console.log('Auth state changed:', state);
        // This can be overridden to handle auth state changes
    }

    // Get user info
    getUser() {
        return this.user;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.user;
    }
}

// Create global instance
window.supabaseService = new SupabaseService(); 