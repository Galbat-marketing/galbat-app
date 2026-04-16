import express from 'express';
import cors from 'cors';
import Mailjet from 'node-mailjet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const mailjet = Mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

app.post('/api/contact', async (req, res) => {
  const { name, email, company, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  const htmlContent = `
    <div style="font-family: 'Montserrat', sans-serif; max-width: 600px; padding: 20px;">
      <h2 style="color: #7b5ea7; font-family: 'Cinzel', serif;">Nuevo mensaje de GALBAT</h2>
      <hr style="border: 1px solid #e6c98c; margin: 20px 0;">
      
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Empresa:</strong> ${company || 'No especificada'}</p>
      
      <div style="background: #f5f0e8; padding: 20px; margin-top: 20px; border-left: 3px solid #e6c98c;">
        <strong>Mensaje:</strong><br><br>
        ${message.replace(/\n/g, '<br>')}
      </div>
    </div>
  `;

  const textContent = `
Nuevo mensaje de GALBAT

Nombre: ${name}
Email: ${email}
Empresa: ${company || 'No especificada'}

Mensaje:
${message}
  `;

  try {
    const result = await mailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: process.env.MJ_SENDER_EMAIL,
              Name: 'GALBAT Landing'
            },
            To: [
              {
                Email: process.env.MJ_RECIPIENT_EMAIL,
                Name: 'GALBAT'
              }
            ],
            Subject: `Nuevo contacto de ${name}`,
            TextPart: textContent,
            HTMLPart: htmlContent
          }
        ]
      });

    console.log('Email enviado:', result.body);
    res.json({ success: true, message: 'Mensaje enviado correctamente' });
  } catch (error) {
    console.error('Error al enviar email:', error);
    res.status(500).json({ error: 'Error al enviar el mensaje' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
