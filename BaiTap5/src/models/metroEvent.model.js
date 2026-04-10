const mongoose = require("mongoose");

const metroEventSchema = new mongoose.Schema(
  {
    ticketCode: { type: String, required: true, index: true },
    eventType: {
      type: String,
      enum: ["entry_validated", "manual_inspection"],
      required: true,
    },
    stationCode: { type: String, default: null },
    reason: { type: String, default: null },
    result: { type: String, default: null },
    performedBy: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      role: { type: String, required: true },
    },
    occurredAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MetroEvent", metroEventSchema);
