/// <reference lib="dom" />

import { expect, test, type Locator, type Page } from "@playwright/test";

const TEST_USERNAME = process.env.DYNECHO_AUTH_USERNAME ?? "admin";
const TEST_PASSWORD = process.env.DYNECHO_AUTH_PASSWORD ?? "admin";
const E2E_OPERATION_TIMEOUT = 30_000;
const SAFE_EDIT_COMMAND = "2. layerı sil, 15 mm gypsum ekle, Rw ve STC seç, hesapla";
const BLOCKED_CANDIDATE_COMMAND = "rockwool'u çıkar, iki gypsum layer ekle, iki alternatif dene";
const MIXED_RESEARCH_EDIT_COMMAND = "internetten araştır sonra gypsum ekle";
const ASSISTANT_PROMPT_EXAMPLES = [
  {
    label: "Rw kontrol et",
    prompt: "Ekrandaki stacke bak Rw fazla mı az mı? İnternetten araştır."
  },
  {
    label: "Rw artır",
    prompt: "Bu layer kombinasyonunun Rw değerini beğenmedim, birkaç layer daha ekle ki Rw artsın, en mantıklısını seç."
  },
  {
    label: "Edit planı",
    prompt: `${SAFE_EDIT_COMMAND}.`
  },
  {
    label: "Alternatif ara",
    prompt: "Bu katman kombinasyonuna alternatif malzeme araştır."
  },
  {
    label: "Araştırmayı ayır",
    prompt: `${MIXED_RESEARCH_EDIT_COMMAND}.`
  }
] as const;

// Coordination note (assistant bounded proposal browser contract, 2026-06-22):
// This spec protects the real Workbench confirmation/stale guards without changing calculator runtime behavior.

let browserRuntimeErrors: string[] = [];

async function signIn(page: Page) {
  const response = await page.request.post("/api/auth/login", {
    data: {
      nextPath: "/workbench-v2",
      password: TEST_PASSWORD,
      username: TEST_USERNAME
    }
  });

  expect(response.ok()).toBeTruthy();
}

async function openWorkbenchV2(page: Page) {
  await page.goto("/workbench-v2");
  await expect(page.getByRole("heading", { name: "Acoustic workbench" })).toBeVisible({
    timeout: E2E_OPERATION_TIMEOUT
  });
  await expectLayerCount(page, 3);
}

function assistantCommandForm(page: Page): Locator {
  return page.locator("form.calc-assistant-command");
}

function boundedDryRunPanel(page: Page): Locator {
  return page.locator('[data-kind="bounded-edit-plan-dry-run"]').first();
}

function boundedDryRunPanels(page: Page): Locator {
  return page.locator('[data-kind="bounded-edit-plan-dry-run"]');
}

function workbenchApplyProposalPanel(page: Page): Locator {
  return page.locator('[data-kind="workbench-apply-proposal"]').first();
}

function workbenchApplyProposalPanels(page: Page): Locator {
  return page.locator('[data-kind="workbench-apply-proposal"]');
}

function assistantMessage(page: Page, title: string): Locator {
  return page.locator(".calc-assistant-command-message").filter({ hasText: title }).first();
}

async function expectLayerCount(page: Page, count: number) {
  await expect(page.getByRole("button", { name: /^Select layer \d+$/u })).toHaveCount(count, {
    timeout: E2E_OPERATION_TIMEOUT
  });
}

async function runAssistantCommand(page: Page, command: string) {
  const commandForm = assistantCommandForm(page);
  const commandInput = page.getByRole("textbox", { name: "Stack command" });

  await expect(commandInput).toBeEnabled({ timeout: E2E_OPERATION_TIMEOUT });
  await commandInput.fill(command);
  await commandForm.getByRole("button", { exact: true, name: "Run" }).click();
}

