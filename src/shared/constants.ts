import { config } from "./config.js";

export const ROLES = {
  ADMIN: "admin",
  CLIENT: "client",
  BARBER_SHOP: "barber",
} as const;

export type statusTypes = "active" | "pending" | "blocked";

export type TRole = "client" | "admin" | "barber";

export const HTTP_STATUS = {
  // ✅ Success responses
  OK: 200, // Request was successful (e.g., fetching data, updating without response body)
  CREATED: 201, // Resource successfully created (e.g., user registration, new booking)
  ACCEPTED: 202, // Request accepted for processing but not completed yet (e.g., background job)
  NO_CONTENT: 204, // Request successful but no content returned (e.g., deleting a resource)

  // ❌ Client errors
  BAD_REQUEST: 400, // Invalid request (e.g., missing fields, invalid data format)
  UNAUTHORIZED: 401, // Authentication required (e.g., user not logged in, invalid token)
  FORBIDDEN: 403, // Access denied (e.g., trying to access admin-only routes)
  NOT_FOUND: 404, // Requested resource not found (e.g., wrong ID, missing endpoint)
  METHOD_NOT_ALLOWED: 405, // HTTP method not supported (e.g., using GET instead of POST)
  CONFLICT: 409, // Conflict in request (e.g., duplicate email, already registered)
  PAYLOAD_TOO_LARGE: 413, // Request payload is too large (e.g., file upload exceeds limit)
  UNSUPPORTED_MEDIA_TYPE: 415, // Unsupported content type (e.g., sending XML instead of JSON)
  TOO_MANY_REQUESTS: 429, // Rate limiting (e.g., too many login attempts, API abuse)

  // ⚠️ Server errors
  INTERNAL_SERVER_ERROR: 500, // Generic server error (e.g., database failure, unhandled exception)
  NOT_IMPLEMENTED: 501, // Feature not implemented yet (e.g., unbuilt endpoint)
  BAD_GATEWAY: 502, // Server received invalid response from upstream (e.g., microservices failure)
  SERVICE_UNAVAILABLE: 503, // Server is down or overloaded (e.g., maintenance mode)
  GATEWAY_TIMEOUT: 504, // Upstream server timed out (e.g., long API response time)
} as const;

export const SUCCESS_MESSAGES = {
  BOOKING_SUCCESS: "Booking completed",
  CANCELLATION_SUCCESS: "Cancellation successful",
  CREATED: "Successfully created",
  ADDED: "Added successfully",
  LOGIN_SUCCESS: "Logged in",
  REGISTRATION_SUCCESS: "Registration completed",
  OTP_SEND_SUCCESS: "OTP sent",
  OTP_VERIFIED: "OTP verified",
  COMMUNITY_CREATED: "Community created successfully",
  LOGOUT_SUCCESS: "Logged out",
  REVIEW_ADDED: "Review added successfully",
  JOIN_SUCCESS: "Joined Successfully",
  COMMENT_ADDED: "Comment added successfully",
  MEETING_CREATED: "Meeting created successfully",
  UPDATE_SUCCESS: "Updated Successfully",
  DELETE_SUCCESS: "Deleted Successfully",
  OPERATION_SUCCESS: "Action completed",
  WALLET_BOOKING_SUCCESS: "Booking successful using wallet.",
  PASSWORD_RESET_SUCCESS: "Password reset",
  VERIFICATION_SUCCESS: "Verification done",
  DATA_RETRIEVED: "Data loaded",
  ACTION_SUCCESS: "Action successful",
  CANCEL_SUCCESS: "Cancelled Successfully",
  WITHDRAWAL_SUCCESS:
    "Your withdrawal request has been processed successfully.",
  WITHDRAWAL_APPROVED_SUCCESS: "Withdrawal approved successfully.",
  WITHDRAWAL_REJECTED_SUCCESS: "Withdrawal rejected successfully.",
  EMAIL_SENT_SUCCESSFULLY: "Email sent",
  REQUEST_SUBMITTED: "Request submitted waiting for admin approval",
  APPLICATION_SUBMITTED: "Application submitted waiting for admin approval",
  LOGIN_AND_COMPLETE_YOUR_PROFILE: "Login and complete your profile!",
  COMPLETE_YOUR_PROFILE_TO_GET_APPROVED:
    "Complete your profile to get approved!",
  REQUEST_APPROVED: "Request approved",
  REQUEST_REJECTED: "Request rejected",
  ACCOUNT_ACTIVATED: "Your account is now active",
  ACCOUNT_DEACTIVATED: "Your account has been deactivated",
  TRANSACTION_SUCCESS: "Transaction successful",
  REFUND_INITIATED: "Refund process started",
  PAYMENT_SUCCESS: "Payment completed",
  PAYMENT_PENDING: "Payment is being processed",
  PAYMENT_FAILED: "Payment failed please try again",
  FILE_UPLOADED: "File uploaded successfully",
  PROFILE_UPDATED: "Profile updated",
  SESSION_EXTENDED: "Session extended",
  TOGGLE_LIKE_SUCCESS: "Like/unlike successful",
  POST_ADDED: "Post added successfully",
} as const;

