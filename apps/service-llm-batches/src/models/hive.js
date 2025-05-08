import mongoose from 'mongoose';

const hiveSchema = new mongoose.Schema(
  {
    hiveId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    models: {
      type: [String],
      required: true,
      validate: {
        validator: function (array) {
          return array && array.length > 0;
        },
        message: 'At least one model must be specified',
      },
    },
  },
  { timestamps: true },
);

const Hive = mongoose.model('Hive', hiveSchema);

export default Hive;
