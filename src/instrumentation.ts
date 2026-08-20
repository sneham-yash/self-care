export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  try {
    const tls = await import(/* webpackIgnore: true */ "node:tls");
    tls.setDefaultCACertificates([
      ...tls.getCACertificates(),
      ...tls.getCACertificates("system"),
    ]);
  } catch {
    // Keep Node's default CAs if the OS store is unavailable.
  }
}
