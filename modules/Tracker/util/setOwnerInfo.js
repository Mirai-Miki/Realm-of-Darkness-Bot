module.exports.setOwnerInfo = (recvMess, char) =>
{
    const ownerID = char.owner.id;
    if (ownerID != recvMess.author.id) return;

    char.owner.avatarURL = recvMess.author.avatarURL();
    if (recvMess.member) char.owner.username = recvMess.member.displayName;
    else char.owner.username = recvMess.author.username;
}