async function expectBaseDraftUnchanged(page: Page) {
  await expectLayerCount(page, 3);
  await expect(page.getByText("162.5 mm").first()).toBeVisible();
  await expect(page.getByRole("button", { name: /Gypsum Board 850 kg\/m3 \/ finish/u })).toHaveCount(1);
  await expect(page.getByRole("button", { name: /Rock Wool 45 kg\/m3 \/ insulation/u })).toHaveCount(1);
  await expect(page.getByRole("button", { name: /Concrete 2400 kg\/m3 \/ mass/u })).toHaveCount(1);
  await expect(page.getByRole("checkbox", { name: "Rw Airborne" })).toBeChecked();
  await expect(page.getByRole("checkbox", { name: "STC Airborne" })).not.toBeChecked();
  await expect(page.getByText("Rw: Calculated").first()).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  await expect(page.getByText("57 dB").first()).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
}

async function prepareBoundedApplyProposal(page: Page) {
  await boundedDryRunPanel(page).getByRole("button", { exact: true, name: "Prepare apply proposal" }).click();
}

async function useRwImprovementCandidate(page: Page, candidateTitle: string) {
  const candidate = page.locator(".calc-assistant-candidate-stack").filter({ hasText: candidateTitle }).first();
  await expect(candidate).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  await candidate.getByRole("button", { exact: true, name: "Use" }).click();
}

test.beforeEach(async ({ page }) => {
  browserRuntimeErrors = [];
  page.on("pageerror", (error) => {
    browserRuntimeErrors.push(`pageerror: ${error.message}`);
  });
  page.on("console", (message) => {
    if (message.type() === "error") {
      browserRuntimeErrors.push(`console.error: ${message.text()}`);
    }
  });
  await page.context().clearCookies();
  await page.addInitScript({
    content: "window.localStorage.clear(); window.sessionStorage.clear();"
  });
  await signIn(page);
});

test.afterEach(() => {
  expect(browserRuntimeErrors).toEqual([]);
});

test("assistant prompt examples fill the command box without running a draft change", async ({ page }) => {
  test.setTimeout(120_000);

  await openWorkbenchV2(page);
  const promptChips = page.locator(".calc-assistant-prompt-chip");
  const commandInput = page.getByRole("textbox", { name: "Stack command" });
  const runButton = assistantCommandForm(page).getByRole("button", { exact: true, name: "Run" });

  await expect(promptChips).toHaveCount(ASSISTANT_PROMPT_EXAMPLES.length);
  await expectBaseDraftUnchanged(page);

  for (const example of ASSISTANT_PROMPT_EXAMPLES) {
    const chip = promptChips.filter({ hasText: example.label });

    await expect(chip, example.label).toBeVisible();
    await expect(chip, example.label).toBeEnabled();
    await expect(chip, example.label).toHaveAttribute("title", example.prompt);
    await expect(chip, example.label).toHaveAttribute("aria-label", `Use assistant prompt: ${example.prompt}`);
    await chip.click();

    await expect(commandInput, example.label).toHaveValue(example.prompt);
    await expect(commandInput, example.label).toBeFocused();
    await expect(runButton, example.label).toBeEnabled();
    await expect(boundedDryRunPanels(page), example.label).toHaveCount(0);
    await expect(workbenchApplyProposalPanels(page), example.label).toHaveCount(0);
    await expectBaseDraftUnchanged(page);
  }
});

