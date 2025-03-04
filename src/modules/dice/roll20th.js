"use strict";
require(`${process.cwd()}/alias`);
const { EmbedBuilder } = require("discord.js");
const { trimString } = require("@modules/misc");
const { RealmError, ErrorCodes } = require("@errors");
const RollResults20th = require("@structures/RollResults20th");
const { Emoji } = require("@constants");
const getCharacter = require("@modules/dice/getCharacter");
const API = require("@api");


module.exports = async function roll20th(interaction) {
  if (interaction.options.getSubcommand() === "attack") {
    return handleCombatRoll(interaction);
  }

  interaction.arguments = await getArgs(interaction);
  applyDicePenalty(interaction);
  interaction.results = new RollResults20th(interaction.arguments);
  await updateWillpower(interaction);
  return { content: getContent(interaction), embeds: [getEmbed(interaction)] };
};

async function handleCombatRoll(interaction) {
  const args = await getCombatArgs(interaction);
  const embeds = [];
  

  // Get character names
  args.attacker = await getCharacter(args.attacker_name, interaction);
  args.defender = await getCharacter(args.defender_name, interaction);

  // 1. Attack Roll
  const attackRoll = await performCombatRoll(interaction, {
    ...args,
    pool: args.attack_pool,
    description: `⚔️ ${args.attacker.name} Attack (${args.attack_pool}d10)`
  });
  embeds.push(attackRoll.embed);

  // 2. Defense Roll
  const defenseRoll = await performCombatRoll(interaction, {
    ...args,
    pool: args.defense_pool,
    description: `🛡️ ${args.defender.name} Defense (${args.defense_pool}d10)`
  });
  embeds.push(defenseRoll.embed);

  // 3. Calculate Net Successes
  const netSuccesses = attackRoll.results.total - defenseRoll.results.total;
  
  if (netSuccesses > 0) {
    // 4. Calculate and Roll Damage
    const damagePool = args.damage_pool + netSuccesses;
    const damageRoll = await performCombatRoll(interaction, {
      ...args,
      pool: damagePool,
      description: `💥 ${args.damage_type.toUpperCase()} Damage (${damagePool}d10)`
    });
    embeds.push(damageRoll.embed);

    // 5. Calculate and Roll Absorption
    const effectiveAbsorption = args.damage_type === "aggravated" 
      ? Math.floor(args.absorption_pool / 2) 
      : args.absorption_pool;
    
    const absorptionRoll = await performCombatRoll(interaction, {
      ...args,
      pool: effectiveAbsorption,
      description: `🛡️ ${args.damage_type.toUpperCase()} Absorption (${effectiveAbsorption}d10)`
    });
    embeds.push(absorptionRoll.embed);

    // 6. Calculate Final Damage
    const finalDamage = Math.max(0, damageRoll.results.total - absorptionRoll.results.total);
    
    // 8. Summary Embed
    if (args.defender?.tracked?.health) {
      applyDamage(args.defender, finalDamage, args.damage_type);
      embeds.push(createHealthEmbed(args.defender));
    }

    // 8. Embed de Resumen
    const summaryEmbed = new EmbedBuilder()
      .setTitle("🔥 Combat Result")
      .setColor(getDamageColor(args.damage_type))
      .addFields(
        { name: "Attacker", value: args.attacker.name, inline: true },
        { name: "Defender", value: args.defender.name, inline: true },
        { name: "Net Successes", value: netSuccesses.toString(), inline: true },
        { name: "Damage Type", value: args.damage_type.toUpperCase(), inline: true },
        { name: "Damage Dealt", value: damageRoll.results.total.toString(), inline: true },
        { name: "Absorption", value: absorptionRoll.results.total.toString(), inline: true },
        { name: "Final Damage", value: `${finalDamage} ${args.damage_type.toUpperCase()}`, inline: false }
      );
    embeds.push(summaryEmbed);
  } else {
    embeds.push(new EmbedBuilder()
      .setColor(0x00FF00)
      .setDescription("🎯 Attack was completely defended!"));
  }

  return { embeds };
}

async function performCombatRoll(interaction, args) {
  interaction.arguments = args;
  applyDicePenalty(interaction);
  interaction.results = new RollResults20th(interaction.arguments);
  
  return {
    embed: getCombatEmbed(interaction, args.description),
    results: interaction.results
  };
}

