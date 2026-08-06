/// <reference types="astro/client" />
import type { SupabaseClient } from '@supabase/supabase-js';

declare global {
  namespace App {
    interface Locals {
      usuario?: { email: string; nombre: string };
      db?: SupabaseClient;
    }
  }
}
export {};
