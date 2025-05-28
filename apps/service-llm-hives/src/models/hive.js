import mongoose from 'mongoose';

const LLMHiveSchema = new mongoose.Schema({
  id: { type: String, required: true }, // name of the hive
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  large_language_models: {
    type: [String],
    validate: {
      validator: function (v) {
        return Array.isArray(v) && v.length >= 2;
      },
      message: 'A hive must contain at least 2 language models.',
    },
    required: true,
  },
});

const HiveDocumentSchema = new mongoose.Schema({
  ownerId: { type: String, required: true }, // matches Auth0 `sub`
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  hives: { type: [LLMHiveSchema], default: [] },
  schemaVersion: { type: Number, default: 1 },
});

export const Hives = mongoose.model('HiveDocument', HiveDocumentSchema);
