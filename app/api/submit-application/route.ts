import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const RECIPIENT = "accommodation@chresouniversity.edu.zm";
const FROM = "Accommodation Portal <send@chresouniversity.edu.zm>";

type ApplicationPayload = Record<string, string | boolean | undefined>;

const FIELD_SECTIONS: {
  title: string;
  fields: { key: string; label: string }[];
}[] = [
  {
    title: "Student Details",
    fields: [
      { key: "student_name", label: "Full Name" },
      { key: "dob", label: "Date of Birth" },
      { key: "student_number", label: "Student Number" },
      { key: "gender", label: "Gender" },
      { key: "year_of_study", label: "Year of Study" },
      { key: "marital_status", label: "Marital Status" },
      { key: "program", label: "Academic Program" },
      { key: "nrc_id", label: "NRC / ID Number" },
      { key: "nationality", label: "Nationality" },
      { key: "type_rate", label: "Accommodation Type & Rate" },
      { key: "email_address", label: "Email Address" },
      { key: "contact_number", label: "Contact Phone Number" },
      { key: "intake", label: "Academic Intake Period" },
      { key: "address", label: "Residential / Permanent Address" },
    ],
  },
  {
    title: "Sponsor Details",
    fields: [
      { key: "sponsor_name", label: "Name of Sponsor" },
      { key: "sponsor_phone", label: "Sponsor Contact Number" },
      { key: "sponsor_email", label: "Sponsor Email Address" },
    ],
  },
  {
    title: "Next of Kin Details",
    fields: [
      { key: "kin_name", label: "Name of Next of Kin" },
      { key: "kin_phone", label: "Contact Phone Number" },
      { key: "kin_email", label: "Email Address" },
    ],
  },
  {
    title: "Declaration",
    fields: [{ key: "termsAgreement", label: "Terms & Conditions Agreed" }],
  },
];

function formatValue(value: string | boolean | undefined): string {
  if (value === undefined || value === null || value === "") {
    return "—";
  }
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  return String(value);
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word.length > maxChars ? word.slice(0, maxChars) : word;
      while (current.length > maxChars) {
        lines.push(current.slice(0, maxChars));
        current = current.slice(maxChars);
      }
    }
  }

  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

async function buildApplicationPdf(data: ApplicationPayload): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const margin = 50;
  const pageWidth = 595;
  const pageHeight = 842;
  const lineHeight = 14;
  const fieldGap = 6;

  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  const drawText = (
    text: string,
    size: number,
    bold = false,
    color = rgb(0.11, 0.15, 0.2)
  ) => {
    page.drawText(text, {
      x: margin,
      y,
      size,
      font: bold ? fontBold : font,
      color,
    });
    y -= size + 4;
  };

  const ensureSpace = (needed: number) => {
    if (y - needed < margin) {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
    }
  };

  drawText("Chreso University", 18, true, rgb(0.11, 0.37, 0.13));
  drawText("Accommodation Application", 14, true);
  drawText(
    `Submitted: ${new Date().toLocaleString("en-ZM", { timeZone: "Africa/Lusaka" })}`,
    10,
    false,
    rgb(0.4, 0.4, 0.4)
  );
  y -= 8;

  for (const section of FIELD_SECTIONS) {
    ensureSpace(28);
    drawText(section.title, 12, true, rgb(0.11, 0.37, 0.13));
    y -= 4;

    for (const { key, label } of section.fields) {
      const value = formatValue(data[key]);
      const valueLines = wrapText(value, 72);

      ensureSpace(lineHeight * (valueLines.length + 2) + fieldGap);

      page.drawText(`${label}:`, {
        x: margin,
        y,
        size: 10,
        font: fontBold,
        color: rgb(0.27, 0.35, 0.39),
      });
      y -= lineHeight;

      for (const line of valueLines) {
        page.drawText(line, {
          x: margin + 8,
          y,
          size: 10,
          font,
          color: rgb(0.2, 0.2, 0.2),
        });
        y -= lineHeight;
      }

      y -= fieldGap;
    }

    y -= 6;
  }

  return pdfDoc.save();
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ApplicationPayload;

    const requiredKeys = [
      "student_name",
      "dob",
      "student_number",
      "gender",
      "year_of_study",
      "marital_status",
      "program",
      "nrc_id",
      "nationality",
      "type_rate",
      "email_address",
      "contact_number",
      "intake",
      "address",
      "sponsor_name",
      "sponsor_phone",
      "sponsor_email",
      "kin_name",
      "kin_phone",
      "kin_email",
    ];

    const missing = requiredKeys.filter((key) => {
      const value = body[key];
      return (
        value === undefined || value === null || String(value).trim() === ""
      );
    });

    if (!body.termsAgreement) {
      missing.push("termsAgreement");
    }

    if (missing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missing.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Email service is not configured. Please contact support.",
        },
        { status: 500 }
      );
    }

    const pdfBytes = await buildApplicationPdf(body);
    const studentNumber = String(body.student_number).replace(/[^\w-]/g, "_");
    const filename = `accommodation-application-${studentNumber}.pdf`;

    const resend = new Resend(apiKey);
    const { error: sendError } = await resend.emails.send({
      from: FROM,
      to: RECIPIENT,
      subject: `Accommodation Application — ${body.student_name} (${body.student_number})`,
      html: `
        <p>A new accommodation application has been submitted via the online portal.</p>
        <p><strong>Student:</strong> ${body.student_name}<br/>
        <strong>Student Number:</strong> ${body.student_number}<br/>
        <strong>Email:</strong> ${body.email_address}</p>
        <p>The completed application is attached as a PDF.</p>
      `,
      attachments: [
        {
          filename,
          content: Buffer.from(pdfBytes).toString("base64"),
        },
      ],
    });

    if (sendError) {
      console.error("Resend error:", sendError);
      return NextResponse.json(
        {
          success: false,
          error: sendError.message ?? "Failed to send application email.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
    });
  } catch (err) {
    console.error("submit-application error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