test("assistant prompt examples execute in their intended safe lanes without mutating the base draft", async ({ page }) => {
  test.setTimeout(180_000);

  for (const example of ASSISTANT_PROMPT_EXAMPLES) {
    await test.step(example.label, async () => {
      await openWorkbenchV2(page);
      await expectBaseDraftUnchanged(page);

      const chip = page.locator(".calc-assistant-prompt-chip").filter({ hasText: example.label }).first();
      await chip.click();
      await assistantCommandForm(page).getByRole("button", { exact: true, name: "Run" }).click();

      if (example.label === "Rw kontrol et") {
        await expect(assistantMessage(page, "Source review ready")).toBeVisible({
          timeout: E2E_OPERATION_TIMEOUT
        });
        await expect(page.getByText("Calculator values were not changed.").first()).toBeVisible();
        await expect(page.getByRole("button", { exact: true, name: "Prepare report edit" })).toBeDisabled();
      } else if (example.label === "Rw artır") {
        await expect(assistantMessage(page, "Rw improvement candidates prepared")).toBeVisible({
          timeout: E2E_OPERATION_TIMEOUT
        });
        await expect(page.locator(".calc-assistant-candidate-stack")).toHaveCount(3);
        await expect(page.getByText("Replace one gypsum board with acoustic gypsum").first()).toBeVisible();
        await expect(page.getByText("Add Acoustic Gypsum Board to side B").first()).toBeVisible();
        await expect(page.getByText("Add symmetric Acoustic Gypsum Board boards").first()).toBeVisible();
      } else if (example.label === "Edit planı") {
        await expect(assistantMessage(page, "Multi-step dry run ready")).toBeVisible({
          timeout: E2E_OPERATION_TIMEOUT
        });
        await expect(boundedDryRunPanel(page).getByText("4 steps / read-only", { exact: true })).toBeVisible();
        await expect(workbenchApplyProposalPanels(page)).toHaveCount(0);
      } else if (example.label === "Alternatif ara") {
        await expect(assistantMessage(page, "Source alternative review ready")).toBeVisible({
          timeout: E2E_OPERATION_TIMEOUT
        });
        if (!process.env.DYNECHO_REPORT_ASSISTANT_RESEARCH_ENDPOINT) {
          await expect(page.getByText("No source alternative Workbench candidate stack was created").first()).toBeVisible();
          await expect(page.getByText("0 source candidates").first()).toBeVisible();
        }
      } else {
        await expect(assistantMessage(page, "Research edit needs clarification")).toBeVisible({
          timeout: E2E_OPERATION_TIMEOUT
        });
        await expect(page.getByText("Research wording was not applied to the Workbench draft.").first()).toBeVisible();
        await expect(boundedDryRunPanels(page)).toHaveCount(0);
      }

      await expectBaseDraftUnchanged(page);
      await expect(page.getByRole("button", { exact: true, name: "Apply to draft" })).toHaveCount(0);
    });
  }
});

test("objective Rw improvement candidates require confirmation and block stale target applies", async ({ page }) => {
  test.setTimeout(180_000);

  await openWorkbenchV2(page);
  await runAssistantCommand(page, ASSISTANT_PROMPT_EXAMPLES[1].prompt);
  await expect(assistantMessage(page, "Rw improvement candidates prepared")).toBeVisible({
    timeout: E2E_OPERATION_TIMEOUT
  });
  await expect(page.locator(".calc-assistant-candidate-stack")).toHaveCount(3);
  await expectBaseDraftUnchanged(page);

  await useRwImprovementCandidate(page, "Add Acoustic Gypsum Board to side B");
  await expect(assistantMessage(page, "Workbench apply proposal prepared")).toBeVisible({
    timeout: E2E_OPERATION_TIMEOUT
  });
  await expect(workbenchApplyProposalPanel(page).getByText("Apply assistant layer-stack draft to Workbench")).toBeVisible();
  await expect(workbenchApplyProposalPanel(page).getByText("1 layer row would change")).toBeVisible();
  await expect(workbenchApplyProposalPanel(page).getByText("Outputs: Rw", { exact: true })).toBeVisible();
  await expectBaseDraftUnchanged(page);

  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toContain("Apply this assistant proposal to the current unsaved Workbench draft?");
    await dialog.dismiss();
  });
  await workbenchApplyProposalPanel(page).getByRole("button", { exact: true, name: "Apply to draft" }).click();
  await expect(assistantMessage(page, "Workbench apply cancelled")).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  await expectBaseDraftUnchanged(page);

  let confirmMessage = "";
  page.once("dialog", async (dialog) => {
    confirmMessage = dialog.message();
    await dialog.accept();
  });
  await workbenchApplyProposalPanel(page).getByRole("button", { exact: true, name: "Apply to draft" }).click();
  expect(confirmMessage).toContain("Apply this assistant proposal to the current unsaved Workbench draft?");
  await expect(assistantMessage(page, "Workbench proposal applied")).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  await expectLayerCount(page, 4);
  await expect(page.getByRole("button", { name: /Acoustic Gypsum Board/u })).toHaveCount(1);
  await expect(page.getByRole("button", { name: /Rock Wool 45 kg\/m3 \/ insulation/u })).toHaveCount(1);
  await expect(page.getByRole("button", { name: /Concrete 2400 kg\/m3 \/ mass/u })).toHaveCount(1);

  await page.evaluate(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
  await openWorkbenchV2(page);
  await runAssistantCommand(page, ASSISTANT_PROMPT_EXAMPLES[1].prompt);
  await expect(assistantMessage(page, "Rw improvement candidates prepared")).toBeVisible({
    timeout: E2E_OPERATION_TIMEOUT
  });
  await useRwImprovementCandidate(page, "Add Acoustic Gypsum Board to side B");
  await expect(workbenchApplyProposalPanel(page)).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  await expectBaseDraftUnchanged(page);

  await page.getByRole("button", { exact: true, name: "Add layer" }).click();
  await expectLayerCount(page, 4);

  let unexpectedDialogSeen = false;
  page.once("dialog", async (dialog) => {
    unexpectedDialogSeen = true;
    await dialog.dismiss();
  });
  await workbenchApplyProposalPanel(page).getByRole("button", { exact: true, name: "Apply to draft" }).click();
  await expect(assistantMessage(page, "Workbench apply blocked")).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  await expect(page.getByText("The visible Workbench draft changed after this assistant proposal was created.").first()).toBeVisible();
  expect(unexpectedDialogSeen).toBe(false);
  await expectLayerCount(page, 4);
});

