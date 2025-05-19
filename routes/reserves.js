import express from "express";
import fs from "fs";

const router = express.Router();

const readReserves = () => {
    try {
        const data = fs.readFileSync("./reservesDb.json");
        return JSON.parse(data);
    } catch (error) {
        console.error(error);
    }

};

const writeData = (data) => {
    try {
        fs.writeFileSync("./recursosDb.json", JSON.stringify(data));
    } catch (error) {
        console.error(error);
    }
};

router.get("/", (req, res) => {
    const user={name:"Usman"}
    const htmlMessage = `
    <a href="/">Volver a Home</a>`;
    const data = readReserves();
    res.render("reserves",{user, data, htmlMessage});
});

router.get("/:id", (req, res) => {
    const data = readReserves();
    const user={name:"Usman"}
    const reserves_id = parseInt(req.params.id);
    const reserva = data.reserves.find((reserves) => reserves.reserves_id === reserves_id);
    res.render("reservesDetall", {user, reserva});
});

router.get("/editarReserves/:id", (req, res) => {
    const data = readReserves();
    const user={name:"Usman"}
    const reserves_id = parseInt(req.params.id);
    const reserva = data.reserves.find((reserves) => reserves.reserves_id === reserves_id);
    res.render("editarReserves", {user, reserva});
});

export default router;