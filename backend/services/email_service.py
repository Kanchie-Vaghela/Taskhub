import os
import resend

resend.api_key = os.getenv(
    "RESEND_API_KEY"
)

def send_email(
    to_email,
    subject,
    html
):

    print("ABOUT TO SEND EMAIL")
  
    response = resend.Emails.send({
    "from":
    "TaskHub <onboarding@resend.dev>",
    "to": [to_email],
    "subject": subject,
    "html": html
    })

    print("EMAIL RESPONSE:")
    print(response)