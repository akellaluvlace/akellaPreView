// Tiny STORED-only ZIP writer. 2026-05-20 — added for the Publish flow
// (drop a hostable site onto Netlify Drop). Hand-rolled rather than
// pulling jszip / fflate because:
//   1. Dropin's locked stack rule forbids new dependencies.
//   2. We only ever write ~1-3 small text files (index.html + optional
//      README + optional 404.html). The STORED (no-compression) format
//      ships those files raw, costs ~150 LOC including CRC-32.
//   3. ZIP-STORED is a frozen, well-documented format. No moving parts.
//
// File-format reference: PKWARE APPNOTE 6.3.10, sections 4.3.6
// (local file header), 4.3.12 (central directory header), 4.3.16
// (end-of-central-directory). CRC-32 = ISO 3309 polynomial 0xEDB88320.
// Bit 11 of the general purpose flag (0x0800) declares filename bytes
// are UTF-8 — required by APPNOTE 4.4.4 for non-ASCII filenames or
// strict extractors will mis-decode CP-437. We set it unconditionally.
//
// Caller passes string contents; we encode to UTF-8 here. Returns a
// Blob with type "application/zip" suitable for triggering a download
// via the standard <a href={URL.createObjectURL(blob)} download> path.

export interface ZipEntry {
  path: string;
  content: string;
}

// IBM CRC-32 lookup table. Built once on module load.
const CRC32_TABLE: Uint32Array = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    c = CRC32_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

// MS-DOS date/time. ZIP format uses a 1980-epoch packed-bitfield;
// recent files all serialize to the same constant (we don't care about
// the timestamp, only that it's valid). Picked 2026-01-01 00:00:00.
function dosDateTime(): { date: number; time: number } {
  const year = 2026 - 1980;
  const month = 1;
  const day = 1;
  const date = ((year & 0x7f) << 9) | ((month & 0x0f) << 5) | (day & 0x1f);
  const time = 0;
  return { date, time };
}

function writeU16(view: DataView, offset: number, value: number) {
  view.setUint16(offset, value, /*littleEndian*/ true);
}

function writeU32(view: DataView, offset: number, value: number) {
  view.setUint32(offset, value, /*littleEndian*/ true);
}

export function buildZip(entries: ZipEntry[]): Blob {
  const encoder = new TextEncoder();
  // Per-entry encoded data + local header bytes, accumulated as we go.
  const chunks: Uint8Array[] = [];
  // Saved for the central directory pass at the end.
  const records: Array<{
    pathBytes: Uint8Array;
    contentBytes: Uint8Array;
    crc: number;
    localHeaderOffset: number;
  }> = [];
  const { date, time } = dosDateTime();
  let cursor = 0;

  for (const entry of entries) {
    const pathBytes = encoder.encode(entry.path);
    const contentBytes = encoder.encode(entry.content);
    const crc = crc32(contentBytes);
    const localHeaderOffset = cursor;
    // 30 bytes fixed + variable filename + zero extra fields.
    const header = new ArrayBuffer(30);
    const view = new DataView(header);
    writeU32(view, 0, 0x04034b50); // local file header signature
    writeU16(view, 4, 20); // version needed
    writeU16(view, 6, 0x0800); // general purpose bit flag — UTF-8 filename
    writeU16(view, 8, 0); // STORED (no compression)
    writeU16(view, 10, time);
    writeU16(view, 12, date);
    writeU32(view, 14, crc);
    writeU32(view, 18, contentBytes.length); // compressed size (= raw for STORED)
    writeU32(view, 22, contentBytes.length); // uncompressed size
    writeU16(view, 26, pathBytes.length);
    writeU16(view, 28, 0); // extra field length
    chunks.push(new Uint8Array(header), pathBytes, contentBytes);
    cursor += 30 + pathBytes.length + contentBytes.length;
    records.push({ pathBytes, contentBytes, crc, localHeaderOffset });
  }

  const centralDirOffset = cursor;
  for (const r of records) {
    // 46 bytes fixed + variable filename.
    const header = new ArrayBuffer(46);
    const view = new DataView(header);
    writeU32(view, 0, 0x02014b50); // central directory header signature
    writeU16(view, 4, 20); // version made by
    writeU16(view, 6, 20); // version needed
    writeU16(view, 8, 0x0800); // general purpose bit flag — UTF-8 filename
    writeU16(view, 10, 0); // STORED
    writeU16(view, 12, time);
    writeU16(view, 14, date);
    writeU32(view, 16, r.crc);
    writeU32(view, 20, r.contentBytes.length);
    writeU32(view, 24, r.contentBytes.length);
    writeU16(view, 28, r.pathBytes.length);
    writeU16(view, 30, 0); // extra field length
    writeU16(view, 32, 0); // file comment length
    writeU16(view, 34, 0); // disk number start
    writeU16(view, 36, 0); // internal file attributes
    writeU32(view, 38, 0); // external file attributes
    writeU32(view, 42, r.localHeaderOffset);
    chunks.push(new Uint8Array(header), r.pathBytes);
    cursor += 46 + r.pathBytes.length;
  }
  const centralDirSize = cursor - centralDirOffset;

  // End of central directory record. 22 bytes, no comment.
  const eocd = new ArrayBuffer(22);
  const eocdView = new DataView(eocd);
  writeU32(eocdView, 0, 0x06054b50); // EOCD signature
  writeU16(eocdView, 4, 0); // disk number
  writeU16(eocdView, 6, 0); // disk where CD starts
  writeU16(eocdView, 8, records.length); // entries on this disk
  writeU16(eocdView, 10, records.length); // total entries
  writeU32(eocdView, 12, centralDirSize);
  writeU32(eocdView, 16, centralDirOffset);
  writeU16(eocdView, 20, 0); // zip file comment length
  chunks.push(new Uint8Array(eocd));

  return new Blob(chunks as BlobPart[], { type: "application/zip" });
}
