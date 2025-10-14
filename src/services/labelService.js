import fs from "fs";
import path from "path";
import bwipjs from "bwip-js";
import puppeteer from "puppeteer";
import ptp from "pdf-to-printer";
import ejs from "ejs";
import { fileURLToPath } from "url";
import db from "../../models/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatePath = path.join(__dirname, "../views/label.ejs");

// DB에서 라벨 데이터 가져오기
export const getLabelDataId = async ({ id }) => {
  try {
    const labelData = await db.Inventory.findByPk(id);
    return labelData || null;
  } catch (e) {
    console.error("getLabelDataId 에러:", e);
    return null;
  }
};

// 라벨 PDF 생성 + 프린터 출력
export const printLabelData = async ({ printDevice, labelData, labelType }) => {
  try {
    console.log(labelData, "   ", labelType)
    const productName = labelData.productName || "";
    const quantity = labelData.quantity || "";
    const expiration_date = labelData.expiration_date || "";
    const registrationNumber = labelData.registrationNumber || "";
    const storageType = labelData.storageType || "";
    const productTypeAndForm = labelData.productTypeAndForm || "";
    const barcord = labelData.barcord || "";
    const barcode = labelData.barcode || labelData.barcord || "";
    const ingredientAmount = labelData.ingredientAmount || "";
    const ingredientName = labelData.ingredientName || "";
    const netWeight = labelData.netWeight || "";
    const feedPurpose = labelData.feedPurpose || "";
    const manufactureDate = labelData.manufacturingDate?.toISOString().split("T")[0] || "";
    const precautions = labelData.precautions || "";

    let barcodeBase64 = "";
    if (barcode) {
      let barcodeHeight = 40, barcodeScale = 2;
      if (labelType === "large") { barcodeHeight = 50; barcodeScale = 3; }
      else if (labelType === "medium") { barcodeHeight = 30; barcodeScale = 2; }
      else if (labelType === "small") { barcodeHeight = 20; barcodeScale = 1; }

      const pngBuffer = await bwipjs.toBuffer({
        bcid: "code128",
        text: String(barcode),
        scale: barcodeScale,
        height: barcodeHeight,
        includetext: true,
        textxalign: "center",
      });
      barcodeBase64 = pngBuffer.toString("base64");
    }

    const html = await new Promise((resolve, reject) => {
      ejs.renderFile(templatePath, {
        productName,
        quantity,
        expiration_date,
        registrationNumber,
        storageType,
        productTypeAndForm,
        barcord,
        ingredientAmount,
        ingredientName,
        netWeight,
        feedPurpose,
        manufacturingDate: manufactureDate, // <-- 여기서 이름 맞춤
        precautions,
        barcode,
        barcodeBase64,
        labelSize: labelType
      }, (err, html) => err ? reject(err) : resolve(html));
    });
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfWidth = labelType === "large" ? "100mm" : labelType === "medium" ? "80mm" : "50mm";
    const pdfHeight = labelType === "large" ? "100mm" : labelType === "medium" ? "60mm" : "30mm";
    const pdfPath = path.join(__dirname, `temp_label_${Date.now()}.pdf`);

    await page.pdf({ path: pdfPath, printBackground: true, width: pdfWidth, height: pdfHeight, margin: { top:0, left:0, right:0, bottom:0 } });
    await browser.close();

    await ptp.print(pdfPath, { printer: printDevice, copies: 1 });
    fs.unlinkSync(pdfPath);

    return "✅ 라벨이 프린터로 출력되었습니다!";
  } catch (err) {
    console.error("printLabelData 에러:", err);
    throw err;
  }
};
