import { createClient } from "@supabase/supabase-js";


const supabaseUrl = "https://mktyzbsafcomosjfgkcl.supabase.co";
const supabaseKey = "sb_publishable_d8DnU7tyclwceYJ5eawkGA_gdX8zZpA";

export const supabase = createClient(supabaseUrl, supabaseKey);
