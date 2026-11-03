import { marked } from 'marked';
import * as XLSX from 'xlsx';

export interface SchoolSignInfo {
  namaSekolah?: string;
  npsn?: string;
  alamatSekolah?: string;
  dinasPendidikan?: string;
  cabangDinas?: string;
  namaGuru?: string;
  nipGuru?: string;
  kepalaSekolah?: string;
  nipKepalaSekolah?: string;
  pengawasSekolah?: string;
  nipPengawas?: string;
  kotaKabupaten?: string;
  semester?: string;
  tahunAjaran?: string;
  docType?: string;
  peranGuru?: string;
  faseKelas?: string;
  mataPelajaran?: string;
  daftarIsiPerangkat?: string[];
}

/**
 * Strips any messy AI-generated trailing signature blocks or markdown tables
 * from the content, ensuring only the clean official signature is displayed.
 */
export function stripMessyMarkdownSignatures(text: string): string {
  if (!text) return '';

  const signatureCutoffPatterns = [
    /\n---\s*\n+<br>\s*<div align=["']right["']>[\s\S]*$/i,
    /\n---\s*\n+\|?\s*Mengetahui[\s\S]*$/i,
    /\n\s*\|\s*Mengetahui[,\s<br>]+[\s\S]*$/i,
    /\n\s*Mengetahui,\s*\n+\s*(?:\*\*)?Kepala[\s\S]*$/i,
    /\n\s*Disetujui dan Disahkan oleh:[\s\S]*$/i,
    /\n\s*###\s*[A-Z0-9.\s]*LEMBAR PENGESAHAN[\s\S]*$/i,
    /\n\s*\(Tanda Tangan & Cap Sekolah\)[\s\S]*$/i,
    /\n\s*\(Tanda\s+Tangan\s+&\s+Cap\s+Sekolah\)[\s\S]*$/i,
  ];

  let cleaned = text;
  for (const pattern of signatureCutoffPatterns) {
    if (pattern.test(cleaned)) {
      cleaned = cleaned.replace(pattern, '').trimEnd();
    }
  }

  return cleaned;
}

/**
 * Strips duplicate AI-generated markdown headers/titles at the top of content
 * to ensure that Kop/Header only appears once (e.g., Kop PROTA, PROMES, ATP, KKTP).
 */
export function stripDuplicateHeaders(text: string, docType?: string): string {
  if (!text) return '';
  let cleaned = text.trim();

  if (docType === 'PROTA') {
    // Strip leading '# PROGRAM TAHUNAN (PROTA)', '## PROGRAM TAHUNAN', 'Kelas: ...', 'Mapel: ...'
    cleaned = cleaned.replace(/^#*\s*PROGRAM\s+TAHUNAN(?:\s*\(PROTA\))?[\s\S]*?(?=\|\s*No|\|\s*NO|\|)/i, '');
    cleaned = cleaned.replace(/^(?:Kelas|Mapel|Mata\s+Pelajaran|Tahun\s+Pelajaran|Alokasi\s+Waktu)\s*:.*$/gim, '').trim();
  } else if (docType === 'PROMES') {
    cleaned = cleaned.replace(/^#*\s*PROGRAM\s+SEMESTER(?:\s*\(PROSEM\))?[\s\S]*?(?=\|\s*No|\|\s*NO|\|)/i, '');
    cleaned = cleaned.replace(/^(?:Kelas|Mapel|Mata\s+Pelajaran|Tahun\s+Pelajaran|Semester)\s*:.*$/gim, '').trim();
  } else if (docType === 'ATP') {
    cleaned = cleaned.replace(/^#*\s*ALUR\s+TUJUAN\s+PEMBELAJARAN(?:\s*\(ATP\))?[\s\S]*?(?=\|\s*No|\|\s*NO|\|)/i, '');
    cleaned = cleaned.replace(/^(?:Nama\s+Penyusun|NIP|Kelas|Mata\s+Pelajaran|Tahun\s+Pelajaran|Capaian\s+Pembelajaran)\s*:.*$/gim, '').trim();
  } else if (docType === 'KKTP') {
    cleaned = cleaned.replace(/^#*\s*(?:KKTP|KRITERIA\s+KETERCAPAIAN)[\s\S]*?(?=\|\s*No|\|\s*NO|\|)/i, '');
    cleaned = cleaned.replace(/^(?:Nama\s+Sekolah|Kelas|Semester|Tahun\s+Pelajaran|Mata\s+Pelajaran)\s*:.*$/gim, '').trim();
  } else if (docType === 'JURNAL') {
    cleaned = cleaned.replace(/^#*\s*JURNAL[\s\S]*?(?=\|\s*No|\|\s*NO|\|)/i, '');
    cleaned = cleaned.replace(/^(?:Nama\s+Sekolah|Kelas|Semester|Tahun\s+Pelajaran|Mata\s+Pelajaran|Nama\s+Guru)\s*:.*$/gim, '').trim();
  }

  return cleaned.trim();
}

/**
 * Converts Markdown content into a standalone Word-compatible HTML file and triggers a .doc download.
 * Formatted strictly according to Indonesian Dinas Pendidikan / Kemendikbudristek school administration standards.
 */
export function exportToWordDoc(
  title: string,
  markdownContent: string,
  signInfo?: SchoolSignInfo
) {
  // Configure marked options
  marked.setOptions({
    gfm: true,
    breaks: true,
  });

  const docType = signInfo?.docType;
  const cleanedSignatures = stripMessyMarkdownSignatures(markdownContent);
  const cleanedMarkdown = stripDuplicateHeaders(cleanedSignatures, docType);
  const rawHtml = marked.parse(cleanedMarkdown) as string;

  const school = signInfo?.namaSekolah || 'SATUAN PENDIDIKAN';
  const npsn = signInfo?.npsn ? `NPSN: ${signInfo.npsn}` : 'NPSN: ....................';
  const alamat = signInfo?.alamatSekolah || 'Jalan Pendidikan No. 1, Kota Pelajar';
  const dinas = signInfo?.dinasPendidikan || 'DINAS PENDIDIKAN DAN KEBUDAYAAN';
  const cabang = signInfo?.cabangDinas ? `<p style="margin:2px 0; font-size:10.5pt; font-weight:bold;">${signInfo.cabangDinas.toUpperCase()}</p>` : '';
  const kota = signInfo?.kotaKabupaten || 'Indonesia';
  const guru = signInfo?.namaGuru || 'MARWINI, A.Ma';
  const nipGuru = signInfo?.nipGuru ? `NIP : ${signInfo.nipGuru.replace(/^NIP\.?\s*:?\s*/i, '')}` : 'NIP : -';
  const kepsek = signInfo?.kepalaSekolah || 'HADJRIN, S.Pd';
  const nipKepsek = signInfo?.nipKepalaSekolah ? `NIP : ${signInfo.nipKepalaSekolah.replace(/^NIP\.?\s*:?\s*/i, '')}` : 'NIP : -';
  const pengawas = signInfo?.pengawasSekolah || 'Pengawas Pembina Dinas Pendidikan';
  const nipPengawas = signInfo?.nipPengawas ? `NIP : ${signInfo.nipPengawas.replace(/^NIP\.?\s*:?\s*/i, '')}` : 'NIP : -';
  const peranGuruLabel = signInfo?.peranGuru || 'Guru Kelas';
  const kelasStr = signInfo?.faseKelas ? signInfo.faseKelas.replace(/[^0-9IVX]/gi, '').trim() || signInfo.faseKelas : '1';
  const mapelStr = signInfo?.mataPelajaran || 'Mata Pelajaran';

  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const isPromes = docType === 'PROMES';
  const isProta = docType === 'PROTA';
  const isAtp = docType === 'ATP';
  const isKktp = docType === 'KKTP';
  const isSampul = docType === 'SAMPUL';
  const isBankSoal = docType === 'BANK_SOAL';

  let bodyContent = '';

  if (isSampul) {
    // Sampul Cover Page Word Export
    const items = signInfo?.daftarIsiPerangkat && signInfo.daftarIsiPerangkat.length > 0
      ? signInfo.daftarIsiPerangkat
      : [
          'Kalender Pendidikan',
          'Modul Ajar (MA)',
          'Alur Tujuan Pembelajaran (ATP)',
          'Program Semester (PROSEM)',
          'Program Tahunan (PROTA)',
          'Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)',
        ];

    const checklistRows = items.map((it) => `
      <div style="font-size:11pt; margin-bottom:8px; display:flex; align-items:center;">
        <span style="font-family:'Segoe UI Emoji',sans-serif; color:#1d4ed8; margin-right:8px; font-weight:bold;">[ √ ]</span>
        <span>${it}</span>
      </div>
    `).join('');

    bodyContent = `
      <div style="border: 4px double #1e3a8a; padding: 40px 30px; text-align: center; min-height: 850px; background-color: #ffffff;">
        <div style="margin-bottom: 20px;">
          <p style="font-size: 11pt; font-weight: bold; text-transform: uppercase; margin: 0; color: #1e3a8a;">
            KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI
          </p>
          <p style="font-size: 12pt; font-weight: bold; text-transform: uppercase; margin: 4px 0 0 0; color: #0f172a;">
            ${dinas.toUpperCase()}
          </p>
          <h2 style="font-size: 14pt; font-weight: 900; text-transform: uppercase; margin: 4px 0 0 0; color: #0f172a;">
            ${school.toUpperCase()}
          </h2>
        </div>

        <div style="margin: 45px 0 35px 0;">
          <h1 style="font-size: 20pt; font-weight: 900; text-transform: uppercase; line-height: 1.3; margin: 0; color: #0f172a; letter-spacing: 1px;">
            PERANGKAT PEMBELAJARAN<br>KURIKULUM MERDEKA
          </h1>
          <p style="font-size: 14pt; font-weight: bold; margin-top: 12px; color: #1e3a8a;">
            Kelas ${kelasStr}
          </p>
        </div>

        <div style="margin: 30px auto; max-width: 380px; text-align: left; font-size: 11pt; font-weight: bold; border-top: 1px solid #cbd5e1; border-bottom: 1px solid #cbd5e1; padding: 12px 10px;">
          <table style="width: 100%; border: none;">
            <tr>
              <td style="width: 35%; border: none; padding: 3px 0;">Nama Guru</td>
              <td style="border: none; padding: 3px 0;">: ${guru}</td>
            </tr>
            <tr>
              <td style="border: none; padding: 3px 0;">NIP</td>
              <td style="border: none; padding: 3px 0;">: ${nipGuru.replace(/^NIP\s*:\s*/i, '')}</td>
            </tr>
          </table>
        </div>

        <div style="margin: 25px auto; max-width: 420px; border: 2px solid #0f172a; padding: 18px 24px; text-align: left; background-color: #f8fafc;">
          <p style="font-size: 10.5pt; font-weight: bold; margin: 0 0 12px 0; text-transform: uppercase; color: #1e293b; border-bottom: 1px solid #94a3b8; padding-bottom: 4px;">
            DAFTAR ISI BERKAS PERANGKAT:
          </p>
          ${checklistRows}
        </div>

        <div style="margin-top: 40px;">
          <p style="font-size: 11pt; font-weight: bold; text-transform: uppercase; margin: 0; color: #334155;">
            TAHUN PELAJARAN ${signInfo?.tahunAjaran || '2024/2025'}
          </p>
        </div>
      </div>
    `;
  } else if (isProta) {
    bodyContent = `
      <!-- FORMAT PERSIS FOTO UNTUK PROTA (HANYA 1 KOP) -->
      <div class="custom-title-box">
        PROGRAM TAHUNAN (PROTA)
      </div>
      <div class="custom-meta">
        <div>Kelas &nbsp;: ${kelasStr}</div>
        <div>Mapel : ${mapelStr}</div>
      </div>
      ${rawHtml}
      <div style="margin-top: 35px; width: 100%;">
        <table style="width: 100%; border: none;">
          <tr>
            <td style="width: 45%; text-align: center; border: none; vertical-align: top;">
              Mengetahui<br>
              <strong>Kepala Sekolah</strong><br>
              <div class="signature-space"></div>
              <strong><u>${kepsek}</u></strong><br>
              ${nipKepsek}
            </td>
            <td style="width: 10%; border: none;"></td>
            <td style="width: 45%; text-align: center; border: none; vertical-align: top;">
              <strong>${peranGuruLabel}</strong><br>
              <br>
              <div class="signature-space"></div>
              <strong><u>${guru}</u></strong><br>
              ${nipGuru}
            </td>
          </tr>
        </table>
      </div>
    `;
  } else if (isPromes) {
    bodyContent = `
      <!-- FORMAT PERSIS FOTO UNTUK PROMES (PROSEM) -->
      <div class="custom-title-box">
        PROGRAM SEMESTER (PROSEM)
      </div>
      <div class="custom-meta">
        <div>Kelas &nbsp;: ${kelasStr}</div>
        <div>Mapel : ${mapelStr.toUpperCase()}</div>
      </div>
      ${rawHtml}
      <div style="margin-top: 35px; width: 100%;">
        <table style="width: 100%; border: none;">
          <tr>
            <td style="width: 45%; text-align: center; border: none; vertical-align: top;">
              Mengetahui<br>
              <strong>Kepala Sekolah</strong><br>
              <div class="signature-space"></div>
              <strong><u>${kepsek}</u></strong><br>
              ${nipKepsek}
            </td>
            <td style="width: 10%; border: none;"></td>
            <td style="width: 45%; text-align: center; border: none; vertical-align: top;">
              <strong>${peranGuruLabel}</strong><br>
              <br>
              <div class="signature-space"></div>
              <strong><u>${guru}</u></strong><br>
              ${nipGuru}
            </td>
          </tr>
        </table>
      </div>
    `;
  } else if (isAtp) {
    bodyContent = `
      <!-- FORMAT PERSIS FOTO UNTUK ALUR TUJUAN PEMBELAJARAN (ATP) -->
      <div class="custom-title-box">
        ALUR TUJUAN PEMBELAJARAN (ATP)
      </div>
      <div class="custom-meta" style="font-family: monospace; font-size: 10pt;">
        <div>Nama Penyusun : ${guru}</div>
        <div>NIP &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; : ${nipGuru.replace(/^NIP\s*:\s*/i, '')}</div>
        <div>Kelas &nbsp; &nbsp; &nbsp; &nbsp; : ${kelasStr}</div>
        <div>Mata Pelajaran: ${mapelStr}</div>
      </div>
      ${rawHtml}
      <div style="margin-top: 35px; width: 100%;">
        <table style="width: 100%; border: none;">
          <tr>
            <td style="width: 45%; text-align: center; border: none; vertical-align: top;">
              Mengetahui<br>
              <strong>Kepala Sekolah</strong><br>
              <div class="signature-space"></div>
              <strong><u>${kepsek}</u></strong><br>
              ${nipKepsek}
            </td>
            <td style="width: 10%; border: none;"></td>
            <td style="width: 45%; text-align: center; border: none; vertical-align: top;">
              <strong>${peranGuruLabel} / Penyusun</strong><br>
              <br>
              <div class="signature-space"></div>
              <strong><u>${guru}</u></strong><br>
              ${nipGuru}
            </td>
          </tr>
        </table>
      </div>
    `;
  } else if (isKktp) {
    bodyContent = `
      <!-- FORMAT PERSIS FOTO UNTUK KKTP -->
      <div class="custom-title-box">
        KKTP (KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN)
      </div>
      <div class="custom-meta" style="font-family: monospace; font-size: 10pt;">
        <table style="width: 100%; border: none; margin: 0 0 10px 0;">
          <tr>
            <td style="border: none; padding: 2px 0; width: 50%;">Nama Sekolah : ${school}</td>
            <td style="border: none; padding: 2px 0; width: 50%;">Semester &nbsp; &nbsp; &nbsp; &nbsp;: ${signInfo?.semester || 'Genap'}</td>
          </tr>
          <tr>
            <td style="border: none; padding: 2px 0;">Kelas &nbsp; &nbsp; &nbsp; &nbsp;: ${kelasStr}</td>
            <td style="border: none; padding: 2px 0;">Tahun Pelajaran : ${signInfo?.tahunAjaran || '2024/2025'}</td>
          </tr>
        </table>
      </div>
      ${rawHtml}
      <div style="margin-top: 35px; width: 100%;">
        <table style="width: 100%; border: none;">
          <tr>
            <td style="width: 45%; text-align: center; border: none; vertical-align: top;">
              Mengetahui<br>
              <strong>Kepala Sekolah</strong><br>
              <div class="signature-space"></div>
              <strong><u>${kepsek}</u></strong><br>
              ${nipKepsek}
            </td>
            <td style="width: 10%; border: none;"></td>
            <td style="width: 45%; text-align: center; border: none; vertical-align: top;">
              <strong>${peranGuruLabel}</strong><br>
              <br>
              <div class="signature-space"></div>
              <strong><u>${guru}</u></strong><br>
              ${nipGuru}
            </td>
          </tr>
        </table>
      </div>
    `;
  } else if (isBankSoal) {
    // Bank Soal HOTS: Naskah Ujian & Kisi-kisi tanpa blok tanda tangan pengesahan dinas
    bodyContent = `
      <!-- KOP DINAS PENDIDIKAN RESMI -->
      <div class="kop-dinas">
        <div style="border-bottom: 2px solid #000000; padding-bottom: 4px;">
          <h1 style="font-size: 12pt; font-weight: bold; margin: 0; text-transform: uppercase;">PEMERINTAH DAERAH PROVINSI / KABUPATEN / KOTA</h1>
          <h2 style="font-size: 13pt; font-weight: bold; margin: 2px 0; text-transform: uppercase;">${dinas.toUpperCase()}</h2>
          ${cabang}
          <h3 style="font-size: 14pt; font-weight: bold; margin: 3px 0; text-transform: uppercase;">${school.toUpperCase()}</h3>
          <p style="font-size: 9.5pt; margin: 2px 0;">${alamat} | ${npsn}</p>
        </div>
      </div>

      ${rawHtml}
    `;
  } else {
    // Default RPP / Modul Ajar Dinas format
    bodyContent = `
      <!-- KOP DINAS PENDIDIKAN RESMI -->
      <div class="kop-dinas">
        <div style="border-bottom: 1px solid #000000; padding-bottom: 4px;">
          <h1 style="font-size: 12pt; font-weight: bold; margin: 0; text-transform: uppercase;">PEMERINTAH DAERAH PROVINSI / KABUPATEN / KOTA</h1>
          <h2 style="font-size: 13pt; font-weight: bold; margin: 2px 0; text-transform: uppercase;">${dinas.toUpperCase()}</h2>
          ${cabang}
          <h3 style="font-size: 14pt; font-weight: bold; margin: 3px 0; text-transform: uppercase;">${school.toUpperCase()}</h3>
          <p style="font-size: 9.5pt; margin: 2px 0;">${alamat} | ${npsn}</p>
        </div>
      </div>

      ${rawHtml}

      <div style="margin-top: 35px; width: 100%;">
        <p style="text-align: right; margin-bottom: 12px; font-weight: bold;">${kota}, ${currentDate}</p>
        <table style="width: 100%; border: none;">
          <tr>
            <td style="width: 33.33%; text-align: center; border: none; vertical-align: top;">
              Mengetahui,<br>
              <strong>Kepala ${school}</strong><br>
              <div class="signature-space"></div>
              <strong><u>${kepsek}</u></strong><br>
              ${nipKepsek}
            </td>
            <td style="width: 33.33%; text-align: center; border: none; vertical-align: top;">
              Diverifikasi oleh:<br>
              <strong>Pengawas Pembina</strong><br>
              <div class="signature-space"></div>
              <strong><u>${pengawas}</u></strong><br>
              ${nipPengawas}
            </td>
            <td style="width: 33.33%; text-align: center; border: none; vertical-align: top;">
              Disusun oleh:<br>
              <strong>${peranGuruLabel}</strong><br>
              <div class="signature-space"></div>
              <strong><u>${guru}</u></strong><br>
              ${nipGuru}
            </td>
          </tr>
        </table>
      </div>
    `;
  }

  const wordHtml = `
  <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <!--[if gte mso 9]>
    <xml>
      <w:WordDocument>
        <w:View>Print</w:View>
        <w:Zoom>100</w:Zoom>
        <w:DoNotOptimizeForBrowser/>
      </w:WordDocument>
    </xml>
    <![endif]-->
    <style>
      @page {
        size: ${isPromes ? 'A4 landscape' : 'A4 portrait'};
        margin: 1.5cm 1.5cm 1.5cm 1.5cm;
        mso-page-orientation: ${isPromes ? 'landscape' : 'portrait'};
      }
      body {
        font-family: 'Times New Roman', Times, serif;
        font-size: 10pt;
        line-height: 1.35;
        color: #000000;
        background: #ffffff;
      }
      .kop-dinas {
        text-align: center;
        border-bottom: 3px solid #000000;
        padding-bottom: 8px;
        margin-bottom: 18px;
      }
      .custom-title-box {
        border: 2px solid #000000;
        text-align: center;
        padding: 8px;
        font-size: 13pt;
        font-weight: bold;
        margin-bottom: 12px;
      }
      .custom-meta {
        font-size: 10.5pt;
        font-weight: bold;
        margin-bottom: 14px;
      }
      table {
        border-collapse: collapse;
        width: 100%;
        margin-top: 10px;
        margin-bottom: 14px;
      }
      th {
        background-color: #f2f2f2;
        border: 1px solid #000000;
        padding: 5px 6px;
        font-weight: bold;
        font-size: 9.5pt;
        text-align: center;
      }
      td {
        border: 1px solid #000000;
        padding: 4px 6px;
        font-size: 9pt;
        vertical-align: top;
      }
      .signature-space {
        height: 95px;
      }
    </style>
  </head>
  <body>
    ${bodyContent}
  </body>
  </html>
  `;

  const blob = new Blob(['\ufeff', wordHtml], {
    type: 'application/msword',
  });

  const sanitizedFilename = (title || 'DOKUMEN_PERANGKAT_DINAS')
    .replace(/[^a-zA-Z0-9_\-\s]/g, '')
    .trim()
    .replace(/\s+/g, '_');

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${sanitizedFilename}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

/**
 * Exports documents directly into Microsoft Excel (.xlsx) matching user uploaded photos PERSIS:
 * - For PROTA: Title PROGRAM TAHUNAN (PROTA), Kelas, Mapel, Columns [No., No ATP, Alur tujuan Pembelajaran (ATP), Jam, SMT]
 * - For PROMES: Title PROGRAM SEMESTER (PROSEM), Kelas, Mapel, 2-tier 12 Months (Juli-Jun) with 5 weeks each
 * - For ATP: Title ALUR TUJUAN PEMBELAJARAN (ATP), Nama Penyusun, NIP, Kelas, Mapel, Columns [NO, CAPAIAN PEMBELAJARAN, ELEMEN, TUJUAN PEMBELAJARAN, ALOKASI WAKTU, PROFIL PELAJAR PANCASILA]
 * - For KKTP: Title KKTP, Nama Sekolah, Kelas, Semester, Tahun Pelajaran, Columns Interval [0-69, 70-79, 80-89, 90-100]
 */
export function exportToExcel(
  title: string,
  markdownContent: string,
  signInfo?: SchoolSignInfo
) {
  const docType = signInfo?.docType;
  const cleanedSignatures = stripMessyMarkdownSignatures(markdownContent);
  const cleanedMarkdown = stripDuplicateHeaders(cleanedSignatures, docType);

  const guru = signInfo?.namaGuru || 'MARWINI, A.Ma';
  const nipGuru = signInfo?.nipGuru ? `NIP : ${signInfo.nipGuru.replace(/^NIP\.?\s*:?\s*/i, '')}` : 'NIP : -';
  const kepsek = signInfo?.kepalaSekolah || 'HADJRIN, S.Pd';
  const nipKepsek = signInfo?.nipKepalaSekolah ? `NIP : ${signInfo.nipKepalaSekolah.replace(/^NIP\.?\s*:?\s*/i, '')}` : 'NIP : -';
  const peranGuruLabel = signInfo?.peranGuru || 'Guru Kelas';
  const school = signInfo?.namaSekolah || 'SDN 4 PALASA';
  const kelasStr = signInfo?.faseKelas ? signInfo.faseKelas.replace(/[^0-9IVX]/gi, '').trim() || signInfo.faseKelas : '1';
  const mapelStr = signInfo?.mataPelajaran || 'Mata Pelajaran';

  const rows: (string | number)[][] = [];

  if (docType === 'PROTA') {
    // ==========================================
    // EXCEL EXPORT FOR PROTA (PROGRAM TAHUNAN)
    // ==========================================
    rows.push(['PROGRAM TAHUNAN (PROTA)']);
    rows.push([`Kelas   : ${kelasStr}`]);
    rows.push([`Mapel  : ${mapelStr}`]);
    rows.push([]); // blank row

    rows.push(['No.', 'No ATP', 'Alur tujuan Pembelajaran (ATP)', 'Jam', 'SMT']);

    const lines = cleanedMarkdown.split('\n');
    let rowCount = 0;
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (line.startsWith('|') && line.endsWith('|')) {
        const isSeparator = /^\|[\s\-:|]+\|$/.test(line);
        const isHeader = line.toLowerCase().includes('alur tujuan') || line.toLowerCase().includes('no atp');
        if (!isSeparator && !isHeader) {
          const rawCols = line.slice(1, -1).split('|').map(c => c.trim().replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1'));
          if (rawCols.length >= 3) {
            rowCount++;
            rows.push([
              rawCols[0] || rowCount,
              rawCols[1] || `1,${rowCount}`,
              rawCols[2] || '',
              rawCols[3] || '8',
              rawCols[4] || (rowCount <= 7 ? '1' : '2'),
            ]);
          }
        }
      }
    }

    // Space for Signatures
    rows.push([]);
    rows.push([]);
    rows.push(['', '', 'Mengetahui', '', peranGuruLabel]);
    rows.push(['', '', 'Kepala Sekolah']);
    rows.push([]);
    rows.push([]);
    rows.push([]);
    rows.push([]);
    rows.push(['', '', kepsek, '', guru]);
    rows.push(['', '', nipKepsek, '', nipGuru]);

    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }];
    ws['!cols'] = [
      { wch: 6 },
      { wch: 10 },
      { wch: 65 },
      { wch: 8 },
      { wch: 8 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'PROTA');

    const sanitizedFilename = (title || 'PROGRAM_TAHUNAN_PROTA')
      .replace(/[^a-zA-Z0-9_\-\s]/g, '')
      .trim()
      .replace(/\s+/g, '_');

    XLSX.writeFile(wb, `${sanitizedFilename}.xlsx`);
    return;
  }

  if (docType === 'ATP') {
    // ==========================================
    // EXCEL EXPORT FOR ATP (ALUR TUJUAN PEMBELAJARAN)
    // ==========================================
    rows.push(['ALUR TUJUAN PEMBELAJARAN (ATP)']);
    rows.push([`Nama Penyusun : ${guru}`]);
    rows.push([`NIP           : ${nipGuru.replace(/^NIP\s*:\s*/i, '')}`]);
    rows.push([`Kelas         : ${kelasStr}`]);
    rows.push([`Mata Pelajaran: ${mapelStr}`]);
    rows.push([]); // blank row

    rows.push(['NO', 'CAPAIAN PEMBELAJARAN', 'ELEMEN', 'TUJUAN PEMBELAJARAN', 'ALOKASI WAKTU', 'PROFIL PELAJAR PANCASILA']);

    const lines = cleanedMarkdown.split('\n');
    let rowCount = 0;
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (line.startsWith('|') && line.endsWith('|')) {
        const isSeparator = /^\|[\s\-:|]+\|$/.test(line);
        const isHeader = line.toLowerCase().includes('capaian pembelajaran') || line.toLowerCase().includes('tujuan pembelajaran');
        if (!isSeparator && !isHeader) {
          const rawCols = line.slice(1, -1).split('|').map(c => c.trim().replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1'));
          if (rawCols.length >= 4) {
            rowCount++;
            rows.push([
              rawCols[0] || rowCount,
              rawCols[1] || '',
              rawCols[2] || '',
              rawCols[3] || '',
              rawCols[4] || '8',
              rawCols[5] || 'Beriman, Gotong Royong, Mandiri, Bernalar Kritis',
            ]);
          }
        }
      }
    }

    rows.push([]);
    rows.push([]);
    rows.push(['', '', 'Mengetahui', '', `${peranGuruLabel} / Penyusun`]);
    rows.push(['', '', 'Kepala Sekolah']);
    rows.push([]);
    rows.push([]);
    rows.push([]);
    rows.push([]);
    rows.push(['', '', kepsek, '', guru]);
    rows.push(['', '', nipKepsek, '', nipGuru]);

    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }];
    ws['!cols'] = [
      { wch: 6 },
      { wch: 45 },
      { wch: 18 },
      { wch: 45 },
      { wch: 14 },
      { wch: 35 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'ATP');

    const sanitizedFilename = (title || 'ALUR_TUJUAN_PEMBELAJARAN_ATP')
      .replace(/[^a-zA-Z0-9_\-\s]/g, '')
      .trim()
      .replace(/\s+/g, '_');

    XLSX.writeFile(wb, `${sanitizedFilename}.xlsx`);
    return;
  }

  if (docType === 'KKTP') {
    // ==========================================
    // EXCEL EXPORT FOR KKTP (INTERVAL NILAI)
    // ==========================================
    rows.push(['KKTP (KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN)']);
    rows.push([`Nama Sekolah : ${school}`, '', '', `Semester        : ${signInfo?.semester || 'Genap'}`]);
    rows.push([`Kelas        : ${kelasStr}`, '', '', `Tahun Pelajaran : ${signInfo?.tahunAjaran || '2024/2025'}`]);
    rows.push([]); // blank row

    // Two-tier header row 1 & row 2
    rows.push(['No.', 'Mata Pelajaran / Lingkup Materi', 'Deskripsi CP (Capaian Pembelajaran)', 'Interval', '', '', '']);
    rows.push(['', '', '', 'Perlu Bimbingan (0-69)', 'Cukup (70-79)', 'Baik (80-89)', 'Sangat Baik (90-100)']);

    const lines = cleanedMarkdown.split('\n');
    let rowCount = 0;
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (line.startsWith('|') && line.endsWith('|')) {
        const isSeparator = /^\|[\s\-:|]+\|$/.test(line);
        const isHeader = line.toLowerCase().includes('perlu bimbingan') || line.toLowerCase().includes('deskripsi cp');
        if (!isSeparator && !isHeader) {
          const rawCols = line.slice(1, -1).split('|').map(c => c.trim().replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1'));
          if (rawCols.length >= 4) {
            rowCount++;
            rows.push([
              rawCols[0] || rowCount,
              rawCols[1] || mapelStr,
              rawCols[2] || '',
              rawCols[3] || '',
              rawCols[4] || '',
              rawCols[5] || '',
              rawCols[6] || '',
            ]);
          }
        }
      }
    }

    rows.push([]);
    rows.push([]);
    rows.push(['', '', 'Mengetahui', '', '', peranGuruLabel]);
    rows.push(['', '', 'Kepala Sekolah']);
    rows.push([]);
    rows.push([]);
    rows.push([]);
    rows.push([]);
    rows.push(['', '', kepsek, '', '', guru]);
    rows.push(['', '', nipKepsek, '', '', nipGuru]);

    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }, // Title
      { s: { r: 4, c: 0 }, e: { r: 5, c: 0 } }, // No.
      { s: { r: 4, c: 1 }, e: { r: 5, c: 1 } }, // Mata Pelajaran
      { s: { r: 4, c: 2 }, e: { r: 5, c: 2 } }, // Deskripsi CP
      { s: { r: 4, c: 3 }, e: { r: 4, c: 6 } }, // Interval across cols 3-6
    ];

    ws['!cols'] = [
      { wch: 6 },
      { wch: 30 },
      { wch: 45 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'KKTP');

    const sanitizedFilename = (title || 'KKTP_KRITERIA_KETERCAPAIAN')
      .replace(/[^a-zA-Z0-9_\-\s]/g, '')
      .trim()
      .replace(/\s+/g, '_');

    XLSX.writeFile(wb, `${sanitizedFilename}.xlsx`);
    return;
  }

  // ==========================================
  // EXCEL EXPORT FOR PROMES (PROGRAM SEMESTER)
  // ==========================================
  rows.push(['PROGRAM SEMESTER (PROSEM)']);
  rows.push([`Kelas   : ${kelasStr}`]);
  rows.push([`Mapel  : ${mapelStr.toUpperCase()}`]);
  rows.push([]); // blank separator

  const months = ['Juli', 'Agust', 'Sept', 'Okt', 'Nov', 'Des', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const headerRow1: string[] = ['No.', 'No ATP', 'Alur tujuan Pembelajaran (ATP)', 'Jam'];
  for (const m of months) {
    headerRow1.push(m, '', '', '', '');
  }
  rows.push(headerRow1);

  const headerRow2: (string | number)[] = ['', '', '', ''];
  for (let i = 0; i < months.length; i++) {
    headerRow2.push(1, 2, 3, 4, 5);
  }
  rows.push(headerRow2);

  const lines = cleanedMarkdown.split('\n');
  let rowCount = 0;
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      const isSeparator = /^\|[\s\-:|]+\|$/.test(line);
      const isHeader = line.toLowerCase().includes('alur tujuan') || line.toLowerCase().includes('no atp');
      if (!isSeparator && !isHeader) {
        const rawCols = line.slice(1, -1).split('|').map(c => c.trim().replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1'));
        if (rawCols.length >= 3) {
          rowCount++;
          const dataRow: (string | number)[] = [
            rawCols[0] || rowCount,
            rawCols[1] || `1.${rowCount}`,
            rawCols[2] || '',
            rawCols[3] || '4',
          ];

          for (let colIdx = 4; colIdx < 4 + 60; colIdx++) {
            dataRow.push(rawCols[colIdx] || '');
          }
          rows.push(dataRow);
        }
      }
    }
  }

  rows.push([]);
  rows.push([]);
  rows.push(['', '', 'Mengetahui', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', peranGuruLabel]);
  rows.push(['', '', 'Kepala Sekolah']);
  rows.push([]);
  rows.push([]);
  rows.push([]);
  rows.push([]);
  rows.push(['', '', kepsek, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', guru]);
  rows.push(['', '', nipKepsek, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', nipGuru]);

  const ws = XLSX.utils.aoa_to_sheet(rows);

  const merges = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 63 } },
    { s: { r: 4, c: 0 }, e: { r: 5, c: 0 } },
    { s: { r: 4, c: 1 }, e: { r: 5, c: 1 } },
    { s: { r: 4, c: 2 }, e: { r: 5, c: 2 } },
    { s: { r: 4, c: 3 }, e: { r: 5, c: 3 } },
  ];

  for (let mIdx = 0; mIdx < 12; mIdx++) {
    const startCol = 4 + mIdx * 5;
    merges.push({
      s: { r: 4, c: startCol },
      e: { r: 4, c: startCol + 4 },
    });
  }

  ws['!merges'] = merges;

  const colWidths: { wch: number }[] = [
    { wch: 6 },
    { wch: 10 },
    { wch: 55 },
    { wch: 8 },
  ];
  for (let i = 0; i < 60; i++) {
    colWidths.push({ wch: 5 });
  }
  ws['!cols'] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'PROSEM');

  const sanitizedFilename = (title || 'PROGRAM_SEMESTER_PROSEM')
    .replace(/[^a-zA-Z0-9_\-\s]/g, '')
    .trim()
    .replace(/\s+/g, '_');

  XLSX.writeFile(wb, `${sanitizedFilename}.xlsx`);
}

/**
 * Triggers native browser print dialog styled for A4 paper.
 */
export function triggerPrint() {
  window.print();
}

/**
 * Copies text cleanly to clipboard.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  } catch (e) {
    console.error('Clipboard copy failed:', e);
    return false;
  }
}
