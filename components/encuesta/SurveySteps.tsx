"use client";

import Link from "next/link";
import {
  BARRERAS_DIGITALIZACION,
  BARRERAS_VENTA,
  CANALES_PEDIDOS,
  CARGOS,
  COMUNICACION_PROMOCIONES,
  EMPLEADOS,
  FRECUENCIA_PROBLEMA,
  GRUPO_ENSENA,
  INTERES_PARAFARMACIA,
  INTERES_PILOTO,
  INTERRUPCIONES,
  MOMENTOS_COLAS,
  PAGINA_WEB,
  PEDIDOS_ANTICIPADOS,
  PRINCIPALES_PROBLEMAS,
  PROBLEMAS_ENCARGO_KEYS,
  PROBLEMAS_ENCARGO_LABELS,
  PROGRAMAS_GESTION,
  PROPORCION_REPETITIVAS,
  REGISTRO_PEDIDOS,
  SISTEMA_AVISOS,
  SOLUCION_PRIORITARIA,
  SOLUCIONES_DIGITALES,
  TIEMPO_CONSULTAS,
  USO_WHATSAPP,
  VOLUMEN_LLAMADAS,
  PRECIO_MENSUAL_RAZONABLE,
  PRECIO_MAXIMO_ACEPTABLE,
  MODELO_PAGO_PREFERIDO,
  INTENCION_PRUEBA_30_DIAS,
} from "@/lib/encuesta/options";
import { PROVINCIAS } from "@/lib/encuesta/provinces";
import type { SurveyFormData } from "@/lib/encuesta/types";
import {
  CheckboxGroup,
  FieldError,
  FieldLabel,
  QuestionBlock,
  RadioGroup,
  ScaleInput,
  TextInput,
  TextSelect,
  TextTextarea,
} from "./SurveyFields";

type Props = {
  data: SurveyFormData;
  errors: Record<string, string>;
  update: <K extends keyof SurveyFormData>(key: K, value: SurveyFormData[K]) => void;
};

