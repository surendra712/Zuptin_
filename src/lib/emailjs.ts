import emailjs from '@emailjs/browser';

const EMAILJS_CONFIG = {
  serviceId: 'service_plt70sl',
  templateId: 'template_k1q9s0c',
  publicKey: '9Xlc1czMEODcnHQNl'
};

export const sendEmail = async (templateParams: {
  name: string;
  email: string;
  message: string;
  subject?: string;
}) => {
  try {
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      {
        to_email: 'zuptin07@gmail.com',
        from_name: templateParams.name,
        from_email: templateParams.email,
        message: templateParams.message,
        subject: templateParams.subject || 'Contact Form Submission'
      },
      EMAILJS_CONFIG.publicKey
    );
    
    return { success: true, response };
  } catch (error) {
    console.error('EmailJS Error:', error);
    return { success: false, error };
  }
};

export default sendEmail;
