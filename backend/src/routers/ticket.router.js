import { Router } from "express";
import { TicketModel } from "../models/ticket.model.js";
import handler from "express-async-handler";
import admin from "../middleware/admin.mid.js";

const router = Router();

router.get(
  "/",
  handler(async (req, res) => {
    const tickets = await TicketModel.find({});
    res.send(tickets);
  })
);

router.post(
  "/",
  admin,
  handler(async (req, res) => {
    const { code, label, mark, isActive } = req.body;

    const ticket = new TicketModel({
      code,
      label,
      mark,
      isActive,
    });

    await ticket.save();

    res.send(ticket);
  })
);

router.put(
  "/",
  admin,
  handler(async (req, res) => {
    const { id, code, label, mark, isActive } = req.body;

    await TicketModel.updateOne({ _id: id }, { code, label, mark, isActive });

    res.send();
  })
);

router.delete(
  "/:ticketId",
  admin,
  handler(async (req, res) => {
    const { ticketId } = req.params;
    await TicketModel.deleteOne({ _id: ticketId });
    res.send();
  })
);

router.get(
  "/search/:searchTerm",
  handler(async (req, res) => {
    const { searchTerm } = req.params;
    const searchRegex = new RegExp(searchTerm, "i");

    const tickets = await TicketModel.find({ label: { $regex: searchRegex } });
    res.send(tickets);
  })
);

router.get(
  "/:ticketId",
  handler(async (req, res) => {
    const { ticketId } = req.params;
    const ticket = await TicketModel.findById(ticketId);
    res.send(ticket);
  })
);

export default router;
