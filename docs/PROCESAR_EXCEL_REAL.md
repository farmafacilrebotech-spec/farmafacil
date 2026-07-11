# 📊 Cómo Procesar tu Excel Real

## 🎯 Objetivo

Guía paso a paso para procesar tu archivo Excel **"VENTAS DERMO AGOSTO24 A AGOSTO25.xlsx"** y convertirlo en un catálogo de productos en FarmaFácil.

---

## 🚀 Método Recomendado: Upload desde Dashboard

### **Paso 1: Preparar el Excel**

Tu Excel debe tener **al menos** una columna con el nombre del producto. El sistema detectará automáticamente las demás columnas.

**Columnas típicas que el sistema busca:**
- Descripción / Nombre / Producto / Artículo
- Código / EAN / Código de Barras
- Precio / PVP / Precio Venta
- Stock / Inventario / Existencias
- Laboratorio / Marca / Fabricante
- Categoría / Familia / Sección

### **Paso 2: Login como Farmacia**

1. Ir a `https://tu-dominio.com/login-farmacia`
2. Ingresar email y contraseña
3. El sistema te redirige al dashboard

### **Paso 3: Subir Excel**

1. En el dashboard verás la sección **"Subir Catálogo desde Excel"**
2. Hacer clic en **"Seleccionar archivo"**
3. Elegir tu Excel: `VENTAS DERMO AGOSTO24 A AGOSTO25.xlsx`
4. Hacer clic en **"Importar"**

### **Paso 4: Esperar Procesamiento**

El sistema:
- ✅ Lee el Excel completo
- ✅ Detecta columnas automáticamente
- ✅ Limpia textos (capitalización, espacios)
- ✅ Infiere categorías por palabras clave
- ✅ Inserta/actualiza productos en Supabase

### **Paso 5: Ver Resultado**

```
✅ ¡Catálogo importado exitosamente!
   • 45 productos insertados
   • 12 productos actualizados
   • Total: 57 productos procesados
```

---

## 🔍 Detección Automática de Categorías

El sistema analiza el nombre del producto y asigna categoría:

| Palabras Clave en Nombre | Categoría Asignada |
|--------------------------|-------------------|
| gel, crema, loción | **Dermocosmética** |
| champú, acondicionador | **Cuidado Capilar** |
| solar, spf, protección | **Solar** |
| bebé, infantil, niño | **Infantil** |
| colutorio, pasta, dental | **Oral** |
| maquillaje, labial, sombra | **Maquillaje** |
| Resto | **Otros** |

**Ejemplos:**
```
"Gel Limpiador Facial Suave" → Dermocosmética
"Champú Anticaspa Intensive" → Cuidado Capilar
"Protector Solar SPF 50+" → Solar
"Crema Pañal Protectora" → Infantil
"Pasta Dentífrica Blanqueadora" → Oral
```

---

## 🧹 Limpieza Automática de Datos

El sistema aplica estas transformaciones:

### **Textos:**
```
"CREMA HIDRATANTE" → "Crema Hidratante"
"  gel limpiador  " → "Gel Limpiador"
"sérum antiarrugas" → "Sérum Antiarrugas"
```

### **Precios:**
```
"12,50" → 12.50
"18.95" → 18.95
"$15.00" → 15.00
```

### **Stock:**
```
"50 unidades" → 50
"25" → 25
"" (vacío) → 0
```

---

## 📋 Estructura del Excel

### **Formato Actual (típico):**

```
| Código | Descripción              | Precio | Stock | Laboratorio |
|--------|--------------------------|--------|-------|-------------|
| 001    | Gel Limpiador Facial     | 12.50  | 45    | La Roche    |
| 002    | Protector Solar SPF 50   | 18.95  | 32    | Isdin       |
```

### **Lo que el Sistema Necesita:**

```
| (Al menos una columna con nombre del producto) |
```

Todo lo demás es **opcional** pero recomendado para mejor calidad de datos.

---

## 🎯 Selección Inteligente de Productos

Si tu Excel tiene muchos productos, el sistema:

1. **Lee todos los productos**
2. **Filtra los mejor formados:**
   - Descripción no vacía ✅
   - Precio válido ✅
   - Stock numérico ✅
   - Código no vacío (opcional pero preferible) ✅

3. **Procesa todos los válidos**

---

## ⚠️ Problemas Comunes y Soluciones

### **Problema 1: "No se pudo detectar columna de nombre"**

**Causa:** Tu Excel no tiene columna reconocible.

**Solución:**
```
1. Abre tu Excel
2. Renombra la columna principal a "Nombre" o "Descripción"
3. Vuelve a subir
```

### **Problema 2: "Muchos productos no se procesaron"**

**Causa:** Filas vacías o datos incompletos.

**Solución:**
```
1. Revisa que las filas tengan al menos nombre
2. Elimina filas completamente vacías
3. Verifica que los precios sean números
```