export function StepIdentificacion({ data, errors, update }: Props) {
  return (
    <div className="space-y-4">
      <QuestionBlock fieldId="nombre_titular">
        <FieldLabel htmlFor="nombre_titular" required>
          Nombre completo del titular o cotitular
        </FieldLabel>
        <TextInput
          id="nombre_titular"
          value={data.nombre_titular}
          onChange={(e) => update("nombre_titular", e.target.value)}
          autoComplete="name"
          invalid={!!errors.nombre_titular}
          errorId="nombre_titular-error"
        />
        <FieldError id="nombre_titular-error" message={errors.nombre_titular} />
      </QuestionBlock>

      <QuestionBlock fieldId="nombre_farmacia">
        <FieldLabel htmlFor="nombre_farmacia" required>
          Nombre comercial de la farmacia
        </FieldLabel>
        <TextInput
          id="nombre_farmacia"
          value={data.nombre_farmacia}
          onChange={(e) => update("nombre_farmacia", e.target.value)}
          invalid={!!errors.nombre_farmacia}
          errorId="nombre_farmacia-error"
        />
        <FieldError id="nombre_farmacia-error" message={errors.nombre_farmacia} />
      </QuestionBlock>

      <div className="grid gap-4 sm:grid-cols-2">
        <QuestionBlock fieldId="telefono">
          <FieldLabel htmlFor="telefono" required>
            Teléfono de contacto
          </FieldLabel>
          <TextInput
            id="telefono"
            type="tel"
            inputMode="tel"
            value={data.telefono}
            onChange={(e) => update("telefono", e.target.value)}
            autoComplete="tel"
            invalid={!!errors.telefono}
            errorId="telefono-error"
          />
          <FieldError id="telefono-error" message={errors.telefono} />
        </QuestionBlock>
        <QuestionBlock fieldId="email">
          <FieldLabel htmlFor="email" required>
            Email
          </FieldLabel>
          <TextInput
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => update("email", e.target.value)}
            autoComplete="email"
            invalid={!!errors.email}
            errorId="email-error"
          />
          <FieldError id="email-error" message={errors.email} />
        </QuestionBlock>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <QuestionBlock fieldId="provincia">
          <FieldLabel htmlFor="provincia" required>
            Provincia
          </FieldLabel>
          <TextSelect
            id="provincia"
            value={data.provincia}
            onChange={(e) => update("provincia", e.target.value)}
            invalid={!!errors.provincia}
            errorId="provincia-error"
          >
            <option value="">Selecciona…</option>
            {PROVINCIAS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </TextSelect>
          <FieldError id="provincia-error" message={errors.provincia} />
        </QuestionBlock>
        <QuestionBlock fieldId="municipio">
          <FieldLabel htmlFor="municipio" required>
            Municipio
          </FieldLabel>
          <TextInput
            id="municipio"
            value={data.municipio}
            onChange={(e) => update("municipio", e.target.value)}
            invalid={!!errors.municipio}
            errorId="municipio-error"
          />
          <FieldError id="municipio-error" message={errors.municipio} />
        </QuestionBlock>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <QuestionBlock fieldId="codigo_postal">
          <FieldLabel htmlFor="codigo_postal" required>
            Código postal
          </FieldLabel>
          <TextInput
            id="codigo_postal"
            inputMode="numeric"
            value={data.codigo_postal}
            onChange={(e) => update("codigo_postal", e.target.value)}
            maxLength={5}
            invalid={!!errors.codigo_postal}
            errorId="codigo_postal-error"
          />
          <FieldError id="codigo_postal-error" message={errors.codigo_postal} />
        </QuestionBlock>
        <QuestionBlock fieldId="cargo">
          <FieldLabel required>Cargo o relación con la farmacia</FieldLabel>
          <RadioGroup
            name="cargo"
            options={CARGOS}
            value={data.cargo}
            onChange={(v) => update("cargo", v as SurveyFormData["cargo"])}
            error={errors.cargo}
            errorId="cargo-error"
          />
        </QuestionBlock>
      </div>

      <QuestionBlock fieldId="declaracion_titularidad">
        <label
          className={`flex items-start gap-3 rounded-xl border p-3 text-sm ${
            errors.declaracion_titularidad
              ? "border-[#e07a3d] bg-[#fff8f3]"
              : "border-gray-200 bg-[#F7F9FA]"
          }`}
        >
          <input
            type="checkbox"
            className="mt-0.5 accent-[#1ABBB3]"
            checked={data.declaracion_titularidad}
            onChange={(e) => update("declaracion_titularidad", e.target.checked)}
            aria-invalid={errors.declaracion_titularidad ? true : undefined}
            aria-describedby={
              errors.declaracion_titularidad ? "declaracion_titularidad-error" : undefined
            }
          />
          <span>
            Declaro que soy titular o cotitular de la farmacia indicada y que la información
            facilitada es veraz. *
          </span>
        </label>
        <FieldError id="declaracion_titularidad-error" message={errors.declaracion_titularidad} />
      </QuestionBlock>
    </div>
  );
}

function ChoiceQuestion({
  fieldId,
  label,
  hint,
  children,
}: {
  fieldId: string;
  label: React.ReactNode;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <QuestionBlock fieldId={fieldId}>
      <FieldLabel required>{label}</FieldLabel>
      {hint}
      {children}
    </QuestionBlock>
  );
}

