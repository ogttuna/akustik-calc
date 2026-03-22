import type { ReportProfile } from "@dynecho/shared";

import {
  DEFAULT_SIMPLE_WORKBENCH_PROPOSAL_ISSUE_PURPOSE,
  DEFAULT_SIMPLE_WORKBENCH_PROPOSAL_VALIDITY_NOTE
} from "./simple-workbench-proposal-policy-presets";

const PROPOSAL_COMPANY_PROFILE_STORAGE_KEY = "dynecho:proposal-company-profiles:v1";

export type SimpleWorkbenchProposalCompanyProfile = {
  approverTitle: string;
  consultantAddress: string;
  consultantCompany: string;
  consultantEmail: string;
  consultantLogoDataUrl: string;
  consultantPhone: string;
  consultantWordmarkLine: string;
  id: string;
  isDefault: boolean;
  issueCodePrefix: string;
  label: string;
  preparedBy: string;
  preferredReportProfile: ReportProfile;
  proposalIssuePurpose: string;
  proposalValidityNote: string;
  updatedAtIso: string;
};

export type SaveSimpleWorkbenchProposalCompanyProfileInput = Omit<
  SimpleWorkbenchProposalCompanyProfile,
  "id" | "updatedAtIso" | "isDefault"
> & {
  isDefault?: boolean;
};

export type SimpleWorkbenchProposalCompanyProfileIdentity = Pick<
  SimpleWorkbenchProposalCompanyProfile,
  | "approverTitle"
  | "consultantAddress"
  | "consultantCompany"
  | "consultantEmail"
  | "consultantLogoDataUrl"
  | "consultantPhone"
  | "consultantWordmarkLine"
  | "issueCodePrefix"
  | "preparedBy"
  | "preferredReportProfile"
>;

type ExportedProposalCompanyProfiles = {
  exportedAtIso: string;
  profiles: readonly SimpleWorkbenchProposalCompanyProfile[];
  schemaVersion: 1;
};

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeIdentityValue(value: string): string {
  return value.trim();
}

function normalizeIdentityEmail(value: string): string {
  return value.trim().toLowerCase();
}

function sanitizeProposalCompanyProfile(value: unknown): SimpleWorkbenchProposalCompanyProfile | null {
  if (!isObjectRecord(value)) {
    return null;
  }

  if (
    typeof value.approverTitle !== "string" ||
    typeof value.consultantAddress !== "string" ||
    typeof value.consultantCompany !== "string" ||
    typeof value.consultantEmail !== "string" ||
    typeof value.consultantLogoDataUrl !== "string" ||
    typeof value.consultantPhone !== "string" ||
    typeof value.consultantWordmarkLine !== "string" ||
    typeof value.id !== "string" ||
    value.id.trim().length === 0 ||
    (typeof value.isDefault !== "undefined" && typeof value.isDefault !== "boolean") ||
    (typeof value.issueCodePrefix !== "undefined" && typeof value.issueCodePrefix !== "string") ||
    typeof value.label !== "string" ||
    value.label.trim().length === 0 ||
    typeof value.preparedBy !== "string" ||
    (typeof value.preferredReportProfile !== "undefined" &&
      value.preferredReportProfile !== "consultant" &&
      value.preferredReportProfile !== "developer" &&
      value.preferredReportProfile !== "lab_ready") ||
    (typeof value.proposalIssuePurpose !== "undefined" && typeof value.proposalIssuePurpose !== "string") ||
    (typeof value.proposalValidityNote !== "undefined" && typeof value.proposalValidityNote !== "string") ||
    typeof value.updatedAtIso !== "string"
  ) {
    return null;
  }

  return {
    approverTitle: value.approverTitle,
    consultantAddress: value.consultantAddress,
    consultantCompany: value.consultantCompany,
    consultantEmail: value.consultantEmail,
    consultantLogoDataUrl: value.consultantLogoDataUrl,
    consultantPhone: value.consultantPhone,
    consultantWordmarkLine: value.consultantWordmarkLine,
    id: value.id,
    isDefault: value.isDefault === true,
    issueCodePrefix: typeof value.issueCodePrefix === "string" ? value.issueCodePrefix : "",
    label: value.label,
    preparedBy: value.preparedBy,
    preferredReportProfile:
      value.preferredReportProfile === "developer" || value.preferredReportProfile === "lab_ready"
        ? value.preferredReportProfile
        : "consultant",
    proposalIssuePurpose:
      typeof value.proposalIssuePurpose === "string"
        ? value.proposalIssuePurpose
        : DEFAULT_SIMPLE_WORKBENCH_PROPOSAL_ISSUE_PURPOSE,
    proposalValidityNote:
      typeof value.proposalValidityNote === "string"
        ? value.proposalValidityNote
        : DEFAULT_SIMPLE_WORKBENCH_PROPOSAL_VALIDITY_NOTE,
    updatedAtIso: value.updatedAtIso
  };
}

