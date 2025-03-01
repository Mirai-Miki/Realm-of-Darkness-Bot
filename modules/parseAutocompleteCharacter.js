/**
 * Parses a character name from autocomplete that might contain special formatting
 * @param {string} name - The character name that might be in special format ~id|splat
 * @param {string} defaultSplat - The default splat to use if not specified in the name
 * @returns {Object} An object containing the parsed name, splat and pk
 */
module.exports = function parseAutocompleteCharacter(name, defaultSplat) {
  let result = {
    name: name,
    splat: defaultSplat || null,
    pk: undefined,
  };

  if (name && name.startsWith("~")) {
    const parts = name.substring(1).split("|");
    if (parts.length === 2) {
      result.pk = parts[0];
      result.splat = parts[1];
      result.name = null; // Name isn't used when we have pk and splat
    }
  }

  return result;
};
