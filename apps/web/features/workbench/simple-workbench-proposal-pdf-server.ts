import { chromium } from "playwright";

import {
  buildSimpleWorkbenchProposalHtml,
  type SimpleWorkbenchProposalDocument
} from "./simple-workbench-proposal";

const PROPOSAL_PDF_VIEWPORT = {
  height: 1754,
  width: 1240
} as const;

export async function renderSimpleWorkbenchProposalPdf(
  proposalDocument: SimpleWorkbenchProposalDocument
): Promise<Buffer> {
  const browser = await chromium.launch({
    args: ["--disable-dev-shm-usage", "--no-sandbox"],
    headless: true
  });

  try {
    const page = await browser.newPage({
      viewport: PROPOSAL_PDF_VIEWPORT
    });

    await page.setContent(buildSimpleWorkbenchProposalHtml(proposalDocument), {
      waitUntil: "load"
    });
    await page.emulateMedia({
      media: "print"
    });

    return await page.pdf({
      format: "A4",
      margin: {
        bottom: "0",
        left: "0",
        right: "0",
        top: "0"
      },
      printBackground: true,
      preferCSSPageSize: true
    });
  } finally {
    await browser.close();
  }
}
