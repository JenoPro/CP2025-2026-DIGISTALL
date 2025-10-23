import emailjs from '@emailjs/browser'

// EmailJS Configuration - reusing the same service as applicants
const EMAILJS_SERVICE_ID = 'service_e2awvdk'
const EMAILJS_APPROVE_TEMPLATE_ID = 'template_r6kxcnh' // Template for approve emails (reusing)
const EMAILJS_PUBLIC_KEY = 'sTpDE-Oq2-9XH_UZd'
const SENDER_EMAIL = 'requiem121701@gmail.com'
const SENDER_NAME = 'Stall Management System'

let isInitialized = false

// Initialize EmailJS
const initializeEmailJS = () => {
  if (!isInitialized) {
    try {
      emailjs.init({
        publicKey: EMAILJS_PUBLIC_KEY,
        blockHeadless: false,
        blockList: {
          list: [],
          watchVariable: 'userAgent',
        },
        limitRate: {
          id: 'app',
          throttle: 5000,
        },
      })
      isInitialized = true
      console.log('✅ EmailJS initialized successfully for employees')
    } catch (error) {
      console.error('❌ EmailJS initialization failed:', error)
      // Fallback initialization
      emailjs.init(EMAILJS_PUBLIC_KEY)
      isInitialized = true
    }
  }
}

// Generate employee username with format: EMP-XXXX
export const generateEmployeeUsername = () => {
  // Generate 4 random digits
  const randomDigits = Math.floor(1000 + Math.random() * 9000).toString() // Ensures 4 digits
  const username = `EMP${randomDigits}`
  console.log('🔑 Generated employee username:', username)
  return username
}

// Generate secure password
export const generateEmployeePassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let password = ''
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  console.log('🔒 Generated employee password:', password)
  return password
}

// Send employee credentials email using fetch method
const sendEmployeeCredentialsEmailFetch = async (
  recipientEmail,
  employeeName,
  username,
  password,
) => {
  try {
    console.log(`📧 Sending employee credentials via Fetch to:`, recipientEmail)

    initializeEmailJS()

    const templateParams = {
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_APPROVE_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: {
        from_name: SENDER_NAME,
        from_email: SENDER_EMAIL,
        to_email: recipientEmail,
        to_name: employeeName,
        subject: 'Welcome to Stall Management - Your Employee Credentials',
        message: `Dear ${employeeName},

Welcome to the Naga Stall Management System! Your employee account has been successfully created.

🔐 YOUR LOGIN CREDENTIALS:
Username: ${username}
Password: ${password}

📋 IMPORTANT INSTRUCTIONS:
✅ Please change your password after your first login
✅ Keep your credentials secure and confidential
✅ Contact your manager if you experience any login issues
✅ Your account has been configured with specific permissions for your role

⚠️ SECURITY REMINDER:
- Never share your login credentials with anyone
- Always log out when finished
- Report any suspicious activity immediately

If you have any questions about your account or need assistance, please contact your branch manager.

Welcome to the team!

Best regards,
Stall Management Admin Team`,
        reply_to: SENDER_EMAIL,
        stall_username: username,
        stall_password: password,
      },
    }

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: window.location.origin,
      },
      body: JSON.stringify(templateParams),
    })

    if (response.ok) {
      console.log('✅ Employee credentials email sent successfully via Fetch')
      return {
        success: true,
        message: `Employee credentials sent to ${recipientEmail}`,
      }
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
  } catch (error) {
    console.error('❌ Fetch method failed for employee email:', error)
    return {
      success: false,
      message: `Failed to send email: ${error.message}`,
    }
  }
}

// Send employee credentials email using XMLHttpRequest method
const sendEmployeeCredentialsEmailXHR = async (
  recipientEmail,
  employeeName,
  username,
  password,
) => {
  try {
    console.log(`📧 Sending employee credentials via XHR to:`, recipientEmail)

    initializeEmailJS()

    return new Promise((resolve) => {
      const templateParams = {
        from_name: SENDER_NAME,
        from_email: SENDER_EMAIL,
        to_email: recipientEmail,
        to_name: employeeName,
        subject: 'Welcome to Stall Management - Your Employee Credentials',
        message: `Dear ${employeeName},

Welcome to the Naga Stall Management System! Your employee account has been successfully created.

🔐 YOUR LOGIN CREDENTIALS:
Username: ${username}
Password: ${password}

🌐 Login Portal: http://localhost:5173/employee/login

📋 IMPORTANT INSTRUCTIONS:
✅ Please change your password after your first login
✅ Keep your credentials secure and confidential
✅ Contact your manager if you experience any login issues
✅ Your account has been configured with specific permissions for your role

⚠️ SECURITY REMINDER:
- Never share your login credentials with anyone
- Always log out when finished
- Report any suspicious activity immediately

If you have any questions about your account or need assistance, please contact your branch manager.

Welcome to the team!

Best regards,
Stall Management Admin Team`,
        reply_to: SENDER_EMAIL,
        stall_username: username,
        stall_password: password,
      }

      emailjs
        .send(EMAILJS_SERVICE_ID, EMAILJS_APPROVE_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY)
        .then(() => {
          console.log('✅ Employee credentials email sent successfully via XHR')
          resolve({
            success: true,
            message: `Employee credentials sent to ${recipientEmail}`,
          })
        })
        .catch((error) => {
          console.error('❌ XHR method failed for employee email:', error)
          resolve({
            success: false,
            message: `Failed to send email: ${error.text || error.message || 'Unknown error'}`,
          })
        })
    })
  } catch (error) {
    console.error('❌ XHR method error for employee email:', error)
    return {
      success: false,
      message: `Failed to send email: ${error.message}`,
    }
  }
}

