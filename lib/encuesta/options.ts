export const CARGOS = ["Titular", "Cotitular", "Otro"] as const;

export const EMPLEADOS = ["1 o 2", "3 a 5", "6 a 10", "Más de 10"] as const;

export const GRUPO_ENSENA = [
  "No, es una farmacia independiente",
  "Sí, pertenece a un grupo o enseña",
  "Prefiero no indicarlo",
] as const;

export const PROGRAMAS_GESTION = [
  "Nixfarma",
  "Farmatic",
  "Unycop",
  "BitFarma",
  "Gestifarma",
  "Otro",
  "No lo sé",
] as const;

export const PAGINA_WEB = [
  "Sí, con venta online",
  "Sí, pero sin venta online",
  "No",
] as const;

export const USO_WHATSAPP = [
  "Sí, de forma habitual",
  "Sí, ocasionalmente",
  "No",
] as const;

export const PEDIDOS_ANTICIPADOS = ["Sí", "No", "Solo en algunos casos"] as const;

export const VOLUMEN_LLAMADAS = [
  "Menos de 10",
  "Entre 10 y 25",
  "Entre 26 y 50",
  "Más de 50",
  "No lo sé",
] as const;

export const PROPORCION_REPETITIVAS = [
  "Muy pocas",
  "Algunas",
  "Aproximadamente la mitad",
  "La mayoría",
  "No lo sé",
] as const;

export const MOMENTOS_COLAS = [
  "A primera hora",
  "A media mañana",
  "Al mediodía",
  "Por la tarde",
  "Antes del cierre",
  "Varía mucho",
  "Normalmente no tenemos colas",
] as const;

export const INTERRUPCIONES = [
  "Nunca o casi nunca",
  "Algunas veces al día",
  "Muchas veces al día",
  "Constantemente",
] as const;

export const TIEMPO_CONSULTAS = [
  "Menos de 30 minutos",
  "Entre 30 minutos y 1 hora",
  "Entre 1 y 2 horas",
  "Más de 2 horas",
  "No lo sé",
] as const;

export const CANALES_PEDIDOS = [
  "En persona",
  "Por teléfono",
  "Por WhatsApp",
  "Por email",
  "Por la página web",
  "Mediante una aplicación",
  "Por otro medio",
] as const;

export const REGISTRO_PEDIDOS = [
  "Directamente en el programa de gestión",
  "En papel",
  "En notas o agendas",
  "En WhatsApp",
  "En una hoja de cálculo",
  "En otra aplicación",
  "No existe un sistema único",
] as const;

export const FRECUENCIA_PROBLEMA = [
  "Nunca",
  "Raramente",
  "Algunas veces",
  "Frecuentemente",
  "Muy frecuentemente",
] as const;

export const PROBLEMAS_ENCARGO_KEYS = [
  "encargos_mal_anotados",
  "dificultad_localizar",
  "clientes_llaman_varias",
  "productos_tardan_recoger",
  "falta_coordinacion_turnos",
  "errores_comunicar_listo",
] as const;

export const PROBLEMAS_ENCARGO_LABELS: Record<
  (typeof PROBLEMAS_ENCARGO_KEYS)[number],
  string
> = {
  encargos_mal_anotados: "Encargos que no quedan correctamente anotados",
  dificultad_localizar: "Dificultad para localizar el pedido de un cliente",
  clientes_llaman_varias: "Clientes que llaman varias veces para preguntar",
  productos_tardan_recoger: "Productos preparados que tardan en recogerse",
  falta_coordinacion_turnos: "Falta de coordinación entre turnos",
  errores_comunicar_listo: "Errores al comunicar que un pedido está preparado",
};

export const SISTEMA_AVISOS = [
  "Llamada telefónica",
  "WhatsApp",
  "SMS",
  "Email",
  "El cliente vuelve o llama",
  "No se avisa habitualmente",
  "Otro",
] as const;

