const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

let separarPDF = async (pdf, outputDirectory) => {
  console.log(`Recebido separar ${pdf}`);
  const data = await fs.promises.readFile(pdf);
  const readPdf = await PDFDocument.load(data);
  const { length } = readPdf.getPages();

  for (let i = 0, n = length; i < n; i += 1) {
    const writePdf = await PDFDocument.create();
    const [page] = await writePdf.copyPages(readPdf, [i]);
    writePdf.addPage(page);
    const bytes = await writePdf.save();
    const outputPath = path.join(outputDirectory, `${path.basename(pdf,".pdf")}_${i + 1}.pdf`);
    await fs.promises.writeFile(outputPath, bytes);
    console.log(`Added ${outputPath}`);
  }
}

separarPDF(process.argv[2], process.argv[3])
    .then(() =>  console.log('Todos as paginas separados!'))
    .catch(console.error);