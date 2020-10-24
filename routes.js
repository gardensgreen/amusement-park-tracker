const express = require("express");
const { route } = require("./app");
const { environment } = require("./config");
const db = require("./db/models");
const csrf = require("csurf");
const csrfProtection = csrf({ cookie: true });
const router = express.Router();
const { check, validationResult } = require("express-validator");

const asyncHandler = (handler) => (req, res, next) =>
    handler(req, res, next).catch(next);

const parkValidators = [
    check("parkName")
        .isLength({ max: 255 })
        .withMessage("Park Name must not be more than 255 characters long")
        .exists({ checkFalsy: true })
        .withMessage("Please provide a value for Park Name"),
    check("city")
        .exists({ checkFalsy: true })
        .withMessage("Please provide a value for City")
        .isLength({ max: 100 })
        .withMessage("City must not be more than 100 characters long"),
    check("provinceState")
        .isLength({ max: 100 })
        .withMessage("Province/State must not be more than 100 characters long")
        .exists({ checkFalsy: true })
        .withMessage("Please provide a value for Province/State"),

    check("country")
        .isLength({ max: 100 })
        .withMessage("Country must not be more than 100 characters long")
        .exists({ checkFalsy: true })
        .withMessage("Please provide a value for Country"),
    check("opened")
        .exists({ checkFalsy: true })
        .withMessage("Please provide a value for Opened")
        .isISO8601()
        .withMessage("Please provide a valid date for Opened"),
    check("size")
        .isLength({ max: 100 })
        .withMessage("Size must not be more than 100 characters long")
        .exists({ checkFalsy: true })
        .withMessage("Please provide a value for Size"),
    check("description")
        .exists({ checkFalsy: true })
        .withMessage("Please provide a value for Description"),
];
router.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});

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

router.get("/park/add", csrfProtection, (req, res) => {
    const park = db.Park.build();

    res.render("park-add", {
        park,
        title: "Add Park",
        csrfToken: req.csrfToken(),
    });
});

router.post(
    "/park/add",
    csrfProtection,
    parkValidators,
    asyncHandler(async (req, res, next) => {
        const {
            parkName,
            city,
            provinceState,
            country,
            size,
            opened,
            description,
        } = req.body;
        const park = db.Park.build({
            parkName,
            city,
            provinceState,
            country,
            size,
            opened,
            description,
        });

        const validatorErrors = validationResult(req);

        try {
            if (validatorErrors.isEmpty()) {
                await park.save();
                res.redirect("/");
            } else {
                const errors = validatorErrors
                    .array()
                    .map((error) => error.msg);

                res.render("park-add", {
                    title: "Add Park",
                    park,
                    errors,
                    csrfToken: req.csrfToken(),
                });
            }
        } catch (err) {
            if (err.name === "SequelizeValidationError") {
                const errors = err.errors.map((error) => error.message);
                res.render("park-add", {
                    title: "Add Park",
                    park,
                    errors,
                    csrfToken: req.csrfToken(),
                });
            } else {
                next(err);
            }
        }
    })
);

if (environment !== "production") {
    router.get("/error-test", () => {
        throw new Error("This is a test error.");
    });
}

module.exports = router;
