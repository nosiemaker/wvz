import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  // Always return a mock client for now to bypass auth
  return {
    auth: {
      signInWithPassword: async () => ({ 
        data: { 
          user: { 
            id: '00000000-0000-0000-0000-000000000001', 
            email: 'driver@fleet.com',
            role: 'authenticated'
          },
          session: { access_token: 'fake-token' } 
        }, 
        error: null 
      }),
      signUp: async () => ({ data: { user: null }, error: null }),
      getUser: async () => ({ 
        data: { 
          user: { 
            id: '00000000-0000-0000-0000-000000000001', 
            email: 'driver@fleet.com',
            role: 'authenticated'
          } 
        }, 
        error: null 
      }),
      signOut: async () => ({ error: null }),
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
          order: () => ({ data: [], error: null }),
        }),
        order: () => ({ data: [], error: null }),
        insert: async () => ({ data: null, error: null }),
        update: async () => ({ data: null, error: null }),
      }),
      insert: async () => ({ data: null, error: null }),
      update: async () => ({ data: null, error: null }),
    }),
  } as any
}
