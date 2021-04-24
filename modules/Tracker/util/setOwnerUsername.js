module.exports.setOwnerUsername = (recvMess, char) =>
{
    const ownerID = char.owner;
    if (ownerID != recvMess.author.id) return;
    
    let name;
    if (recvMess.member) name = recvMess.member.displayName;
    else name = recvMess.author.username;

    char.ownerUsername = name;
}