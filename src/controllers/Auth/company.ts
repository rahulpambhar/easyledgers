import { Request, Response } from "express";
import prisma, { createDatabase } from "../../helpers/prisma";
import { isValidGSTNumber, isValidPANNumber, replaceNullWithString, uploadFiles } from "../../utils";
import { StatusCodes } from "http-status-codes";
import { activityLog } from "../../helpers/general";

export const insertCompany = async (req: Request, res: Response) => {
  try {
    const userId = req.cookies.id;

    const existing = await prisma.company.findFirst({
      where: {
        name: req.body.name,
        isDelete: false,
      },
    });

    if (existing) {
      return res.json({
        st: false,
        statusCode: StatusCodes.BAD_REQUEST,
        msg: "company named already exists.",
      });
    }

    var year = new Date().getFullYear();

    var characters = req.body.name;
    var charactersLength = characters.length;
    var random = "";
    for (var i = 0; i < 6; i++) {
      random += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    var code = random.concat(year.toString());
    var db_name = code.replace(/ /g, "");

    let data: any = {
      name: req.body.name,
      printName: req.body.printName,
      financialFrom: new Date(req.body.financialFrom),
      financialTo: new Date(req.body.financialTo),
      companyType: req.body.companyType,
      businessType: req.body.businessType,
      legalPerson: req.body.legalPerson != "" ? req.body.legalPerson : null,
      phoneNumber: req.body.phoneNumber != "" ? req.body.phoneNumber : null,
      AltPhoneNumber: req.body.AltPhoneNumber != "" ? req.body.AltPhoneNumber : null,
      email: req.body.email != "" ? req.body.email : null,
      address: req.body.address != "" ? req.body.address : null,
      state: req.body.state != "" ? req.body.state : null,
      city: req.body.city != "" ? req.body.city : null,
      pincode: req.body.pincode != "" ? parseInt(req.body.pincode) : null,
      crn: req.body.crn != "" ? req.body.crn : null,
      cin: req.body.cin != "" ? req.body.cin : null,
      iec: req.body.iec != "" ? req.body.iec : null,
      msme: req.body.msme != "" ? req.body.msme : null,
      lutBond: req.body.lutBond != "" ? req.body.lutBond : null,
      pancard: req.body.pancard != "" ? req.body.pancard : null,
      createBy: userId,
    };

    if (req?.files?.logo) {
      data.logo = await uploadFiles(req.files.logo, "logo");
    }
    if (req?.files?.sign) {
      data.sign = await uploadFiles(req.files.sign, "sign");
    }
    if (req?.files?.attachment) {
      data.attachment = await uploadFiles(req.files.attachment, "attachment");
    }

    if (req.body.isGst) {
      if (req.body?.gst === "") {
        return res.json({
          st: false,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          msg: "Gst Number in Not valid",
        });
      }
      if (req.body?.gst) {
        if (isValidGSTNumber(req.body?.gst) == false) {
          res
            .status(400)
            .json({ st: "failed", msg: "Gst Number in Not valid" });
        }
      }

      data.isGst = req.body.isGst;
      data.gstNo = req.body.gstNo;
      data.gstRegDate = new Date(req.body.gstRegDate);
      data.gstRegType = req.body.gstRegType;
    }
    if (req.body.isTds) {
      data.isTds = req.body.isTds;
      data.tdsPer = req.body.tdsPer;
      data.tanNumber = req.body.tanNumber;
    }

    if (req.body?.pan_number) {
      if (isValidPANNumber(req.body?.pan_number) == false) {
        return res.json({ st: "failed", msg: "PAN Number in Not valid" });
      }
    }

    let financialYear =
      new Date(req.body.financialFrom).getFullYear() +
      "-" +
      String(new Date(req.body.financialTo).getFullYear()).substring(2, 5);
    data.years = {
      create: {
        db_name: db_name,
        year: financialYear,
      },
    };

    const company = await prisma.company.create({ data: data });
    if (company) {
      await createDatabase(db_name);
      await activityLog(
        "accounting_master",
        "INSERT",
        "company",
        req.body,
        userId
      );
      return res.json({
        st: true,
        statusCode: StatusCodes.OK,
        msg: "Company Inserted Successfully",
      });
    } else {
      return res.json({
        st: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        msg: "something went wrong",
      });
    }
  } catch (e: any) {
    console.log(e);

    return res.json({
      st: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      msg: e.message,
    });
  }
};

export const updateCompany = async (req: Request, res: Response) => {
  try {
    const userId = req.cookies.id;

    const existing = await prisma.company.findFirst({
      where: {
        id: {
          not: parseInt(req.body.id),
        },
        name: req.body.name,
        isDelete: false,
      },
    });

    if (existing) {
      return res.json({
        st: false,
        statusCode: StatusCodes.BAD_REQUEST,
        msg: "hsn code already exists.",
      });
    }

    let data: any = {
      name: req.body.name,
      printName: req.body.printName,

      companyType: req.body.companyType,
      businessType: req.body.businessType,
      legalPerson: req.body.legalPerson != "" ? req.body.legalPerson : null,
      phoneNumber: req.body.phoneNumber != "" ? req.body.phoneNumber : null,
      AltPhoneNumber: req.body.AltPhoneNumber != "" ? req.body.AltPhoneNumber : null,
      email: req.body.email != "" ? req.body.email : null,
      address: req.body.address != "" ? req.body.address : null,
      state: req.body.state != "" ? req.body.state : null,
      city: req.body.city != "" ? req.body.city : null,
      pincode: req.body.pincode != "" ? parseInt(req.body.pincode) : null,
      crn: req.body.crn != "" ? req.body.crn : null,
      cin: req.body.cin != "" ? req.body.cin : null,
      iec: req.body.iec != "" ? req.body.iec : null,
      msme: req.body.msme != "" ? req.body.msme : null,
      lutBond: req.body.lutBond != "" ? req.body.lutBond : null,
      pancard: req.body.pancard != "" ? req.body.pancard : null,
      updateBy: userId,
    };

    if (req?.files?.logo) {
      data.logo = await uploadFiles(req.files.logo, "logo");
    }
    if (req?.files?.sign) {
      data.sign = await uploadFiles(req.files.sign, "sign");
    }
    if (req?.files?.attachment) {
      data.attachment = await uploadFiles(req.files.attachment, "attachment");
    }

    if (Boolean(req.body.isGst)) {
      if (req.body?.gst === "") {
        return res.json({
          st: false,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          msg: "Gst Number in Not valid",
        });
      }
      if (req.body?.gst) {
        if (isValidGSTNumber(req.body?.gst) == false) {
          res
            .status(400)
            .json({ st: "failed", msg: "Gst Number in Not valid" });
        }
      }

      data.isGst = Boolean(req.body.isGst);
      data.gstNo = req.body.gstNo;
      data.gstRegDate = new Date(req.body.gstRegDate);
      data.gstRegType = req.body.gstRegType;
    }
    if (req.body.isTds) {
      data.isTds = Boolean(req.body.isTds);
      data.tdsPer = parseFloat(req.body.tdsPer);
      data.tanNumber = req.body.tanNumber;
    }

    if (req.body?.pan_number) {
      if (isValidPANNumber(req.body?.pancard) == false) {
        return res.json({ st: "failed", msg: "PAN Number in Not valid" });
      }
    }

    const post = await prisma.company.update({
      where: {
        id: parseInt(req.body.id),
      },
      data: data,
    });
    if (post) {
      await activityLog(
        "accounting_master",
        "UPDATE",
        "company",
        req.body,
        userId
      );
      return res.json({
        st: true,
        statusCode: StatusCodes.OK,
        msg: "Company Update Successfully",
      });
    } else {
      return res.json({
        st: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        msg: "something went wrong",
      });
    }
  } catch (e: any) {
    return res.json({
      st: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      msg: e.message,
    });
  }
};

export const deleteCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const userId = req.cookies.id;

    const post = await prisma.company.update({
      where: {
        id: parseInt(id),
      },
      data: {
        isDelete: true,
        updateBy: userId,
      },
    });
    if (post) {
      await activityLog(
        "accounting_master",
        "DELETE",
        "company",
        req.body,
        userId
      );
      return res.json({
        st: true,
        statusCode: StatusCodes.OK,
        msg: "Company Deleted Successfully",
      });
    } else {
      return res.json({
        st: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        msg: "something went wrong",
      });
    }
  } catch (e: any) {
    return res.json({
      st: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      msg: e.message,
    });
  }
};

