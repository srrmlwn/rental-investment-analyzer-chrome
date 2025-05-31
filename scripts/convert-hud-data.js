const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Input and output paths
const inputFile = path.join(__dirname, '../data/fy2025_safmrs_revised.xlsx');
const outputFile = path.join(__dirname, '../src/data/hud_rental_data.json');

// Map Excel columns to clean JSON keys
const COLUMN_MAP = {
  zip_code: 'ZIP\nCode',
  area_code: 'HUD Area Code',
  area_name: 'HUD Fair Market Rent Area Name',
  '0BR': 'SAFMR\n0BR',
  '0BR-90': 'SAFMR\n0BR -\n90%\nPayment\nStandard',
  '0BR-110': 'SAFMR\n0BR -\n110%\nPayment\nStandard',
  '1BR': 'SAFMR\n1BR',
  '1BR-90': 'SAFMR\n1BR -\n90%\nPayment\nStandard',
  '1BR-110': 'SAFMR\n1BR -\n110%\nPayment\nStandard',
  '2BR': 'SAFMR\n2BR',
  '2BR-90': 'SAFMR\n2BR -\n90%\nPayment\nStandard',
  '2BR-110': 'SAFMR\n2BR -\n110%\nPayment\nStandard',
  '3BR': 'SAFMR\n3BR',
  '3BR-90': 'SAFMR\n3BR -\n90%\nPayment\nStandard',
  '3BR-110': 'SAFMR\n3BR -\n110%\nPayment\nStandard',
  '4BR': 'SAFMR\n4BR',
  '4BR-90': 'SAFMR\n4BR -\n90%\nPayment\nStandard',
  '4BR-110': 'SAFMR\n4BR -\n110%\nPayment\nStandard',
};

async function convertHudData() {
  try {
    console.log('Reading Excel file...');
    const workbook = XLSX.readFile(inputFile);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(worksheet);
    console.log(`Processing ${rawData.length} records...`);

    const transformedData = {
      metadata: {
        lastUpdated: new Date().toISOString().split('T')[0],
        version: '1.0',
        source: 'HUD FY2025 SAFMRs',
        description: 'HUD Fair Market Rent data by zip code',
        recordCount: rawData.length,
        columns: Object.keys(COLUMN_MAP)
      },
      data: {
        zip_codes: {}
      }
    };

    rawData.forEach(record => {
      const zipCode = record[COLUMN_MAP.zip_code];
      if (!zipCode) return;
      const zipCodeStr = zipCode.toString().padStart(5, '0');

      // Build rents object with clean keys
      const rents = {
        '0BR': record[COLUMN_MAP['0BR']] || null,
        '0BR-90': record[COLUMN_MAP['0BR-90']] || null,
        '0BR-110': record[COLUMN_MAP['0BR-110']] || null,
        '1BR': record[COLUMN_MAP['1BR']] || null,
        '1BR-90': record[COLUMN_MAP['1BR-90']] || null,
        '1BR-110': record[COLUMN_MAP['1BR-110']] || null,
        '2BR': record[COLUMN_MAP['2BR']] || null,
        '2BR-90': record[COLUMN_MAP['2BR-90']] || null,
        '2BR-110': record[COLUMN_MAP['2BR-110']] || null,
        '3BR': record[COLUMN_MAP['3BR']] || null,
        '3BR-90': record[COLUMN_MAP['3BR-90']] || null,
        '3BR-110': record[COLUMN_MAP['3BR-110']] || null,
        '4BR': record[COLUMN_MAP['4BR']] || null,
        '4BR-90': record[COLUMN_MAP['4BR-90']] || null,
        '4BR-110': record[COLUMN_MAP['4BR-110']] || null,
      };

      // Only add if we have at least one rent value
      if (Object.values(rents).some(val => val !== null)) {
        transformedData.data.zip_codes[zipCodeStr] = {
          area_code: record[COLUMN_MAP.area_code] || null,
          area_name: record[COLUMN_MAP.area_name] || null,
          rents
        };
      }
    });

    // Ensure output directory exists
    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(
      outputFile,
      JSON.stringify(transformedData, null, 2)
    );

    const zipCodeCount = Object.keys(transformedData.data.zip_codes).length;
    console.log('Conversion complete!');
    console.log(`Total records processed: ${rawData.length}`);
    console.log(`Valid zip codes with rent data: ${zipCodeCount}`);
    console.log(`Output file: ${outputFile}`);
    const stats = fs.statSync(outputFile);
    const fileSizeInMB = stats.size / (1024 * 1024);
    console.log(`Output file size: ${fileSizeInMB.toFixed(2)} MB`);
  } catch (error) {
    console.error('Error converting HUD data:', error);
    process.exit(1);
  }
}

convertHudData(); 