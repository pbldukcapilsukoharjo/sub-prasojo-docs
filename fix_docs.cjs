const fs = require('fs');
const yaml = require('js-yaml');

const docPath = 'openapi.yaml';
let doc = yaml.load(fs.readFileSync(docPath, 'utf8'));

// 1. Combine Wilayah tags
if (doc.paths['/api/v1/wilayah/distribusi']) {
    const methods = ['get'];
    methods.forEach(m => {
        if (doc.paths['/api/v1/wilayah/distribusi'][m]) {
            doc.paths['/api/v1/wilayah/distribusi'][m].tags = ['Wilayah'];
            
            // 2. Add info about kecamatan filter to description
            let desc = doc.paths['/api/v1/wilayah/distribusi'][m].description || '';
            if (!desc.includes('menampilkan data desa')) {
                doc.paths['/api/v1/wilayah/distribusi'][m].description = desc + '\n\n**Catatan:** Jika filter `kecamatan_code` (atau id_kecamatan) diterapkan, maka data yang ditampilkan adalah distribusi pada tingkat desa/kelurahan di kecamatan tersebut.';
            }
        }
    });
}

if (doc.paths['/api/v1/wilayah/export']) {
    const methods = ['get'];
    methods.forEach(m => {
        if (doc.paths['/api/v1/wilayah/export'][m]) {
            doc.paths['/api/v1/wilayah/export'][m].tags = ['Wilayah'];
            // 3. Remove filters for export
            doc.paths['/api/v1/wilayah/export'][m].parameters = [];
        }
    });
}

if (doc.paths['/api/v1/sla/export']) {
    const methods = ['get'];
    methods.forEach(m => {
        if (doc.paths['/api/v1/sla/export'][m]) {
            doc.paths['/api/v1/sla/export'][m].tags = ['SLA'];
            // 3. Remove filters for export
            doc.paths['/api/v1/sla/export'][m].parameters = [];
        }
    });
}

// Ensure SLA KPI has query params (copying from SLA list if missing)
if (doc.paths['/api/v1/sla/kpi'] && doc.paths['/api/v1/sla/kpi'].get) {
    if (!doc.paths['/api/v1/sla/kpi'].get.parameters || doc.paths['/api/v1/sla/kpi'].get.parameters.length === 0) {
        doc.paths['/api/v1/sla/kpi'].get.parameters = [
            { name: 'id_layanan', in: 'query', schema: { type: 'integer' }, description: 'Memfilter data berdasarkan ID layanan.' },
            { name: 'periode_bulan', in: 'query', schema: { type: 'integer' }, description: 'Memfilter data berdasarkan bulan tertentu (1-12).' },
            { name: 'start_date', in: 'query', schema: { type: 'string' }, description: 'Memfilter data berdasarkan rentang tanggal spesifik (Format tanggal harus: dd-mm-yyyy).' },
            { name: 'end_date', in: 'query', schema: { type: 'string' }, description: 'Memfilter data berdasarkan rentang tanggal spesifik (Format tanggal harus: dd-mm-yyyy).' }
        ];
    }
}

// Ensure Wilayah distribusi has complete query params
if (doc.paths['/api/v1/wilayah/distribusi'] && doc.paths['/api/v1/wilayah/distribusi'].get) {
    let params = doc.paths['/api/v1/wilayah/distribusi'].get.parameters || [];
    const hasSearch = params.find(p => p.name === 'search');
    if (!hasSearch) {
        params.push({ name: 'search', in: 'query', schema: { type: 'string' }, description: 'Pencarian.' });
    }
    const hasIdKecamatan = params.find(p => p.name === 'id_kecamatan' || p.name === 'kecamatan_code');
    if (!hasIdKecamatan) {
        params.push({ name: 'kecamatan_code', in: 'query', schema: { type: 'string' }, description: 'Kode kecamatan.' });
    }
    const hasStartDate = params.find(p => p.name === 'start_date');
    if (!hasStartDate) {
        params.push({ name: 'start_date', in: 'query', schema: { type: 'string' }, description: 'Memfilter data berdasarkan rentang tanggal spesifik (Format tanggal harus: dd-mm-yyyy).' });
    }
    const hasEndDate = params.find(p => p.name === 'end_date');
    if (!hasEndDate) {
        params.push({ name: 'end_date', in: 'query', schema: { type: 'string' }, description: 'Memfilter data berdasarkan rentang tanggal spesifik (Format tanggal harus: dd-mm-yyyy).' });
    }
    doc.paths['/api/v1/wilayah/distribusi'].get.parameters = params;
}

// 4 & 5. Global updates for search, start_date, end_date
for (const path in doc.paths) {
    for (const method in doc.paths[path]) {
        const obj = doc.paths[path][method];
        if (obj.parameters) {
            obj.parameters.forEach(param => {
                if (param.name === 'start_date' || param.name === 'end_date') {
                    param.description = 'Memfilter data berdasarkan rentang tanggal spesifik (Format tanggal harus: dd-mm-yyyy).';
                }
                if (param.name === 'search') {
                    if (path.includes('operator')) {
                        param.description = 'Pencarian berdasarkan nama operator atau NIK.';
                    } else if (path.includes('ulasan')) {
                        param.description = 'Pencarian berdasarkan isi ulasan atau nama pelapor.';
                    } else if (path.includes('wilayah')) {
                        param.description = 'Pencarian berdasarkan nama kecamatan atau nama desa.';
                    } else if (path.includes('sla')) {
                        param.description = 'Pencarian berdasarkan nama layanan.';
                    } else {
                        param.description = 'Pencarian berdasarkan kata kunci tertentu.';
                    }
                }
            });
        }
    }
}

fs.writeFileSync(docPath, yaml.dump(doc, { noRefs: true, lineWidth: -1 }), 'utf8');
console.log("Done updating openapi.yaml");
