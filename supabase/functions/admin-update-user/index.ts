// deno-lint-ignore-file no-explicit-any
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const ADMIN_FUNCTION_SECRET = Deno.env.get("ADMIN_FUNCTION_SECRET");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (!SERVICE_ROLE_KEY) {
    return jsonResponse({ error: "SERVICE_ROLE key ausente" }, 500);
  }

  if (!ADMIN_FUNCTION_SECRET) {
    return jsonResponse({ error: "ADMIN_FUNCTION_SECRET ausente" }, 500);
  }

  const authHeader = req.headers.get("x-admin-secret") || req.headers.get("authorization")?.replace("Bearer ", "");
  if (!authHeader || authHeader !== ADMIN_FUNCTION_SECRET) {
    return jsonResponse({ error: "Não autorizado" }, 401);
  }

  let payload: any;
  try {
    payload = await req.json();
  } catch (err) {
    return jsonResponse({ error: "JSON inválido", details: String(err) }, 400);
  }

  const { user_id, email, password } = payload ?? {};

  if (!user_id) {
    return jsonResponse({ error: "user_id é obrigatório" }, 400);
  }

  if (!email && !password) {
    return jsonResponse({ error: "Informe email e/ou password" }, 400);
  }

  const updates: { email?: string; password?: string } = {};
  if (email) updates.email = email;
  if (password) updates.password = password;

  const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data, error } = await adminClient.auth.admin.updateUserById(user_id, updates);

  if (error) {
    return jsonResponse({ error: error.message }, 400);
  }

  return jsonResponse({
    user_id: data.user?.id,
    email: data.user?.email,
    updated_email: Boolean(email),
    updated_password: Boolean(password),
  });
});
