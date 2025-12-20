import type { Request, Response } from 'express';

 export const getLandingPage = (_req: Request, res: Response) => {
  res
    .status(200)
    .set('Cache-Control', 'no-store')
    .type('html')
    .send(`
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>${process.env.APP_NAME || 'Banking API'}</title>
          <style>
            body{font-family:system-ui,-apple-system,Segoe UI,Roboto;max-width:920px;margin:44px auto;padding:0 16px;line-height:1.6}
            .card{border:1px solid #e8e8e8;border-radius:14px;padding:18px;box-shadow:0 2px 10px rgba(0,0,0,.04)}
            code{background:#f4f4f4;padding:2px 6px;border-radius:6px}
            .muted{color:#666}
            ul{margin:10px 0 0 18px}
            .row{display:flex;gap:12px;flex-wrap:wrap}
            .pill{border:1px solid #e8e8e8;border-radius:999px;padding:6px 10px;font-size:14px}
          </style>
        </head>
        <body>
          <h1>${process.env.APP_NAME || 'Banking API'}</h1>
          <p class="muted">Secure backend service for banking operations.</p>

          <div class="card">
            <div class="row">
              <span class="pill"><b>Status:</b> Online ✅</span>
              <span class="pill"><b>Version:</b> ${process.env.APP_VERSION || '1.0.0'}</span>
              <span class="pill"><b>Environment:</b> ${process.env.NODE_ENV || 'development'}</span>
            </div>

            <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />

            <p><b>Available routes</b></p>
            <ul>
              <li><code>/api</code> — API routes (protected where applicable)</li>
              <li><code>/health</code> — service health check</li>
            </ul>

            <p class="muted" style="margin-top:14px">
              Note: Detailed system information is intentionally not exposed on the public landing page.
            </p>
          </div>
        </body>
      </html>
    `);
};
