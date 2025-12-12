import type { StandupInput, StandupOptions } from '../types';

export class StandupGenerator {
  private toneTemplates = {
    formal: {
      prefix: '',
      bulletPoint: '• ',
      yesterdayLabel: 'Yesterday:',
      todayLabel: 'Today:',
      blockersLabel: 'Blockers:',
      separator: '\n\n'
    },
    casual: {
      prefix: '👋 ',
      bulletPoint: '✓ ',
      yesterdayLabel: '📅 Yesterday:',
      todayLabel: '🎯 Today:',
      blockersLabel: '🚧 Blockers:',
      separator: '\n\n'
    },
    humorous: {
      prefix: '🎪 Daily Standup Extravaganza! 🎪\n\n',
      bulletPoint: '🎯 ',
      yesterdayLabel: '🕰️ What I conquered yesterday:',
      todayLabel: '🚀 Today\'s epic quest:',
      blockersLabel: '😱 Dragons blocking my path:',
      separator: '\n\n'
    }
  };

  private styleModifiers = {
    short: (text: string[]) => text.slice(0, 3).map(t => this.truncate(t, 60)),
    standard: (text: string[]) => text,
    manager: (text: string[]) => text.map(t => `[Status Update] ${t}`),
    developer: (text: string[]) => text.map(t => `// ${t}`)
  };

  private truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }

  private parseLines(text: string): string[] {
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  }

  private formatSection(label: string, items: string[], bulletPoint: string): string {
    if (items.length === 0) return '';
    const formattedItems = items.map(item => `${bulletPoint}${item}`).join('\n');
    return `${label}\n${formattedItems}`;
  }

  generate(input: StandupInput, options: StandupOptions): string {
    const template = this.toneTemplates[options.tone];
    const styleModifier = this.styleModifiers[options.style];

    const yesterdayItems = styleModifier(this.parseLines(input.yesterday));
    const todayItems = styleModifier(this.parseLines(input.today));
    const blockerItems = input.blockers ? styleModifier(this.parseLines(input.blockers)) : [];

    const sections = [
      this.formatSection(template.yesterdayLabel, yesterdayItems, template.bulletPoint),
      this.formatSection(template.todayLabel, todayItems, template.bulletPoint),
      blockerItems.length > 0
        ? this.formatSection(template.blockersLabel, blockerItems, template.bulletPoint)
        : ''
    ].filter(s => s);

    return template.prefix + sections.join(template.separator);
  }

  getSuggestions(input: StandupInput): string[] {
    const suggestions: string[] = [];

    if (!input.yesterday) {
      suggestions.push('💡 Tip: Mention completed tasks, code reviews, or meetings from yesterday');
    }

    if (!input.today) {
      suggestions.push('💡 Tip: List your planned tasks, goals, or meetings for today');
    }

    if (input.yesterday && input.today && !input.blockers) {
      suggestions.push('💡 Optional: Add any blockers or issues you\'re facing');
    }

    return suggestions;
  }
}

export const standupGenerator = new StandupGenerator();

