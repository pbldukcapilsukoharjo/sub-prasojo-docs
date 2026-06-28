import json
import re

file_path = r'c:\projects\api-docs\sub-prasojo-docs\openapi.yaml'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

descriptions = {
    'search': 'Pencarian cepat (no reg / NIK pelapor / layanan / kecamatan)',
    'kecamatan': 'Filter kode kecamatan',
    'pelapor': 'Filter nama peran pelapor (online, offline, mandiri, operator, dll)',
    'start_date': 'Tanggal awal (format dd-mm-yyyy)',
    'end_date': 'Tanggal akhir (format dd-mm-yyyy)',
    'periode': 'Filter periode berdasarkan bulan (1-12)',
    'layanan': 'Filter kode layanan (untuk filter tab bar)',
    'sort': 'Urutan data (terbaru atau terlama)',
    'per_page': 'Jumlah data per halaman paginasi (default 10)',
    'page': 'Nomor halaman paginasi',
    'nama_identitas_produk': 'Pencarian berdasarkan nama identitas produk'
}

def add_descriptions(match):
    name = match.group(1)
    if name in descriptions:
        desc = descriptions[name]
        return match.group(0) + f'\n          description: {desc}'
    return match.group(0)

pattern = r'- name: ([a-z_]+)\n\s+in: query\n\s+schema:\n\s+type: [a-z]+'
content = re.sub(pattern, add_descriptions, content)

lembar_kerja_example = '''                {
                  "status": true,
                  "code": 200,
                  "message": "Berhasil mengambil data",
                  "data": [
                    {
                      "ajuan_id": 1,
                      "ajuan_no_reg": "REG-12345",
                      "ajuan_create_datetime": "2024-01-01 10:00:00",
                      "ajuan_status": "DIPROSES",
                      "ajuan_pelapor_role_name": "Online",
                      "ajuan_is_online": 1,
                      "kecamatan": {
                         "kecamatan_id": 1,
                         "kecamatan_name": "Klojen"
                      },
                      "layanan": {
                         "layanan_id": 1,
                         "layanan_name": "KTP Elektronik"
                      },
                      "pelapor": {
                         "user_id": 1,
                         "user_nik": "3573010000000001",
                         "user_nama_lengkap": "Budi Santoso"
                      }
                    }
                  ],
                  "meta": {
                    "page": 1,
                    "per_page": 10,
                    "total": 100,
                    "total_page": 10
                  },
                  "chart_status": [
                    {"status": "DIPROSES", "total": 50},
                    {"status": "DITERIMA", "total": 50}
                  ],
                  "chart_layanan": [
                    {"layanan": "KTP Elektronik", "total": 100}
                  ]
                }'''

ajuan_example = '''                {
                  "status": true,
                  "code": 200,
                  "message": "Berhasil mengambil data",
                  "data": [
                    {
                      "ajuan_id": 1,
                      "ajuan_no_reg": "REG-12345",
                      "ajuan_create_datetime": "2024-01-01 10:00:00",
                      "ajuan_status": "MENUNGGU",
                      "ajuan_pelapor_role_name": "Online",
                      "ajuan_is_online": 1,
                      "kecamatan": {
                         "kecamatan_id": 1,
                         "kecamatan_name": "Klojen"
                      },
                      "layanan": {
                         "layanan_id": 1,
                         "layanan_name": "KTP Elektronik"
                      },
                      "pelapor": {
                         "user_id": 1,
                         "user_nik": "3573010000000001",
                         "user_nama_lengkap": "Budi Santoso"
                      }
                    }
                  ],
                  "meta": {
                    "page": 1,
                    "per_page": 10,
                    "total": 100,
                    "total_page": 10
                  }
                }'''

produk_example = '''                {
                  "status": true,
                  "code": 200,
                  "message": "Berhasil mengambil data",
                  "data": [
                    {
                      "ajuan_id": 1,
                      "ajuan_no_reg": "REG-12345",
                      "ajuan_create_datetime": "2024-01-01 10:00:00",
                      "ajuan_status": "SELESAI",
                      "ajuan_is_online": 1,
                      "nama_identitas_produk": "Kartu Keluarga a.n Budi",
                      "kecamatan": {
                         "kecamatan_id": 1,
                         "kecamatan_name": "Klojen"
                      },
                      "layanan": {
                         "layanan_id": 1,
                         "layanan_name": "KTP Elektronik"
                      }
                    }
                  ],
                  "meta": {
                    "page": 1,
                    "per_page": 10,
                    "total": 100,
                    "total_page": 10
                  }
                }'''

empty_example = '''                {
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
                }'''

content = content.replace('  /api/v1/pengajuan/lembar-kerja:', 'LEM_KER_START')
content = content.replace('  /api/v1/pengajuan/ajuan:', 'AJU_START')
content = content.replace('  /api/v1/pengajuan/produk:', 'PRO_START')
content = content.replace('  /api/v1/pengajuan/{ajuan_id}/detail:', 'DET_START')

parts = content.split('LEM_KER_START')
if len(parts) > 1:
    sub_parts = parts[1].split('AJU_START')
    if len(sub_parts) > 1:
        sub_parts[0] = sub_parts[0].replace(empty_example, lembar_kerja_example)
        parts[1] = 'AJU_START'.join(sub_parts)
content = 'LEM_KER_START'.join(parts)

parts = content.split('AJU_START')
if len(parts) > 1:
    sub_parts = parts[1].split('PRO_START')
    if len(sub_parts) > 1:
        sub_parts[0] = sub_parts[0].replace(empty_example, ajuan_example)
        parts[1] = 'PRO_START'.join(sub_parts)
content = 'AJU_START'.join(parts)

parts = content.split('PRO_START')
if len(parts) > 1:
    sub_parts = parts[1].split('DET_START')
    if len(sub_parts) > 1:
        sub_parts[0] = sub_parts[0].replace(empty_example, produk_example)
        parts[1] = 'DET_START'.join(sub_parts)
content = 'PRO_START'.join(parts)

content = content.replace('LEM_KER_START', '  /api/v1/pengajuan/lembar-kerja:')
content = content.replace('AJU_START', '  /api/v1/pengajuan/ajuan:')
content = content.replace('PRO_START', '  /api/v1/pengajuan/produk:')
content = content.replace('DET_START', '  /api/v1/pengajuan/{ajuan_id}/detail:')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("openapi.yaml updated successfully")
