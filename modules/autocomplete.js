"use strict";

/**
 * Autocompletes names based on the provided interaction and options.
 *
 * @param {Interaction} interaction - The interaction object.
 * @param {string} splat - The splat value.
 * @param {boolean} [sheet_only=false] - Indicates whether to only get names from the sheet.
 * @returns {Promise<Array<{ name: string, value: string }>>} - The filtered and mapped choices.
 */
const API = require("../realmAPI");

module.exports = async function autocomplete5th(
  interaction,
  splat,
  sheet_only = false
) {
  const focusedOption = interaction.options.getFocused(true);
  const focusedValue = focusedOption.value.toLowerCase();

  let choices = [];
  if (focusedOption.name === "discipline")
    choices = await API.getDisciplineNames(
      interaction.user.id,
      interaction.guild?.id
    );
  else if (focusedOption.name === "name") {
    choices = await API.getNamesList(
      interaction.user.id,
      interaction.guild?.id,
      splat,
      sheet_only
    );
  }

  const filtered = choices.filter((choice) =>
    choice.toLowerCase().startsWith(focusedValue)
  );
  return filtered.map((choice) => ({ name: choice, value: choice }));
};
