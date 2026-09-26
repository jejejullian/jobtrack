import AppError from "@/lib/AppError";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Pakai NextResponse karena response ini akan digunakan untuk set cookie
    const response = NextResponse.json({
        message: 'Logout successful'
    })

    response.cookies.set('token', '', {
        httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: 'lax',
        maxAge: 0,
        path: '/'
        
    })

    return response
  } catch (error) {
    if (error instanceof AppError) {
      return Response.json({ error: error.message, field: error.field }, { status: error.statusCode });
    }

    console.error(error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}


//   const logout = useCallback(() => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setToken(null);
//     setUser(null);
//   }, []);

//    return (
//     <AuthContext.Provider value={{ token, user, login, logout, updateUser }}>
//       {children}
//     </AuthContext.Provider>
//   );