// Send employee credentials email using improved EmailJS method
const sendEmployeeCredentialsEmailImproved = async (
  recipientEmail,
  employeeName,
  username,
  password,
) => {
  try {
    console.log(`📧 Sending employee credentials via Improved method to:`, recipientEmail)

    initializeEmailJS()

    const templateParams = {
      from_name: SENDER_NAME,
      from_email: SENDER_EMAIL,
      to_email: recipientEmail,
      to_name: employeeName,
      subject: 'Welcome to Stall Management - Your Employee Credentials',
      message: `Dear ${employeeName},

Welcome to the Naga Stall Management System! Your employee account has been successfully created.

🔐 YOUR LOGIN CREDENTIALS:
Username: ${username}
Password: ${password}

🌐 Login Portal: http://localhost:5173/employee/login

📋 IMPORTANT INSTRUCTIONS:
✅ Please change your password after your first login
✅ Keep your credentials secure and confidential
✅ Contact your manager if you experience any login issues
✅ Your account has been configured with specific permissions for your role

⚠️ SECURITY REMINDER:
- Never share your login credentials with anyone
- Always log out when finished
- Report any suspicious activity immediately

If you have any questions about your account or need assistance, please contact your branch manager.

Welcome to the team!

Best regards,
Stall Management Admin Team`,
      reply_to: SENDER_EMAIL,
      stall_username: username,
      stall_password: password,
    }

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_APPROVE_TEMPLATE_ID,
      templateParams,
      {
        publicKey: EMAILJS_PUBLIC_KEY,
        blockHeadless: false,
        blockList: {
          list: [],
        },
      },
    )

    console.log('✅ Employee credentials email sent successfully via Improved method:', response)
    return {
      success: true,
      message: `Employee credentials sent to ${recipientEmail}`,
    }
  } catch (error) {
    console.error('❌ Improved EmailJS method failed for employee email:', error)
    return {
      success: false,
      message: `Failed to send email: ${error.message || 'Unknown error'}`,
    }
  }
}

// Main function with retry mechanism for sending employee credentials email
export const sendEmployeeCredentialsEmailWithRetry = async (
  recipientEmail,
  employeeName,
  username,
  password,
) => {
  console.log('📧 Starting email retry mechanism for employee credentials')

  // Attempt 1: Fetch method
  console.log('📧 Attempt 1: Fetch method')
  let result = await sendEmployeeCredentialsEmailFetch(
    recipientEmail,
    employeeName,
    username,
    password,
  )
  if (result.success) {
    return result
  }

  // Attempt 2: XHR method
  console.log('📧 Attempt 2: XHR method')
  result = await sendEmployeeCredentialsEmailXHR(recipientEmail, employeeName, username, password)
  if (result.success) {
    return result
  }

  // Attempt 3: Improved EmailJS method
  console.log('📧 Attempt 3: Improved EmailJS method')
  result = await sendEmployeeCredentialsEmailImproved(
    recipientEmail,
    employeeName,
    username,
    password,
  )
  if (result.success) {
    return result
  }

  // All methods failed
  console.error('❌ All email methods failed for employee credentials')
  return {
    success: false,
    message:
      'All email sending methods failed. Please check your network connection and try again.',
  }
}

// Send password reset email for employees
export const sendEmployeePasswordResetEmail = async (recipientEmail, employeeName, newPassword) => {
  console.log('📧 Sending employee password reset email')

  try {
    initializeEmailJS()

    const templateParams = {
      from_name: SENDER_NAME,
      from_email: SENDER_EMAIL,
      to_email: recipientEmail,
      to_name: employeeName,
      subject: 'Password Reset - Stall Management System',
      message: `Dear ${employeeName},

Your password has been reset by your manager in the Naga Stall Management System.

🔐 YOUR NEW PASSWORD:
Password: ${newPassword}

🌐 Login Portal: http://localhost:5173/employee/login

📋 IMPORTANT INSTRUCTIONS:
✅ Please change your password immediately after logging in
✅ Keep your new password secure and confidential
✅ Contact your manager if you experience any login issues

⚠️ SECURITY REMINDER:
- Never share your login credentials with anyone
- Always log out when finished
- If you did not request this password reset, contact your manager immediately

Best regards,
Stall Management Admin Team`,
      reply_to: SENDER_EMAIL,
      stall_password: newPassword,
    }

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_APPROVE_TEMPLATE_ID,
      templateParams,
      {
        publicKey: EMAILJS_PUBLIC_KEY,
        blockHeadless: false,
        blockList: {
          list: [],
        },
      },
    )

    console.log('✅ Employee password reset email sent successfully:', response)
    return {
      success: true,
      message: `Password reset notification sent to ${recipientEmail}`,
    }
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error)
    return {
      success: false,
      message: `Failed to send password reset email: ${error.message || 'Unknown error'}`,
    }
  }
}

export default {
  sendEmployeeCredentialsEmailWithRetry,
  sendEmployeePasswordResetEmail,
  generateEmployeeUsername,
  generateEmployeePassword,
}