export const ERROR_MESSAGES = {
  WRONG_ID: "Invalid ID",
  TOKEN_EXPIRED: "Session expired login again",
  TOKEN_BLACKLISTED: "Session is no longer valid",
  COMMUNITY_NOT_FOUND: "Community not found",
  EMAIL_NOT_FOUND: "Email not found",
  FORBIDDEN: "You don’t have access",
  BLOCKED: "Your account is blocked",
  NOT_ALLOWED: "You can’t do this action",
  EMAIL_EXISTS: "Email already registered",
  USERNAME_EXISTS: "Username already taken",
  WALLET_NOT_FOUND: "Wallet not found",
  MEETING_NOT_FOUND: "Meeting not found",
  WALLET_UPDATE_FAILED: "Failed to update wallet.",
  REQUEST_NOT_FOUND: "Request not found",
  SERVICE_EXISTS: "Service already exists",
  SERVICE_NOT_FOUND: "Service not found",
  INVALID_TOKEN: "Invalid session please login again",
  INVALID_ROLE: "Access denied",
  CHAT_NOT_FOUND: "Chat not found",
  INVALID_TRANSACTION: "Invalid transaction",
  INVALID_OTP: "Invalid or expired otp",
  INVALID_CREDENTIALS: "Wrong email or password",
  USER_NOT_FOUND: "User not found",
  ROUTE_NOT_FOUND: "Page not found",
  COMMENT_NOT_FOUND: "Comment not found",
  UNAUTHORIZED_ACCESS: "Not authorized",
  ALREADY_JOINED_IN_COMMUNITY: "Already joined in this community",
  SERVER_ERROR: "Something went wrong try again later",
  VALIDATION_ERROR: "Check your inputs and try again",
  SHOP_NOT_FOUND: "Shop not found",
  SHOP_UNDER_VERIFICATION: "Shop request submitted waiting for admin approval",
  SHOP_EXISTS: "You already have a registered shop",
  SHOP_BLOCKED: "This shop is blocked by admin",
  MISSING_PARAMETERS: "Some details are missing",
  TRANSACTION_NOT_FOUND: "Transaction not found",
  WRONG_CURRENT_PASSWORD: "Current password is incorrect",
  ACCOUNT_UNDER_VERIFICATION:
    "Your account is under verification. Please wait for admin approval.",
  POST_NOT_FOUND: "Post not found",
  SAME_CURR_NEW_PASSWORD:
    "New password must be different from current password",
  INSUFFICIENT_BALANCE: "Not enough balance",
  YOU_CAN_ONLY_BOOK_FOR_FUTURE: "You can only book for a future date and time.",
  TRANSACTION_FAILED: "Transaction failed try again",
  REFUND_FAILED: "Refund process failed",
  PAYMENT_ERROR: "Payment could not be processed",
  BOOKING_EXISTS: "Booking already exists. Refresh your page.",
  MORE_THAN_5_CANCELLED_BOOKING:
    "You're having more than 5 cancelled bookings in the last 2 days.",
  BOOKING_NOT_FOUND: "Booking not found.",
  BOOKING_CANNOT_COMPLETE_BEFORE_TIME_ENDS:
    "Booking cannot be marked as completed before it ends.",
  CANCEL_BOOKING_BEFORE_1_HOUR:
    "Booking cannot be cancelled within 1 hour of the scheduled time.",
  ACCOUNT_SUSPENDED: "Your account has been suspended",
  ACCOUNT_BANNED: "Your account has been banned",
  SESSION_EXPIRED: "Your session has expired please log in again",
  TOO_MANY_ATTEMPTS: "Too many failed attempts try again later",
  REVIEW_EXISTING: "You have already reviewed this shop",
  UNSUPPORTED_FILE_TYPE: "Unsupported file type",
  FILE_SIZE_EXCEEDED: "File size is too large",
  RATE_LIMIT_EXCEEDED: "Too many requests try again later",
  MEETING_ALREADY_EXISTS: "A meeting is already scheduled for this community",
  MEETING_ALREADY_CANCELLED: "Meeting already cancelled",
  MEETING_ALREADY_COMPLETED: "Meeting already completed",
  MEETING_CANNOT_COMPLETE_BEFORE_TIME_ENDS:
    "Meeting cannot be marked as completed before it ends",
  INVALID_DATES_FOR_MEETING: "Invalid start time or end time for meeting",
  MEETING_CANNOT_SCHEDULE_IN_PAST:
    "Meeting must be scheduled for a future time.",
  START_TIME_MUST_BE_BEFORE_END_TIME: "Start time must be before end time.",
  HAIRSTYLE_ALREADY_EXISTS: "Hairstyle with this name already exists",
  HAIRSTYLE_NOT_FOUND: "Hairstyle not found",
  BOOKING_LIMIT_EXCEEDED_FOR_TODAY: "Your Booking limit exceeded",
  NOTIFICATION_NOT_FOUND: "Notification not found",
} as const;

