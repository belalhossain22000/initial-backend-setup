const setupAccount = (inviteLink: string) => `
    <div style="font-family: Arial, sans-serif">
      <h2>Welcome to Test School</h2>
      <p>An account has been created for you by an administrator.</p>
      <p>Please click the button below to set your password:</p>

      <a href="${inviteLink}"
         style="display:inline-block;
                padding:10px 16px;
                background:#2563eb;
                color:#fff;
                text-decoration:none;
                border-radius:4px;">
        Set Your Password
      </a>

      <p>This link will expire in <strong>24 hours</strong>.</p>

      <p>If you did not expect this email, you can safely ignore it.</p>
    </div>
  `;

export default setupAccount;
