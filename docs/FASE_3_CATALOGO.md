# 📦 FASE 3: Sincronizador de Catálogo Excel

## 🎯 Objetivo

Permitir a las farmacias subir archivos Excel con sus catálogos de productos y procesarlos automáticamente para insertar/actualizar productos en Supabase.

---

## 🏗️ Arquitectura Implementada

### **Componentes:**

1. **Base de Datos**
   - Tabla `productos` en Supabase
   - RLS configurado
   - Índices optimizados para UPSERT

2. **Backend API**
   - Endpoint `/api/catalogo/upload`
   - Procesa archivos Excel (.xlsx, .xls)
   - Detección automática de columnas
   - UPSERT inteligente

3. **Frontend Dashboard**
   - UI de carga en `/farmacia/dashboard`
   - Input de archivo
   - Feedback en tiempo real

4. **Utilidades**
   - `lib/excelMapper.ts` - Mapeo inteligente de columnas
   - Script de carga de datos demo

---

## 📊 Estructura de la Tabla `productos`

```sql
CREATE TABLE productos (
  id uuid PRIMARY KEY,
  farmacia_id text NOT NULL,
  codigo_barras text,
  nombre text NOT NULL,
  descripcion text,
  categoria text,
  laboratorio text,
  precio numeric(10,2) DEFAULT 0,
  pvp numeric(10,2) DEFAULT 0,
  stock integer DEFAULT 0,
  imagen_url text,
  activo boolean DEFAULT true,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  
  UNIQUE (farmacia_id, codigo_barras)
);
```

---

## 🔄 Flujo de Importación

### **Proceso:**

```
1. Farmacia sube Excel desde dashboard
   ↓
2. Frontend envía FormData a /api/catalogo/upload
   ↓
3. Backend lee Excel con librería xlsx
   ↓
4. Sistema detecta columnas automáticamente
   • Busca patrones conocidos
   • Normaliza nombres
   ↓
5. Mapea productos a estructura estándar
   ↓
6. UPSERT en Supabase:
   • Si existe (farmacia_id + codigo_barras) → UPDATE
   • Si no existe → INSERT
   ↓
7. Devuelve estadísticas al frontend
   ↓
8. Muestra resultado al usuario
```

---

## 🔍 Detección Automática de Columnas

El sistema reconoce múltiples variaciones de nombres de columnas:

| Campo | Patrones Detectados |
|-------|---------------------|
| **Nombre** | nombre, product, articulo, item, descripcion, description, producto |
| **Categoría** | categoria, category, family, familia, seccion, grupo, tipo |
| **Precio** | precio, price, coste, cost, precioc, pc |
| **PVP** | pvp, preciov, pv, precioventa, venta, sale, retail |
| **Stock** | stock, inventario, cantidad, existencias, disponible, qty, quantity |
| **Código Barras** | codigobarras, ean, barcode, codigo, code, upc, cn |
| **Laboratorio** | laboratorio, marca, brand, fabricante, manufacturer, proveedor |

### **Ejemplo de Excel Compatible:**

```
| Artículo              | Family        | PV    | Inventario | EAN           | Marca       |
|-----------------------|---------------|-------|------------|---------------|-------------|
| Gel Limpiador Facial  | Dermocosmética| 12.50 | 45         | 8470001678901 | La Roche    |
| Protector Solar SPF50 | Solar         | 18.95 | 32         | 8470001234567 | Isdin       |
```

Se detecta automáticamente:
- `Artículo` → `nombre`
- `Family` → `categoria`
- `PV` → `pvp`
- `Inventario` → `stock`
- `EAN` → `codigo_barras`
- `Marca` → `laboratorio`

---

## 🏷️ Categorías con Inferencia Automática

Si el Excel no tiene categoría, el sistema la infiere por palabras clave:

| Palabras Clave | Categoría Asignada |
|----------------|-------------------|
| gel, crema, loción | Dermocosmética |
| champú, acondicionador | Cuidado Capilar |
| solar, spf, protección | Solar |
| bebé, infantil | Infantil |
| colutorio, pasta dental | Oral |
| Otros casos | Otros |

---

## 💻 Uso del Sistema

### **Método 1: Desde el Dashboard (Recomendado)**

1. **Login como farmacia:**
   ```
   https://tu-dominio.com/login-farmacia
   ```

2. **Ir al dashboard:**
   ```
   https://tu-dominio.com/farmacia/dashboard
   ```

3. **Subir Excel:**
   - Hacer clic en "Seleccionar archivo"
   - Elegir tu archivo Excel (.xlsx o .xls)
   - Hacer clic en "Importar"

4. **Ver resultado:**
   ```
   ✅ ¡Catálogo importado exitosamente!
   45 productos insertados, 12 actualizados.
   Total: 57 productos procesados
   ```

### **Método 2: Cargar Datos Demo**

Si quieres usar los 50 productos demo incluidos:

```bash
# Instalar dependencia (si no está)
npm install -D tsx

# Ejecutar script
npx tsx scripts/load-demo-productos.ts
```

El script:
- ✅ Lee `public/demo/catalogo_supabase.json`
- ✅ Inserta 50 productos dermatológicos
- ✅ Hace UPSERT (no duplica)
- ✅ Muestra progreso en consola

