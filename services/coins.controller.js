const CoinsService = require("./coins.service");
const express = require("express");

const coins = express.Router();

coins
    .get("/categories", async (req, res) => {
        res.send(await CoinsService.getCategories());
    })
    .get("/countries", async (req, res) => {
        res.send(await CoinsService.getCountries());
    })
    .get("/compositions", async (req, res) => {
        res.send(await CoinsService.getCompositions());
    })
    .get("/qualities", async (req, res) => {
        res.send(await CoinsService.getQualities());
    })
    .put("/category/:id", async (req, res) => {
        const id = +req.params.id;
        const {count, offset} = req.body
        if (!id && !+count && !+offset) {
            res.status(404).send([]);
            return;
        }
        res.send(await CoinsService.getCoinsByCategoryId(id, count, offset));
    })
    .get("/:id", async (req, res) => {
        const id = +req.params.id;
        if (!id) {
            res.status(404).send([]);
            return;
        }
        res.send(await CoinsService.getCoinById(id));
    })
    .put("/", async (req, res) => {
        const {mainValue, country, composition, quality, priceFrom, priceTo, yearFrom, yearTo, count, offset} = req.body;
        res.send(await CoinsService.getCoins(mainValue, country, composition, quality, priceFrom, priceTo, yearFrom, yearTo, count, offset));
    });

module.exports = coins;