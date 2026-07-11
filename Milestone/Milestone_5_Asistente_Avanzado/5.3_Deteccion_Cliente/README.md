# 🔍 Milestone 5.3: Detección de Cliente Logueado

## 📑 Índice de Pasos

1. [Paso 1: Verificación de sesión](#paso-1-verificación-de-sesión)
2. [Paso 2: Obtener datos del cliente](#paso-2-obtener-datos-del-cliente)
3. [Paso 3: Enviar cliente_id al API](#paso-3-enviar-cliente_id-al-api)
4. [Paso 4: Conversaciones diferenciadas](#paso-4-conversaciones-diferenciadas)
5. [Paso 5: Personalización de respuestas](#paso-5-personalización-de-respuestas)

---

## Implementación

### Flujo de detección
```typescript
// En FloatingAssistantButton.tsx
useEffect(() => {
  const session = sessionManager.getSession()
  if (session?.tipo === 'cliente') {
    setClienteId(session.id)
    setClienteNombre(session.nombre)
  }
}, [])

// Al enviar mensaje
const handleSend = async () => {
  await fetch('/api/assistant/chat', {
    method: 'POST',
    body: JSON.stringify({
      mensaje,
      farmacia_id: farmaciaId || 'general',
      cliente_id: clienteId || null
    })
  })
}
```

### Comportamiento según estado

| Estado | Guardado | Personalización |
|--------|----------|-----------------|
| Logueado | ✅ Sí | "Hola, [nombre]" |
| Anónimo | ❌ No | Respuesta genérica |

---

## ✅ Checklist de Completado

- [x] Verificación de sesión al cargar
- [x] Obtención de datos del cliente
- [x] Envío de cliente_id a la API
- [x] Diferenciación de conversaciones
- [x] Respuestas personalizadas

---

[← Anterior: 5.2 Integración](../5.2_Integracion_Chat/README.md) | [Siguiente: 5.4 Citas →](../5.4_Sistema_Citas/README.md)