function getCombatEmbed(interaction, title) {
  const args = interaction.arguments;
  const results = interaction.results;
  const outcomeText = results.total > 0 ? "Success!" : 
                     results.blackDice.filter(d => d === 1).length > results.total ? 
                     "Botch!" : "Failure";

  const embed = new EmbedBuilder()
    .setTitle(title)
    .setColor(0x8B0000)
    .addFields(
      {
        name: "Dice",
        value: results.blackDice.map(d => {
          if (d === 10) return Emoji.green10;
          return d >= 6 ? Emoji[`green${d}`] : Emoji[`red${d}`];
        }).join(" "),
        inline: true
      },
      {
        name: "Successes",
        value: `${results.total} (Difficulty ${args.difficulty})`,
        inline: true
      },
      {
        name: "Outcome",
        value: outcomeText,
        inline: false
      }
    );

  if (args.notes) {
    embed.addFields({ name: "Notes", value: args.notes, inline: false });
  }

  return embed;
}

async function getCombatArgs(interaction) {
  return {
    attacker_name: interaction.options.getString("name"),
    defender_name: interaction.options.getString("name"),
    attack_pool: interaction.options.getInteger("attack_pool"),
    defense_pool: interaction.options.getInteger("defense_pool"),
    damage_pool: interaction.options.getInteger("damage_pool"),
    damage_type: interaction.options.getString("damage_type"),
    absorption_pool: interaction.options.getInteger("absorption_pool"),
    difficulty: 6,
  };
}

function applyDamage(character, amount, type) {
  if (!character?.tracked?.health) return;
  
  const health = character.tracked.health;
  switch(type) {
    case "bashing":
      health.bashing = Math.min(health.bashing + amount, health.max);
      break;
    case "lethal":
      health.lethal = Math.min(health.lethal + amount, health.max - health.bashing);
      break;
    case "aggravated":
      health.aggravated = Math.min(health.aggravated + amount, health.max - health.bashing - health.lethal);
      break;
  }
}

function createHealthEmbed(character) {
  return new EmbedBuilder()
    .setTitle(`${character.name}'s Health`)
    .setColor(0x8B0000)
    .addFields(
      { name: "Bashing", value: character.tracked.health.bashing.toString(), inline: true },
      { name: "Lethal", value: character.tracked.health.lethal.toString(), inline: true },
      { name: "Aggravated", value: character.tracked.health.aggravated.toString(), inline: true }
    );
}

function getDamageColor(type) {
  const colors = {
    bashing: 0xFFFF00,  // yellow
    lethal: 0xFF0000,    // red
    aggravated: 0x8B0000 // red dark
  };
  return colors[type] || 0x808080;
}

async function getArgs(interaction) {
  const args = {
    pool: interaction.options.getInteger("pool"),
    difficulty: interaction.options.getInteger("difficulty"),
    willpower: interaction.options.getBoolean("willpower"),
    mod: interaction.options.getInteger("modifier"),
    spec: interaction.options.getString("speciality"),
    notes: interaction.options.getString("notes"),
    nightmare: interaction.options.getInteger("nightmare"),
    character: await getCharacter(
      trimString(interaction.options.getString("character")),
      interaction
    ),
    cancelOnes: interaction.options.getBoolean("no_botch"),
  };

  if ((args.nightmare ?? 0) > args.pool)
    throw new RealmError({ code: ErrorCodes.NightmareOutOfRange });

  if (!args.character && interaction.guild) {
    const defaults = await API.characterDefaults.get(
      interaction.client,
      interaction.guild.id,
      interaction.user.id
    );
    if (defaults)
      args.character = await getCharacter(defaults.name, interaction);
  }

  return args;
}

function applyDicePenalty(interaction) {
  if (interaction.arguments.character?.tracked?.health) {
    const dicePenalty = extractDicePenalty(interaction.arguments);
    interaction.arguments.pool -= dicePenalty;

    // Ensure the pool doesn't go below 1
    if (interaction.arguments.pool < 1) {
      interaction.arguments.pool = 1;
    }
  }
}

