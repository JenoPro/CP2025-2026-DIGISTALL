import emailjs from '@emailjs/browser'

// EmailJS Configuration
const EMAILJS_SERVICE_ID = 'service_e2awvdk'
const EMAILJS_APPROVE_TEMPLATE_ID = 'template_r6kxcnh' // Template for approve emails
const EMAILJS_DECLINE_TEMPLATE_ID = 'template_jmqrem5' // Template for decline emails
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
      console.log('✅ EmailJS initialized successfully')
    } catch (error) {
      console.error('❌ EmailJS initialization failed:', error)
      // Fallback initialization
      emailjs.init(EMAILJS_PUBLIC_KEY)
      isInitialized = true
    }
  }
}

// Generate username with format: 25-XXXXX (year-5digits)
export const generateUsername = () => {
  const now = new Date()
  const year = now.getFullYear().toString().slice(-2) // Last 2 digits of year

  // Generate 5 random digits
  const randomDigits = Math.floor(10000 + Math.random() * 90000).toString() // Ensures 5 digits

  const username = `${year}-${randomDigits}`
  console.log('🔑 Generated username:', username)
  return username
}

// Generate password with format: 3 random letters + 3 random numbers
export const generatePassword = () => {
  const letters = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'

  let password = ''

  // Add 3 random letters
  for (let i = 0; i < 3; i++) {
    password += letters.charAt(Math.floor(Math.random() * letters.length))
  }

  // Add 3 random numbers
  for (let i = 0; i < 3; i++) {
    password += numbers.charAt(Math.floor(Math.random() * numbers.length))
  }

  console.log('🔑 Generated password:', password)
  return password
}

// Send credentials email using fetch method
export const sendCredentialsEmailFetch = async (
  recipientEmail,
  applicantName,
  username,
  password,
) => {
  try {
    console.log('📧 Sending approval email via fetch method to:', recipientEmail)

    const templateParams = {
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_APPROVE_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: {
        from_name: SENDER_NAME,
        from_email: SENDER_EMAIL,
        to_email: recipientEmail,
        to_name: applicantName,
        subject: 'Stall Application Approved - Your Login Credentials',
        message: `Dear ${applicantName},

Congratulations! Your stall application has been APPROVED.

Here are your login credentials to access the stall management system:

Username: ${username}
Password: ${password}

IMPORTANT INSTRUCTIONS:
1. Please save these credentials securely
2. Use these credentials to log into the system
3. Monitor the system regularly for raffle updates
4. Change your password after first login for security

What's Next:
• Log into the system using your credentials
• Check for raffle announcements and countdowns
• Stay updated on your stall assignment

Welcome to our stall management community!

Best regards,
Stall Management Admin Team`,
        username: username,
        password: password,
        reply_to: SENDER_EMAIL,
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
      console.log('✅ Approval email sent successfully via fetch')
      return {
        success: true,
        message: `Approval notification and credentials sent to ${recipientEmail}`,
      }
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
  } catch (error) {
    console.error('❌ Fetch method failed:', error)
    return {
      success: false,
      message: `Failed to send email via fetch: ${error.message}`,
    }
  }
}

// Send credentials email using XHR method
export const sendCredentialsEmailXHR = async (
  recipientEmail,
  applicantName,
  username,
  password,
) => {
  return new Promise((resolve) => {
    try {
      console.log('📧 Sending approval email via XHR method to:', recipientEmail)

      const xhr = new XMLHttpRequest()
      xhr.open('POST', 'https://api.emailjs.com/api/v1.0/email/send', true)
      xhr.setRequestHeader('Content-Type', 'application/json')

      const templateParams = {
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_APPROVE_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: {
          from_name: SENDER_NAME,
          from_email: SENDER_EMAIL,
          to_email: recipientEmail,
          to_name: applicantName,
          subject: 'Stall Application Approved - Your Login Credentials',
          message: `Dear ${applicantName},

Congratulations! Your stall application has been APPROVED.

Here are your login credentials to access the stall management system:

Username: ${username}
Password: ${password}

IMPORTANT INSTRUCTIONS:
1. Please save these credentials securely
2. Use these credentials to log into the system
3. Monitor the system regularly for raffle updates
4. Change your password after first login for security

What's Next:
• Log into the system using your credentials
• Check for raffle announcements and countdowns
• Stay updated on your stall assignment

Welcome to our stall management community!

Best regards,
Stall Management Admin Team`,
          username: username,
          password: password,
          reply_to: SENDER_EMAIL,
        },
      }

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            console.log('✅ Approval email sent successfully via XHR')
            resolve({
              success: true,
              message: `Approval notification and credentials sent to ${recipientEmail}`,
            })
          } else {
            console.error('❌ XHR method failed:', xhr.responseText)
            resolve({
              success: false,
              message: `Failed to send email via XHR: ${xhr.statusText}`,
            })
          }
        }
      }

      xhr.onerror = function () {
        console.error('❌ XHR network error')
        resolve({
          success: false,
          message: 'Network error occurred while sending email',
        })
      }

      xhr.send(JSON.stringify(templateParams))
    } catch (error) {
      console.error('❌ XHR method error:', error)
      resolve({
        success: false,
        message: `XHR method failed: ${error.message}`,
      })
    }
  })
}

