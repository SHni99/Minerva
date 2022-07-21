import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://uzxaovzbbwexnjnhecue.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6eGFvdnpiYndleG5qbmhlY3VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTM1NTg3MDYsImV4cCI6MTk2OTEzNDcwNn0.IYMiwHSQmoNmnKY2DhNc8NYpT7Kj_fI9DC-B9hXUqOQ";

// Backup:
// const supabaseUrl = "https://ffglsldgpdvrfokasejo.supabase.co";
// const supabaseAnonKey =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmZ2xzbGRncGR2cmZva2FzZWpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTgzMzU3MjAsImV4cCI6MTk3MzkxMTcyMH0.MizcVjpi1vxuP2NqdfFoYb2vDz8wr4N_7CYKe576lgk";

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
