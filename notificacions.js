import express from "express";
import fs from "fs";

const router = express.Router();

const readData = () => {
    try {
        const data = fs.readFileSync("./notificacionsDb.json");
        return JSON.parse(data);
    } catch (error) {
        console.error(error);
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync("./notificacionsDb.json", JSON.stringify(data));
    } catch (error) {
        console.error(error);
    }
};

router.get("/", (req, res) => {
    const data = readData();
    res.json(data.notificacions);
});

router.get("/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const notificacio = data.notificacions.find(n => n.notificacions_id === id);
    res.json(notificacio);
});

router.post("/", (req, res) => {
    const data = readData();
    const newNotificacio = req.body;
    data.notificacions.push(newNotificacio);
    writeData(data);
    res.json(newNotificacio);
});

router.put("/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const index = data.notificacions.findIndex(n => n.notificacions_id === id);
    data.notificacions[index] = {
        ...data.notificacions[index],
        ...req.body
    };
    writeData(data);
    res.json({ message: "Notificació actualitzada" });
});

router.delete("/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const index = data.notificacions.findIndex(n => n.notificacions_id === id);
    data.notificacions.splice(index, 1);
    writeData(data);
    res.json({ message: "Notificació eliminada" });
});

export default router;
