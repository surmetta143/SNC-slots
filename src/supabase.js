import { createClient } from "@supabase/supabase-js";

// 👉 Replace these
const supabaseUrl = "https://ommjnaekammlmjvhdvhf.supabase.co";
const supabaseKey = "sb_publishable_X_quqCon4Mm6lMDzo1Zg_w_e6DAKiqL";

export const supabase = createClient(supabaseUrl, supabaseKey);