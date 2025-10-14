import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // Hardcoded Lovable Cloud credentials (publishable keys - safe to commit)
  const supabaseUrl = env.VITE_SUPABASE_URL || "https://riqzdvnggzfuvncmrzcs.supabase.co";
  const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpcXpkdm5nZ3pmdXZuY21yemNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzMDI1NDEsImV4cCI6MjA3NTg3ODU0MX0.p_qiRe7mxjf0wA6G062593HjZNYyBdFr74MjobEDhPY";
  const supabaseProjectId = env.VITE_SUPABASE_PROJECT_ID || "riqzdvnggzfuvncmrzcs";

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(supabaseUrl),
      "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(supabaseKey),
      "import.meta.env.VITE_SUPABASE_PROJECT_ID": JSON.stringify(supabaseProjectId),
    },
  };
});