export function StepCaracteristicas({ data, errors, update }: Props) {
  return (
    <div className="space-y-5">
      <ChoiceQuestion
        fieldId="empleados"
        label="¿Cuántas personas trabajan habitualmente en la farmacia?"
      >
        <RadioGroup
          name="empleados"
          options={EMPLEADOS}
          value={data.empleados}
          onChange={(v) => update("empleados", v as SurveyFormData["empleados"])}
          error={errors.empleados}
          errorId="empleados-error"
        />
      </ChoiceQuestion>

      <QuestionBlock fieldId="mostradores">
        <FieldLabel htmlFor="mostradores" required>
          ¿Cuántos mostradores de atención tiene aproximadamente?
        </FieldLabel>
        <TextInput
          id="mostradores"
          inputMode="numeric"
          value={data.mostradores}
          onChange={(e) => update("mostradores", e.target.value)}
          invalid={!!errors.mostradores}
          errorId="mostradores-error"
        />
        <FieldError id="mostradores-error" message={errors.mostradores} />
      </QuestionBlock>

      <ChoiceQuestion
        fieldId="grupo_ensena"
        label="¿La farmacia pertenece a una cadena, grupo o enseña?"
      >
        <RadioGroup
          name="grupo_ensena"
          options={GRUPO_ENSENA}
          value={data.grupo_ensena}
          onChange={(v) => update("grupo_ensena", v as SurveyFormData["grupo_ensena"])}
          error={errors.grupo_ensena}
          errorId="grupo_ensena-error"
        />
      </ChoiceQuestion>

      <ChoiceQuestion
        fieldId="programa_gestion"
        label="¿Qué programa de gestión utiliza principalmente?"
      >
        <RadioGroup
          name="programa_gestion"
          options={PROGRAMAS_GESTION}
          value={data.programa_gestion}
          onChange={(v) => update("programa_gestion", v as SurveyFormData["programa_gestion"])}
          error={errors.programa_gestion}
          errorId="programa_gestion-error"
        />
        {data.programa_gestion === "Otro" && (
          <div className="mt-2" data-field="programa_gestion_otro">
            <TextInput
              placeholder="Indica el programa"
              value={data.programa_gestion_otro}
              onChange={(e) => update("programa_gestion_otro", e.target.value)}
              invalid={!!errors.programa_gestion_otro}
              errorId="programa_gestion_otro-error"
            />
            <FieldError
              id="programa_gestion_otro-error"
              message={errors.programa_gestion_otro}
            />
          </div>
        )}
      </ChoiceQuestion>

      <ChoiceQuestion fieldId="pagina_web" label="¿Dispone actualmente de página web?">
        <RadioGroup
          name="pagina_web"
          options={PAGINA_WEB}
          value={data.pagina_web}
          onChange={(v) => update("pagina_web", v as SurveyFormData["pagina_web"])}
          error={errors.pagina_web}
          errorId="pagina_web-error"
        />
      </ChoiceQuestion>

      <ChoiceQuestion
        fieldId="uso_whatsapp"
        label="¿Utiliza WhatsApp para atender a clientes?"
      >
        <RadioGroup
          name="uso_whatsapp"
          options={USO_WHATSAPP}
          value={data.uso_whatsapp}
          onChange={(v) => update("uso_whatsapp", v as SurveyFormData["uso_whatsapp"])}
          error={errors.uso_whatsapp}
          errorId="uso_whatsapp-error"
        />
      </ChoiceQuestion>

      <ChoiceQuestion
        fieldId="pedidos_anticipados"
        label="¿Permite hacer encargos o pedidos antes de acudir a la farmacia?"
      >
        <RadioGroup
          name="pedidos_anticipados"
          options={PEDIDOS_ANTICIPADOS}
          value={data.pedidos_anticipados}
          onChange={(v) =>
            update("pedidos_anticipados", v as SurveyFormData["pedidos_anticipados"])
          }
          error={errors.pedidos_anticipados}
          errorId="pedidos_anticipados-error"
        />
      </ChoiceQuestion>
    </div>
  );
}

