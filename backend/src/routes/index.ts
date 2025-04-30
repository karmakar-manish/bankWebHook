import express from "express"
import bankWebHook from "./bankWebHook"
import getOnRampTxns from "./getOnRampTxns"

const router = express.Router()

router.use("/bankWebHook", bankWebHook)
router.use("/getOnRampTxns", getOnRampTxns)


export default router;