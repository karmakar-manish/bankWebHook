import express from "express"
import { PrismaClient } from "@prisma/client"
const client = new PrismaClient()

const router = express.Router()


router.get("/test", (req, res): any => {
    return res.json({
        message: "Hi there!"
    })
})

router.post("/webHook", async (req, res) => {

    //check if this request came from hdfc bank, use a webhook secret here

    const paymentInformation = {
        token: req.body.token,
        userId: req.body.userId,
        amount: req.body.amount
    }

    
    //transactions, we want both of them to happen or none to happen

    try {
        await client.$transaction([
            //update balance in database and add transaction
            client.balance.updateMany({
                where: {
                    userId: Number(paymentInformation.userId)
                },
                data: {
                    amount: {
                        increment: Number(paymentInformation.amount)
                    }
                }
            }),
            client.onRampTransaction.updateMany({
                where: {
                    token: paymentInformation.token,
                },
                data: {
                    status: "Success"
                }
            })
        ])
        //telling the hdfc bank that everything went well
        res.status(200).json({
            message: "captured"
        })
    } catch (err) {
        console.log(err);
        //hdfc bank will refund the amount to the user
        //telling the hdfc bank that everything went well
        res.status(411).json({
            message: "Error while processing webhook!"
        })
    }
})

export default router;