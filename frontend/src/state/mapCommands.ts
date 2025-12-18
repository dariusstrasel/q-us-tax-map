// frontend/src/state/mapCommands.ts
export type MapData = Record<string, number>;

export type UploadCsvResult =
  | { ok: true; data: MapData }
  | { ok: false; error: string };

export async function uploadCsvCommand(file: File): Promise<UploadCsvResult> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch('/api/csv/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      let message = 'Failed to upload CSV. Please check the file and try again.';
      try {
        const body = await res.json();
        if (body?.message) {
          message = Array.isArray(body.message)
            ? body.message.join('\n')
            : String(body.message);
        }
      } catch {
        // ignore parse errors
      }
      return { ok: false, error: message };
    }

    const { data } = await res.json();
    return { ok: true, data };
  } catch {
    // Network/backend unavailable
    return {
      ok: false,
      error: 'Network error while uploading CSV. Please try again.',
    };
  }
}