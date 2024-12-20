const mongoose = require('mongoose');
const assistantSchema = require('./schema/assistant');
const assistantHistorySchema = require('./schema/assistantHistorySchema');

const Assistant = mongoose.model('assistant', assistantSchema);


/**
 * Logs changes to assistant instructions in the assistantHistory collection.
 * @param {string} assistant_id - The ID of the assistant.
 * @param {string} userId - The ID of the user making the change.
 * @param {string} instructions - The new or updated instructions.
 * @param {string} assistantName - The name of the assistant.
 * @returns {Promise} Resolves when the log entry is created.
 */
const logAssistantHistory = async (assistant_id, userId, instructions, assistantName) => {
  try {
    await assistantHistorySchema.create({
      assistant_id,
      user: userId,
      instructions,
      assistantName
    });
  } catch (error) {
    console.error('Error logging assistant history:', error);
    throw error;
  }
};
/**
 * Update an assistant with new data without overwriting existing properties,
 * or create a new assistant if it doesn't exist.
 *
 * @param {Object} searchParams - The search parameters to find the assistant to update.
 * @param {string} searchParams.assistant_id - The ID of the assistant to update.
 * @param {string} searchParams.user - The user ID of the assistant's author.
 * @param {Object} updateData - An object containing the properties to update.
 * @returns {Promise<AssistantDocument>} The updated or newly created assistant document as a plain object.
 */
const updateAssistantDoc = async (searchParams, updateData) => {
  const options = { new: true, upsert: true };
  return await Assistant.findOneAndUpdate(searchParams, updateData, options).lean();
};

/**
 * Retrieves an assistant document based on the provided ID.
 *
 * @param {Object} searchParams - The search parameters to find the assistant to update.
 * @param {string} searchParams.assistant_id - The ID of the assistant to update.
 * @param {string} searchParams.user - The user ID of the assistant's author.
 * @returns {Promise<AssistantDocument|null>} The assistant document as a plain object, or null if not found.
 */
const getAssistant = async (searchParams) => await Assistant.findOne(searchParams).lean();

/**
 * Retrieves all assistants that match the given search parameters.
 *
 * @param {Object} searchParams - The search parameters to find matching assistants.
 * @param {Object} [select] - Optional. Specifies which document fields to include or exclude.
 * @returns {Promise<Array<AssistantDocument>>} A promise that resolves to an array of assistant documents as plain objects.
 */
const getAssistants = async (searchParams, select = null) => {
  let query = Assistant.find(searchParams);

  if (select) {
    query = query.select(select);
  }

  return await query.lean();
};

/**
 * Deletes an assistant based on the provided ID.
 *
 * @param {Object} searchParams - The search parameters to find the assistant to delete.
 * @param {string} searchParams.assistant_id - The ID of the assistant to delete.
 * @param {string} searchParams.user - The user ID of the assistant's author.
 * @returns {Promise<void>} Resolves when the assistant has been successfully deleted.
 */
const deleteAssistant = async (searchParams) => {
  return await Assistant.findOneAndDelete(searchParams);
};

module.exports = {
  updateAssistantDoc,
  deleteAssistant,
  getAssistants,
  getAssistant,
  logAssistantHistory
};
