/**
 * Servicio para enviar mensajes de WhatsApp
 * 
 * En producción, usar uno de estos servicios:
 * - WhatsApp Business API (oficial)
 * - Twilio WhatsApp API
 * - MessageBird
 * - 360dialog
 * 
 * Para desarrollo, simula el envío y genera links de WhatsApp
 */

export interface WhatsAppMessage {
  telefono: string          // Número de teléfono (con código de país)
  mensaje: string           // Mensaje de texto
  mediaUrl?: string         // URL del archivo (PDF, imagen, etc.)
  mediaType?: 'document' | 'image'
  filename?: string         // Nombre del archivo
}

export interface WhatsAppResponse {
  success: boolean
  messageId?: string
  error?: string
  whatsappLink?: string     // Link directo de WhatsApp (para desarrollo)
}

// Configuración
const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL || ''
const WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN || ''
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID || ''

// Flag para modo desarrollo (sin API real)
const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production' || !WHATSAPP_API_TOKEN

/**
 * Formatea el número de teléfono para WhatsApp
 * Elimina espacios, guiones y añade código de país si no lo tiene
 */
function formatPhoneNumber(phone: string): string {
  // Eliminar todo excepto números
  let cleaned = phone.replace(/\D/g, '')
  
  // Si empieza con 6, 7, 8 o 9 y tiene 9 dígitos, añadir código de España
  if (/^[6789]\d{8}$/.test(cleaned)) {
    cleaned = '34' + cleaned
  }
  
  return cleaned
}

/**
 * Genera un link de WhatsApp para abrir la conversación
 */
export function generateWhatsAppLink(phone: string, message: string): string {
  const formattedPhone = formatPhoneNumber(phone)
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`
}

/**
 * Envía un mensaje de WhatsApp
 * En desarrollo, retorna el link de WhatsApp
 * En producción, usa la API de WhatsApp Business
 */
export async function sendWhatsAppMessage(message: WhatsAppMessage): Promise<WhatsAppResponse> {
  const formattedPhone = formatPhoneNumber(message.telefono)
  
  // Modo desarrollo: simular envío
  if (IS_DEVELOPMENT) {
    console.log('📱 [WhatsApp Dev] Simulando envío a:', formattedPhone)
    console.log('📝 Mensaje:', message.mensaje)
    if (message.mediaUrl) {
      console.log('📎 Archivo:', message.filename || 'documento.pdf')
    }
    
    return {
      success: true,
      messageId: `dev_${Date.now()}`,
      whatsappLink: generateWhatsAppLink(message.telefono, message.mensaje),
    }
  }
  
  // Producción: usar API de WhatsApp Business
  try {
    // Primero enviar el mensaje de texto
    const textResponse = await fetch(
      `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: formattedPhone,
          type: 'text',
          text: {
            preview_url: false,
            body: message.mensaje,
          },
        }),
      }
    )
    
    if (!textResponse.ok) {
      const error = await textResponse.json()
      throw new Error(error.error?.message || 'Error al enviar mensaje')
    }
    
    const textData = await textResponse.json()
    
    // Si hay un archivo adjunto, enviarlo
    if (message.mediaUrl && message.mediaType) {
      await fetch(
        `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_ID}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${WHATSAPP_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: formattedPhone,
            type: message.mediaType,
            [message.mediaType]: {
              link: message.mediaUrl,
              filename: message.filename,
            },
          }),
        }
      )
    }
    
    return {
      success: true,
      messageId: textData.messages?.[0]?.id,
    }
  } catch (error: any) {
    console.error('Error enviando WhatsApp:', error)
    return {
      success: false,
      error: error.message || 'Error desconocido',
    }
  }
}

/**
 * Envía el recibo del pedido por WhatsApp
 */
export async function sendReciboWhatsApp(params: {
  telefono: string
  nombreDestinatario: string
  pedidoId: string
  total: number
  farmaciaNombre: string
  pdfUrl?: string
  tipo: 'cliente' | 'farmacia'
}): Promise<WhatsAppResponse> {
  const { telefono, nombreDestinatario, pedidoId, total, farmaciaNombre, pdfUrl, tipo } = params
  
  let mensaje: string
  
  if (tipo === 'cliente') {
    mensaje = `🧾 *Recibo de tu pedido FarmaFácil*

Hola ${nombreDestinatario},

Tu pedido *#${pedidoId}* ha sido registrado correctamente.

📦 *Farmacia:* ${farmaciaNombre}
💰 *Total:* ${total.toFixed(2)}€

Te avisaremos cuando esté listo para recoger.

¡Gracias por confiar en FarmaFácil! 💚`
  } else {
    mensaje = `🔔 *Nuevo pedido FarmaFácil*

Tienes un nuevo pedido:

📋 *Pedido:* #${pedidoId}
👤 *Cliente:* ${nombreDestinatario}
💰 *Total:* ${total.toFixed(2)}€

Revisa los detalles en tu panel de FarmaFácil.`
  }
  
  return sendWhatsAppMessage({
    telefono,
    mensaje,
    mediaUrl: pdfUrl,
    mediaType: 'document',
    filename: `recibo_${pedidoId}.pdf`,
  })
}

/**
 * Genera el mensaje de confirmación de pedido para copiar
 */
export function generarMensajeConfirmacion(params: {
  nombreCliente: string
  pedidoId: string
  total: number
  farmaciaNombre: string
  productos: Array<{ nombre: string; cantidad: number }>
}): string {
  const { nombreCliente, pedidoId, total, farmaciaNombre, productos } = params
  
  const productosTexto = productos
    .map(p => `  • ${p.cantidad}x ${p.nombre}`)
    .join('\n')
  
  return `🧾 *Recibo de Pedido FarmaFácil*

Hola ${nombreCliente},

Tu pedido *#${pedidoId}* ha sido confirmado.

📦 *Farmacia:* ${farmaciaNombre}

🛒 *Productos:*
${productosTexto}

💰 *Total:* ${total.toFixed(2)}€

Te avisaremos cuando esté listo.

¡Gracias por tu compra! 💚`
}

