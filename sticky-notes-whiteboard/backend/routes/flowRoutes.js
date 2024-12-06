const express = require("express")
const flowController = require('../controllers/flowController')

const router = express.Router()

router.post('/', flowController.createFlow)
router.get('/', flowController.getFlows)
router.get("/:id", flowController.getFlowById);
router.delete("/:id", flowController.deleteFlow);

module.exports = router;
