import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/admin"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password, fullName, phone, licenseNumber, licenseClass, licenseExpiry } = body

        if (!email || !password || !fullName) {
            return NextResponse.json(
                { error: "Email, password, and full name are required" },
                { status: 400 }
            )
        }

        const supabase = createAdminClient()

        // 1. Create the Auth User
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name: fullName }
        })

        if (authError) {
            console.error("Auth Error:", authError)
            return NextResponse.json({ error: authError.message }, { status: 400 })
        }

        const user = authData.user

        // 2. Create the User Profile
        const { error: profileError } = await supabase
            .from("users")
            .insert({
                id: user.id,
                email: user.email,
                full_name: fullName,
                phone: phone,
                role: "driver",
                license_number: licenseNumber,
                license_class: licenseClass,
                license_expiry: licenseExpiry || null
            })

        if (profileError) {
            console.error("Profile Error:", profileError)
            // Attempt to cleanup the auth user if profile creation fails
            await supabase.auth.admin.deleteUser(user.id)
            return NextResponse.json({ error: profileError.message }, { status: 400 })
        }

        return NextResponse.json({
            success: true,
            user: { id: user.id, email: user.email, fullName }
        })

    } catch (error: any) {
        console.error("Internal Server Error:", error)
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        )
    }
}
