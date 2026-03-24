import { NextResponse } from "next/server";

import {
  applySessionCookie,
  buildAuthConfigurationErrorMessage,
  normalizeNextPath,
  validateLoginCredentials
} from "@/lib/auth";

type LoginPayload = {
  nextPath?: unknown;
  password?: unknown;
  username?: unknown;
};

export async function POST(request: Request) {
  let payload: LoginPayload;

  try {
    payload = (await request.json()) as LoginPayload;
  } catch {
    return NextResponse.json(
      {
        error: "DynEcho could not read the login payload.",
        ok: false
      },
      {
        status: 400
      }
    );
  }

  const username = typeof payload.username === "string" ? payload.username : "";
  const password = typeof payload.password === "string" ? payload.password : "";
  const nextPath = normalizeNextPath(typeof payload.nextPath === "string" ? payload.nextPath : undefined);
  const loginState = validateLoginCredentials(username, password);

  if (!loginState.configured) {
    return NextResponse.json(
      {
        error: buildAuthConfigurationErrorMessage(loginState.missingKeys),
        ok: false
      },
      {
        status: 503
      }
    );
  }

  if (!loginState.valid) {
    return NextResponse.json(
      {
        error: "Invalid username or password.",
        ok: false
      },
      {
        status: 401
      }
    );
  }

  const response = NextResponse.json({
    ok: true,
    redirectTo: nextPath
  });

  applySessionCookie(response, loginState.config, loginState.config.username);

  return response;
}