export const DIRECT_CHAT_EVENTS = {
  SEND_MESSAGE: "direct-chat:send-message",
  RECEIVE_MESSAGE: "direct-chat:receive-message",
  READ_MESSAGE: "direct-chat:read-message",
  MARK_AS_READ: "direct-chat:mark-as-read",
} as const;

export const COMMUNITY_CHAT_EVENTS = {
  SEND_MESSAGE: "community-chat:send-message",
  RECEIVE_MESSAGE: "community-chat:receive-message",
} as const;

export const VERIFICATION_MAIL_CONTENT = (
  otp: string
) => `<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
   <!-- Logo Text Section -->
   <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="font-size: 48px; font-weight: bold; margin: 0;">
         ✂️ <span style="color: #FEBA43;">Trimly</span>
      </h1>
   </div>

   <h2 style="color: #FEBA43; text-align: center; margin-bottom: 30px;">
      Welcome to Trimly – Where Style Begins! 💈
   </h2>
   
   <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
      Your grooming experience just got better! Book appointments, discover nearest & top barbers, and keep your style sharp. ✨
   </p>
   
   <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
      <p style="margin-bottom: 10px; font-size: 16px;">Your verification code is:</p>
      <h1 style="background-color: #f2f2f2; color: #FEBA43; font-size: 36px; margin: 10px 0; padding: 20px; border-radius: 8px; letter-spacing: 5px;">
         ${otp.trim()}
      </h1>
      <p style="color: #666; font-size: 14px;">
         ⏰ Code expires in 1 minute
      </p>
   </div>
   
   <p style="font-size: 14px; color: #666; margin-top: 20px;">
      🔒 For your security, please don't share this code with anyone.
   </p>
   
   <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
      <p style="font-size: 14px; color: #888;">
         Need help? We're here for you! 💡<br>
         Contact us at <a href="mailto:support@trimly.in" style="color: #FEBA43; text-decoration: none;">support@trimly.in</a>
      </p>
   </div>

   <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #888;">
      © ${new Date().getFullYear()} Trimly. All rights reserved.
   </div>
</div>
`;

