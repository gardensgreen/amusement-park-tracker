const express = require("express");
const { route } = require("./app");
const { environment } = require("./config");
const db = require("./db/models");
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });
const router = express.Router();

router.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});

const asyncHandler = (handler) => (req, res, next) =>
    handler(req, res, next).catch(next);

router.get(
    "/parks",
    asyncHandler(async (req, res) => {
        const parks = await db.Park.findAll({
            order: [["parkName", "ASC"]],
        });

        res.render("park-list", { title: "Parks", parks });
        console.log("this got here");
    })
);

router.get(
    "/park/:id(\\d+)",
    asyncHandler(async (req, res) => {
        const parkId = parseInt(req.params.id, 10);
        const park = await db.Park.findByPk(parkId);

        res.render("park-detail", { park, title: "Park Detail" });
    })
);

router.get('/park/add', csrfProtection,(req, res)=>{
    const park = db.Park.build()

    res.render('park-add', { park, title: "Add Park", csrfToken:req.csrfToken()})

})

router.post('/park/add', csrfProtection, asyncHandler(async(req,res)=>{
    const { parkName, city, provinceState, country, size, opened, description } = req.body
    const park = db.Park.build({ parkName, city, provinceState, country, size, opened, description })
}))

if (environment !== "production") {
    router.get("/error-test", () => {
        throw new Error("This is a test error.");
    });
}

module.exports = router;