export function StepAtencion({ data, errors, update }: Props) {
  return (
    <div className="space-y-5">
      <ChoiceQuestion
        fieldId="volumen_llamadas"
        label="Aproximadamente, ¿cuántas llamadas recibe la farmacia en un día normal?"
      >
        <RadioGroup
          name="volumen_llamadas"
          options={VOLUMEN_LLAMADAS}
          value={data.volumen_llamadas}
          onChange={(v) => update("volumen_llamadas", v as SurveyFormData["volumen_llamadas"])}
          error={errors.volumen_llamadas}
          errorId="volumen_llamadas-error"
        />
      </ChoiceQuestion>

      <ChoiceQuestion
        fieldId="proporcion_repetitivas"
        label="¿Qué proporción de esas llamadas suele corresponder a preguntas repetitivas?"
        hint={
          <p className="mb-2 text-xs text-gray-500">
            Por ejemplo: encargos, stock, horarios, precios, reservas o recogidas.
          </p>
        }
      >
        <RadioGroup
          name="proporcion_repetitivas"
          options={PROPORCION_REPETITIVAS}
          value={data.proporcion_repetitivas}
          onChange={(v) =>
            update("proporcion_repetitivas", v as SurveyFormData["proporcion_repetitivas"])
          }
          error={errors.proporcion_repetitivas}
          errorId="proporcion_repetitivas-error"
        />
      </ChoiceQuestion>

      <ChoiceQuestion fieldId="momentos_colas" label="¿En qué momentos se producen más colas?">
        <CheckboxGroup
          options={MOMENTOS_COLAS}
          values={data.momentos_colas}
          onChange={(v) => update("momentos_colas", v as SurveyFormData["momentos_colas"])}
          error={errors.momentos_colas}
          errorId="momentos_colas-error"
        />
      </ChoiceQuestion>

      <ChoiceQuestion
        fieldId="interrupciones"
        label="¿Con qué frecuencia una persona del equipo debe interrumpir la atención presencial para responder al teléfono?"
      >
        <RadioGroup
          name="interrupciones"
          options={INTERRUPCIONES}
          value={data.interrupciones}
          onChange={(v) => update("interrupciones", v as SurveyFormData["interrupciones"])}
          error={errors.interrupciones}
          errorId="interrupciones-error"
        />
      </ChoiceQuestion>

      <ChoiceQuestion
        fieldId="tiempo_consultas"
        label="¿Cuánto tiempo estimas que dedica diariamente el equipo a llamadas, WhatsApp y consultas repetitivas?"
      >
        <RadioGroup
          name="tiempo_consultas"
          options={TIEMPO_CONSULTAS}
          value={data.tiempo_consultas}
          onChange={(v) => update("tiempo_consultas", v as SurveyFormData["tiempo_consultas"])}
          error={errors.tiempo_consultas}
          errorId="tiempo_consultas-error"
        />
      </ChoiceQuestion>

      <QuestionBlock fieldId="consultas_mas_repetidas">
        <FieldLabel htmlFor="consultas_mas_repetidas" required>
          ¿Qué consultas o llamadas se repiten con mayor frecuencia?
        </FieldLabel>
        <TextTextarea
          id="consultas_mas_repetidas"
          value={data.consultas_mas_repetidas}
          onChange={(e) => update("consultas_mas_repetidas", e.target.value)}
          invalid={!!errors.consultas_mas_repetidas}
          errorId="consultas_mas_repetidas-error"
        />
        <FieldError id="consultas_mas_repetidas-error" message={errors.consultas_mas_repetidas} />
      </QuestionBlock>
    </div>
  );
}

export function StepPedidos({ data, errors, update }: Props) {
  return (
    <div className="space-y-5">
      <ChoiceQuestion
        fieldId="canales_pedidos"
        label="¿Por qué canales recibe actualmente encargos o pedidos?"
      >
        <CheckboxGroup
          options={CANALES_PEDIDOS}
          values={data.canales_pedidos}
          onChange={(v) => update("canales_pedidos", v as SurveyFormData["canales_pedidos"])}
          error={errors.canales_pedidos}
          errorId="canales_pedidos-error"
        />
      </ChoiceQuestion>

      <ChoiceQuestion fieldId="registro_pedidos" label="¿Cómo registra normalmente esos encargos?">
        <CheckboxGroup
          options={REGISTRO_PEDIDOS}
          values={data.registro_pedidos}
          onChange={(v) => update("registro_pedidos", v as SurveyFormData["registro_pedidos"])}
          error={errors.registro_pedidos}
          errorId="registro_pedidos-error"
        />
      </ChoiceQuestion>

      <div>
        <FieldLabel required>¿Con qué frecuencia se producen alguno de estos problemas?</FieldLabel>
        <div className="mt-3 space-y-4">
          {PROBLEMAS_ENCARGO_KEYS.map((key) => (
            <QuestionBlock
              key={key}
              fieldId={`problemas_encargos.${key}`}
              className="rounded-xl border border-gray-100 p-3"
            >
              <p className="mb-2 text-sm font-medium text-[#1A1A1A]">
                {PROBLEMAS_ENCARGO_LABELS[key]}
              </p>
              <RadioGroup
                name={key}
                options={FRECUENCIA_PROBLEMA}
                value={data.problemas_encargos[key]}
                onChange={(v) =>
                  update("problemas_encargos", {
                    ...data.problemas_encargos,
                    [key]: v,
                  })
                }
                error={errors[`problemas_encargos.${key}`]}
                errorId={`problemas_encargos.${key}-error`}
              />
            </QuestionBlock>
          ))}
        </div>
      </div>

      <ChoiceQuestion
        fieldId="sistema_avisos"
        label="¿Cómo avisa actualmente la farmacia cuando un encargo está preparado?"
      >
        <CheckboxGroup
          options={SISTEMA_AVISOS}
          values={data.sistema_avisos}
          onChange={(v) => update("sistema_avisos", v as SurveyFormData["sistema_avisos"])}
          error={errors.sistema_avisos}
          errorId="sistema_avisos-error"
        />
      </ChoiceQuestion>

      <QuestionBlock fieldId="principal_problema_pedidos">
        <FieldLabel htmlFor="principal_problema_pedidos" required>
          ¿Cuál es el principal problema que tenéis actualmente con los encargos o pedidos?
        </FieldLabel>
        <TextTextarea
          id="principal_problema_pedidos"
          value={data.principal_problema_pedidos}
          onChange={(e) => update("principal_problema_pedidos", e.target.value)}
          invalid={!!errors.principal_problema_pedidos}
          errorId="principal_problema_pedidos-error"
        />
        <FieldError
          id="principal_problema_pedidos-error"
          message={errors.principal_problema_pedidos}
        />
      </QuestionBlock>
    </div>
  );
}