export const PASSWORD_RESET_MAIL_CONTENT = (
  resetLink: string
) => `<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; background: #fff;">
   <!-- Logo Text Section -->
   <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="font-size: 48px; font-weight: bold; margin: 0;">
         ✂️ <span style="color: #FEBA43;">Trimly</span>
      </h1>
   </div>

   <div style="text-align: center; margin-bottom: 30px;">
      <h2 style="color: #FEBA43; font-size: 28px; margin: 0;">
         Password Reset Request 🔐
      </h2>
      <p style="color: #666; font-size: 16px; margin: 10px 0 0 0;">
         Don't worry, we'll help you get back in style! ✨
      </p>
   </div>

   <div style="border-radius: 15px; padding: 25px; margin-bottom: 25px; background: linear-gradient(to bottom, #fff, #fcfcfc);">
      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; text-align: center;">
         We received a request to reset your password for your Trimly account. 
         Your security is our top priority! 🛡️
      </p>
      
      <!-- Action Button Section -->
      <div style="border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;">
         <p style="margin-bottom: 20px; font-size: 16px; color: #444;">
            Click the button below to securely reset your password:
         </p>
         
         <a href="${resetLink}" 
            style="background-color: #FEBA43; color: white; padding: 16px 40px; 
                   text-decoration: none; border-radius: 8px; font-weight: 500; 
                   display: inline-block; margin: 10px 0; font-size: 16px; 
                   box-shadow: 0 2px 4px rgba(254, 186, 67, 0.2); transition: all 0.3s ease;
                   max-width: 100%;"
            onmouseover="this.style.backgroundColor='#E6A936'"
            onmouseout="this.style.backgroundColor='#FEBA43'"
            rel="noopener noreferrer"
         >
            Reset Password 🔐
         </a>

         <p style="color: #666; font-size: 14px; margin-top: 20px;">
            ⏰ For security, this link expires in 10 minutes
         </p>
      </div>
   </div>

   <div style="border-radius: 8px; padding: 20px; margin: 25px 0; background-color: #FFF8E1; box-shadow: 0 2px 8px rgba(254, 186, 67, 0.15);">
      <div style="text-align: left; margin-bottom: 15px; display: flex; align-items: center;">
         <span style="font-size: 24px; margin-right: 10px;">⚠️</span>
         <h3 style="color: #B76E00; margin: 0; font-size: 18px;">Security Reminders</h3>
      </div>
      <ul style="list-style: none; padding: 0; margin: 0;">
         <li style="font-size: 14px; color: #8B5800; margin: 8px 0; display: flex; align-items: center;">
            <span style="color: #FEBA43; margin-right: 8px;">•</span> Never share this link with anyone
         </li>
         <li style="font-size: 14px; color: #8B5800; margin: 8px 0; display: flex; align-items: center;">
            <span style="color: #FEBA43; margin-right: 8px;">•</span> Trimly will never ask for your password
         </li>
         <li style="font-size: 14px; color: #8B5800; margin: 8px 0; display: flex; align-items: center;">
            <span style="color: #FEBA43; margin-right: 8px;">•</span> Ensure you're on our official website before logging in
         </li>
      </ul>
   </div>

   <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
      <p style="font-size: 14px; color: #888;">
         Need help? We're here for you! 💡<br>
         Contact us at <a href="mailto:support@trimly.in" style="color: #FEBA43; text-decoration: none;">support@trimly.in</a>
      </p>
   </div>

   <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #888;">
      © ${new Date().getFullYear()} Trimly. All rights reserved.<br>
      <span style="color: #FEBA43;">✦</span> Your Style, Our Priority <span style="color: #FEBA43;">✦</span>
   </div>
</div>`;

export const SHOP_APPROVED_MAIL_CONTENT = (
  shopName: string
) => `<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
   <!-- Logo Text Section -->
   <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="font-size: 48px; font-weight: bold; margin: 0;">
         ✂️ <span style="color: #FEBA43;">Trimly</span>
      </h1>
   </div>
   
   <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
      Your barbershop <strong>${shopName}</strong> has been successfully approved and is now live on the Trimly platform! ✂️  
      You can start managing your appointments, attracting clients, and growing your business.
   </p>
   
   <div style="text-align: center; margin: 30px 0;">
      <a href="${config.cors.ALLOWED_ORIGIN}/barber/dashboard" 
         style="background-color: #FEBA43; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">
         Go to Dashboard
      </a>
   </div>
   
   <p style="font-size: 14px; color: #666;">
      📅 Keep your profile updated, add your available slots, and start receiving bookings today!
   </p>
   
   <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
      <p style="font-size: 14px; color: #888;">
         Need help? We're here for you! 💡<br>
         Contact us at <a href="mailto:support@trimly.in" style="color: #FEBA43; text-decoration: none;">support@trimly.in</a>
      </p>
   </div>

   <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #888;">
      © ${new Date().getFullYear()} Trimly. All rights reserved.
   </div>
</div>`;

