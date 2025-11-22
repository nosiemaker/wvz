import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  // Always return a mock client for now to bypass auth
  return {
    auth: {
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
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          single: async () => ({
            data: {
              id: '00000000-0000-0000-0000-000000000001',
              role: 'driver',
              full_name: 'Demo Driver'
            },
            error: null
          }),
        }),
        order: () => ({ data: [], error: null }),
      }),
      insert: async () => ({ data: null, error: null }),
      update: async () => ({ data: null, error: null }),
    }),
  } as any
}
