// Reading time calculation (words per minute)
const WORDS_PER_MINUTE = 200;

export function calculateReadingTime(wordCount: number): string {
  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
  if (minutes < 1) return '< 1 min';
  return `${minutes} min${minutes === 1 ? '' : 's'}`;
}

// Reading level calculation based on text complexity
export function calculateReadingLevel(text: string): string {
  // Remove extra whitespace and split into sentences
  const sentences = text.trim()
    .replace(/\s+/g, ' ')
    .split(/[.!?]+/)
    .filter(sentence => sentence.trim().length > 0);

  if (sentences.length === 0) return 'Beginner';

  // Calculate average sentence length
  const avgSentenceLength = text.split(/\s+/).length / sentences.length;
  
  // Calculate percentage of complex words (words with 3 or more syllables)
  const words = text.toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 0);

  const complexWords = words.filter(word => countSyllables(word) >= 3);
  const complexWordPercentage = (complexWords.length / words.length) * 100;

  // Determine reading level based on metrics
  if (avgSentenceLength <= 12 && complexWordPercentage <= 10) {
    return 'Beginner';
  } else if (avgSentenceLength <= 20 && complexWordPercentage <= 20) {
    return 'Intermediate';
  } else {
    return 'Advanced';
  }
}

// Helper function to count syllables in a word
function countSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;

  // Remove common word endings
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');

  // Count vowel groups
  const syllables = word.match(/[aeiouy]{1,2}/g);
  return syllables ? syllables.length : 1;
}