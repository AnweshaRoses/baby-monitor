import ssl, smtplib, os
from html_msg import msg as DEFAULT_HTML

EMAIL_ID=os.environ.get('EMAIL_ID',"giornoqwerty123@gmail.com")
PASSWORD=os.environ.get('PASSWORD',"giorno123")


DEFAULT_SUBJECT="Baby Alert!"
DEFAULT_BODY="The baby is CRYING or is in a loud surrounding!"


#Mailer
class Mailer():
    def __init__(self) -> None:
        self.PORT=465
        self.mail_id=EMAIL_ID
        self.password=PASSWORD

        context=ssl.create_default_context()
        self.server=smtplib.SMTP_SSL("smtp.gmail.com",self.PORT,context=context)

    
    def mail(self,reciever,subject=DEFAULT_SUBJECT,body=DEFAULT_BODY,html=DEFAULT_HTML):
        self.server.login(self.mail_id,self.password)

        msg=f'/nSubject:{subject}/n/n{body}'
        if(html!=""):
            msg=self.create_html_mail(reciever,subject,body,html)
        
        self.server.sendmail(self.mail_id,reciever,msg)

    def create_html_mail(self,reciever,subject,body,html):
        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart

        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = self.mail_id
        message["To"] = reciever
        message.attach(MIMEText(body, "plain"))
        message.attach(MIMEText(html, "html"))

        return message.as_string()

    def close(self):
        self.server.close()



#
#a=Mailer()
#a.mail(EMAIL_ID)
#
#

