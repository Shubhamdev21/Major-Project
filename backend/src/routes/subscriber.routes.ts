import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { chatId, name } = req.body;
    const subscriber = await prisma.subscriber.create({
      data: { chatId, name }
    });
    res.status(201).json({ message: "Subscribed successfully!", subscriber });
  } catch (err: any) {
    if (err.code === "P2002") {
      res.status(400).json({ error: "Already subscribed!" });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const subscribers = await prisma.subscriber.findMany();
    res.json(subscribers);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:chatId", async (req: Request, res: Response) => {
  try {
    const chatId = String(req.params["chatId"]);
    await prisma.subscriber.delete({ where: { chatId } });
    res.json({ message: "Unsubscribed successfully!" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