function extractDicePenalty(interaction) {
  const healthStatus = interaction.character?.tracked.health.damageInfo;
  const match = healthStatus.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

function getContent(interaction) {
  const results = interaction.results;
  const args = interaction.arguments;
  const diff = args.difficulty ?? 1;
  let content = "";

  for (const dice of results.blackDice) {
    if (dice === 10 && args.spec) content += Emoji.black_crit;
    else if (dice === 10) content += Emoji.green10;
    else if (dice >= diff) content += DiceSuxEmotes[dice];
    else if (dice < diff && (dice != 1 || args.cancelOnes))
      content += DiceFailEmotes[dice];
    else content += Emoji.botch;
    content += " ";
  }

  if (content.length && args.nightmare) content += Emoji.butterfly;
  for (const dice of results.nightmareDice) {
    if (dice === 10) content += Emoji.nightmare;
    else if (dice >= diff) content += DiceSuxEmotes[dice];
    else if (dice < diff && (dice != 1 || args.cancelOnes))
      content += DiceFailEmotes[dice];
    else content += Emoji.botch;
    content += " ";
  }
  return content;
}

async function updateWillpower(interaction) {
  const character = interaction.arguments.character?.tracked;
  if (!character || !interaction.arguments.willpower) return;
  if (character.version !== "20th") return;
  if (character.willpower.current === 0)
    throw new RealmError({ code: ErrorCodes.NoWillpower });

  const change = { command: "Dice Roll", willpower: -1 };
  character.updateFields(change);
  await character.save(interaction.client);
  interaction.followUps = [{ embeds: [character.getEmbed()], ephemeral: true }];
}

function getEmbed(interaction) {
  const args = interaction.arguments;
  const results = interaction.results;
  const damageInfo = args.character?.tracked?.health.damageInfo ?? null;
  const embed = new EmbedBuilder();

  embed.setAuthor({
    name:
      interaction.member?.displayName ??
      interaction.user.displayName ??
      interaction.user.username,
    iconURL:
      interaction.member?.displayAvatarURL() ??
      interaction.user.displayAvatarURL(),
  });

  let title = `Pool ${args.pool} | Diff ${args.difficulty}`;
  if (args.nightmare) title += ` | Nightmare ${args.nightmare}`;
  if (args.willpower) title += ` | WP`;
  if (args.mod) title += ` | Mod ${args.mod}`;
  if (args.spec) title += ` | Spec`;
  if (args.cancelOnes) title += ` | No Botch`;
  embed.setTitle(title);

  if (args.character) {
    embed.addFields({
      name: "Character",
      value: args.character.name,
    });

    if (damageInfo) {
      embed.addFields({
        name: "Dice penalty",
        value: damageInfo.split("\n")[0], // Only include the first line
      });
    }

    if (args.character.tracked?.thumbnail)
      embed.setThumbnail(args.character.tracked.thumbnail);
  }

  if (results.blackDice.length)
    embed.addFields({
      name: "Dice",
      value: results.getSortedString(results.blackDice, args),
      inline: true,
    });

  if (results.nightmareDice.length)
    embed.addFields({
      name: "Nightmare",
      value: results.getSortedString(results.nightmareDice, args),
      inline: true,
    });

  if (args.spec)
    embed.addFields({
      name: "Specialty",
      value: args.spec,
      inline: true,
    });

  if (args.mod)
    embed.addFields({
      name: "Modifier",
      value: args.mod.toString(),
      inline: true,
    });

  if (args.notes)
    embed.addFields({
      name: "Notes",
      value: args.notes,
      inline: false,
    });

  embed.addFields({
    name: "Result",
    value: `Rolled: ${results.total} Sux\n${results.outcome.toString}`,
    inline: false,
  });

  embed.setColor(results.outcome.color);

  const links =
    "\n[Website](https://realmofdarkness.app/) " +
    "| [Commands](https://realmofdarkness.app/20th/commands/) " +
    "| [Patreon](https://www.patreon.com/MiraiMiki)";
  embed.data.fields.at(-1).value += links;

  embed.setURL("https://realmofdarkness.app/");
  return embed;
}

const DiceSuxEmotes = {
  1: Emoji.green1,
  2: Emoji.green2,
  3: Emoji.green3,
  4: Emoji.green4,
  5: Emoji.green5,
  6: Emoji.green6,
  7: Emoji.green7,
  8: Emoji.green8,
  9: Emoji.green9,
  10: Emoji.green10,
};

const DiceFailEmotes = {
  1: Emoji.red1,
  2: Emoji.red2,
  3: Emoji.red3,
  4: Emoji.red4,
  5: Emoji.red5,
  6: Emoji.red6,
  7: Emoji.red7,
  8: Emoji.red8,
  9: Emoji.red9,
  10: Emoji.red10,
};