export const INTERES_PARAFARMACIA = [
  "Sí, es una prioridad",
  "Sí, pero no es prioritario",
  "No especialmente",
  "No lo sé",
] as const;

export const BARRERAS_VENTA = [
  "Falta de tiempo para asesorar",
  "Los clientes no conocen todo el catálogo",
  "Falta de espacio de exposición",
  "Dificultad para comunicar promociones",
  "Competencia de grandes tiendas online",
  "Falta de herramientas digitales",
  "Falta de personal",
  "Falta de una estrategia comercial",
  "Otro",
] as const;

export const COMUNICACION_PROMOCIONES = [
  "Cartelería dentro de la farmacia",
  "Escaparate",
  "Redes sociales",
  "WhatsApp",
  "Email",
  "Página web",
  "De forma verbal",
  "No se comunican de forma sistemática",
  "Otro",
] as const;

export const SOLUCIONES_DIGITALES = [
  "Página web",
  "Tienda online",
  "WhatsApp Business",
  "Redes sociales",
  "Aplicación propia",
  "Pantallas digitales",
  "Kiosco o pantalla de autoservicio",
  "Sistema de fidelización",
  "Automatización de mensajes",
  "Ninguna",
  "Otras",
] as const;

export const BARRERAS_DIGITALIZACION = [
  "Falta de tiempo",
  "Falta de conocimientos",
  "Coste",
  "Dificultad de implantación",
  "Falta de personal",
  "Falta de integración con el programa de gestión",
  "No se percibe una necesidad clara",
  "Preocupación por protección de datos",
  "Otro",
] as const;

export const PRINCIPALES_PROBLEMAS = [
  "Interrupciones por llamadas",
  "Colas en determinados horarios",
  "Gestión de encargos",
  "Falta de coordinación interna",
  "Comunicación con clientes",
  "Promoción de productos",
  "Venta de parafarmacia",
  "Fidelización de clientes",
  "Falta de tiempo del equipo",
  "Procesos manuales",
  "Dificultades con las herramientas digitales",
  "Competencia online",
  "Otro",
] as const;

export const SOLUCION_PRIORITARIA = [
  "Gestión digital de encargos",
  "Avisos automáticos al cliente",
  "Catálogo digital",
  "Asistente para preguntas frecuentes",
  "Kiosco de autoservicio",
  "Sistema de promociones y fidelización",
  "Ninguna por el momento",
] as const;

export const INTERES_PILOTO = [
  "Sí",
  "Quizá, me gustaría recibir información",
  "No por el momento",
] as const;

export const PRECIO_MENSUAL_RAZONABLE = [
  "Menos de 30 €/mes",
  "30-49 €/mes",
  "50-69 €/mes",
  "70-89 €/mes",
  "90-119 €/mes",
  "120 €/mes o más",
  "Dependería del ahorro y los resultados que obtenga",
] as const;

export const PRECIO_MAXIMO_ACEPTABLE = [
  "Más de 50 €/mes",
  "Más de 75 €/mes",
  "Más de 100 €/mes",
  "Más de 150 €/mes",
  "Más de 200 €/mes",
  "Dependería de los resultados",
] as const;

export const MODELO_PAGO_PREFERIDO = [
  "Cuota mensual fija",
  "Pago anual con descuento",
  "Pago según el uso",
  "Pago según número de empleados",
  "Pago según número de pedidos",
  "Me es indiferente",
] as const;

export const INTENCION_PRUEBA_30_DIAS = [
  "Sí, sin ninguna duda",
  "Probablemente sí",
  "Depende del coste de implantación",
  "Solo si se integra con mi programa de gestión",
  "No",
] as const;

export const ESTADOS = [
  "pendiente_revision",
  "requiere_revision",
  "aprobada",
  "rechazada",
  "bono_enviado",
] as const;

export const ESTADOS_BONO = [
  "no_revisado",
  "pendiente_envio",
  "enviado",
  "no_corresponde",
] as const;
