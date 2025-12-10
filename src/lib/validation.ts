import { Filter } from 'bad-words';

const filter = new Filter();

// Common English words dictionary check (basic implementation)
// In production, you'd want a more comprehensive dictionary
const commonWords = new Set([
  // Colors
  'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black', 'white', 'gray', 'grey',
  'golden', 'silver', 'bronze', 'copper', 'coral', 'ivory', 'cream', 'beige', 'tan', 'olive', 'teal',
  'navy', 'maroon', 'crimson', 'scarlet', 'rose', 'blush', 'peach', 'salmon', 'rust', 'amber', 'honey',
  'chocolate', 'coffee', 'mocha', 'caramel', 'cinnamon', 'nude', 'flesh', 'skin', 'warm', 'cool', 'deep',
  'light', 'dark', 'pale', 'bright', 'vivid', 'soft', 'dusty', 'muted', 'rich', 'burnt', 'raw',

  // Adjectives
  'hard', 'soft', 'warm', 'cool', 'hot', 'cold', 'sweet', 'bitter', 'sour', 'spicy', 'mild',
  'bold', 'gentle', 'fierce', 'calm', 'wild', 'tame', 'fresh', 'stale', 'new', 'old', 'young',
  'ancient', 'modern', 'classic', 'vintage', 'retro', 'sleek', 'rough', 'smooth', 'shiny', 'matte',
  'glossy', 'silky', 'velvet', 'satin', 'leather', 'suede', 'lush', 'dry', 'wet', 'damp', 'humid',
  'sunny', 'cloudy', 'stormy', 'foggy', 'misty', 'hazy', 'clear', 'pure', 'natural', 'organic',
  'earthy', 'woody', 'floral', 'fruity', 'tropical', 'exotic', 'urban', 'rural', 'coastal', 'mountain',
  'desert', 'forest', 'jungle', 'arctic', 'polar', 'summer', 'winter', 'spring', 'autumn', 'fall',
  'morning', 'evening', 'night', 'midnight', 'dawn', 'dusk', 'twilight', 'sunset', 'sunrise',
  'royal', 'regal', 'noble', 'humble', 'modest', 'grand', 'petite', 'tiny', 'huge', 'giant',
  'little', 'big', 'small', 'large', 'medium', 'extra', 'super', 'ultra', 'mega', 'mini',

  // Nouns (names, things, concepts)
  'rose', 'lily', 'daisy', 'tulip', 'orchid', 'violet', 'jasmine', 'lavender', 'sage', 'mint',
  'basil', 'thyme', 'rosemary', 'ginger', 'pepper', 'salt', 'sugar', 'honey', 'maple', 'oak',
  'pine', 'cedar', 'birch', 'willow', 'cherry', 'apple', 'lemon', 'lime', 'orange', 'berry',
  'grape', 'plum', 'fig', 'date', 'olive', 'almond', 'walnut', 'hazel', 'chestnut', 'cocoa',
  'moon', 'sun', 'star', 'sky', 'cloud', 'rain', 'snow', 'ice', 'fire', 'flame', 'ember',
  'ash', 'smoke', 'mist', 'fog', 'dew', 'frost', 'wind', 'breeze', 'storm', 'thunder',
  'ocean', 'sea', 'river', 'lake', 'pond', 'stream', 'wave', 'tide', 'sand', 'stone',
  'rock', 'pebble', 'crystal', 'gem', 'diamond', 'ruby', 'emerald', 'sapphire', 'pearl', 'jade',
  'silk', 'cotton', 'wool', 'linen', 'velvet', 'satin', 'lace', 'denim', 'leather', 'suede',
  'heart', 'soul', 'spirit', 'dream', 'hope', 'love', 'joy', 'bliss', 'peace', 'grace',
  'beauty', 'charm', 'magic', 'wonder', 'mystery', 'secret', 'shadow', 'light', 'glow', 'shine',
  'spark', 'flash', 'gleam', 'shimmer', 'glitter', 'sparkle', 'twinkle', 'radiance', 'brilliance',

  // Common names (for "Hard Ryan" style naming)
  'ryan', 'james', 'john', 'michael', 'david', 'chris', 'matt', 'alex', 'sam', 'max',
  'emma', 'olivia', 'sophia', 'ava', 'mia', 'luna', 'ella', 'lily', 'grace', 'ruby',
  'jack', 'luke', 'leo', 'finn', 'owen', 'cole', 'blake', 'chase', 'tyler', 'dylan',
  'maya', 'chloe', 'zoe', 'aria', 'isla', 'nova', 'ivy', 'jade', 'eden', 'aurora',
]);

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateTiptoneName(name: string): ValidationResult {
  // Check length (max 25 characters)
  if (name.length === 0) {
    return { isValid: false, error: 'Name is required' };
  }

  if (name.length > 25) {
    return { isValid: false, error: 'Name must be 25 characters or less' };
  }

  // Check for numbers
  if (/\d/.test(name)) {
    return { isValid: false, error: 'Name cannot contain numbers' };
  }

  // Check for symbols (only letters and spaces allowed)
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return { isValid: false, error: 'Name can only contain letters and spaces' };
  }

  // Check for profanity
  if (filter.isProfane(name)) {
    return { isValid: false, error: 'Name contains inappropriate content' };
  }

  // Check that each word is a real word (basic check)
  const words = name.toLowerCase().split(/\s+/).filter(w => w.length > 0);

  if (words.length === 0) {
    return { isValid: false, error: 'Name must contain at least one word' };
  }

  if (words.length > 3) {
    return { isValid: false, error: 'Name can have at most 3 words' };
  }

  // For now, we'll be lenient and allow any alphabetic words
  // In production, you could use a dictionary API
  for (const word of words) {
    if (word.length < 2) {
      return { isValid: false, error: 'Each word must be at least 2 characters' };
    }
  }

  return { isValid: true };
}

export function formatTiptoneName(name: string): string {
  return name.toUpperCase().trim().replace(/\s+/g, ' ');
}
