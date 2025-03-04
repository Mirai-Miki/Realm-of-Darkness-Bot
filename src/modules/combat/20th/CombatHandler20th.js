"use strict";
const { EmbedBuilder } = require("discord.js");
const { Emoji } = require("@constants");
const getCharacter = require("@modules/dice/getCharacter");
const RollResults20th = require("@structures/RollResults20th");

class CombatHandler20th {
  constructor(interaction) {
    this.interaction = interaction;
    this.embeds = [];
    this.attackRoll = null;
    this.defenseRoll = null;
    this.finalDamage = 0;
  }

  async handleCombat() {
    const args = await this.getCombatArgs();
    
    // 1. Retrieve character data
    args.attacker = await getCharacter(args.attackerName, this.interaction);
    args.defender = await getCharacter(args.defenderName, this.interaction);

    // 2. Process Attack Roll
    await this.processAttack(args);
    // 3. Process Defense Roll
    await this.processDefense(args);
    
    // Calculate combat outcome
    const netSuccesses = this.attackRoll.results.total - this.defenseRoll.results.total;
    
    if (netSuccesses > 0) {
      // 5. Calculate and Roll Damage
      // 6. Calculate and Roll Absorption
      await this.processDamage(args, netSuccesses);
      // 7. Apply Final Damage in processDamage      
      // 8. Create Combat Summary
      this.createSummaryEmbed(args, netSuccesses);
    } else {
      // 9. Defense Success Case
      this.addDefenseSuccessEmbed();
    }
    return { embeds: this.embeds };
  }

  async processAttack(args) {
    this.attackRoll = await this.performCombatRoll({
      ...args,
      pool: args.attackPool,
      description: `⚔️ ${args.attacker.name} Attack (${args.attackPool}d10)`
    });
    this.embeds.push(this.attackRoll.embed);
  }

  async processDefense(args) {
    this.defenseRoll = await this.performCombatRoll({
      ...args,
      pool: args.defensePool,
      description: `🛡️ ${args.defender.name} Defense (${args.defensePool}d10)`
    });
    this.embeds.push(this.defenseRoll.embed);
  }

  async processDamage(args, netSuccesses) {
    // Calculate and roll damage
    const damageRoll = await this.rollDamage(args, netSuccesses);
    
    // Calculate and roll absorption
    const absorptionRoll = await this.rollAbsorption(args);
    
    // Apply final damage calculations
    this.applyFinalDamage(args, damageRoll, absorptionRoll);
  }

  async rollDamage(args, netSuccesses) {
    const damagePool = args.damagePool + netSuccesses;
    const damageRoll = await this.performCombatRoll({
      ...args,
      pool: damagePool,
      description: `💥 ${args.damageType.toUpperCase()} Damage (${damagePool}d10)`
    });
    this.embeds.push(damageRoll.embed);
    return damageRoll;
  }

  async rollAbsorption(args) {
    const effectiveAbsorption = args.damageType === "aggravated" 
      ? Math.floor(args.absorptionPool / 2) 
      : args.absorptionPool;
    
    const absorptionRoll = await this.performCombatRoll({
      ...args,
      pool: effectiveAbsorption,
      description: `🛡️ ${args.damageType.toUpperCase()} Absorption (${effectiveAbsorption}d10)`
    });
    this.embeds.push(absorptionRoll.embed);
    return absorptionRoll;
  }

  applyFinalDamage(args, damageRoll, absorptionRoll) {
    this.finalDamage = Math.max(0, damageRoll.results.total - absorptionRoll.results.total);
    
    if (args.defender?.tracked?.health) {
      this.applyDamage(args.defender, this.finalDamage, args.damageType);
      this.embeds.push(this.createHealthEmbed(args.defender));
    }
  }

  async getCombatArgs() {
    return {
      attackerName: this.interaction.options.getString("name"),
      defenderName: this.interaction.options.getString("name"),
      attackPool: this.interaction.options.getInteger("attack_pool"),
      defensePool: this.interaction.options.getInteger("defense_pool"),
      damagePool: this.interaction.options.getInteger("damage_pool"),
      damageType: this.interaction.options.getString("damage_type"),
      absorptionPool: this.interaction.options.getInteger("absorption_pool"),
      difficulty: 6,
    };
  }

  async performCombatRoll(args) {
    this.interaction.arguments = args;
    this.applyDicePenalty();
    this.interaction.results = new RollResults20th(this.interaction.arguments);
    
    return {
      embed: this.createCombatEmbed(args.description),
      results: this.interaction.results
    };
  }

  createCombatEmbed(title) {
    const args = this.interaction.arguments;
    const results = this.interaction.results;
    
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
  applyDicePenalty() {
    if (this.interaction.arguments.character?.tracked?.health) {
      const healthStatus = this.interaction.arguments.character.tracked.health.damageInfo;
      const match = healthStatus?.match(/\d+/);
      const dicePenalty = match ? parseInt(match[0], 10) : 0;
      
      this.interaction.arguments.pool = Math.max(
        1, 
        this.interaction.arguments.pool - dicePenalty
      );
    }
  }
  applyDamage(character, amount, type) {
    if (!character?.tracked?.health) return;
    
    const health = character.tracked.health;
    health.bashing = health.bashing || 0;
    health.lethal = health.lethal || 0;
    health.aggravated = health.aggravated || 0;
    health.max = health.max || 7;
  
    switch(type.toLowerCase()) {
      case "bashing":
        health.bashing = Math.min(health.bashing + amount, health.max);
        break;
      case "lethal":
        health.lethal = Math.min(
          health.lethal + amount, 
          health.max - health.bashing
        );
        break;
      case "aggravated":
        health.aggravated = Math.min(
          health.aggravated + amount, 
          health.max - health.bashing - health.lethal
        );
        break;
    }
  }
  createHealthEmbed(character) {
    const health = character.tracked.health;
    
    const bashing = health.bashing || 0;
    const lethal = health.lethal || 0;
    const aggravated = health.aggravated || 0;
  
    return new EmbedBuilder()
      .setTitle(`${character.name}'s Health`)
      .setColor(0x8B0000)
      .addFields(
        { name: "Bashing", value: bashing.toString(), inline: true },
        { name: "Lethal", value: lethal.toString(), inline: true },
        { name: "Aggravated", value: aggravated.toString(), inline: true }
      );
  }
  createSummaryEmbed(args, netSuccesses) {
    const summaryEmbed = new EmbedBuilder()
      .setTitle("🔥 Combat Result")
      .setColor(this.getDamageColor(args.damageType))
      .addFields(
        { name: "Attacker", value: args.attacker.name, inline: true },
        { name: "Defender", value: args.defender.name, inline: true },
        { name: "Net Successes", value: netSuccesses.toString(), inline: true },
        { name: "Damage Type", value: args.damageType.toUpperCase(), inline: true },
        { name: "Final Damage", value: `${this.finalDamage} ${args.damageType.toUpperCase()}`, inline: false }
      );
    
    this.embeds.push(summaryEmbed);
  }
  getDamageColor(type) {
    const colors = {
      bashing: 0xFFFF00,
      lethal: 0xFF0000,
      aggravated: 0x8B0000
    };
    return colors[type.toLowerCase()] || 0x808080;
  }
  addDefenseSuccessEmbed() {
    this.embeds.push(new EmbedBuilder()
      .setColor(0x00FF00)
      .setDescription("🎯 Attack was completely defended!")
    );
  }
}
module.exports = CombatHandler20th;