function sortProposalCompanyProfiles(
  profiles: readonly SimpleWorkbenchProposalCompanyProfile[]
): SimpleWorkbenchProposalCompanyProfile[] {
  return [...profiles].sort((left, right) => {
    if (left.isDefault !== right.isDefault) {
      return left.isDefault ? -1 : 1;
    }

    const updatedCompare = right.updatedAtIso.localeCompare(left.updatedAtIso);
    if (updatedCompare !== 0) {
      return updatedCompare;
    }

    return left.label.localeCompare(right.label);
  });
}

function normalizeProposalCompanyProfiles(
  profiles: readonly SimpleWorkbenchProposalCompanyProfile[]
): SimpleWorkbenchProposalCompanyProfile[] {
  let defaultAssigned = false;

  return sortProposalCompanyProfiles(
    sortProposalCompanyProfiles(profiles).map((profile) => {
      if (!profile.isDefault || defaultAssigned) {
        return {
          ...profile,
          isDefault: false
        };
      }

      defaultAssigned = true;
      return profile;
    })
  );
}

function readProposalCompanyProfilesRegister(): SimpleWorkbenchProposalCompanyProfile[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(PROPOSAL_COMPANY_PROFILE_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return normalizeProposalCompanyProfiles(
      parsed
        .map((entry) => sanitizeProposalCompanyProfile(entry))
        .filter((entry): entry is SimpleWorkbenchProposalCompanyProfile => entry !== null)
    );
  } catch {
    return [];
  }
}

function writeProposalCompanyProfilesRegister(profiles: readonly SimpleWorkbenchProposalCompanyProfile[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PROPOSAL_COMPANY_PROFILE_STORAGE_KEY, JSON.stringify(normalizeProposalCompanyProfiles(profiles)));
}

export function readSimpleWorkbenchProposalCompanyProfiles(): readonly SimpleWorkbenchProposalCompanyProfile[] {
  return readProposalCompanyProfilesRegister();
}

export function getDefaultSimpleWorkbenchProposalCompanyProfile(): SimpleWorkbenchProposalCompanyProfile | null {
  return readProposalCompanyProfilesRegister().find((profile) => profile.isDefault) ?? null;
}

export function matchesSimpleWorkbenchProposalCompanyProfile(
  profile: SimpleWorkbenchProposalCompanyProfile,
  identity: SimpleWorkbenchProposalCompanyProfileIdentity
): boolean {
  return (
    normalizeIdentityValue(profile.approverTitle) === normalizeIdentityValue(identity.approverTitle) &&
    normalizeIdentityValue(profile.consultantAddress) === normalizeIdentityValue(identity.consultantAddress) &&
    normalizeIdentityValue(profile.consultantCompany) === normalizeIdentityValue(identity.consultantCompany) &&
    normalizeIdentityEmail(profile.consultantEmail) === normalizeIdentityEmail(identity.consultantEmail) &&
    normalizeIdentityValue(profile.consultantLogoDataUrl) === normalizeIdentityValue(identity.consultantLogoDataUrl) &&
    normalizeIdentityValue(profile.consultantPhone) === normalizeIdentityValue(identity.consultantPhone) &&
    normalizeIdentityValue(profile.consultantWordmarkLine) === normalizeIdentityValue(identity.consultantWordmarkLine) &&
    normalizeIdentityValue(profile.issueCodePrefix) === normalizeIdentityValue(identity.issueCodePrefix) &&
    normalizeIdentityValue(profile.preparedBy) === normalizeIdentityValue(identity.preparedBy) &&
    profile.preferredReportProfile === identity.preferredReportProfile
  );
}