### **Problema 3: "Productos duplicados"**

**Causa:** Productos sin código de barras se insertan siempre.

**Solución:**
```
1. Añade columna "EAN" o "Código de Barras"
2. Asigna códigos únicos a cada producto
3. El sistema hará UPDATE en lugar de INSERT
```

---

## 🔄 Actualización de Productos Existentes

### **Con Código de Barras:**

```
Si producto existe (mismo farmacia_id + codigo_barras):
  → UPDATE (actualiza precio, stock, etc.)
  
Si no existe:
  → INSERT (nuevo producto)
```

### **Sin Código de Barras:**

```
→ Siempre INSERT (nuevo producto cada vez)
```

**Recomendación:** Usa códigos de barras para evitar duplicados.

---

## 📊 Ejemplo Real de Uso

### **Tu Excel Original:**

```excel
| CODIGO | DESCRIPCION                    | PVENTA | EXIST | LABORATORIO |
|--------|--------------------------------|--------|-------|-------------|
| 12345  | GEL LIMPIADOR FACIAL SUAVE     | 12.50  | 45    | LA ROCHE    |
| 12346  | PROTECTOR SOLAR SPF 50+        | 18.95  | 32    | ISDIN       |
| 12347  | CHAMPU ANTICASPA               | 14.20  | 22    | VICHY       |
```

### **Después del Procesamiento:**

```json
[
  {
    "codigo_barras": "12345",
    "nombre": "Gel Limpiador Facial Suave",
    "categoria": "Dermocosmética",
    "pvp": 12.50,
    "stock": 45,
    "laboratorio": "La Roche"
  },
  {
    "codigo_barras": "12346",
    "nombre": "Protector Solar Spf 50+",
    "categoria": "Solar",
    "pvp": 18.95,
    "stock": 32,
    "laboratorio": "Isdin"
  },
  {
    "codigo_barras": "12347",
    "nombre": "Champú Anticaspa",
    "categoria": "Cuidado Capilar",
    "pvp": 14.20,
    "stock": 22,
    "laboratorio": "Vichy"
  }
]
```

---

## 🧪 Prueba con Subset Primero

Si tienes dudas, prueba primero con un Excel más pequeño:

1. **Copia tu Excel original**
2. **Deja solo 10-20 productos**
3. **Sube y verifica que funciona**
4. **Luego sube el Excel completo**

---

## 📈 Monitoreo Post-Importación

Después de importar, verifica:

```sql
-- Ver productos importados
SELECT COUNT(*) FROM productos WHERE farmacia_id = 'TU_FARMACIA_ID';

-- Ver productos por categoría
SELECT categoria, COUNT(*) 
FROM productos 
WHERE farmacia_id = 'TU_FARMACIA_ID'
GROUP BY categoria;

-- Ver productos sin stock
SELECT nombre, stock 
FROM productos 
WHERE farmacia_id = 'TU_FARMACIA_ID' AND stock = 0;
```

O desde el dashboard (próximamente):
- Ver total de productos
- Ver productos por categoría
- Ver productos con bajo stock

---

## 💡 Tips para Mejores Resultados

### **1. Limpia tu Excel antes de subir:**
```
✅ Elimina filas vacías
✅ Asegúrate de que precios sean números
✅ Verifica que stock sea numérico
✅ Estandariza nombres de laboratorios
```

### **2. Usa códigos de barras:**
```
✅ Evita duplicados
✅ Permite actualizaciones
✅ Facilita gestión de inventario
```

### **3. Categoriza correctamente:**
```
✅ Usa palabras clave en nombres
✅ O añade columna "Categoría"
✅ Facilita búsquedas de clientes
```

### **4. Mantén datos actualizados:**
```
✅ Sube Excel actualizado periódicamente
✅ El sistema actualizará precios y stock
✅ No perderás productos anteriores
```

---

## 🔄 Flujo Completo

```
1. Preparar Excel
   ↓
2. Login en /login-farmacia
   ↓
3. Ir a /farmacia/dashboard
   ↓
4. Subir Excel
   ↓
5. Sistema procesa automáticamente
   ↓
6. Ver estadísticas de importación
   ↓
7. Productos disponibles en Supabase
   ↓
8. Visibles en catálogo de clientes
```

---

## 📞 Ayuda

Si tienes problemas:

1. **Revisa la documentación:** `docs/FASE_3_CATALOGO.md`
2. **Prueba con datos demo:** `npx tsx scripts/load-demo-productos.ts`
3. **Verifica migración SQL:** Tabla `productos` debe existir
4. **Revisa logs del navegador:** Console (F12)
5. **Verifica Supabase:** Dashboard > Table Editor > productos

---

**¡Listo para procesar tu catálogo!** 🚀

Sube tu Excel y deja que el sistema haga la magia ✨

