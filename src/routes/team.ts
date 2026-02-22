import express from "express";
import TeamMember from "../models/TeamMember";
const router = express.Router();

// GET all team members (Optimized to exclude large base64 strings)
router.get("/", async (req, res) => {
    try {
        const members = await TeamMember.find({ is_active: true })
            .sort({ order: 1 })
            .lean();

        const formattedMembers = members.map((m: any) => {
            return { ...m, id: m._id.toString(), _id: m._id.toString() };
        });
        res.json({ success: true, data: formattedMembers });
    } catch (error) {
        console.error("Error in team fetch:", error);
        res.status(500).json({ success: false, message: "Error fetching team members", error });
    }
});

// POST new team member (including file upload)
router.post("/", async (req, res) => {
    try {
        const count = await TeamMember.countDocuments();
        if (count >= 1) {
            return res.status(400).json({ success: false, message: "Only one leader is allowed." });
        }

        const memberData = { ...req.body };
        // image_base64 is now expected in req.body
        if (memberData.image_base64) memberData.image_url = "";

        const member = new TeamMember(memberData);
        await member.save();
        res.status(201).json({ success: true, data: member });
    } catch (error) {
        console.error("Error creating team member:", error);
        res.status(400).json({ success: false, message: "Error creating team member", error });
    }
});

// PUT update team member
router.put("/:id", async (req, res) => {
    try {
        const updateData = { ...req.body };
        // image_base64 is now expected in req.body
        if (updateData.image_base64) updateData.image_url = "";

        const member = await TeamMember.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!member) return res.status(404).json({ success: false, message: "Member not found" });
        res.json({ success: true, data: member });
    } catch (error) {
        console.error("Error updating team member:", error);
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