export function StepVenta({ data, errors, update }: Props) {
  return (
    <div className="space-y-5">
      <ChoiceQuestion
        fieldId="interes_parafarmacia"
        label="¿Te gustaría aumentar la venta de productos de parafarmacia?"
      >
        <RadioGroup
          name="interes_parafarmacia"
          options={INTERES_PARAFARMACIA}
          value={data.interes_parafarmacia}
          onChange={(v) =>
            update("interes_parafarmacia", v as SurveyFormData["interes_parafarmacia"])
          }
          error={errors.interes_parafarmacia}
          errorId="interes_parafarmacia-error"
        />
      </ChoiceQuestion>

      <ChoiceQuestion
        fieldId="barreras_venta"
        label="¿Qué dificultades encuentra la farmacia para vender más productos de parafarmacia?"
      >
        <CheckboxGroup
          options={BARRERAS_VENTA}
          values={data.barreras_venta}
          onChange={(v) => update("barreras_venta", v as SurveyFormData["barreras_venta"])}
          error={errors.barreras_venta}
          errorId="barreras_venta-error"
        />
      </ChoiceQuestion>

      <ChoiceQuestion
        fieldId="comunicacion_promociones"
        label="¿Cómo comunica actualmente las promociones?"
      >
        <CheckboxGroup
          options={COMUNICACION_PROMOCIONES}
          values={data.comunicacion_promociones}
          onChange={(v) =>
            update("comunicacion_promociones", v as SurveyFormData["comunicacion_promociones"])
          }
          error={errors.comunicacion_promociones}
          errorId="comunicacion_promociones-error"
        />
      </ChoiceQuestion>

      <ChoiceQuestion
        fieldId="soluciones_digitales"
        label="¿Qué soluciones digitales utiliza actualmente?"
      >
        <CheckboxGroup
          options={SOLUCIONES_DIGITALES}
          values={data.soluciones_digitales}
          onChange={(v) =>
            update("soluciones_digitales", v as SurveyFormData["soluciones_digitales"])
          }
          error={errors.soluciones_digitales}
          errorId="soluciones_digitales-error"
        />
      </ChoiceQuestion>

      <ChoiceQuestion
        fieldId="barreras_digitalizacion"
        label="¿Qué frena actualmente una mayor digitalización?"
      >
        <CheckboxGroup
          options={BARRERAS_DIGITALIZACION}
          values={data.barreras_digitalizacion}
          onChange={(v) =>
            update("barreras_digitalizacion", v as SurveyFormData["barreras_digitalizacion"])
          }
          error={errors.barreras_digitalizacion}
          errorId="barreras_digitalizacion-error"
        />
      </ChoiceQuestion>
    </div>
  );
}