// export const SHOP_REJECTION_WITH_MESSAGE_MAIL = (
// 	shopName: string,
// 	adminMessage: string
// ) => `<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
//     <!-- Logo Text Section -->
//     <div style="text-align: center; margin-bottom: 30px;">
//        <h1 style="font-size: 48px; font-weight: bold; margin: 0;">
//           ✂️ <span style="color: #FEBA43;">Trimly</span>
//        </h1>
//     </div>

//     <h2 style="color: #FEBA43; text-align: center; margin-bottom: 30px;">
//        ❌ Your shop application was not approved.
//     </h2>

//     <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
//        We appreciate your interest in joining Trimly. Unfortunately, your barbershop <strong>${shopName}</strong>
//        did not meet our approval criteria at this time. 🚧
//     </p>

//     <div style="background-color: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
//        <strong>📢 Message from the Admin:</strong>
//        <p style="font-size: 14px; line-height: 1.5; margin: 10px 0;">
//           ${adminMessage}
//        </p>
//     </div>

//     <p style="font-size: 14px; color: #666;">
//        🔍 If you believe this was an error, or if you would like to improve your application, please review our guidelines and reapply.
//     </p>

//     <div style="text-align: center; margin: 30px 0;">
//        <a href="${config.cors.ALLOWED_ORIGIN}/support"
//           style="background-color: #FEBA43; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">
//           Contact Support
//        </a>
//     </div>

//     <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
//        <p style="font-size: 14px; color: #888;">
//           Need help? We're here for you! 💡<br>
//           Contact us at <a href="mailto:support@trimly.in" style="color: #FEBA43; text-decoration: none;">support@trimly.in</a>
//        </p>
//     </div>

//     <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #888;">
//        © ${new Date().getFullYear()} Trimly. All rights reserved.
//     </div>
//  </div>`;

export const SHOP_REJECTION_WITH_MESSAGE_MAIL = (
  shopName: string,
  adminMessage: string
) => `<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
    <!-- Logo Text Section -->
    <div style="text-align: center; margin-bottom: 30px;">
       <h1 style="font-size: 48px; font-weight: bold; margin: 0;">
          ✂️ <span style="color: #FEBA43;">Trimly</span>
       </h1>
    </div>
 
    <h2 style="color: #FEBA43; text-align: center; margin-bottom: 30px;">
       ❌ Your shop application was not approved.
    </h2>
    
    <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
       We appreciate your interest in joining Trimly. Unfortunately, your barbershop <strong>${shopName}</strong> 
       did not meet our approval criteria at this time. 🚧
    </p>
 
    <div style="background-color: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
       <strong>📢 Message from the Admin:</strong>
       <p style="font-size: 14px; line-height: 1.5; margin: 10px 0;">
          ${adminMessage}
       </p>
    </div>

    <h3 style="color: #FEBA43; text-align: center; margin-top: 30px;">
       🔄 Request a New Shop Application
    </h3>

    <p style="font-size: 14px; line-height: 1.5; color: #666; text-align: center; margin-bottom: 20px;">
       Your previous shop application has been removed. If you would like to try again, you can submit a new shop request with updated details.
    </p>

    <div style="text-align: center; margin-bottom: 30px;">
       <a href="${config.cors.ALLOWED_ORIGIN}/barber" 
          style="background-color: #FEBA43; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">
          Request New Shop
       </a>
    </div>

    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
       <p style="font-size: 14px; color: #888;">
          Need help? We're here for you! 💡<br>
          Contact us at <a href="mailto:support@trimly.in" style="color: #FEBA43; text-decoration: none;">support@trimly.in</a>
       </p>
    </div>
 
    <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #888;">
       © ${new Date().getFullYear()} Trimly. All rights reserved.
    </div>
 </div>`;