### **Método 3: API Directa**

```bash
curl -X POST https://tu-dominio.com/api/catalogo/upload \
  -F "file=@mi-catalogo.xlsx" \
  -F "farmacia_id=F012-DEMO"
```

---

## 📋 Formato Recomendado del Excel

### **Columnas Mínimas Requeridas:**

```
| Nombre o Producto | (columna de nombre - OBLIGATORIO)
```

### **Columnas Opcionales pero Recomendadas:**

```
| Nombre       | Categoría | PVP   | Stock | EAN          | Laboratorio |
|--------------|-----------|-------|-------|--------------|-------------|
| Producto 1   | Cat1      | 10.50 | 50    | 8470001234.. | Lab1        |
| Producto 2   | Cat2      | 15.95 | 30    | 8470005678.. | Lab2        |
```

### **Reglas:**

- ✅ Primera fila debe ser encabezados
- ✅ Nombre del producto es obligatorio
- ✅ Filas vacías se saltan automáticamente
- ✅ Valores numéricos con coma o punto funcionan
- ✅ Textos se limpian automáticamente (mayúsculas, espacios)
- ✅ Códigos de barras únicos permiten actualización

---

## 🔧 Lógica de UPSERT

```typescript
Para cada producto:
  
  Si tiene codigo_barras:
    Buscar en DB: (farmacia_id + codigo_barras)
    
    Si existe:
      → UPDATE (actualizar precio, stock, etc.)
    
    Si no existe:
      → INSERT (nuevo producto)
  
  Si NO tiene codigo_barras:
    → INSERT (siempre nuevo producto)
```

---

## 🎨 Productos Demo Incluidos

El archivo `public/demo/catalogo_supabase.json` contiene 50 productos dermatológicos:

- **Dermocosmética** (35 productos)
  - Geles limpiadores
  - Cremas hidratantes
  - Sérums
  - Mascarillas
  
- **Solar** (5 productos)
  - Protectores solares
  - After sun
  
- **Cuidado Capilar** (5 productos)
  - Champús
  - Acondicionadores
  
- **Infantil** (3 productos)
  - Productos para bebés
  
- **Oral** (2 productos)
  - Pastas dentales
  - Colutorios

**Todos los productos tienen:**
- ✅ Código de barras único
- ✅ Nombre descriptivo
- ✅ Categoría asignada
- ✅ Precio y PVP
- ✅ Stock disponible
- ✅ Laboratorio/Marca

---

## 🔐 Seguridad

1. **RLS habilitado** en tabla productos
2. **Solo farmacias autenticadas** pueden subir catálogos
3. **Solo gestionan sus propios productos** (filtro por farmacia_id)
4. **Validación de tipo de archivo** (.xlsx, .xls)
5. **Límites de tamaño** (configurable en Next.js)

---

## 🐛 Manejo de Errores

### **Errores Comunes:**

**1. "No se pudo detectar la columna de nombre"**
- **Causa:** Excel sin columna de nombre/producto
- **Solución:** Asegúrate de tener una columna con el nombre

**2. "El archivo Excel está vacío"**
- **Causa:** Hoja vacía o sin datos
- **Solución:** Verifica que la primera hoja tenga datos

**3. "Error insertando producto X"**
- **Causa:** Violación de constraint o error de tipo
- **Solución:** Revisa que los valores sean válidos

### **Sistema Tolerante:**

- ✅ Salta filas vacías
- ✅ Continúa si un producto falla
- ✅ Reporta errores específicos
- ✅ Muestra total de productos procesados

---

## 📊 Estadísticas y Monitoreo

Después de cada importación, el sistema muestra:

```
✅ ¡Catálogo importado exitosamente!
   • 45 productos insertados
   • 12 productos actualizados
   • Total: 57 productos procesados

⚠️ Ver advertencias (3):
   • Fila 15: No se pudo procesar (falta nombre)
   • Fila 23: Stock inválido, usando 0
   • Fila 34: Precio inválido, usando 0
```

---

## 🚀 Próximas Mejoras (No Implementadas)

Posibles funcionalidades futuras:

- [ ] Preview de productos antes de importar
- [ ] Descarga de plantilla Excel ejemplo
- [ ] Validación de imágenes (URLs)
- [ ] Carga masiva de imágenes
- [ ] Historial de importaciones
- [ ] Exportar catálogo actual a Excel
- [ ] Importación programada/automática
- [ ] Sincronización con APIs de distribuidores

---

## 📞 Soporte

Si tienes problemas con la importación:

1. Verifica que el Excel tenga al menos la columna de nombre
2. Revisa los mensajes de error específicos
3. Prueba con un archivo más pequeño primero
4. Usa los datos demo para validar el sistema

---

## ✅ Checklist de Verificación

Antes de usar en producción:

- [ ] Migración SQL aplicada en Supabase
- [ ] Variables de entorno configuradas
- [ ] Tabla `productos` creada correctamente
- [ ] RLS habilitado
- [ ] Permisos de farmacia configurados
- [ ] Probado con Excel de prueba
- [ ] Probado con datos demo
- [ ] Verificado UPSERT funciona correctamente

---

**Última actualización:** 2025-11-21  
**Versión:** 1.0.0

