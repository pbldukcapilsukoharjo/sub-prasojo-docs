const fs = require('fs');
const yaml = require('js-yaml');

const jsonPath = 'c:\\projects\\laravel\\sub-prasojo-api\\docs\\api-1.json';
const yamlPath = 'openapi.yaml';

try {
    const fileContents = fs.readFileSync(jsonPath, 'utf8');
    const data = JSON.parse(fileContents);
    
    // Add mock examples to Pengajuan endpoints instead of regex
    const lembar_kerja_example = {
      status: true,
      code: 200,
      message: "Berhasil mengambil data",
      data: [
        {
          ajuan_id: 1,
          ajuan_no_reg: "REG-12345",
          ajuan_create_datetime: "2024-01-01 10:00:00",
          ajuan_status: "DIPROSES",
          ajuan_pelapor_role_name: "Online",
          ajuan_is_online: 1,
          kecamatan: { kecamatan_id: 1, kecamatan_name: "Klojen" },
          layanan: { layanan_id: 1, layanan_name: "KTP Elektronik" },
          pelapor: { user_id: 1, user_nik: "3573010000000001", user_nama_lengkap: "Budi Santoso" }
        }
      ],
      meta: { page: 1, per_page: 10, total: 100, total_page: 10 },
      chart_status: [
        { status: "DIPROSES", total: 50 },
        { status: "DITERIMA", total: 50 }
      ],
      chart_layanan: [
        { layanan: "KTP Elektronik", total: 100 }
      ]
    };

    const ajuan_example = {
      status: true,
      code: 200,
      message: "Berhasil mengambil data",
      data: [
        {
          ajuan_id: 1,
          ajuan_no_reg: "REG-12345",
          ajuan_create_datetime: "2024-01-01 10:00:00",
          ajuan_status: "MENUNGGU",
          ajuan_pelapor_role_name: "Online",
          ajuan_is_online: 1,
          kecamatan: { kecamatan_id: 1, kecamatan_name: "Klojen" },
          layanan: { layanan_id: 1, layanan_name: "KTP Elektronik" },
          pelapor: { user_id: 1, user_nik: "3573010000000001", user_nama_lengkap: "Budi Santoso" }
        }
      ],
      meta: { page: 1, per_page: 10, total: 100, total_page: 10 }
    };

    const produk_example = {
      status: true,
      code: 200,
      message: "Berhasil mengambil data",
      data: [
        {
          ajuan_id: 1,
          ajuan_no_reg: "REG-12345",
          ajuan_create_datetime: "2024-01-01 10:00:00",
          ajuan_status: "SELESAI",
          ajuan_is_online: 1,
          nama_identitas_produk: "Kartu Keluarga a.n Budi",
          kecamatan: { kecamatan_id: 1, kecamatan_name: "Klojen" },
          layanan: { layanan_id: 1, layanan_name: "KTP Elektronik" }
        }
      ],
      meta: { page: 1, per_page: 10, total: 100, total_page: 10 }
    };

    // Inject examples directly into the JSON object
    if (data.paths['/api/v1/pengajuan/lembar-kerja']?.get?.responses?.['200']?.content?.['application/json']) {
        data.paths['/api/v1/pengajuan/lembar-kerja'].get.responses['200'].content['application/json'].example = JSON.stringify(lembar_kerja_example, null, 2);
    }
    
    if (data.paths['/api/v1/pengajuan/ajuan']?.get?.responses?.['200']?.content?.['application/json']) {
        data.paths['/api/v1/pengajuan/ajuan'].get.responses['200'].content['application/json'].example = JSON.stringify(ajuan_example, null, 2);
    }

    if (data.paths['/api/v1/pengajuan/produk']?.get?.responses?.['200']?.content?.['application/json']) {
        data.paths['/api/v1/pengajuan/produk'].get.responses['200'].content['application/json'].example = JSON.stringify(produk_example, null, 2);
    }
    
    // We also need to add descriptions if they are missing
    const customDescriptions = {
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
    };
    
    // Iterate over all parameters across all paths and methods
    Object.keys(data.paths).forEach(path => {
        Object.keys(data.paths[path]).forEach(method => {
            const endpoint = data.paths[path][method];
            if (endpoint.parameters && Array.isArray(endpoint.parameters)) {
                endpoint.parameters.forEach(param => {
                    if (customDescriptions[param.name]) {
                        param.description = customDescriptions[param.name];
                    }
                });
            }
        });
    });

    const yamlStr = yaml.dump(data, {
        noRefs: true,
        skipInvalid: true,
        lineWidth: -1
    });
    fs.writeFileSync(yamlPath, yamlStr, 'utf8');
    console.log('Successfully converted and patched api-1.json to openapi.yaml');
} catch (e) {
    console.error(e);
}