test("bounded assistant dry-run and Workbench apply proposal stay non-mutating through cancel and stale target", async ({ page }) => {
  test.setTimeout(120_000);

  await openWorkbenchV2(page);
  await expect(page.getByRole("button", { name: /Rock Wool 45 kg\/m3 \/ insulation/u })).toBeVisible();

  await runAssistantCommand(page, SAFE_EDIT_COMMAND);

  const dryRunPanel = boundedDryRunPanel(page);
  await expect(dryRunPanel).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  await expect(dryRunPanel.getByText("Multi-step dry run", { exact: true })).toBeVisible();
  await expect(dryRunPanel.getByText("4 steps / read-only", { exact: true })).toBeVisible();
  await expect(dryRunPanel.getByText(/Layers: 3 -> 2/u)).toBeVisible();
  await expect(dryRunPanel.getByText(/Layers: 2 -> 3/u)).toBeVisible();
  await expect(dryRunPanel.getByText(/outputs: Rw, STC/u).first()).toBeVisible();
  await expectLayerCount(page, 3);

  await prepareBoundedApplyProposal(page);

  const proposalPanel = workbenchApplyProposalPanel(page);
  await expect(proposalPanel).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  await expect(proposalPanel.getByText("Apply bounded edit plan to draft", { exact: true })).toBeVisible();
  await expect(proposalPanel.getByText("Outputs: Rw, STC", { exact: true })).toBeVisible();
  await expectLayerCount(page, 3);

  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toContain("Apply this assistant proposal to the current unsaved Workbench draft?");
    await dialog.dismiss();
  });
  await proposalPanel.getByRole("button", { exact: true, name: "Apply to draft" }).click();
  await expect(assistantMessage(page, "Workbench apply cancelled")).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  await expectLayerCount(page, 3);

  await page.getByRole("button", { exact: true, name: "Add layer" }).click();
  await expectLayerCount(page, 4);

  let unexpectedDialogSeen = false;
  page.once("dialog", async (dialog) => {
    unexpectedDialogSeen = true;
    await dialog.dismiss();
  });
  await workbenchApplyProposalPanel(page).getByRole("button", { exact: true, name: "Apply to draft" }).click();
  await expect(assistantMessage(page, "Workbench apply blocked")).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  await expect(page.getByText("The visible Workbench draft changed after this assistant proposal was created.").first()).toBeVisible();
  expect(unexpectedDialogSeen).toBe(false);
  await expectLayerCount(page, 4);
});

