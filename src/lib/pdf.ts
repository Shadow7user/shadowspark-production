import { InvoicePDF } from "@/components/invoice/invoice-pdf";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";

export async function generateInvoicePDF(data: any): Promise<Buffer> {
  const pdfBuffer = await renderToBuffer(
    // @ts-expect-error - react-pdf types don't match React.createElement
    React.createElement(InvoicePDF, { data }),
  );
  return Buffer.from(pdfBuffer);
}
