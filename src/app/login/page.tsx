import LoginForm from './LoginForm';
import { safeNext } from '@/lib/safe-next';

type SearchParams = {
  error?: string | string[];
  message?: string | string[];
  next?: string | string[];
};

type Props = { searchParams: Promise<SearchParams> };

const errorMessages: Record<string, string> = {
  missing: 'Completa los campos obligatorios.',
  password: 'La contraseña debe tener al menos 8 caracteres.',
  login: 'No se pudo iniciar sesión. Comprueba tu correo y contraseña.',
  confirmation: 'No se pudo confirmar la cuenta. Abre el enlace más reciente que recibiste por correo o solicita uno nuevo.',
  logout: 'No se pudo cerrar la sesión. Inténtalo de nuevo.',
  configuration: 'El registro no está configurado para este entorno.',
  signup: 'No se pudo crear la cuenta. Revisa tus datos e inténtalo de nuevo.',
  invitation: 'El código de invitación no es válido, venció o ya fue utilizado.',
};

const statusMessages: Record<string, string> = {
  'check-email': 'Cuenta creada. Revisa tu correo y confirma tu dirección para entrar.',
  'signed-out': 'Cerraste sesión correctamente.',
  sent: 'Si existe una cuenta para ese correo, recibirás instrucciones para restablecer la contraseña.',
  'password-updated': 'Contraseña actualizada. Ya puedes iniciar sesión.',
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
      : 'No se pudo completar la solicitud. Inténtalo de nuevo.'
    : undefined;
  const message = messageCode && Object.prototype.hasOwnProperty.call(statusMessages, messageCode)
    ? statusMessages[messageCode]
    : undefined;

  return <LoginForm error={error} message={message} next={safeNext(firstParam(params.next), '')} />;
}
