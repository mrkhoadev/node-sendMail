const sendMail = require("../utils/mail");
const { HistoryEmail } = require("../models/index");
const { string } = require("yup");
const path = require('path');

const imgPath = path.join(__dirname, '../assets/images/test.png');


module.exports = {
    index: async (req, res, next) => {
        const data = await HistoryEmail.findAll({
            order: [
                ["created_at", "desc"],
                ["id", "desc"]
            ],
        });
        res.render("index", { data, req })
    },
    sendMail: async (req, res, next) => {
        res.render("form/sendMail", { req })
    },
    handleSendMail: async (req, res, next) => {
        try {
            const validate = await req.validate(req.body, {
                email: string()
                        .required("Email bắt buộc phải nhập")
                        .email("Email không đúng định dạng"),
                title: string()
                        .required("Tiêu đề bắt buộc phải nhập"),
                content: string()
                        .required("Nội dung bắt buộc phải nhập"),
            })
            if (validate) {
                const createData = await HistoryEmail.create(validate);
                if (createData) {
                    const info = await sendMail(
                        validate.email,
                        validate.title,
                        `${validate.content} <img src="${process.env.HOSTING}/sendFile/${createData.id}" style="width: 10px; height: 10px;" alt="Tracking Pixel" />`,
                    )
                    if (info) {
                        req.flash("msg", "Gửi thành công");
                        return res.redirect("/")
                    }
                }
                req.flash("error", "Gửi thất bại");
            }
            req.flash("old", req.body);
        } catch (e) {
            return next(e)
        }
        
        return res.redirect("/send-mail");
    },
    detailSendmail: async (req, res, next) => {
        const { id } = req.params;
        try {
            const data = await HistoryEmail.findOne({
                where: {
                    id 
                }
            });
            if (!data) {
                throw new Error("Không tìm thấy!")
            }
            res.render("form/detail", { data, req })
        } catch (e) {
            return next(e)
        }
    },
    sendFile: (req, res, next) => {
        const { id } = req.params;
        const options = {
            root: path.join(__dirname, '..')
        };
        res.sendFile('assets/images/test.png', options, async function (err) {
            if (err) {
                console.error('Error sending file:', err);
                res.status(err.status).end();
            } else {
                try {
                    const result = await HistoryEmail.update(
                        {
                            status: true,
                        },
                        {
                            where: {
                                id
                            }
                        }
                    )
                    if (!result) {
                        throw new Error("Không tồn tại!")
                    }
                } catch (e) {
                    console.log(e);
                    return next(e)
                }
            }
        });
    }
}