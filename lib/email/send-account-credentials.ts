interface SendCredentialsInput {
  email: string;
  fullName: string;
  password: string;
}

export async function sendAccountCredentialsEmail(input: SendCredentialsInput) {
  const webhookUrl = process.env.CREDENTIALS_EMAIL_WEBHOOK_URL;

  if (!webhookUrl) {
    console.info("[checkout] Credentials email webhook missing; logging credentials for development only.", {
      email: input.email,
      password: input.password,
    });
    return { sent: false };
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "new-account-credentials",
      to: input.email,
      fullName: input.fullName,
      password: input.password,
      subject: "Your new account credentials",
      message:
        "Your account has been created from checkout. Use the credentials below to sign in and track your orders.",
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to send credentials email: ${response.status}`);
  }

  return { sent: true };
}
