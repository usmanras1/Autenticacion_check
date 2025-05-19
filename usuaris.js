import express from "express";
import fs from "fs";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const readData = () => {
    try {
        const data = fs.readFileSync("./usuariDb.json");
        return JSON.parse(data);
    } catch (error) {
        console.error(error);
    }

};

const writeData = (data) => {
    try {
        fs.writeFileSync("./usuariDb.json", JSON.stringify(data));
    } catch (error) {
        console.error(error);
    }
};


app.get("/", (req, res) => {
    res.send("Welcome to the my first API");
})

app.get("/usuari", (req, res) => {
    const data = readData();
    res.json(data.usuari);
});

//Creem un endpoint per obtenir un usuari per id
app.get("/usuari/:id", (req, res) => {
    const data = readData();
    const usuari_id = parseInt(req.params.id);
    const usuari = data.usuari.find((usuari) => usuari.usuari_id === usuari_id);
    res.json(usuari);
});


//Creem un endpoint del tipus post per afegir un usuari
app.post("/usuari", (req, res) => {
    const data = readData();
    const body = req.body;
    const newUsuari = {
        ...body
    };
    data.usuari.push(newUsuari);
    writeData(data);
    res.json(newUsuari);
});


//Creem un endpoint per modificar un usuari
app.put("/usuari/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const usuariIndex = data.usuari.findIndex((usuari) => usuari.id === id);
    data.usuari[usuariIndex] = {
        ...data.usuari[usuariIndex],
        ...body,
    };
    writeData(data);
    res.json({ message: "Usuari updated successfully" });
});


//Creem un endpoint per eliminar un usuari
app.delete("/usuari/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const usuariIndex = data.usuari.findIndex((usuari) => usuari.id === id);
 
    data.usuari.splice(usuariIndex, 1);
    writeData(data);
    res.json({ message: "Usuari deleted successfully" });
    });

///Funcio per escoltar les dades 
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});