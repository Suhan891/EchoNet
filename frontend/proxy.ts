import { NextRequest, NextResponse } from "next/server";
import { PUBLIC } from "./utils/routes.path";
import { tokenSchema } from "./validations/common/token.validate";

export default function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname

    if (path === '/')
        return NextResponse.next()

    // if (path.startsWith('/api')) {
    //     const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";
    //     const targetUrl = new URL(request.nextUrl.pathname.replace(/^\/api/, '') + request.nextUrl.search, backendUrl);
    //     return NextResponse.rewrite(targetUrl);
    // }

    const isPublic = PUBLIC.some(p => path === p || path.startsWith(`${p}/`))
    const token = request.cookies.get('accessToken')?.value

    if (!token && isPublic)
        return NextResponse.next()
    if (!token && !isPublic)
        return NextResponse.redirect(new URL('/login', request.nextUrl))

    const isValid = tokenSchema.safeParse(token).success

    if (isValid && isPublic)
        return NextResponse.redirect(new URL('/profile', request.nextUrl))

    if (!isValid) {
        const response = NextResponse.redirect(new URL('/login', request.nextUrl))
        response.cookies.delete('accessToken')
        response.cookies.delete('profile')
        return response
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}