const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: false },
    mapFlagIcon: { type: String, required: false },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: false,
    },
    canceled: { type: Boolean, default: false },
    canceledMessage: { type: String, default: null },
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    joined_by: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    created_by: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", EventSchema);

Event.collection.createIndex({ location: "2dsphere" });

module.exports = Event;
