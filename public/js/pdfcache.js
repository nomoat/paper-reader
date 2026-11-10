// PDFs kept in this browser (IndexedDB), by paper key. A key's PDF never changes, so a kept copy
// is used as is; when the browser has cleared it, the reader downloads the PDF again.
const db = () => new Promise((resolve, reject) => {
  const r = indexedDB.open("xyznot", 1);
  r.onupgradeneeded = () => r.result.createObjectStore("pdfs");
  r.onsuccess = () => resolve(r.result);
  r.onerror = () => reject(r.error);
});
async function run(mode, fn) {
  const t = (await db()).transaction("pdfs", mode);
  const req = fn(t.objectStore("pdfs"));
  return new Promise((resolve, reject) => { t.oncomplete = () => resolve(req.result); t.onerror = t.onabort = () => reject(t.error); });
}
export const keptPdf = (key) => run("readonly", (s) => s.get(key)).catch(() => null);
export const keepPdf = (key, data) => run("readwrite", (s) => s.put(data, key)).catch(() => {});
