import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // We just check token format, we can't call prisma since it's not available in Edge
  // and /api/chat requires Edge runtime.
  const token = request.headers.get("Authorization");
  const openAIApiKey = request.headers.get("x-openai-key");
  if (!openAIApiKey && !token?.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({
        error: {
          message:
            "Please sign up to get free quota or provide your own OpenAI key.",
        },
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 401,
      }
    );
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/api/chat"],
};