test("bounded assistant clears the stale proposal preparation path when the layer stack changed after dry-run", async ({ page }) => {
  test.setTimeout(120_000);

  await openWorkbenchV2(page);
  await runAssistantCommand(page, SAFE_EDIT_COMMAND);
  await expect(boundedDryRunPanel(page)).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  await expectLayerCount(page, 3);

  await page.getByRole("button", { exact: true, name: "Add layer" }).click();
  await expectLayerCount(page, 4);

  await expect(boundedDryRunPanels(page)).toHaveCount(0);
  await expect(workbenchApplyProposalPanel(page)).toHaveCount(0);
  await expectLayerCount(page, 4);
});

test("bounded assistant applies a confirmed proposal only after browser confirmation", async ({ page }) => {
  test.setTimeout(120_000);

  await openWorkbenchV2(page);
  await runAssistantCommand(page, SAFE_EDIT_COMMAND);
  await expect(boundedDryRunPanel(page)).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  await prepareBoundedApplyProposal(page);

  let confirmMessage = "";
  page.once("dialog", async (dialog) => {
    confirmMessage = dialog.message();
    await dialog.accept();
  });
  await workbenchApplyProposalPanel(page).getByRole("button", { exact: true, name: "Apply to draft" }).click();

  await expect(assistantMessage(page, "Workbench proposal applied")).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  expect(confirmMessage).toContain("Apply this assistant proposal to the current unsaved Workbench draft?");
  await expectLayerCount(page, 3);
  await expect(page.getByRole("button", { name: /Rock Wool 45 kg\/m3 \/ insulation/u })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Gypsum Board 850 kg\/m3 \/ finish/u })).toHaveCount(2);
  await expect(page.getByRole("button", { name: /Concrete 2400 kg\/m3 \/ mass/u })).toHaveCount(1);
  await expect(page.getByRole("checkbox", { name: "STC Airborne" })).toBeChecked();
});

test("bounded assistant keeps unsupported candidate generation read-only and without an apply proposal", async ({ page }) => {
  test.setTimeout(120_000);

  await openWorkbenchV2(page);
  await runAssistantCommand(page, BLOCKED_CANDIDATE_COMMAND);

  const dryRunPanel = boundedDryRunPanel(page);
  await expect(dryRunPanel).toBeVisible({ timeout: E2E_OPERATION_TIMEOUT });
  await expect(dryRunPanel.getByText("Multi-step dry run blocked", { exact: true }).first()).toBeVisible();
  await expect(dryRunPanel.getByText(/No Workbench layer changed yet/u)).toBeVisible();
  await expect(dryRunPanel.getByRole("button", { exact: true, name: "Prepare apply proposal" })).toHaveCount(0);
  await expect(workbenchApplyProposalPanel(page)).toHaveCount(0);
  await expectLayerCount(page, 3);
});

test("assistant answers mixed research and edit wording without changing the draft", async ({ page }) => {
  test.setTimeout(120_000);

  await openWorkbenchV2(page);
  await runAssistantCommand(page, MIXED_RESEARCH_EDIT_COMMAND);

  await expect(assistantMessage(page, "Research edit needs clarification")).toBeVisible({
    timeout: E2E_OPERATION_TIMEOUT
  });
  await expect(page.getByText("Research wording was not applied to the Workbench draft.").first()).toBeVisible();
  await expect(boundedDryRunPanels(page)).toHaveCount(0);
  await expect(workbenchApplyProposalPanel(page)).toHaveCount(0);
  await expect(page.getByRole("button", { exact: true, name: "Prepare apply proposal" })).toHaveCount(0);
  await expect(page.getByRole("button", { exact: true, name: "Apply to draft" })).toHaveCount(0);
  await expectLayerCount(page, 3);
  await expect(page.getByRole("button", { name: /Rock Wool 45 kg\/m3 \/ insulation/u })).toBeVisible();
});
