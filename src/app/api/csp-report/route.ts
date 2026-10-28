import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const MAX_CSP_REPORT_SIZE = 1024; // 1 KB máximo por reporte CSP

export async function POST(req: Request) {
  try {
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_CSP_REPORT_SIZE) {
      return NextResponse.json(
        { status: 'error', error: 'CSP report too large' },
        { status: 413 }
      );
    }

    const body = await req.json();
    const cspReport = body?.['csp-report'];
    if (cspReport) {
      // Validar que el reporte no contenga datos sensibles inesperados
      const reportString = JSON.stringify(cspReport);
      if (reportString.length > MAX_CSP_REPORT_SIZE) {
        return NextResponse.json(
          { status: 'error', error: 'CSP report payload too large' },
          { status: 413 }
        );
      }
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
