'use strict'
const { RealmError, ErrorCodes } = require('../Errors');
const API = require('../realmAPI');

module.exports = async function getNamesLists(interaction)
{
  const requestedUser = interaction.arguments.player ?? interaction.user;
  const names = await API.getCharacterList(requestedUser, interaction.guild);

  if (!names) throw new RealmError({code: ErrorCodes.NoNamesList});

  const lists = [];
  let count = 0;
  let currentList = [];
  
  for (const char of names)
  {    
    if (count === 25)
    {
      count = 0;
      lists.push(currentList);
      currentList = [];
    }
    count++;
    currentList.push({
      label: char.name,
      value: char.id,
      description: `Server: ${char.guildName ?? 'None'}`
    })
  }

  if (currentList.length) lists.push(currentList);
  return lists;
}