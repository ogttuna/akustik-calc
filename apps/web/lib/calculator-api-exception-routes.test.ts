import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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

function thrownPartitionAreaResultIssue() {
  return {
    issues: [
      {
        code: "too_small",
        message: "Number must be greater than 0",
        path: ["ratings", "field", "partitionAreaM2"]
      }
    ]
  };
}

function thrownReceivingRoomVolumeResultIssue() {
  return {
    issues: [
      {
        code: "too_small",
        message: "Number must be greater than 0",
        path: ["ratings", "field", "receivingRoomVolumeM3"]
      }
    ]
  };
}

function thrownMalformedIssueObject() {
  return {
    issues: [
      {
        message: "Number must be greater than 0",
        path: "ratings.field.partitionAreaM2"
      }
    ]
  };
}

beforeEach(() => {
  vi.resetModules();
  originalEnv = Object.fromEntries(AUTH_ENV_KEYS.map((key) => [key, process.env[key]] as const));

  for (const key of AUTH_ENV_KEYS) {
    process.env[key] = "";
  }
});

afterEach(() => {
  vi.doUnmock("@dynecho/engine/runtime");
  vi.resetModules();

  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
});

describe("calculator API exception route handling", () => {
  // AGENT COORDINATION 2026-06-24 (Codex): route-level mocks verify the
  // user-facing API responses, not only the shared payload helper, so raw
  // result-validation JSON cannot leak through either public calculation route.
  it("normalizes estimate route result-validation exceptions without leaking raw issue JSON as the error", async () => {
    vi.doMock("@dynecho/engine/runtime", () => ({
      calculateAssembly: () => {
        throw thrownPartitionAreaResultIssue();
      },
      calculateImpactOnly: vi.fn()
    }));

    const { POST } = await import("../app/api/estimate/route");
    const response = await POST(
      jsonRequest("http://localhost/api/estimate", {
        calculator: "dynamic",
        layers: [{ materialId: "concrete", thicknessMm: 100 }],
        targetOutputs: ["Rw"]
      })
    );
    const body = (await response.json()) as {
      error?: string;
      errorKind?: string;
      issues?: Array<{ message: string; path: string[] }>;
      nextField?: { label: string; path: string };
      ok?: boolean;
    };

    expect(response.status).toBe(500);
    expect(body).toMatchObject({
      error: "The calculation needs valid panel area metadata before it can publish field or building outputs.",
      errorKind: "result_validation",
      nextField: {
        label: "Panel area",
        path: "ratings.field.partitionAreaM2"
      },
      ok: false
    });
    expect(body.error).not.toContain("Number must be greater than 0");
    expect(body.error).not.toContain("too_small");
    expect(body.issues).toEqual([
      {
        message: "Number must be greater than 0",
        path: ["ratings", "field", "partitionAreaM2"]
      }
    ]);
  });

  it("normalizes impact-only route result-validation exceptions without leaking raw issue JSON as the error", async () => {
    vi.doMock("@dynecho/engine/runtime", () => ({
      calculateAssembly: vi.fn(),
      calculateImpactOnly: () => {
        throw thrownPartitionAreaResultIssue();
      }
    }));

    const { POST } = await import("../app/api/impact-only/route");
    const response = await POST(
      jsonRequest("http://localhost/api/impact-only", {
        layers: [{ materialId: "concrete", thicknessMm: 150 }],
        sourceLayers: [{ materialId: "concrete", thicknessMm: 150 }],
        targetOutputs: ["Ln,w"]
      })
    );
    const body = (await response.json()) as {
      error?: string;
      errorKind?: string;
      issues?: Array<{ message: string; path: string[] }>;
      nextField?: { label: string; path: string };
      ok?: boolean;
    };

    expect(response.status).toBe(500);
    expect(body).toMatchObject({
      error: "The calculation needs valid panel area metadata before it can publish field or building outputs.",
      errorKind: "result_validation",
      nextField: {
        label: "Panel area",
        path: "ratings.field.partitionAreaM2"
      },
      ok: false
    });
    expect(body.error).not.toContain("Number must be greater than 0");
    expect(body.error).not.toContain("too_small");
    expect(body.issues).toEqual([
      {
        message: "Number must be greater than 0",
        path: ["ratings", "field", "partitionAreaM2"]
      }
    ]);
  });

  it("keeps estimate non-panel result-validation paths structured without panel-area guidance", async () => {
    vi.doMock("@dynecho/engine/runtime", () => ({
      calculateAssembly: () => {
        throw thrownReceivingRoomVolumeResultIssue();
      },
      calculateImpactOnly: vi.fn()
    }));

    const { POST } = await import("../app/api/estimate/route");
    const response = await POST(
      jsonRequest("http://localhost/api/estimate", {
        calculator: "dynamic",
        layers: [{ materialId: "concrete", thicknessMm: 100 }],
        targetOutputs: ["Rw"]
      })
    );
    const body = (await response.json()) as {
      error?: string;
      errorKind?: string;
      issues?: Array<{ message: string; path: string[] }>;
      nextField?: { label: string; path: string };
      ok?: boolean;
    };

    expect(response.status).toBe(500);
    expect(body).toMatchObject({
      error: "The estimate result could not be published safely. Review the highlighted calculator inputs and try again.",
      errorKind: "result_validation",
      nextField: {
        label: "Estimate result",
        path: "ratings.field.receivingRoomVolumeM3"
      },
      ok: false
    });
    expect(body.error).not.toContain("Number must be greater than 0");
    expect(body.nextField?.label).not.toBe("Panel area");
    expect(body.issues).toEqual([
      {
        message: "Number must be greater than 0",
        path: ["ratings", "field", "receivingRoomVolumeM3"]
      }
    ]);
  });

  it("keeps impact-only non-panel result-validation paths structured without panel-area guidance", async () => {
    vi.doMock("@dynecho/engine/runtime", () => ({
      calculateAssembly: vi.fn(),
      calculateImpactOnly: () => {
        throw thrownReceivingRoomVolumeResultIssue();
      }
    }));

    const { POST } = await import("../app/api/impact-only/route");
    const response = await POST(
      jsonRequest("http://localhost/api/impact-only", {
        layers: [{ materialId: "concrete", thicknessMm: 150 }],
        sourceLayers: [{ materialId: "concrete", thicknessMm: 150 }],
        targetOutputs: ["Ln,w"]
      })
    );
    const body = (await response.json()) as {
      error?: string;
      errorKind?: string;
      issues?: Array<{ message: string; path: string[] }>;
      nextField?: { label: string; path: string };
      ok?: boolean;
    };

    expect(response.status).toBe(500);
    expect(body).toMatchObject({
      error: "The impact-only result could not be published safely. Review the highlighted calculator inputs and try again.",
      errorKind: "result_validation",
      nextField: {
        label: "Impact-only result",
        path: "ratings.field.receivingRoomVolumeM3"
      },
      ok: false
    });
    expect(body.error).not.toContain("Number must be greater than 0");
    expect(body.nextField?.label).not.toBe("Panel area");
    expect(body.issues).toEqual([
      {
        message: "Number must be greater than 0",
        path: ["ratings", "field", "receivingRoomVolumeM3"]
      }
    ]);
  });

  it("normalizes plain estimate runtime exceptions without exposing private exception text", async () => {
    vi.doMock("@dynecho/engine/runtime", () => ({
      calculateAssembly: () => {
        throw new Error("private estimate stack: database path /tmp/secret");
      },
      calculateImpactOnly: vi.fn()
    }));

    const { POST } = await import("../app/api/estimate/route");
    const response = await POST(
      jsonRequest("http://localhost/api/estimate", {
        calculator: "dynamic",
        layers: [{ materialId: "concrete", thicknessMm: 100 }],
        targetOutputs: ["Rw"]
      })
    );
    const body = (await response.json()) as {
      error?: string;
      errorKind?: string;
      issues?: unknown[];
      nextField?: { label: string; path: string };
      ok?: boolean;
    };

    expect(response.status).toBe(500);
    expect(body).toEqual({
      error: "Estimate failed while calculating. Review the calculator inputs and try again.",
      errorKind: "internal_error",
      issues: [],
      nextField: {
        action: "Review the calculator inputs and run the calculation again.",
        label: "Estimate input",
        path: "payload"
      },
      ok: false
    });
    expect(body.error).not.toContain("private estimate stack");
    expect(body.error).not.toContain("/tmp/secret");
  });

  it("normalizes plain impact-only runtime exceptions without exposing private exception text", async () => {
    vi.doMock("@dynecho/engine/runtime", () => ({
      calculateAssembly: vi.fn(),
      calculateImpactOnly: () => {
        throw new Error("private impact-only stack: internal catalog trace");
      }
    }));

    const { POST } = await import("../app/api/impact-only/route");
    const response = await POST(
      jsonRequest("http://localhost/api/impact-only", {
        layers: [{ materialId: "concrete", thicknessMm: 150 }],
        sourceLayers: [{ materialId: "concrete", thicknessMm: 150 }],
        targetOutputs: ["Ln,w"]
      })
    );
    const body = (await response.json()) as {
      error?: string;
      errorKind?: string;
      issues?: unknown[];
      nextField?: { label: string; path: string };
      ok?: boolean;
    };

    expect(response.status).toBe(500);
    expect(body).toEqual({
      error: "Impact-only calculation failed. Review the calculator inputs and try again.",
      errorKind: "internal_error",
      issues: [],
      nextField: {
        action: "Review the calculator inputs and run the calculation again.",
        label: "Impact-only input",
        path: "payload"
      },
      ok: false
    });
    expect(body.error).not.toContain("private impact-only stack");
    expect(body.error).not.toContain("internal catalog trace");
  });

  it("treats malformed thrown issue arrays as generic-safe route failures", async () => {
    vi.doMock("@dynecho/engine/runtime", () => ({
      calculateAssembly: () => {
        throw thrownMalformedIssueObject();
      },
      calculateImpactOnly: vi.fn()
    }));

    const { POST } = await import("../app/api/estimate/route");
    const response = await POST(
      jsonRequest("http://localhost/api/estimate", {
        calculator: "dynamic",
        layers: [{ materialId: "concrete", thicknessMm: 100 }],
        targetOutputs: ["Rw"]
      })
    );
    const body = (await response.json()) as {
      error?: string;
      errorKind?: string;
      issues?: unknown[];
      nextField?: { label: string; path: string };
      ok?: boolean;
    };

    expect(response.status).toBe(500);
    expect(body).toMatchObject({
      error: "Estimate failed while calculating. Review the calculator inputs and try again.",
      errorKind: "internal_error",
      issues: [],
      nextField: {
        label: "Estimate input",
        path: "payload"
      },
      ok: false
    });
    expect(body.error).not.toContain("ratings.field.partitionAreaM2");
    expect(body.error).not.toContain("Number must be greater than 0");
  });
});
