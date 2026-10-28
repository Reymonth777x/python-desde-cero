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
  password: 'La contrase├▒a debe tener al menos 8 caracteres.',
  login: 'No se pudo iniciar sesi├│n. Comprueba tu correo y contrase├▒a.',
  confirmation: 'No se pudo confirmar la cuenta. Abre el enlace m├ís reciente que recibiste por correo o solicita uno nuevo.',
  logout: 'No se pudo cerrar la sesi├│n. Int├®ntalo de nuevo.',
  configuration: 'El registro no est├í configurado para este entorno.',
  signup: 'No se pudo crear la cuenta. Comprueba los datos e int├®ntalo de nuevo. Si el problema contin├║a, revisa los logs del servidor.',
};

const statusMessages: Record<string, string> = {
  'check-email': 'La cuenta se registr├│. Revisa tu correo para confirmar la direcci├│n antes de iniciar sesi├│n. En el entorno local, revisa Mailpit.',
  'signed-out': 'Has cerrado la sesi├│n correctamente.',
  sent: 'Si existe una cuenta para ese correo, recibir├ís instrucciones para restablecer la contrase├▒a.',
};

function firstParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const errorCode = firstParam(params.error);
  const messageCode = firstParam(params.message);

  const error = errorCode
    ? Object.prototype.hasOwnProperty.call(errorMessages, errorCode)
      ? errorMessages[errorCode]
      : 'No se pudo completar la solicitud. Int├®ntalo de nuevo.'
    : undefined;
  const message =
    messageCode && Object.prototype.hasOwnProperty.call(statusMessages, messageCode)
      ? statusMessages[messageCode]
      : undefined;

  return <LoginForm error={error} message={message} />;
}
