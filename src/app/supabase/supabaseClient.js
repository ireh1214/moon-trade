import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
// const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

const supabase = createClient(
  "https://dxtqdjpawmtjurqqigdm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4dHFkanBhd210anVycXFpZ2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk0NzU3ODgsImV4cCI6MjA0NTA1MTc4OH0.PV3XQL1t4rPxHYROuDQ5dlBUycaGfv5EbGJnyuDOp-g"
);

export default supabase;
