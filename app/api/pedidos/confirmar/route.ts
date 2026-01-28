import { NextResponse } from 'next/server'
import { generateWhatsAppLink, generarMensajeConfirmacion } from '@/lib/whatsapp-service'
import { getFarmaciaById } from '@/lib/supabase-helpers'

export interface ConfirmarPedidoRequest {
  // Datos del cliente
  clienteNombre: string
  clienteTelefono: string
  clienteDireccion?: string
  
  // Farmacia
  farmaciaId: string
  
  // Productos
  productos: Array<{
    producto_id: string
    nombre: string
    cantidad: number
    precio: number
  }>
  
  // Pago
  metodoPago: string
  total: number
}

// Generar ID único para el pedido
function generarPedidoId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `FF-${timestamp}-${random}`
}

export async function POST(request: Request) {
  try {
    const body: ConfirmarPedidoRequest = await request.json()
    
    // Validaciones básicas
    if (!body.clienteNombre || !body.clienteTelefono) {
      return NextResponse.json(
        { success: false, error: 'Nombre y teléfono son obligatorios' },
        { status: 400 }
      )
    }
    
    if (!body.farmaciaId || !body.productos?.length) {
      return NextResponse.json(
        { success: false, error: 'Farmacia y productos son obligatorios' },
        { status: 400 }
      )
    }
    
    // Obtener datos de la farmacia
    const farmacia = await getFarmaciaById(body.farmaciaId)
    if (!farmacia) {
      return NextResponse.json(
        { success: false, error: 'Farmacia no encontrada' },
        { status: 404 }
      )
    }
    
    // Generar ID del pedido
    const pedidoId = generarPedidoId()
    
    // Generar mensaje de confirmación
    const mensajeCliente = generarMensajeConfirmacion({
      nombreCliente: body.clienteNombre,
      pedidoId,
      total: body.total,
      farmaciaNombre: farmacia.nombre,
      productos: body.productos.map(p => ({
        nombre: p.nombre,
        cantidad: p.cantidad,
      })),
    })
    
    // Links de WhatsApp
    const whatsappLinkCliente = generateWhatsAppLink(body.clienteTelefono, mensajeCliente)
    
    let whatsappLinkFarmacia = ''
    if (farmacia.telefono) {
      const mensajeFarmacia = `🔔 *Nuevo Pedido #${pedidoId}*\n\nCliente: ${body.clienteNombre}\nTeléfono: ${body.clienteTelefono}\nTotal: ${body.total.toFixed(2)}€\n\nProductos:\n${body.productos.map(p => `• ${p.cantidad}x ${p.nombre}`).join('\n')}`
      whatsappLinkFarmacia = generateWhatsAppLink(farmacia.telefono, mensajeFarmacia)
    }
    
    return NextResponse.json({
      success: true,
      pedido: {
        id: pedidoId,
        fecha: new Date().toISOString(),
        total: body.total,
        estado: 'confirmado',
      },
      farmacia: {
        nombre: farmacia.nombre,
        telefono: farmacia.telefono,
        direccion: farmacia.direccion,
      },
      cliente: {
        nombre: body.clienteNombre,
        telefono: body.clienteTelefono,
        direccion: body.clienteDireccion,
      },
      productos: body.productos,
      metodoPago: body.metodoPago,
      whatsapp: {
        cliente: whatsappLinkCliente,
        farmacia: whatsappLinkFarmacia,
      },
    })
    
  } catch (error: any) {
    console.error('Error al confirmar pedido:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
