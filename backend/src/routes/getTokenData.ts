//function to get the token details given the tokenid
import express from "express"
import { PrismaClient } from "@prisma/client"
const client = new PrismaClient()

const router = express.Router()

router.post("/getTokenData", async(req:any, res:any)=>{
    
})