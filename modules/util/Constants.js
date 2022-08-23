'use strict';
const v20config = require('../../config20th.json')
const v5config = require('../../config5th.json')

module.exports.Splats = 
{
    // V20
    vampire20th: 'vampire20th',
    ghoul20th: 'ghoul20th',
    human20th: 'human20th',
    werewolf20th: 'werewolf20th',
    changeling20th: 'changeling20th',    
    mage20th: 'mage20th',
    wraith20th: 'wraith20th',    
    demonTF: 'demon20th',
    // V5
    vampire5th: 'vampire5th',
    mortal5th: 'mortal5th',
    hunter5th: 'hunter5th',
}

module.exports.Versions = 
{
    v20: '20th',
    v5: '5th',
}

module.exports.SplatVersions =
{
    [this.Splats.vampire20th]: this.Versions.v20,
    [this.Splats.ghoul20th]: this.Versions.v20,
    [this.Splats.human20th]: this.Versions.v20,
    [this.Splats.werewolf20th]: this.Versions.v20,
    [this.Splats.changeling20th]: this.Versions.v20,
    [this.Splats.mage20th]: this.Versions.v20,
    [this.Splats.wraith20th]: this.Versions.v20,
    [this.Splats.demonTF]: this.Versions.v20,
    [this.Splats.human20th]: this.Versions.v20,
    [this.Splats.vampire5th]: this.Versions.v5,
    [this.Splats.mortal5th]: this.Versions.v5,
    [this.Splats.hunter5th]: this.Versions.v5,
}

module.exports.clientVersions =
{
    v5: v5config.clientId,
    v20: v20config.clientId,
    [v5config.clientId]: this.Versions.v5,
    [v20config.clientId]: this.Versions.v20
}