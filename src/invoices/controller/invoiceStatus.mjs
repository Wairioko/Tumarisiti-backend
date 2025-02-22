import { invoiceModel } from "../model/invoiceModel.mjs";

export const invoiceStatus = async (req, res) => {
    const { batchId } = req.query;

    if (!batchId) {
        return res.status(400).json({ error: "Missing batchId parameter" });
    }

    try {
        const invoices = await invoiceModel.find({ batchId });

        if (invoices.length === 0) {
            return res.status(404).json({ message: "No invoices found for this batchId" });
        }

        res.status(200).json(invoices);
    } catch (error) {
        console.error("Error retrieving invoice status:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

