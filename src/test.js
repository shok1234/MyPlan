import { supabase } from "./services/supabaseClient";

async function testConnection() {
  const { data, error } = await supabase
    .from("student_tasks")
    .select("*");

  console.log("DATA:", data);
  console.log("ERROR:", error);
}

testConnection();