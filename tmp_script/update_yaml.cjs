const fs = require('fs');
const yaml = require('js-yaml');

const filePath = 'openapi.yaml';
const fileContents = fs.readFileSync(filePath, 'utf8');
let data = yaml.load(fileContents);

// 1. Ubah peringkat-operator menjadi operator/peringkat
if (data.paths['/api/v1/peringkat-operator']) {
    data.paths['/api/v1/operator/peringkat'] = data.paths['/api/v1/peringkat-operator'];
    delete data.paths['/api/v1/peringkat-operator'];
    
    const ep = data.paths['/api/v1/operator/peringkat'].get;
    ep.tags = ['Operator'];
    ep.parameters = [
        { name: 'page', required: true, in: 'query', schema: { type: 'integer', default: 1 } },
        { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        { name: 'search', in: 'query', schema: { type: 'string' } },
        { name: 'id_kecamatan', in: 'query', schema: { type: 'integer' } },
        { name: 'periode_bulan', in: 'query', schema: { type: 'integer' } },
        { name: 'sort', in: 'query', schema: { type: 'string', default: 'newest' } },
        { name: 'start_date', in: 'query', schema: { type: 'string' } },
        { name: 'end_date', in: 'query', schema: { type: 'string' } },
        { name: 'id_operator', in: 'query', schema: { type: 'integer' } }
    ];
    
    // Replace schema completely to remove KPI fields
    ep.responses['200'].content['application/json'].schema = {
        type: 'object',
        properties: {
            code: { type: 'integer' },
            message: { type: 'string' },
            status: { type: 'boolean' },
            data: {
                type: 'object',
                properties: {
                    list: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: { type: 'integer' },
                                peringkat: { type: 'integer' },
                                operator: { type: 'string' },
                                desa: { type: 'string' },
                                kecamatan: { type: 'string' },
                                jumlah_ajuan: { type: 'integer' }
                            }
                        }
                    },
                    meta: {
                        type: 'object',
                        properties: {
                            page: { type: 'integer' },
                            per_page: { type: 'integer' },
                            total: { type: 'integer' },
                            total_page: { type: 'integer' }
                        }
                    }
                }
            }
        }
    };
    
    ep.responses['200'].content['application/json'].example = JSON.stringify({
        status: true,
        code: 200,
        message: "Berhasil mendapatkan data operator",
        data: {
            list: [
                { id: 22, peringkat: 1, operator: "Reza", desa: "Gentan", kecamatan: "Baki", jumlah_ajuan: 124 },
                { id: 23, peringkat: 2, operator: "Erza", desa: "Gentan", kecamatan: "Baki", jumlah_ajuan: 123 }
            ],
            meta: { page: 1, per_page: 10, total: 20, total_page: 2 }
        }
    }, null, 2);
}

// 2. Ubah kpi-global
if (data.paths['/api/v1/operator/kpi-global']) {
    const ep = data.paths['/api/v1/operator/kpi-global'].get;
    ep.parameters = [
        { name: 'id_kecamatan', in: 'query', schema: { type: 'integer' } },
        { name: 'periode_bulan', in: 'query', schema: { type: 'integer' } },
        { name: 'start_date', in: 'query', schema: { type: 'string' } },
        { name: 'end_date', in: 'query', schema: { type: 'string' } },
        { name: 'id_operator', in: 'query', schema: { type: 'integer' } }
    ];
    ep.responses['200'].content['application/json'].example = JSON.stringify({
        status: true,
        code: 200,
        message: "Berhasil",
        data: {
            total_aktif: 25,
            total_berkas_dikerjakan: 10500,
            rata_rata_kecepatan_text: "30 Menit/Berkas"
        }
    }, null, 2);
}

// 3. Ubah /api/v1/peringkat-operator/{op_id} menjadi 2 API
if (data.paths['/api/v1/peringkat-operator/{op_id}']) {
    const ep = data.paths['/api/v1/peringkat-operator/{op_id}'].get;
    const errorResponses = {
        '400': ep.responses['400'],
        '401': ep.responses['401'],
        '404': ep.responses['404']
    };
    
    delete data.paths['/api/v1/peringkat-operator/{op_id}'];
    
    // KPI detail API
    data.paths['/api/v1/operator/{id}/kpi'] = {
        get: {
            tags: ['Operator'],
            summary: 'Detail Operator (Chart & KPI)',
            description: 'Mendapatkan data agregasi indikator (total ajuan, selesai) dan chart bulanan',
            parameters: [
                { name: 'id', required: true, in: 'path', schema: { type: 'integer' } },
                { name: 'tahun', required: true, in: 'query', schema: { type: 'integer' } },
                { name: 'periode_bulan', in: 'query', schema: { type: 'integer' } },
                { name: 'id_layanan', in: 'query', schema: { type: 'integer' } }
            ],
            responses: {
                '200': {
                    description: 'OK',
                    content: {
                        'application/json': {
                            schema: { type: 'object' },
                            example: JSON.stringify({
                                status: true,
                                code: 200,
                                message: "Detail operator berhasil ditemukan",
                                data: {
                                    id: 99,
                                    nama: "Cynthia Glacieterna",
                                    total_ajuan: 124,
                                    total_selesai: 98,
                                    tingkat_selesai: 79,
                                    layanan_perbulan: {
                                        Jan: 70, Feb: 20, Mar: 40, Apr: 25, Mei: 50, Jun: 10,
                                        Jul: 0, Agu: 0, Sep: 0, Okt: 0, Nov: 0, Des: 0
                                    }
                                }
                            }, null, 2)
                        }
                    }
                },
                ...errorResponses
            }
        }
    };
    
    // Riwayat detail API
    data.paths['/api/v1/operator/{id}/riwayat'] = {
        get: {
            tags: ['Operator'],
            summary: 'Detail Operator (Riwayat Layanan)',
            description: 'Mendapatkan tabel riwayat layanan dengan pagination',
            parameters: [
                { name: 'id', required: true, in: 'path', schema: { type: 'integer' } },
                { name: 'page', required: true, in: 'query', schema: { type: 'integer', default: 1 } },
                { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
                { name: 'tahun', required: true, in: 'query', schema: { type: 'integer' } },
                { name: 'periode_bulan', in: 'query', schema: { type: 'integer' } },
                { name: 'id_layanan', in: 'query', schema: { type: 'integer' } },
                { name: 'search', in: 'query', schema: { type: 'string' } }
            ],
            responses: {
                '200': {
                    description: 'OK',
                    content: {
                        'application/json': {
                            schema: { type: 'object' },
                            example: JSON.stringify({
                                status: true,
                                code: 200,
                                message: "Riwayat operator berhasil ditemukan",
                                data: {
                                    list: [
                                        {
                                            id: 1,
                                            no_regis: "REG-123",
                                            pemohon: "Aslam",
                                            kode_ajuan: "KK-NEW",
                                            desa: "Baki",
                                            tanggal: "12-07-2026",
                                            waktu: "09:15",
                                            status: "DIVERIFIKASI"
                                        }
                                    ],
                                    meta: {
                                        page: 1,
                                        per_page: 10,
                                        total: 5,
                                        total_page: 1
                                    }
                                }
                            }, null, 2)
                        }
                    }
                },
                ...errorResponses
            }
        }
    };
}

const yamlStr = yaml.dump(data, { lineWidth: -1, noRefs: true });
fs.writeFileSync(filePath, yamlStr, 'utf8');
console.log('YAML updated!');