export function StepPrioridades({ data, errors, update }: Props) {
  return (
    <div className="space-y-5">
      <ChoiceQuestion
        fieldId="principales_problemas"
        label="Selecciona los tres problemas que más afectan actualmente a tu farmacia"
        hint={
          <p className="mb-2 text-xs text-gray-500">
            Seleccionados: {data.principales_problemas.length}/3
          </p>
        }
      >
        <CheckboxGroup
          options={PRINCIPALES_PROBLEMAS}
          values={data.principales_problemas}
          onChange={(v) =>
            update("principales_problemas", v as SurveyFormData["principales_problemas"])
          }
          error={errors.principales_problemas}
          errorId="principales_problemas-error"
          max={3}
        />
      </ChoiceQuestion>

      <QuestionBlock fieldId="problema_eliminaria">
        <FieldLabel htmlFor="problema_eliminaria" required>
          Si pudieras eliminar mañana un único problema de la farmacia, ¿cuál sería?
        </FieldLabel>
        <TextTextarea
          id="problema_eliminaria"
          value={data.problema_eliminaria}
          onChange={(e) => update("problema_eliminaria", e.target.value)}
          invalid={!!errors.problema_eliminaria}
          errorId="problema_eliminaria-error"
        />
        <FieldError id="problema_eliminaria-error" message={errors.problema_eliminaria} />
      </QuestionBlock>

      <QuestionBlock fieldId="tarea_mas_tiempo">
        <FieldLabel htmlFor="tarea_mas_tiempo" required>
          ¿Qué tarea te hace perder más tiempo cada día?
        </FieldLabel>
        <TextTextarea
          id="tarea_mas_tiempo"
          value={data.tarea_mas_tiempo}
          onChange={(e) => update("tarea_mas_tiempo", e.target.value)}
          invalid={!!errors.tarea_mas_tiempo}
          errorId="tarea_mas_tiempo-error"
        />
        <FieldError id="tarea_mas_tiempo-error" message={errors.tarea_mas_tiempo} />
      </QuestionBlock>

      <QuestionBlock fieldId="uso_hora_ahorrada">
        <FieldLabel htmlFor="uso_hora_ahorrada">
          Si tu equipo ahorrara una hora diaria, ¿a qué dedicaríais ese tiempo?
        </FieldLabel>
        <TextTextarea
          id="uso_hora_ahorrada"
          value={data.uso_hora_ahorrada}
          onChange={(e) => update("uso_hora_ahorrada", e.target.value)}
          invalid={!!errors.uso_hora_ahorrada}
          errorId="uso_hora_ahorrada-error"
        />
        <FieldError id="uso_hora_ahorrada-error" message={errors.uso_hora_ahorrada} />
      </QuestionBlock>

      <QuestionBlock fieldId="reto_dos_anos">
        <FieldLabel htmlFor="reto_dos_anos">
          ¿Cuál consideras que será el mayor reto de tu farmacia durante los próximos dos años?
        </FieldLabel>
        <TextTextarea
          id="reto_dos_anos"
          value={data.reto_dos_anos}
          onChange={(e) => update("reto_dos_anos", e.target.value)}
          invalid={!!errors.reto_dos_anos}
          errorId="reto_dos_anos-error"
        />
        <FieldError id="reto_dos_anos-error" message={errors.reto_dos_anos} />
      </QuestionBlock>
    </div>
  );
}

