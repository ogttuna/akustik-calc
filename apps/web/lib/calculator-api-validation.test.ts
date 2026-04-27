import { afterEach, beforeEach, describe, expect, it } from "vitest";

const AUTH_ENV_KEYS = ["DYNECHO_AUTH_USERNAME", "DYNECHO_AUTH_PASSWORD", "DYNECHO_AUTH_SECRET"] as const;

let originalEnv: Record<string, string | undefined>;

function jsonRequest(url: string, payload: unknown) {
  return new Request(url, {
    body: JSON.stringify(payload),
    headers: {
      "content-type": "application/json"
    },
    method: "POST"
  });
}

beforeEach(() => {
  originalEnv = Object.fromEntries(AUTH_ENV_KEYS.map((key) => [key, process.env[key]] as const));

  for (const key of AUTH_ENV_KEYS) {
    process.env[key] = "";
  }
});

afterEach(() => {
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
});

describe("calculator API validation guidance", () => {
  it("returns concrete next-field guidance for estimate requests without a layer stack", async () => {
    const { POST } = await import("../app/api/estimate/route");
    const response = await POST(
      jsonRequest("http://localhost/api/estimate", {
        targetOutputs: ["Rw"]
      })
    );
    const body = (await response.json()) as {
      error?: string;
      issues?: Array<{ path: string[] }>;
      nextField?: {
        action: string;
        label: string;
        path: string;
      };
      ok?: boolean;
    };

    expect(response.status).toBe(400);
    expect(body).toMatchObject({
      error: "Add at least one wall or floor layer before calculating.",
      nextField: {
        action: "Add one or more layers with material and thickness.",
        label: "Layer stack",
        path: "layers"
      },
      ok: false
    });
    expect(body.issues?.map((issue) => issue.path.join("."))).toContain("layers");
  });

  it("returns concrete next-field guidance for source-less impact-only requests", async () => {
    const { POST } = await import("../app/api/impact-only/route");
    const response = await POST(
      jsonRequest("http://localhost/api/impact-only", {
        targetOutputs: ["Ln,w"]
      })
    );
    const body = (await response.json()) as {
      error?: string;
      issues?: Array<{ message: string; path: string[] }>;
      nextField?: {
        action: string;
        label: string;
        path: string;
      };
      ok?: boolean;
    };

    expect(response.status).toBe(400);
    expect(body).toMatchObject({
      error:
        "Add an impact source before running impact-only: visible layers, source layers, exact bands, predictor input, or an official floor/impact source.",
      nextField: {
        action: "Add visible layers, source layers, exact impact bands, predictor input, or an official source id.",
        label: "Impact source",
        path: "layers"
      },
      ok: false
    });
    expect(body.issues).toEqual([
      expect.objectContaining({
        message: expect.stringContaining("at least one source"),
        path: ["layers"]
      })
    ]);
  });
});
