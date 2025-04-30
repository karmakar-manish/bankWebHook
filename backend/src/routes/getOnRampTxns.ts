import express from "express"
import { PrismaClient } from "@prisma/client"

const client = new PrismaClient()


const router = express.Router()

//it will return all the onRampTransactions which are pending
router.post("/", async (req: any, res:any) => {

   
    
    //find all the pending requests of the user
    const data = await client.onRampTransaction.findMany({
        where: {
            status: "Processing"
        }
    })

    res.json({
        data: data
    })
})

export default router;