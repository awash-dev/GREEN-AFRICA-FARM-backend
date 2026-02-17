import express from "express";
import TeamMember from "../models/TeamMember";

const router = express.Router();

// GET all team members
router.get("/", async (req, res) => {
    try {
        const members = await TeamMember.find({ is_active: true }).sort({ order: 1 });
        res.json({ success: true, data: members });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching team members", error });
    }
});

// POST new team member (including base64 image)
router.post("/", async (req, res) => {
    try {
        const count = await TeamMember.countDocuments();
        if (count >= 1) {
            return res.status(400).json({ success: false, message: "Only one leader is allowed." });
        }

        const member = new TeamMember(req.body);
        await member.save();
        res.status(201).json({ success: true, data: member });
    } catch (error) {
        res.status(400).json({ success: false, message: "Error creating team member", error });
    }
});

// PUT update team member
router.put("/:id", async (req, res) => {
    try {
        const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!member) return res.status(404).json({ success: false, message: "Member not found" });
        res.json({ success: true, data: member });
    } catch (error) {
        res.status(400).json({ success: false, message: "Error updating team member", error });
    }
});

// DELETE team member
router.delete("/:id", async (req, res) => {
    try {
        const member = await TeamMember.findByIdAndDelete(req.params.id);
        if (!member) return res.status(404).json({ success: false, message: "Member not found" });
        res.json({ success: true, message: "Member deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting team member", error });
    }
});

export default router;
