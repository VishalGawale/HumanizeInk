import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://lrqssdquacppziegsoid.supabase.co"
const SUPABASE_ANON_KEY = "sb_publishable_hcBzuynanmK9l_ppt6uj2w_-uT0c79w"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
