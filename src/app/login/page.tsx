import LoginForm from './LoginForm';

type SearchParams = {
  error?: string | string[];
  message?: string | string[];
};

type Props = {
  searchParams: Promise<SearchParams>;
};

const errorMessages: Record<string, string> = {
  missing: 'Completa los campos obligatorios.',
  password: 'La contraseña debe tener al menos 8 caracteres.',
  login: 'No se pudo iniciar sesión. Comprueba tu correo y contraseña.',
  confirmation: 'No se pudo confirmar la cuenta. Abre el enlace más reciente que recibiste por correo o solicita uno nuevo.',
  logout: 'No se pudo cerrar la sesión. Inténtalo de nuevo.',
  configuration: 'El registro no está configurado para este entorno.',
  signup: 'No se pudo crear la cuenta. Comprueba los datos e inténtalo de nuevo. Si el problema continúa, revisa los logs del servidor.',
};

const statusMessages: Record<string, string> = {
  'check-email': 'La cuenta se registró. Revisa tu correo para confirmar la dirección antes de iniciar sesión. En el entorno local, revisa Mailpit.',
  'signed-out': 'Has cerrado la sesión correctamente.',
  sent: 'Si existe una cuenta para ese correo, recibirás instrucciones para restablecer la contraseña.',
};

function firstParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const errorCode = firstParam(params.error);
  const messageCode = firstParam(params.message);

  const error = errorCode
    ? errorMessages[errorCode] ?? 'No se pudo completar la solicitud. Inténtalo de nuevo.'
    : undefined;
  const message = messageCode ? statusMessages[messageCode] : undefined;

  return <LoginForm error={error} message={message} />;
}
