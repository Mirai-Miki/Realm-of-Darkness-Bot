'use strict';

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
}

module.exports.clientVersions =
{
    v5: '699084843069341766',
    v20: '898872627593097267',
    '699084843069341766': this.Versions.v5,
    '898872627593097267': this.Versions.v20
}