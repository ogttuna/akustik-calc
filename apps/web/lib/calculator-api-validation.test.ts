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

function rawJsonRequest(url: string, body: string) {
  return new Request(url, {
    body,
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

  it("allows estimate requests to carry project custom material catalog entries", async () => {
    const { POST } = await import("../app/api/estimate/route");
    const response = await POST(
      jsonRequest("http://localhost/api/estimate", {
        calculator: "dynamic",
        layers: [{ materialId: "custom_cork_finish", thicknessMm: 8 }],
        materialCatalog: [
          {
            acoustic: {
              behavior: "rigid_mass",
              propertySourceStatus: "user_supplied"
            },
            category: "finish",
            densityKgM3: 720,
            id: "custom_cork_finish",
            name: "Custom cork finish",
            tags: ["custom-workbench-material", "finish"]
          }
        ],
        targetOutputs: ["Rw"]
      })
    );
    const body = (await response.json()) as { ok?: boolean; result?: unknown };

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.result).toBeTruthy();
  });

  it("rejects estimate material catalog entries that override built-in material ids", async () => {
    const { POST } = await import("../app/api/estimate/route");
    const response = await POST(
      jsonRequest("http://localhost/api/estimate", {
        calculator: "dynamic",
        layers: [{ materialId: "concrete", thicknessMm: 100 }],
        materialCatalog: [
          {
            acoustic: {
              behavior: "rigid_mass",
              propertySourceStatus: "user_supplied"
            },
            category: "mass",
            densityKgM3: 1,
            id: "concrete",
            name: "Unsafe concrete override",
            tags: ["custom-workbench-material"]
          }
        ],
        targetOutputs: ["Rw"]
      })
    );
    const body = (await response.json()) as {
      issues?: Array<{ path: Array<number | string> }>;
      ok?: boolean;
    };

    expect(response.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.issues?.[0]?.path).toEqual(["materialCatalog", 0, "id"]);
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

  it("rejects non-finite JSON layer thickness before estimate or impact calculation", async () => {
    const { POST: estimate } = await import("../app/api/estimate/route");
    const { POST: impactOnly } = await import("../app/api/impact-only/route");

    const estimateResponse = await estimate(
      rawJsonRequest(
        "http://localhost/api/estimate",
        '{"layers":[{"materialId":"gypsum_board","thicknessMm":1e309}],"targetOutputs":["Rw"]}'
      )
    );
    const estimateBody = (await estimateResponse.json()) as {
      issues?: Array<{ path: string[] }>;
      ok?: boolean;
      result?: unknown;
    };

    expect(estimateResponse.status).toBe(400);
    expect(estimateBody.ok).toBe(false);
    expect(estimateBody.result).toBeUndefined();
    expect(estimateBody.issues?.map((issue) => issue.path.join("."))).toContain("layers.0.thicknessMm");

    const impactResponse = await impactOnly(
      rawJsonRequest(
        "http://localhost/api/impact-only",
        '{"layers":[{"materialId":"concrete","thicknessMm":1e309}],"targetOutputs":["Ln,w"]}'
      )
    );
    const impactBody = (await impactResponse.json()) as {
      issues?: Array<{ path: string[] }>;
      ok?: boolean;
      result?: unknown;
    };

    expect(impactResponse.status).toBe(400);
    expect(impactBody.ok).toBe(false);
    expect(impactBody.result).toBeUndefined();
    expect(impactBody.issues?.map((issue) => issue.path.join("."))).toContain("layers.0.thicknessMm");
  });
});
