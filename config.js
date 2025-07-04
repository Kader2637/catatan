import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://feriqnmbfzixgeedmvzw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlcmlxbm1iZnppeGdlZWRtdnp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2ODY3NTAsImV4cCI6MjA2NjI2Mjc1MH0.POc4TH7fATyb1lsWmMPmUZUww4vaH_5qgGCsD3MsW-E"; 
export const supabase = createClient(supabaseUrl, supabaseKey);
