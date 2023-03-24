'use strict'
const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const { InitPhase } = require('../../Constants');

module.exports.getInitiativeButtonRow = function(phase)
{
  if (phase <= InitPhase.ROLL) return rollPhaseOne;
  else if (phase === InitPhase.REVEAL) return revealPhase;
  else if (phase === InitPhase.DECLARE) return declarePhaseOne; 
}


    /*
    Roll Phase:
        {End} - Less then 2 people have rolled
        {Reveal Initiative, End} - 2 or more have rolled
    
    Reveal Phase:
        {Next Round, Declare Actions, End}
    
    Decalare Phase:
        {End} - When not everyone has declared
        {Next Round, End} - When everyone has declared
    */
   
const rollPhaseOne = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
    .setCustomId(ComponentCID.INIT_END)
    .setLabel('End Initiative')
    .setStyle(ButtonStyle.Danger)
  );
    
const rollPhaseTwo = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
    .setCustomId(ComponentCID.INIT_REVEAL)
    .setLabel('Reveal Initiative')
    .setStyle(ButtonStyle.Primary)
  )
  .addComponents(
    new ButtonBuilder()
    .setCustomId(ComponentCID.INIT_END)
    .setLabel('End Initiative')
    .setStyle(ButtonStyle.Danger)
  ); 

const revealPhase = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
    .setCustomId(ComponentCID.INIT_NEXT_ROUND)
    .setLabel('Next Round')
    .setStyle(ButtonStyle.Primary)
  )
  .addComponents(
    new ButtonBuilder()
    .setCustomId(ComponentCID.INIT_DECLARE)
    .setLabel('Declare Actions')
    .setStyle(ButtonStyle.Secondary)
  )
  .addComponents(
    new ButtonBuilder()
    .setCustomId(ComponentCID.INIT_END)
    .setLabel('End Initiative')
    .setStyle(ButtonStyle.Danger)
  );

const declarePhaseOne = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
    .setCustomId(ComponentCID.INIT_END)
    .setLabel('End Initiative')
    .setStyle(ButtonStyle.Danger)
  );
    
const declarePhaseTwo = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
    .setCustomId(ComponentCID.INIT_NEXT_ROUND)
    .setLabel('Next Round')
    .setStyle(ButtonStyle.Primary)
  )
  .addComponents(
    new ButtonBuilder()
    .setCustomId(ComponentCID.INIT_END)
    .setLabel('End Initiative')
    .setStyle(ButtonStyle.Danger)
  );
    
module.exports.confirmNewTracker = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
    .setCustomId(ComponentCID.INIT_CONFIRM)
    .setLabel('Confirm')
    .setStyle(ButtonStyle.Primary)
  )