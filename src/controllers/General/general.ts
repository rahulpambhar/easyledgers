import { Request, Response } from "express";
import prisma from "../../helpers/prisma";
import { StatusCodes } from "http-status-codes";
import axios from "axios";
import { uploadFiles } from "../../utils";
import { getCompanyByDbName } from "../../helpers/general";

export const companySettings = async (req: Request, res: Response) => {
  try {
    const { db_name, isInventory } = req.body;

    await prisma.$transaction(async (tx) => {
      const companyInfo = await getCompanyByDbName(db_name);
      if (companyInfo) {
        await prisma.company.update({ where: { id: companyInfo.id }, data: { isInventory: isInventory } });
      } else {
        throw new Error("invalid company");
      }
    })
    return res.json({
      st: true,
      statusCode: StatusCodes.OK,
      msg: "success",
    });
  } catch (error) {
    return res.json({
      st: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      msg: "Internal server error",
    });
  }
};

export const checkGst = async (req: Request, res: Response) => {
  try {
    const url = `https://sheet.gstincheck.co.in/check/${process.env.GST_API_KEY}/${req.body.gst_no}`;
    const getGstInfo = (await axios.get(url)).data;

    if (getGstInfo.flag) {
      let info = getGstInfo.data;
      const data = {
        gstin: info.gstin,
        name: info.tradeNam,
        regType: info.dty,
        firmType: info.ctb,
        address: info.pradr.adr,
        state: info.pradr.addr.stcd,
        city: info.pradr.addr.dst,
        pincode: info.pradr.addr.pncd,
      };
      return res.json({
        st: true,
        statusCode: StatusCodes.OK,
        data: data,
      });
    } else {
      return res.json({
        st: false,
        statusCode: StatusCodes.BAD_REQUEST,
        msg: "invalid gstNumber",
      });
    }
  } catch (error) {
    return res.json({
      st: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      msg: "Internal server error",
    });
  }
};

export const getState = async (req: Request, res: Response) => {
  try {
    let where: any = { isActive: true };
    if (req.body.term !== "") {
      where.name = { contains: req.body.term, mode: "insensitive" };
    }
    const states = await prisma.state.findMany({
      where: where,
    });

    if (states) {
      return res.json({
        st: true,
        statusCode: StatusCodes.OK,
        data: states,
      });
    } else {
      return res.json({
        st: false,
        statusCode: StatusCodes.BAD_REQUEST,
        msg: "No states found",
      });
    }
  } catch (error) {
    return res.json({
      st: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      msg: "Internal server error",
    });
  }
};

export const getCity = async (req: Request, res: Response) => {
  try {
    let where: any = { state_id: req.body.state_id, isActive: true };
    if (req.body.term !== "") {
      where.name = { contains: req.body.term, mode: "insensitive" };
    }
    const cities = await prisma.city.findMany({
      where: where,
    });

    if (cities) {
      return res.json({
        st: true,
        statusCode: StatusCodes.OK,
        data: cities,
      });
    } else {
      return res.json({
        st: false,
        statusCode: StatusCodes.BAD_REQUEST,
        msg: "No cities found",
      });
    }
  } catch (error) {
    console.error("Error getting cities:", error);
    return res.json({
      st: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      msg: "Internal server error",
    });
  }
};

export const upload = async (req: Request, res: Response) => {
  try {
    const { action } = req.body;
    let attachment = "";
    if (req?.files?.attachment) {
      attachment = await uploadFiles(req.files.attachment, action);
    }
    return res.json({
      st: true,
      statusCode: StatusCodes.OK,
      data: attachment,
    });
  } catch (error) {
    console.error("Error getting cities:", error);
    return res.json({
      st: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      msg: "Internal server error",
    });
  }
};
