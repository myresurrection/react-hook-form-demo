// Componente reutilizable para mostrar errores de validación.
// Recibe el mensaje directamente desde `errors.<campo>?.message` de React Hook Form.
// Si no hay mensaje, no renderiza nada.
type Props = {
  message?: string
}

export default function ErrorMessage({ message }: Props) {
  if (!message) return null

  return (
    <p role="alert" className="mt-1 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-sm text-red-700">
      {message}
    </p>
  )
}