export const getCompanyById = async (req: Request, res: Response) => {
  try {
    const results = await prisma.company.findFirst({
      where: {
        id: Number(req.body.id),
      },
      include: {
        years: {
          select: {
            db_name: true,
            year: true,
          },
        },
      },
    });

    if (results) {
      const data = replaceNullWithString(results);
      return res.json({ st: true, statusCode: StatusCodes.OK, data: data });
    } else {
      return res.json({
        st: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        msg: "something went wrong",
      });
    }
  } catch (e: any) {
    return res.json({
      st: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      msg: e.message,
    });
  }
};

export const getCompany = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.body.page, 10) || 1;
    const limit = parseInt(req.body.limit, 10) || 10;
    const offset = (page - 1) * limit;

    let where: any = { isDelete: false };
    if (req.body.term !== "") {
      where.name = { contains: req.body.term, mode: "insensitive" };
    }

    const total = await prisma.company.count({
      where: where,
    });

    const results = await prisma.company.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        id: "desc",
      },
      include: {
        years: {
          select: {
            db_name: true,
            year: true,
          },
        },
      },
      where: where,
    });
    if (results) {
      return res.json({
        st: true,
        statusCode: StatusCodes.OK,
        data: results,
        total_rows: total,
        total_pages: Math.ceil(total / limit),
      });
    } else {
      return res.json({
        st: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        msg: "something went wrong",
      });
    }
  } catch (e: any) {
    return res.json({
      st: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      msg: e.message,
    });
  }
};
