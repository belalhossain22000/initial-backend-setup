export const emailVerification = (otp: number) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Verification Code</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f4;">
        <tr>
            <td style="padding: 40px 20px;">
                <!-- Main Container -->
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 40px 30px; text-align: center;">
                            <div style="background-color: rgba(255, 255, 255, 0.1); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; border: 3px solid rgba(255, 255, 255, 0.3);">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="3" y="11" width="18" height="10" rx="2" ry="2" stroke="white" stroke-width="2"/>
                                    <circle cx="12" cy="16" r="1" fill="white"/>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="white" stroke-width="2"/>
                                </svg>
                            </div>
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">Verification Code</h1>
                            <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0; font-size: 16px;">Secure your account</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="color: #333333; margin: 0 0 20px; font-size: 24px; font-weight: 600;">Enter Your Verification Code</h2>
                            
                            <p style="color: #666666; margin: 0 0 30px; font-size: 16px; line-height: 1.6;">
                                To complete your email verification, please enter the following 6-digit code in the verification form:
                            </p>
                            
                            <!-- OTP Code Display -->
                            <div style="text-align: center; margin: 40px 0;">
                                <div style="display: inline-block; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border: 2px solid #e2e8f0; border-radius: 12px; padding: 30px 40px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
                                    <p style="color: #64748b; margin: 0 0 10px; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Your Code</p>
                                    <div style="font-family: 'Courier New', monospace; font-size: 36px; font-weight: 700; color: #1e293b; letter-spacing: 8px; margin: 0;">
                                        ${otp}
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Instructions -->
                            <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin: 30px 0;">
                                <h3 style="color: #0369a1; margin: 0 0 15px; font-size: 16px; font-weight: 600;">
                                    📱 How to use this code:
                                </h3>
                                <ol style="color: #0369a1; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                                    <li style="margin-bottom: 8px;">Return to the verification page in your browser or app</li>
                                    <li style="margin-bottom: 8px;">Enter the 6-digit code exactly as shown above</li>
                                    <li style="margin-bottom: 8px;">Click "Verify" to complete the process</li>
                                </ol>
                            </div>
                            
                            <!-- Expiration Notice -->
                            <div style="background-color: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 20px; margin: 30px 0;">
                                <div style="display: flex; align-items: flex-start;">
                                    <div style="margin-right: 12px; margin-top: 2px;">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="12" r="10" stroke="#d97706" stroke-width="2"/>
                                            <polyline points="12,6 12,12 16,14" stroke="#d97706" stroke-width="2"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p style="color: #92400e; margin: 0 0 8px; font-size: 14px; font-weight: 600;">
                                            ⏰ Time Sensitive
                                        </p>
                                        <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.5;">
                                            This verification code will expire in <strong>10 minutes</strong>. If you need a new code, please request another verification email.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Didn't Request Notice -->
                            <div style="background-color: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 20px; margin: 30px 0;">
                                <p style="color: #dc2626; margin: 0; font-size: 14px; line-height: 1.5;">
                                    <strong>🔒 Security Notice:</strong> If you didn't request this verification code, please ignore this email and consider changing your account password. Someone may have entered your email address by mistake.
                                </p>
                            </div>                     
                       </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="color: #666666; margin: 0 0 15px; font-size: 14px;">
                                Need help? Contact our support team at 
                                <a href="mailto:support@yourapp.com" style="color: #4f46e5; text-decoration: none;">support@yourapp.com</a>
                            </p>
                            
                            <div style="margin: 20px 0;">
                                <a href="#" style="display: inline-block; margin: 0 10px; color: #999999; text-decoration: none; font-size: 12px;">Privacy Policy</a>
                                <span style="color: #cccccc;">|</span>
                                <a href="#" style="display: inline-block; margin: 0 10px; color: #999999; text-decoration: none; font-size: 12px;">Terms of Service</a>
                                <span style="color: #cccccc;">|</span>
                                <a href="#" style="display: inline-block; margin: 0 10px; color: #999999; text-decoration: none; font-size: 12px;">Help Center</a>
                            </div>
                            
                            <p style="color: #999999; margin: 15px 0 0; font-size: 12px;">
                                © 2024 Your Company Name. All rights reserved.<br>
                                123 Business Street, City, State 12345
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};
