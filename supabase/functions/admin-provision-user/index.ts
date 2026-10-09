import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization token." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

    // 1. Verify caller authentication using anon client + Bearer JWT token
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user: caller }, error: callerError } = await userClient.auth.getUser();
    if (callerError || !caller) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid or expired authentication session." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Server-side ADMIN role & ACTIVE account status verification
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const { data: callerProfile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("role, account_status")
      .eq("id", caller.id)
      .single();

    if (
      profileError ||
      !callerProfile ||
      callerProfile.role !== "ADMIN" ||
      callerProfile.account_status !== "ACTIVE"
    ) {
      return new Response(
        JSON.stringify({ error: "Forbidden: Only active Administrators can execute privileged user operations." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Parse request body
    const body = await req.json();
    const action = body.action || "provision";

    // --- ACTION A: UPDATE ACCOUNT STATUS ---
    if (action === "update_status") {
      const { targetUserId, newStatus } = body;
      const validStatuses = ["ACTIVE", "INACTIVE", "LOCKED", "PENDING"];

      if (!targetUserId || !newStatus || !validStatuses.includes(newStatus)) {
        return new Response(
          JSON.stringify({ error: "Validation failed: Valid targetUserId and newStatus are required." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Verify target user is not an ADMIN to prevent self/peer lockout via API
      const { data: targetProfile } = await supabaseAdmin
        .from("profiles")
        .select("role")
        .eq("id", targetUserId)
        .single();

      if (targetProfile && targetProfile.role === "ADMIN") {
        return new Response(
          JSON.stringify({ error: "Forbidden: Administrative profiles cannot have their status altered via this endpoint." }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({ account_status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", targetUserId);

      if (updateError) {
        return new Response(
          JSON.stringify({ error: "Failed to update account status." }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: `Account status updated to ${newStatus}.` }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // --- ACTION B: PROVISION USER ---
    const { fullName, usn_or_employee_id, email, department_id, password, role } = body;

    if (!fullName || !usn_or_employee_id || !email || !department_id || !password || !role) {
      return new Response(
        JSON.stringify({ error: "Validation failed: Full Name, USN/Employee ID, Email, Department, Password, and Role are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ALLOWED PROVISIONING ROLES: STUDENT, FACULTY, HOD. REJECT ADMIN.
    if (role !== "STUDENT" && role !== "FACULTY" && role !== "HOD") {
      return new Response(
        JSON.stringify({ error: "Invalid role: Admin user provisioning can only create STUDENT, FACULTY, and HOD accounts." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate department existence and status
    const { data: deptRecord, error: deptError } = await supabaseAdmin
      .from("departments")
      .select("id, status")
      .eq("id", department_id)
      .single();

    if (deptError || !deptRecord || deptRecord.status !== "ACTIVE") {
      return new Response(
        JSON.stringify({ error: "Invalid or inactive department selected." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanId = usn_or_employee_id.trim();
    const cleanName = fullName.trim();

    // Duplicate check 1: Email
    const { data: existingEmail } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .ilike("email", cleanEmail)
      .limit(1);

    if (existingEmail && existingEmail.length > 0) {
      return new Response(
        JSON.stringify({ error: "User with this email address already exists." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Duplicate check 2: USN or Employee ID
    const { data: existingId } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .ilike("usn_or_employee_id", cleanId)
      .limit(1);

    if (existingId && existingId.length > 0) {
      return new Response(
        JSON.stringify({ error: "User with this USN or Employee ID already exists." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Create Auth user via Supabase Admin API with auto-confirmation for provisioned account
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: cleanEmail,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: cleanName,
        usn_or_employee_id: cleanId,
        role: role,
        department_id: department_id,
      },
    });

    if (createError) {
      return new Response(
        JSON.stringify({ error: createError.message || "Failed to create Auth user." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!newUser.user) {
      return new Response(
        JSON.stringify({ error: "User creation returned null." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 5. Ensure profile sync (auth.users.id = profiles.id)
    const { error: syncError } = await supabaseAdmin
      .from("profiles")
      .upsert({
        id: newUser.user.id,
        email: cleanEmail,
        full_name: cleanName,
        usn_or_employee_id: cleanId,
        role: role,
        department_id: department_id,
        account_status: "ACTIVE",
        updated_at: new Date().toISOString(),
      });

    if (syncError) {
      // Safe cleanup rollback if profile upsert fails
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
      return new Response(
        JSON.stringify({ error: `Profile creation failed: ${syncError.message}. Auth user rolled back.` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully provisioned ${role} account for ${cleanName}.`,
        user: {
          id: newUser.user.id,
          email: cleanEmail,
          full_name: cleanName,
          usn_or_employee_id: cleanId,
          role: role,
          department_id: department_id,
          account_status: "ACTIVE",
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error.";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
