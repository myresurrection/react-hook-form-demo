import { useForm, type SubmitHandler } from 'react-hook-form'
import ErrorMessage from './components/ErrorMessage'

// 1. Tipamos los valores del formulario. React Hook Form usa este tipo
//    para autocompletar los nombres de campo en register(), errors, etc.
type EmailFormValues = {
  to: string
  subject: string
  body: string
}

// Simula una llamada a una API que tarda 2 segundos.
const fakeSend = (data: EmailFormValues) =>
  new Promise<void>((resolve) => setTimeout(() => {
    console.log('Mail "enviado":', data)
    resolve()
  }, 2000))

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 aria-invalid:border-red-400'

function App() {
  // 2. useForm devuelve todo lo necesario:
  //    - register: conecta cada input al formulario (y define sus reglas)
  //    - handleSubmit: valida y, si todo está bien, llama a nuestro onSubmit
  //    - reset: vuelve el formulario a defaultValues
  //    - formState: estado del form (errores, si está enviando, si se envió OK...)
  const {
    register, handleSubmit, reset, formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    defaultValues: { to: '', subject: '', body: '' },
    mode: 'onTouched', // valida al salir del campo, y luego en cada cambio
  })

  // 3. Si onSubmit devuelve una Promise, RHF pone isSubmitting=true
  //    hasta que se resuelva. Así obtenemos el spinner "gratis".
  const onSubmit: SubmitHandler<EmailFormValues> = async (data) => {
    await fakeSend(data)
    reset() // limpia los campos tras el envío
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate // desactiva la validación nativa del navegador; valida RHF
        className="w-full max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow-lg"
      >
        <h1 className="text-2xl font-bold text-slate-800">Nuevo mensaje</h1>

        <div>
          <label htmlFor="to" className="mb-1 block text-sm font-medium text-slate-700">Para</label>
          <input
            id="to"
            type="email"
            placeholder="destinatario@ejemplo.com"
            className={inputClass}
            aria-invalid={!!errors.to}
            // 4. register(nombre, reglas): las reglas incluyen mensaje de error
            {...register('to', {
              required: 'El destinatario es obligatorio',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Ingresá un email válido',
              },
            })}
          />
          {/* 5. El mensaje definido en las reglas llega en errors.<campo>.message */}
          <ErrorMessage message={errors.to?.message} />
        </div>

        <div>
          <label htmlFor="subject" className="mb-1 block text-sm font-medium text-slate-700">Asunto</label>
          <input
            id="subject"
            type="text"
            className={inputClass}
            aria-invalid={!!errors.subject}
            {...register('subject', {
              required: 'El asunto es obligatorio',
              maxLength: { value: 100, message: 'Máximo 100 caracteres' },
            })}
          />
          <ErrorMessage message={errors.subject?.message} />
        </div>

        <div>
          <label htmlFor="body" className="mb-1 block text-sm font-medium text-slate-700">Mensaje</label>
          <textarea
            id="body"
            rows={6}
            className={`${inputClass} resize-y`}
            aria-invalid={!!errors.body}
            {...register('body', {
              required: 'El mensaje no puede estar vacío',
              minLength: { value: 10, message: 'Mínimo 10 caracteres' },
            })}
          />
          <ErrorMessage message={errors.body?.message} />
        </div>

        {isSubmitSuccessful && (
          <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">¡Mail enviado con éxito!</p>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => reset()}
            disabled={isSubmitting}
            className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Limpiar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-70"
          >
            {isSubmitting && (
              <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden />
            )}
            {isSubmitting ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </form>
    </main>
  )
}

export default App
