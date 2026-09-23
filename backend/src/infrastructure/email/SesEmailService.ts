import {
  SESv2Client,
  SendEmailCommand,
} from '@aws-sdk/client-sesv2';
import { config } from '../../config';

const sesClient = new SESv2Client({
  region: process.env.AWS_REGION || 'ap-south-1',
});

export interface SendEmailInput {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: SendEmailInput): Promise<void> {
  const from = config.email.from;

  if (!from) {
    throw new Error('EMAIL_FROM is not configured');
  }

  await sesClient.send(
    new SendEmailCommand({
      FromEmailAddress: from,
      Destination: {
        ToAddresses: [to],
      },
      Content: {
        Simple: {
          Subject: {
            Data: subject,
            Charset: 'UTF-8',
          },
          Body: {
            Text: {
              Data: text,
              Charset: 'UTF-8',
            },
            ...(html
              ? {
                  Html: {
                    Data: html,
                    Charset: 'UTF-8',
                  },
                }
              : {}),
          },
        },
      },
    }),
  );
}
