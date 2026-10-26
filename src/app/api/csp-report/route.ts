import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cspReport = body?.['csp-report'];
    if (cspReport) {
      // En desarrollo, se imprime en consola para revisión.
      // En producción, se enviaría a un servicio de logging o se almacenaría.
      if (process.env.NODE_ENV !== 'production') {
        console.log('[CSP Report]', JSON.stringify(cspReport, null, 2));
      }
    }
    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch {
    return NextResponse.json({ status: 'error' }, { status: 400 });
  }
}
