const db = require("../../models");
const { getLabelDataId, printLabelData } = require("../services/labelService");

// 라벨 목록 조회
exports.templateList = async (req, res) => {
  try {
    const labelList = await db.Inventory.findAll();
    if (res.headersSent) return;
    return res.status(200).json({
      message: "성공적으로 데이터를 가져왔습니다.",
      data: { labelList },
    });
  } catch (e) {
    console.error("templateList 에러:", e.message, e.stack);
    if (res.headersSent) return;
    return res
      .status(500)
      .json({ message: "오류가 발생하였습니다.", error: e.message });
  }
};

// 라벨 추가
exports.templateAdd = async (req, res) => {
  try {
    const {
      item_name,
      lot_no,
      quantity,
      location,
      expiration_date,
      status,
      registrationNumber,
      productName,
      storageType,
      productTypeAndForm,
      ingredientAmount,
      ingredientName,
      netWeight,
      feedPurpose,
      manufacturingDate,
      precautions,
      barcord,
    } = req.body;

    if (!item_name || !quantity || !registrationNumber || !productName) {
      if (res.headersSent) return;
      return res.status(400).json({ message: "필수 값이 누락되었습니다." });
    }

    const newLabel = await db.Inventory.create({
      item_name,
      lot_no,
      quantity,
      location,
      expiration_date,
      status,
      registrationNumber,
      productName,
      storageType,
      productTypeAndForm,
      ingredientAmount,
      ingredientName,
      netWeight,
      feedPurpose,
      manufacturingDate,
      precautions,
      barcord,
    });

    if (res.headersSent) return;
    return res
      .status(201)
      .json({ message: "템플릿 저장 완료", data: newLabel });
  } catch (e) {
    console.error("templateAdd 에러:", e.message, e.stack);
    if (res.headersSent) return;
    return res
      .status(500)
      .json({ message: "오류가 발생하였습니다.", error: e.message });
  }
};

// 라벨 수정
exports.templateEdit = async (req, res) => {
  try {
    const {
      id,
      productName,
      detail,
      code,
      storageType,
      registrationNumber,
      productType,
      ingredientAmount,
      ingredientName,
    } = req.body;

    if (!id) {
      if (res.headersSent) return;
      return res
        .status(400)
        .json({ success: false, message: "id가 필요합니다." });
    }

    const labelData = await getLabelDataId({ id });
    if (!labelData) {
      if (res.headersSent) return;
      return res
        .status(404)
        .json({ success: false, message: "데이터가 없습니다." });
    }

    const [updatedRows] = await db.Inventory.update(
      {
        productName,
        detail,
        code,
        storageType,
        registrationNumber,
        productType,
        ingredientAmount,
        ingredientName,
      },
      { where: { id } }
    );

    if (updatedRows === 0) {
      if (res.headersSent) return;
      return res
        .status(404)
        .json({
          success: false,
          message: "해당 ID의 데이터가 존재하지 않습니다.",
        });
    }

    const updatedData = await db.Inventory.findByPk(id);
    if (res.headersSent) return;
    return res
      .status(200)
      .json({
        success: true,
        message: "수정이 완료되었습니다.",
        data: updatedData,
      });
  } catch (e) {
    console.error("templateEdit 에러:", e.message, e.stack);
    if (res.headersSent) return;
    return res
      .status(500)
      .json({
        success: false,
        message: "서버 오류로 수정에 실패했습니다.",
        error: e.message,
      });
  }
};

// 라벨 출력
exports.labelPrint = async (req, res) => {
  try {
    const { id, printDevice, count, labelType } = req.body;

    if (!id || !printDevice || !count) {
      if (res.headersSent) return;
      return res
        .status(400)
        .json({ message: "id, printDevice, count 값이 필요합니다." });
    }

    // id 전달 시 객체로 감싸서 서비스에 전달
    const labelData = await getLabelDataId({ id });
    if (!labelData) {
      if (res.headersSent) return;
      return res.status(404).json({ message: "데이터가 없습니다." });
    }

    for (let i = 0; i < count; i++) {
      await printLabelData({ printDevice, labelData, labelType });
    }

    if (res.headersSent) return;
    return res
      .status(200)
      .json({ message: `${count}개의 라벨이 성공적으로 출력되었습니다.` });
  } catch (e) {
    console.error("labelPrint 에러:", e.message, e.stack);
    if (res.headersSent) return;
    return res
      .status(500)
      .json({ message: "오류가 발생하였습니다.", error: e.message });
  }
};
