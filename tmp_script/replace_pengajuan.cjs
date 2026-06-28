const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'openapi.yaml');
let content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');

const startLine = 2654; // 0-indexed for 2655
const endLine = 2795; // 0-indexed for 2796

const parametersBlock = `
      parameters:
        - name: search
          in: query
          schema:
            type: string
        - name: kecamatan
          in: query
          schema:
            type: string
        - name: pelapor
          in: query
          schema:
            type: string
        - name: start_date
          in: query
          schema:
            type: string
        - name: end_date
          in: query
          schema:
            type: string
        - name: periode
          in: query
          schema:
            type: integer
        - name: layanan
          in: query
          schema:
            type: string
        - name: sort
          in: query
          schema:
            type: string
        - name: per_page
          in: query
          schema:
            type: integer
        - name: page
          in: query
          schema:
            type: integer
`;

const responsesBlock = `
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
              example: |
                {
                  "status": true,
                  "code": 200,
                  "message": "Berhasil mengambil data",
                  "data": [],
                  "meta": {
                    "page": 1,
                    "per_page": 10,
                    "total": 0,
                    "total_page": 0
                  }
                }
        '400':
          description: Bad Request
          content:
            application/json:
              schema:
                type: object
              example: |
                {
                  "status": false,
                  "code": 400,
                  "message": "Validasi gagal. Silakan periksa kembali input Anda.",
                  "data": {
                    "nama_parameter": ["Pesan error spesifik dari backend (bahasa indonesia)"]
                  }
                }
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                type: object
              example: |
                {
                  "status": false,
                  "code": 401,
                  "message": "Akses ditolak. Sesi Anda tidak valid atau telah berakhir.",
                  "data": null
                }
`;

const newYaml = `  /api/v1/pengajuan/lembar-kerja:
    get:
      tags:
        - Pengajuan
      summary: List Lembar Kerja
      description: Menampilkan list pengajuan untuk halaman lembar kerja.
      security:
        - bearerAuth: []${parametersBlock}${responsesBlock}  /api/v1/pengajuan/ajuan:
    get:
      tags:
        - Pengajuan
      summary: List Ajuan
      description: Menampilkan list pengajuan untuk halaman ajuan.
      security:
        - bearerAuth: []${parametersBlock}${responsesBlock}  /api/v1/pengajuan/produk:
    get:
      tags:
        - Pengajuan
      summary: List Produk
      description: Menampilkan list pengajuan untuk halaman produk, dilengkapi nama identitas produk.
      security:
        - bearerAuth: []${parametersBlock}${responsesBlock}  /api/v1/pengajuan/{ajuan_id}/detail:
    get:
      tags:
        - Pengajuan
      summary: Detail Timeline Pengajuan
      description: Menampilkan detail timeline status dari sebuah pengajuan.
      security:
        - bearerAuth: []
      parameters:
        - name: ajuan_id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
              example: |
                {
                  "status": true,
                  "code": 200,
                  "message": "Berhasil",
                  "data": {
                    "ajuan_id": 1,
                    "no_reg": "REG-123",
                    "status_saat_ini": "MENUNGGU",
                    "timeline": []
                  }
                }
`;

lines.splice(startLine, endLine - startLine + 1, newYaml.trimEnd());

fs.writeFileSync(filePath, lines.join('\n'));
console.log('Done!');