export const GOOGLE_REGISTRATION_MAIL_CONTENT = (
  fullName: string,
  tempPassword: string
) => `<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; background: #fff;">
   <!-- Logo Section -->
   <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="font-size: 48px; font-weight: bold; margin: 0;">
         ✂️ <span style="color: #FEBA43;">Trimly</span>
      </h1>
   </div>

   <!-- Welcome Section -->
   <div style="text-align: center; margin-bottom: 30px;">
      <h2 style="color: #FEBA43; font-size: 28px; margin: 0;">
         Welcome to Trimly, ${fullName}! 🎉
      </h2>
      <p style="color: #666; font-size: 16px; margin: 10px 0 0 0;">
         Your Google registration is complete. Here's everything you need to get started!
      </p>
   </div>

   <!-- Account Info -->
   <div style="border-radius: 15px; padding: 25px; margin-bottom: 25px; background: linear-gradient(to bottom, #fff, #fcfcfc);">
      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; text-align: center;">
         We've generated a temporary password for you. Please use this password to log in and change it ASAP! 🔐
      </p>

      <!-- Temporary Password -->
      <div style="text-align: center; padding: 15px; border-radius: 8px; background-color: #FEBA43; color: white; font-size: 18px; font-weight: bold; display: inline-block; margin: 10px 0;">
         ${tempPassword}
      </div>

      <p style="color: #666; font-size: 14px; text-align: center; margin-top: 10px;">
         ✨ Make sure to update your password as soon as possible to keep your account secure!
      </p>
   </div>

   <!-- Change Password Reminder -->
   <div style="text-align: center; margin-bottom: 30px;">
      <a href="${config.cors.ALLOWED_ORIGIN}" 
         style="background-color: #FEBA43; color: white; padding: 16px 40px; 
                text-decoration: none; border-radius: 8px; font-weight: 500; 
                display: inline-block; margin: 10px 0; font-size: 16px; 
                box-shadow: 0 2px 4px rgba(254, 186, 67, 0.2); 
                transition: all 0.3s ease; 
                cursor: pointer;"
         onmouseover="this.style.backgroundColor='#E6A936'"
         onmouseout="this.style.backgroundColor='#FEBA43'"
         rel="noopener noreferrer"
      >
         Log in & Change Password 🔑
      </a>
   </div>

   <!-- Security Section -->
   <div style="border-radius: 8px; padding: 20px; margin: 25px 0; background-color: #FFF8E1; box-shadow: 0 2px 8px rgba(254, 186, 67, 0.15);">
      <div style="text-align: left; margin-bottom: 15px; display: flex; align-items: center;">
         <span style="font-size: 24px; margin-right: 10px;">⚠️</span>
         <h3 style="color: #B76E00; margin: 0; font-size: 18px;">Security Reminders</h3>
      </div>
      <ul style="list-style: none; padding: 0; margin: 0;">
         <li style="font-size: 14px; color: #8B5800; margin: 8px 0; display: flex; align-items: center;">
            <span style="color: #FEBA43; margin-right: 8px;">•</span> Change your password immediately after logging in
         </li>
         <li style="font-size: 14px; color: #8B5800; margin: 8px 0; display: flex; align-items: center;">
            <span style="color: #FEBA43; margin-right: 8px;">•</span> Never share your password with anyone
         </li>
         <li style="font-size: 14px; color: #8B5800; margin: 8px 0; display: flex; align-items: center;">
            <span style="color: #FEBA43; margin-right: 8px;">•</span> Always ensure you're on the official Trimly website before entering your credentials
         </li>
      </ul>
   </div>

   <!-- Support Section -->
   <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
      <p style="font-size: 14px; color: #888;">
         Need help? We're here for you! 💡<br>
         Contact us at <a href="mailto:support@trimly.in" style="color: #FEBA43; text-decoration: none;">support@trimly.in</a>
      </p>
   </div>

   <!-- Footer -->
   <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #888;">
      © ${new Date().getFullYear()} Trimly. All rights reserved.<br>
      <span style="color: #FEBA43;">✦</span> Your Style, Our Priority <span style="color: #FEBA43;">✦</span>
   </div>
</div>`;
