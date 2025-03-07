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
    this.damageRoll = null;
    this.absorptionRoll = null;
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
      this.applyFinalDamage(args);
    }

    this.createMainEmbed(args, netSuccesses);
    return { embeds: this.embeds };
  }

  async processAttack(args) {
    this.attackRoll = await this.performCombatRoll({
      ...args,
      pool: args.attackPool,
      character: args.attacker,
      description: "Attack Roll"
    });
  }

  async processDefense(args) {
    this.defenseRoll = await this.performCombatRoll({
      ...args,
      pool: args.defensePool,
      character: args.defender,
      description: "Defense Roll"
    });
  }

  async processDamage(args, netSuccesses) {
    const damagePool = args.damagePool + netSuccesses;
    this.damageRoll = await this.performCombatRoll({
      ...args,
      pool: damagePool,
      description: "Damage Roll"
    });

    const effectiveAbsorption = args.damageType === "aggravated" 
      ? Math.floor(args.absorptionPool / 2) 
      : args.absorptionPool;
    
    this.absorptionRoll = await this.performCombatRoll({
      ...args,
      pool: effectiveAbsorption,
      description: "Absorption Roll"
    });

    this.finalDamage = Math.max(0, this.damageRoll.results.total - this.absorptionRoll.results.total);
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
    this.applyDicePenalty(args.character);
    
    const results = new RollResults20th({
      ...args,
      pool: this.interaction.arguments.pool,
      difficulty: args.difficulty
    });

    const outcome = results.total > 0 ? "Success" : 
      results.blackDice.filter(d => d === 1).length > Math.abs(results.total) ? 
      "Botch" : "Failure";

    return {
      results: {
        total: results.total,
        outcome: outcome,
        pool: this.interaction.arguments.pool,
        originalPool: args.pool,
        blackDice: results.blackDice,
        difficulty: args.difficulty
      }
    };
  }

  createMainEmbed(args, netSuccesses) {
    const embed = new EmbedBuilder()
      .setTitle("⚔️ Combat Summary")
      .setColor(this.getDamageColor(args.damageType))
      .setFooter({ text: "Vampire: The Masquerade 20th Anniversary Edition" })
      .addFields(
        {
          name: "🗡️ Attacker",
          value: `**${args.attacker.name}**\n${this.formatRoll(this.attackRoll)}`,
          inline: true
        },
        {
          name: "🛡️ Defender",
          value: `**${args.defender.name}**\n${this.formatRoll(this.defenseRoll)}`,
          inline: true
        },
        {
          name: "⚖️ Net Successes",
          value: `\`${netSuccesses}\` ${netSuccesses > 0 ? '✅' : '❌'}`,
          inline: true
        }
      );

    if (netSuccesses > 0) {
      embed.addFields(
        {
          name: "💥 Damage",
          value: [
            `**Type:** ${args.damageType.toUpperCase()}`,
            `**Pool:** ${this.damageRoll.results.originalPool} → ${this.damageRoll.results.pool}d10`,
            `**Successes:** ${this.damageRoll.results.total}`
          ].join("\n"),
          inline: true
        },
        {
          name: "🛡️ Absorption",
          value: [
            `**Pool:** ${this.absorptionRoll.results.originalPool} → ${this.absorptionRoll.results.pool}d10`,
            `**Successes:** ${this.absorptionRoll.results.total}`
          ].join("\n"),
          inline: true
        },
        {
          name: "🎯 Final Damage",
          value: `\`${this.finalDamage}\` ${args.damageType.toUpperCase()}`,
          inline: true
        }
      );

      if (args.defender?.tracked?.health) {
        embed.addFields({
          name: "❤️ Health Status",
          value: this.formatHealth(args.defender),
          inline: false
        });
      }
    } else {
      embed.addFields({
        name: "🛡️ Defense Result",
        value: "Attack completely deflected!",
        inline: false
      });
    }

    embed.addFields({
      name: "🎲 Dice Results",
      value: this.formatAllDice(),
      inline: false
    });

    this.embeds.push(embed);
  }

  formatRoll(roll) {
    return [
      `Pool: ${roll.results.originalPool} → ${roll.results.pool}d10`,
      `Successes: ${roll.results.total}`,
      `Result: ${roll.results.outcome}`
    ].join("\n");
  }

  formatHealth(character) {
    const health = character.tracked.health;
    return [
      `Bashing: ${health.bashing || 0}`,
      `Lethal: ${health.lethal || 0}`,
      `Aggravated: ${health.aggravated || 0}`,
      `Max: ${health.max || 7}`
    ].join("\n");
  }

  formatAllDice() {
    const sections = [];
    
    sections.push(`**Attack:** ${this.formatDice(this.attackRoll)}`);
    sections.push(`**Defense:** ${this.formatDice(this.defenseRoll)}`);
    
    if (this.finalDamage > 0) {
      sections.push(`**Damage:** ${this.formatDice(this.damageRoll)}`);
      sections.push(`**Absorption:** ${this.formatDice(this.absorptionRoll)}`);
    }

    return sections.join("\n\n");
  }

  formatDice(roll) {
    return roll.results.blackDice.map(d => {
      if (d === 10) return Emoji.green10;
      return d >= 6 ? Emoji[`green${d}`] : Emoji[`red${d}`];
    }).join(" ");
  }

  applyDicePenalty(character) {
    if (character?.tracked?.health) {
      const healthStatus = character.tracked.health.damageInfo;
      const penaltyMatch = healthStatus?.match(/(\d+) dice penalty/);
      const dicePenalty = penaltyMatch ? parseInt(penaltyMatch[1], 10) : 0;
      
      this.interaction.arguments.pool = Math.max(
        1, 
        this.interaction.arguments.pool - dicePenalty
      );
    }
  }

  applyFinalDamage(args) {
    if (args.defender?.tracked?.health) {
      const health = args.defender.tracked.health;
      health.bashing = Number(health.bashing) || 0;
      health.lethal = Number(health.lethal) || 0;
      health.aggravated = Number(health.aggravated) || 0;
      health.max = Number(health.max) || 7;

      const available = health.max - (health.bashing + health.lethal + health.aggravated);
      const effectiveDamage = Math.min(this.finalDamage, available);

      switch(args.damageType.toLowerCase()) {
        case 'bashing':
          health.bashing += effectiveDamage;
          break;
        case 'lethal':
          health.lethal += effectiveDamage;
          break;
        case 'aggravated':
          health.aggravated += effectiveDamage;
          break;
      }
    }
  }

  getDamageColor(type) {
    const colors = {
      bashing: 0xFFFF00,
      lethal: 0xFF0000,
      aggravated: 0x8B0000
    };
    return colors[type.toLowerCase()] || 0x808080;
  }
}

module.exports = CombatHandler20th;