export function StepComercial({ data, errors, update }: Props) {
  return (
    <div className="space-y-5">
      <p className="rounded-xl bg-[#F7F9FA] p-3 text-sm text-gray-600">
        Nos gustaría entender mejor qué modelo tendría sentido para una farmacia como la tuya.
      </p>

      <ChoiceQuestion
        fieldId="precio_mensual_razonable"
        label="Si una solución como esta resolviera realmente los problemas que has indicado, ¿qué cuota mensual te parecería razonable para tu farmacia?"
      >
        <RadioGroup
          name="precio_mensual_razonable"
          options={PRECIO_MENSUAL_RAZONABLE}
          value={data.precio_mensual_razonable}
          onChange={(v) =>
            update(
              "precio_mensual_razonable",
              v as SurveyFormData["precio_mensual_razonable"]
            )
          }
          error={errors.precio_mensual_razonable}
          errorId="precio_mensual_razonable-error"
        />
      </ChoiceQuestion>

      <ChoiceQuestion
        fieldId="precio_maximo_aceptable"
        label="¿A partir de qué precio mensual considerarías que deja de compensarte?"
      >
        <RadioGroup
          name="precio_maximo_aceptable"
          options={PRECIO_MAXIMO_ACEPTABLE}
          value={data.precio_maximo_aceptable}
          onChange={(v) =>
            update(
              "precio_maximo_aceptable",
              v as SurveyFormData["precio_maximo_aceptable"]
            )
          }
          error={errors.precio_maximo_aceptable}
          errorId="precio_maximo_aceptable-error"
        />
      </ChoiceQuestion>

      <ChoiceQuestion
        fieldId="modelo_pago_preferido"
        label="¿Cómo preferirías pagar una solución como esta?"
      >
        <RadioGroup
          name="modelo_pago_preferido"
          options={MODELO_PAGO_PREFERIDO}
          value={data.modelo_pago_preferido}
          onChange={(v) =>
            update("modelo_pago_preferido", v as SurveyFormData["modelo_pago_preferido"])
          }
          error={errors.modelo_pago_preferido}
          errorId="modelo_pago_preferido-error"
        />
      </ChoiceQuestion>

      <ChoiceQuestion
        fieldId="intencion_prueba_30_dias"
        label="Si esta solución resolviera realmente los problemas que has indicado, ¿estarías dispuesto/a a probarla durante 30 días sin compromiso?"
      >
        <RadioGroup
          name="intencion_prueba_30_dias"
          options={INTENCION_PRUEBA_30_DIAS}
          value={data.intencion_prueba_30_dias}
          onChange={(v) =>
            update(
              "intencion_prueba_30_dias",
              v as SurveyFormData["intencion_prueba_30_dias"]
            )
          }
          error={errors.intencion_prueba_30_dias}
          errorId="intencion_prueba_30_dias-error"
        />
      </ChoiceQuestion>
    </div>
  );
}