// Send credentials email using improved EmailJS method
export const sendCredentialsEmailImproved = async (
  recipientEmail,
  applicantName,
  username,
  password,
) => {
  initializeEmailJS()

  try {
    console.log('📧 Sending approval email via improved EmailJS method to:', recipientEmail)

    // Add small delay to ensure initialization
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const templateParams = {
      from_name: SENDER_NAME,
      from_email: SENDER_EMAIL,
      to_email: recipientEmail,
      to_name: applicantName,
      subject: 'Stall Application Approved - Your Login Credentials',
      message: `Dear ${applicantName},

Congratulations! Your stall application has been APPROVED.

Here are your login credentials to access the stall management system:

Username: ${username}
Password: ${password}

IMPORTANT INSTRUCTIONS:
1. Please save these credentials securely
2. Use these credentials to log into the system
3. Monitor the system regularly for raffle updates
4. Change your password after first login for security

What's Next:
• Log into the system using your credentials
• Check for raffle announcements and countdowns
• Stay updated on your stall assignment

Welcome to our stall management community!

Best regards,
Stall Management Admin Team`,
      username: username,
      password: password,
      reply_to: SENDER_EMAIL,
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

    console.log('✅ EmailJS improved method successful:', response)
    return {
      success: true,
      message: `Approval notification and credentials sent to ${recipientEmail}`,
    }
  } catch (error) {
    console.error('❌ Improved EmailJS method failed:', error)
    return {
      success: false,
      message: `Failed to send email: ${error.message || 'Unknown error'}`,
    }
  }
}

// Main function with retry mechanism for sending approval email
export const sendApprovalEmailWithRetry = async (
  recipientEmail,
  applicantName,
  username,
  password,
) => {
  console.log('📧 Starting enhanced email retry mechanism for approval')

  // Attempt 1: Fetch method
  console.log('📧 Attempt 1: Fetch method')
  let result = await sendCredentialsEmailFetch(recipientEmail, applicantName, username, password)
  if (result.success) {
    return result
  }

  // Attempt 2: XHR method
  console.log('📧 Attempt 2: XHR method')
  result = await sendCredentialsEmailXHR(recipientEmail, applicantName, username, password)
  if (result.success) {
    return result
  }

  // Attempt 3: Improved EmailJS method
  console.log('📧 Attempt 3: Improved EmailJS method')
  result = await sendCredentialsEmailImproved(recipientEmail, applicantName, username, password)
  if (result.success) {
    return result
  }

  // All methods failed
  console.error('❌ All email methods failed')
  return {
    success: false,
    message:
      'All email sending methods failed. Please check your network connection and try again.',
  }
}

// Send decline notification email
export const sendDeclineNotificationEmail = async (
  recipientEmail,
  applicantName,
  declineReason = 'Please contact us for more information.',
) => {
  try {
    console.log(`📧 Sending decline notification to:`, recipientEmail)

    const templateParams = {
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_DECLINE_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: {
        from_name: SENDER_NAME,
        from_email: SENDER_EMAIL,
        to_email: recipientEmail,
        to_name: applicantName,
        subject: 'Stall Application Status Update',
        message: `Dear ${applicantName},

Thank you for your interest in our stall management system.

We regret to inform you that your stall application has been declined at this time.

Reason: ${declineReason}

If you have any questions or would like to reapply in the future, please don't hesitate to contact us.

Thank you for your understanding.

Best regards,
Stall Management Admin Team`,
        reply_to: SENDER_EMAIL,
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
      console.log('✅ Decline notification sent successfully')
      return {
        success: true,
        message: `Decline notification sent to ${recipientEmail}`,
      }
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
  } catch (error) {
    console.error('❌ Error sending decline notification:', error)
    return {
      success: false,
      message: `Failed to send notification: ${error.message || 'Unknown error'}`,
    }
  }
}

// Decline email with retry functionality
export const sendDeclineEmailWithRetry = async (
  recipientEmail,
  recipientName,
  declineReason,
  maxRetries = 3,
) => {
  console.log(`📧 Attempting to send decline email to ${recipientEmail} with retry...`)

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`📤 Decline email attempt ${attempt}/${maxRetries}`)

    try {
      // Try primary method first
      const primaryResult = await sendDeclineNotificationEmail(
        recipientEmail,
        recipientName,
        declineReason,
      )

      if (primaryResult.success) {
        console.log(`✅ Decline email sent successfully on attempt ${attempt}`)
        return primaryResult
      } else {
        console.warn(`⚠️ Attempt ${attempt} failed:`, primaryResult.message)

        if (attempt === maxRetries) {
          console.error(`❌ All ${maxRetries} decline email attempts failed`)
          return {
            success: false,
            message: `Failed after ${maxRetries} attempts. Last error: ${primaryResult.message}`,
          }
        }

        // Wait before retry (exponential backoff)
        const delay = Math.pow(2, attempt - 1) * 1000 // 1s, 2s, 4s...
        console.log(`⏳ Waiting ${delay}ms before next attempt...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    } catch (error) {
      console.error(`❌ Decline email attempt ${attempt} error:`, error)

      if (attempt === maxRetries) {
        return {
          success: false,
          message: `Failed after ${maxRetries} attempts. Last error: ${error.message}`,
        }
      }

      // Wait before retry
      const delay = Math.pow(2, attempt - 1) * 1000
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
}
