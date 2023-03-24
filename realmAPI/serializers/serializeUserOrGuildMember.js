'use strict'

module.exports = function serializeUserOrGuildMember(object)
{
  if (!object) return null;
  else return {
    id: object.id,
    username: object.user ? object.user.username : object.username,
    discriminator: object.user ? object.user.discriminator : object.discriminator,
    avatarURL: object.displayAvatarURL(),
    displayName: object.user ? object.displayName : null
  }
}