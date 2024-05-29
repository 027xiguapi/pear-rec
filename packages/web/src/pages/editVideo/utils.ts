export function assetsPrefix<T extends string[] | Record<string, string>>(assetsURL: T): T {
  const prefix = process.env.NODE_ENV === 'development' ? '/' : '/WebAV/';
  if (Array.isArray(assetsURL)) {
    return assetsURL.map((url) => `${prefix}${url}`) as T;
  }

  return Object.fromEntries(Object.entries(assetsURL).map(([k, v]) => [k, `${prefix}${v}`])) as T;
}

export async function createFileWriter(extName = 'mp4'): Promise<FileSystemWritableFileStream> {
  const fileHandle = await window.showSaveFilePicker({
    suggestedName: `WebAV-export-${Date.now()}.${extName}`,
  });
  return fileHandle.createWritable();
}
