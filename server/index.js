import express from 'express';
import cors from 'cors';
import Mailjet from 'node-mailjet';
import dotenv from 'dotenv';
import { supabase } from './supabase.js';

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

// ===== ENDPOINTS DEL BLOG =====

// GET - Obtener todos los posts
app.get('/api/blog', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error al obtener posts:', error);
    res.status(500).json({ error: 'Error al obtener los posts' });
  }
});

// GET - Obtener un post por ID
app.get('/api/blog/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Post no encontrado' });

    res.json(data);
  } catch (error) {
    console.error('Error al obtener post:', error);
    res.status(500).json({ error: 'Error al obtener el post' });
  }
});

// POST - Crear un nuevo post
app.post('/api/blog', async (req, res) => {
  try {
    const { title, content, author, excerpt, featured_image } = req.body;

    if (!title || !content || !author) {
      return res.status(400).json({ error: 'Faltan campos requeridos: title, content, author' });
    }

    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          title,
          content,
          author,
          excerpt: excerpt || content.substring(0, 200),
          featured_image: featured_image || null,
          created_at: new Date(),
          updated_at: new Date()
        }
      ])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error al crear post:', error);
    res.status(500).json({ error: 'Error al crear el post' });
  }
});

// PUT - Actualizar un post
app.put('/api/blog/:id', async (req, res) => {
  try {
    const { title, content, author, excerpt, featured_image } = req.body;

    const { data, error } = await supabase
      .from('posts')
      .update({
        title,
        content,
        author,
        excerpt,
        featured_image,
        updated_at: new Date()
      })
      .eq('id', req.params.id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ error: 'Post no encontrado' });

    res.json(data[0]);
  } catch (error) {
    console.error('Error al actualizar post:', error);
    res.status(500).json({ error: 'Error al actualizar el post' });
  }
});

// DELETE - Eliminar un post
app.delete('/api/blog/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true, message: 'Post eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar post:', error);
    res.status(500).json({ error: 'Error al eliminar el post' });
  }
});

// ===== FIN ENDPOINTS DEL BLOG =====

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
