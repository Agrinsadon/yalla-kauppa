'use server';

import nodemailer from 'nodemailer';

const MAX_ATTACHMENT_BYTES = 3 * 1024 * 1024; // 3 MB

export type ContactFormState = {
  success: boolean;
  message?: string;
};

export async function sendContactEmail(
  _state: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = formData.get('name')?.toString().trim() ?? '';
  const email = formData.get('email')?.toString().trim() ?? '';
  const message = formData.get('message')?.toString().trim() ?? '';
  const attachment = formData.get('attachment');

  if (!name || !email || !message) {
    return { success: false, message: 'Täytä kaikki kentät' };
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  const toAddress = process.env.CONTACT_TO || gmailUser;

  if (!gmailUser || !gmailPass || !toAddress) {
    return { success: false, message: 'Sähköpostiasetukset puuttuvat (GMAIL_USER, GMAIL_APP_PASSWORD, CONTACT_TO)' };
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
  });

  const subject = `Yhteydenotto: ${name}`;
  const text = `Nimi: ${name}\nSähköposti: ${email}\n\nViesti:\n${message}`;
  const html = `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
      <div style="margin-bottom: 12px;">
        <span style="display:inline-block;padding:6px 10px;border-radius:12px;background:#fef2f2;color:#b91c1c;font-weight:700;">Yalla Kauppa</span>
      </div>
      <h2 style="margin: 0 0 12px;">Uusi yhteydenotto</h2>
      <p style="margin: 4px 0;"><strong>Nimi:</strong> ${name}</p>
      <p style="margin: 4px 0;"><strong>Sähköposti:</strong> ${email}</p>
      <p style="margin: 12px 0 6px;"><strong>Viesti:</strong></p>
      <div style="padding: 12px; border-left: 4px solid #e30613; background:#f9fafb;">
        ${message.replace(/\n/g, '<br/>')}
      </div>
    </div>
  `;

  const ackSubject = 'Kiitos yhteydenotostasi – palaamme pian';
  const ackText = `Hei ${name},\n\nKiitos viestistäsi! Olemme vastaanottaneet sen ja palaamme asiaan pian.\n\nYstävällisin terveisin,\nYalla Kauppa\n—\nTämä on automaattinen kuittaus viestistäsi:\n${message}`;
  const ackHtml = `
    <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.7; padding: 18px; border: 1px solid #e5e7eb; border-radius: 14px; background: linear-gradient(135deg, #fff5f5 0%, #ffffff 60%);">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
        <span style="display:inline-block;padding:6px 10px;border-radius:12px;background:#e30613;color:#fff;font-weight:700;">Yalla Kauppa</span>
        <span style="color:#b91c1c;font-weight:600;">Kiitos yhteydenotosta</span>
      </div>
      <p style="margin: 8px 0;">Hei ${name},</p>
      <p style="margin: 8px 0;">Kiitos viestistäsi! Olemme vastaanottaneet sen ja palaamme asiaan pian.</p>
      <p style="margin: 8px 0; font-weight: 600;">Viestisi:</p>
      <div style="margin: 8px 0 16px; padding: 12px; border-left: 4px solid #e30613; background:#fff7f7; border-radius: 8px;">
        ${message.replace(/\n/g, '<br/>')}
      </div>
      <p style="margin: 8px 0;">Ystävällisin terveisin,<br/><strong>Yalla Kauppa</strong></p>
    </div>
  `;

  try {
    let attachments: { filename: string; content: Buffer }[] | undefined;
    if (attachment instanceof File && attachment.size > 0) {
      if (attachment.size > MAX_ATTACHMENT_BYTES) {
        return { success: false, message: 'Liite on liian suuri (max 3 Mt)' };
      }
      const buffer = Buffer.from(await attachment.arrayBuffer());
      attachments = [
        {
          filename: attachment.name || 'liite',
          content: buffer,
        },
      ];
    }

    await Promise.all([
      transporter.sendMail({
        from: gmailUser,
        to: toAddress,
        subject,
        text,
        html,
        replyTo: email,
        attachments,
      }),
      transporter.sendMail({
        from: gmailUser,
        to: email,
        subject: ackSubject,
        text: ackText,
        html: ackHtml,
      }),
    ]);
    return { success: true, message: 'Kiitos viestistäsi! Otamme yhteyttä pian.' };
  } catch (err) {
    console.error('sendContactEmail error', err);
    return { success: false, message: 'Viestin lähetys epäonnistui. Yritä hetken kuluttua uudelleen.' };
  }
}
