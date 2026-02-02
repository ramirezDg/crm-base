export const mailerConfig = {
  host: process.env.MAIL_HOST || 'smtp.example.com',
  port: Number(process.env.MAIL_PORT) || 587,
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.MAIL_USER || 'usuario@example.com',
    pass: process.env.MAIL_PASS || 'contraseña',
  },
  from: process.env.MAIL_FROM || '"CRM Base" <no-reply@example.com>',
};