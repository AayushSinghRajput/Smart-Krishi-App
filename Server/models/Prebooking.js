const mongoose = require("mongoose");

const PrebookingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  item_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  item_type: { 
    type: String, 
    enum: ["crop", "tool"], 
    required: true 
  },
  quantity: { 
    type: Number, 
    default: 0 
  }, // For crops
  rentalHours: { 
    type: Number, 
    default: 0 
  }, // For tools/machines
  preferred_date: { 
    type: Date, 
    default: Date.now 
  }, // For crops
  startDate: { 
    type: Date 
  }, // For machines
  endDate: { 
    type: Date 
  }, // For machines
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending",
  },
  notes: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Update timestamp on save
PrebookingSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model("Prebooking", PrebookingSchema);