export function StepSoluciones({
  data,
  errors,
  update,
  bonosDisponibles = true,
}: Props & { bonosDisponibles?: boolean }) {
  return (
    <div className="space-y-5">
      <p className="rounded-xl bg-[#F7F9FA] p-3 text-sm text-gray-600">
        Valora la utilidad potencial de cada idea para tu farmacia (1 a 5). No implica
        contratación.
      </p>
      <ScaleInput
        fieldId="valoracion_catalogo"
        label="Que el cliente pueda consultar productos, promociones y disponibilidad antes de acudir"
        value={data.valoracion_catalogo}
        onChange={(n) => update("valoracion_catalogo", n)}
        error={errors.valoracion_catalogo}
      />
      <ScaleInput
        fieldId="valoracion_pedidos"
        label="Recibir los encargos de los clientes de forma ordenada en un único sistema"
        value={data.valoracion_pedidos}
        onChange={(n) => update("valoracion_pedidos", n)}
        error={errors.valoracion_pedidos}
      />
      <ScaleInput
        fieldId="valoracion_avisos"
        label="Avisar automáticamente al cliente cuando su pedido esté preparado"
        value={data.valoracion_avisos}
        onChange={(n) => update("valoracion_avisos", n)}
        error={errors.valoracion_avisos}
      />
      <ScaleInput
        fieldId="valoracion_asistente"
        label="Disponer de un asistente que responda preguntas frecuentes y derive las importantes"
        value={data.valoracion_asistente}
        onChange={(n) => update("valoracion_asistente", n)}
        error={errors.valoracion_asistente}
      />
      <ScaleInput
        fieldId="valoracion_kiosco"
        label="Ofrecer en la farmacia una pantalla o kiosco para consultar productos y preparar pedidos"
        value={data.valoracion_kiosco}
        onChange={(n) => update("valoracion_kiosco", n)}
        error={errors.valoracion_kiosco}
      />

      <ChoiceQuestion
        fieldId="solucion_prioritaria"
        label="¿Cuál de estas soluciones implantarías primero?"
      >
        <RadioGroup
          name="solucion_prioritaria"
          options={SOLUCION_PRIORITARIA}
          value={data.solucion_prioritaria}
          onChange={(v) =>
            update("solucion_prioritaria", v as SurveyFormData["solucion_prioritaria"])
          }
          error={errors.solucion_prioritaria}
          errorId="solucion_prioritaria-error"
        />
      </ChoiceQuestion>

      <ChoiceQuestion
        fieldId="interes_piloto"
        label="¿Estarías dispuesto a participar en una prueba piloto gratuita o con condiciones especiales?"
      >
        <RadioGroup
          name="interes_piloto"
          options={INTERES_PILOTO}
          value={data.interes_piloto}
          onChange={(v) => update("interes_piloto", v as SurveyFormData["interes_piloto"])}
          error={errors.interes_piloto}
          errorId="interes_piloto-error"
        />
      </ChoiceQuestion>

      <div className="space-y-3 border-t border-gray-100 pt-5">
        <h3 className="text-base font-semibold text-[#1A1A1A]">Comunidad y comunicaciones</h3>
        <p className="text-sm text-gray-600">
          Un espacio para compartir experiencias, conocer herramientas, participar en nuevos
          estudios y recibir contenidos relacionados con innovación y gestión farmacéutica.
        </p>
        <label className="flex items-start gap-3 rounded-xl border border-gray-200 p-3 text-sm">
          <input
            type="checkbox"
            className="mt-0.5 accent-[#1ABBB3]"
            checked={data.consentimiento_comunidad}
            onChange={(e) => update("consentimiento_comunidad", e.target.checked)}
          />
          <span>
            Quiero recibir una invitación para participar en la comunidad de farmacias impulsada
            por FarmaFácil.
          </span>
        </label>
        <label className="flex items-start gap-3 rounded-xl border border-gray-200 p-3 text-sm">
          <input
            type="checkbox"
            className="mt-0.5 accent-[#1ABBB3]"
            checked={data.consentimiento_comercial}
            onChange={(e) => update("consentimiento_comercial", e.target.checked)}
          />
          <span>
            Quiero recibir información sobre FarmaFácil, sus servicios, pruebas piloto y
            novedades.
          </span>
        </label>
        <label className="flex items-start gap-3 rounded-xl border border-gray-200 p-3 text-sm">
          <input
            type="checkbox"
            className="mt-0.5 accent-[#1ABBB3]"
            checked={data.consentimiento_informe}
            onChange={(e) => update("consentimiento_informe", e.target.checked)}
          />
          <span>Quiero recibir los resultados o el informe elaborado a partir de este estudio.</span>
        </label>
        <p className="text-xs text-gray-500">
          {bonosDisponibles
            ? "Estos consentimientos son voluntarios y no son condición para recibir el bono."
            : "Estos consentimientos son voluntarios y no condicionan tu participación en el estudio."}
        </p>
      </div>

      <QuestionBlock fieldId="aceptacion_privacidad">
        <label
          className={`flex items-start gap-3 rounded-xl border p-3 text-sm ${
            errors.aceptacion_privacidad
              ? "border-[#e07a3d] bg-[#fff8f3]"
              : "border-[#1ABBB3]/30 bg-[#1ABBB3]/5"
          }`}
        >
          <input
            type="checkbox"
            className="mt-0.5 accent-[#1ABBB3]"
            checked={data.aceptacion_privacidad}
            onChange={(e) => update("aceptacion_privacidad", e.target.checked)}
            aria-invalid={errors.aceptacion_privacidad ? true : undefined}
            aria-describedby={
              errors.aceptacion_privacidad ? "aceptacion_privacidad-error" : undefined
            }
          />
          <span>
            He leído y acepto la{" "}
            <Link href="/privacidad" className="font-semibold text-[#1ABBB3] underline" target="_blank">
              política de privacidad
            </Link>{" "}
            y las{" "}
            <Link
              href="/encuesta-farmacias/condiciones"
              className="font-semibold text-[#1ABBB3] underline"
              target="_blank"
            >
              condiciones de participación en el estudio
            </Link>
            . *
          </span>
        </label>
        <FieldError id="aceptacion_privacidad-error" message={errors.aceptacion_privacidad} />
      </QuestionBlock>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-semibold">Antes de enviar</p>
        <p className="mt-1">
          {bonosDisponibles
            ? "Revisa que tus datos de contacto y de la farmacia sean correctos. El bono de Amazon de 10 € solo se enviará tras validación manual de FarmaFácil."
            : "Revisa que tus datos de contacto y de la farmacia sean correctos antes de enviar tu participación."}
        </p>
      </div>
    </div>
  );
}
