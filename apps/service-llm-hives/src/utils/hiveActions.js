import { Hives } from '../models/hive.js';

export async function deleteHivesByOwner(ownerId) {
  if (!ownerId) throw new Error('Missing ownerId');
  const result = await Hives.deleteMany({ ownerId });
  console.log(`[deleteHivesByOwner] Deleted count: ${result.deletedCount} for ownerId: ${ownerId}`);
  return result.deletedCount;
}