export function saveSimpleWorkbenchProposalCompanyProfile(input: SaveSimpleWorkbenchProposalCompanyProfileInput): {
  action: "created" | "updated";
  profiles: readonly SimpleWorkbenchProposalCompanyProfile[];
  savedProfile: SimpleWorkbenchProposalCompanyProfile;
} {
  const label = input.label.trim() || input.consultantCompany.trim() || "Current office profile";
  const id = slugify(label) || `company-profile-${Date.now()}`;
  const updatedAtIso = new Date().toISOString();
  const existingProfiles = readProposalCompanyProfilesRegister();
  const existingProfile = existingProfiles.find((profile) => profile.id === id);
  const savedProfile: SimpleWorkbenchProposalCompanyProfile = {
    approverTitle: input.approverTitle.trim(),
    consultantAddress: input.consultantAddress.trim(),
    consultantCompany: input.consultantCompany.trim(),
    consultantEmail: input.consultantEmail.trim(),
    consultantLogoDataUrl: input.consultantLogoDataUrl.trim(),
    consultantPhone: input.consultantPhone.trim(),
    consultantWordmarkLine: input.consultantWordmarkLine.trim(),
    id,
    isDefault: input.isDefault ?? existingProfile?.isDefault ?? false,
    issueCodePrefix: input.issueCodePrefix.trim(),
    label,
    preparedBy: input.preparedBy.trim(),
    preferredReportProfile: input.preferredReportProfile,
    proposalIssuePurpose: input.proposalIssuePurpose.trim(),
    proposalValidityNote: input.proposalValidityNote.trim(),
    updatedAtIso
  };
  const action = existingProfiles.some((profile) => profile.id === id) ? "updated" : "created";
  const profiles = normalizeProposalCompanyProfiles([
    savedProfile,
    ...existingProfiles.filter((profile) => profile.id !== id)
  ]);

  writeProposalCompanyProfilesRegister(profiles);

  return {
    action,
    profiles,
    savedProfile
  };
}

export function deleteSimpleWorkbenchProposalCompanyProfile(
  profileId: string
): readonly SimpleWorkbenchProposalCompanyProfile[] {
  const profiles = readProposalCompanyProfilesRegister().filter((profile) => profile.id !== profileId);
  writeProposalCompanyProfilesRegister(profiles);
  return profiles;
}

export function setDefaultSimpleWorkbenchProposalCompanyProfile(
  profileId: string
): readonly SimpleWorkbenchProposalCompanyProfile[] {
  const profiles = normalizeProposalCompanyProfiles(
    readProposalCompanyProfilesRegister().map((profile) => ({
      ...profile,
      isDefault: profile.id === profileId
    }))
  );

  writeProposalCompanyProfilesRegister(profiles);
  return profiles;
}

export function exportSimpleWorkbenchProposalCompanyProfiles(): string {
  const payload: ExportedProposalCompanyProfiles = {
    exportedAtIso: new Date().toISOString(),
    profiles: readProposalCompanyProfilesRegister(),
    schemaVersion: 1
  };

  return JSON.stringify(payload, null, 2);
}

export function importSimpleWorkbenchProposalCompanyProfiles(raw: string): {
  importedCount: number;
  profiles: readonly SimpleWorkbenchProposalCompanyProfile[];
} {
  const parsed = JSON.parse(raw) as unknown;
  const entries =
    Array.isArray(parsed)
      ? parsed
      : isObjectRecord(parsed) && Array.isArray(parsed.profiles)
        ? parsed.profiles
        : [];

  const importedProfiles = entries
    .map((entry) => sanitizeProposalCompanyProfile(entry))
    .filter((entry): entry is SimpleWorkbenchProposalCompanyProfile => entry !== null);

  const importedById = new Map(importedProfiles.map((profile) => [profile.id, profile] as const));
  const mergedProfiles = normalizeProposalCompanyProfiles([
    ...importedProfiles,
    ...readProposalCompanyProfilesRegister().filter((profile) => !importedById.has(profile.id))
  ]);

  writeProposalCompanyProfilesRegister(mergedProfiles);

  return {
    importedCount: importedProfiles.length,
    profiles: mergedProfiles
  };
}

export function clearSimpleWorkbenchProposalCompanyProfiles(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(PROPOSAL_COMPANY_PROFILE_STORAGE_KEY);
}
