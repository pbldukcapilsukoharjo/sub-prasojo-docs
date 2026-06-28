const fs = require('fs');
const yaml = require('js-yaml');

const filePath = 'openapi.yaml';
let fileContents = fs.readFileSync(filePath, 'utf8');
let data = yaml.load(fileContents);

// 1. Update /api/v1/sla/kpi parameters
if (data.paths['/api/v1/sla/kpi']) {
    let getOp = data.paths['/api/v1/sla/kpi'].get;
    if (!getOp.parameters) {
        getOp.parameters = [];
    }
    
    let params = getOp.parameters;
    let paramNames = params.map(p => p.name);
    
    if (!paramNames.includes('id_layanan')) {
        params.push({
            name: 'id_layanan',
            in: 'query',
            required: false,
            schema: { type: 'integer' },
            description: 'Filter data berdasarkan ID layanan'
        });
    }
    if (!paramNames.includes('periode_bulan')) {
        params.push({
            name: 'periode_bulan',
            in: 'query',
            required: false,
            schema: { type: 'string' },
            description: 'Filter data berdasarkan periode bulan (format: YYYY-MM)'
        });
    }
}

// 2. Update wilayah distribusi id_kecamatan description
if (data.paths['/api/v1/wilayah/distribusi']) {
    let params = data.paths['/api/v1/wilayah/distribusi'].get.parameters || [];
    let p = params.find(p => p.name === 'id_kecamatan');
    if (p) {
        p.description = 'Filter data berdasarkan ID kecamatan. Jika filter kecamatan diterapkan, maka akan menampilkan data desa/kelurahan.';
    }
}

// 3. Remove query parameters from /api/v1/sla/export and /api/v1/wilayah/export
for (let path of ['/api/v1/sla/export', '/api/v1/wilayah/export']) {
    if (data.paths[path] && data.paths[path].get) {
        data.paths[path].get.parameters = [];
    }
}

let newYaml = yaml.dump(data, {
    lineWidth: -1,
    noRefs: true,
    sortKeys: false
});

fs.writeFileSync(filePath, newYaml, 'utf8');
console.log('Updated openapi.yaml');
