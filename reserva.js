import express from "express";
import fs from "fs";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const readData = () => {
    try {
        const data = fs.readFileSync("./reservesDb.json");
        return JSON.parse(data);
    } catch (error) {
        console.error(error);
    }

};

const writeData = (data) => {
    try {
        fs.writeFileSync("./reservesDb.json", JSON.stringify(data));
    } catch (error) {
        console.error(error);
    }
};


app.get("/", (req, res) => {
    res.send("Welcome to the my first API");
})

app.get("/reserves", (req, res) => {
    const data = readData();
    res.json(data.reserves);
});

//Creem un endpoint per obtenir una reserva per id
app.get("/reserves/:id", (req, res) => {
    const data = readData();
    const reserves_id = parseInt(req.params.id);
    const reserva = data.reserves.find((reserves) => reserves.reserves_id === reserves_id);
    res.json(reserva);
});


//Creem un endpoint del tipus post per afegir una reserva
app.post("/reserves", (req, res) => {
    const data = readData();
    const body = req.body;
    //tot el que ve al ...body s'afegeix a la nova reserva
    const newReserva = {
        ...body
    };
    data.reserves.push(newReserva);
    writeData(data);
    res.json(newReserva);
});


//Creem un endpoint per modificar una reserva
app.put("/reserves/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    console.log(id)
    const reservesIndex = data.reserves.findIndex((reserves) => reserves.reserves_id === id);
    console.log(reservesIndex)
    data.reserves[reservesIndex] = {
        ...data.reserves[reservesIndex],
        ...body,
    };
    writeData(data);
    res.json({ message: "Reserva updated successfully" });
});


//Creem un endpoint per eliminar una reserva
app.delete("/reserves/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const reservesIndex = data.reserves.findIndex((reserves) => reserves.reserves_id === id);
    //splice esborra a partir de reservesIndex, el número de elements
    // que li indiqui al segon argument, en aquest cas 1
    data.reserves.splice(reservesIndex, 1);
    writeData(data);
    res.json({ message: "Reserva deleted successfully" });
    });

///Funcio per escoltar les dades 
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});