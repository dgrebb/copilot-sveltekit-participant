/**
 * Analyzes code to detect Svelte version based on API usage
 *
 * @param code - The Svelte code to analyze
 * @returns The detected Svelte version and incompatibility notes if any
 */
export function detectSvelteVersion(code: string): {
  version: '4' | '5' | 'mixed' | 'unknown'
  notes: string[]
} {
  const result = {
    version: 'unknown' as 'unknown' | '4' | '5' | 'mixed',
    notes: [] as string[],
  }

  // Example patterns for detection - in a real implementation, these would be more comprehensive
  const svelte4Patterns = [
    {
      pattern: /\$\:.*=/,
      note: 'Reactive declarations with $: x = y syntax (Svelte 4)',
    },
    {
      pattern: /(?<!\$app\/stores)\/store\.js/,
      note: 'Likely using Svelte 4 store pattern',
    },
  ]

  const svelte5Patterns = [
    { pattern: /\$state\b/, note: 'Using $state in component (Svelte 5)' },
    { pattern: /\$derived\b/, note: 'Using $derived in component (Svelte 5)' },
    { pattern: /\$effect\b/, note: 'Using $effect in component (Svelte 5)' },
  ]

  // Check for Svelte 4 patterns
  const svelte4Matches = svelte4Patterns.filter(({ pattern }) =>
    pattern.test(code),
  )

  // Check for Svelte 5 patterns
  const svelte5Matches = svelte5Patterns.filter(({ pattern }) =>
    pattern.test(code),
  )

  // Determine version based on matches
  if (svelte4Matches.length > 0 && svelte5Matches.length === 0) {
    result.version = '4'
  } else if (svelte5Matches.length > 0 && svelte4Matches.length === 0) {
    result.version = '5'
  } else if (svelte4Matches.length > 0 && svelte5Matches.length > 0) {
    result.version = 'mixed'
    result.notes.push('Warning: Mixed Svelte 4 and Svelte 5 syntax detected.')

    // Add specific notes about what was found
    svelte4Matches.forEach(({ note }) => result.notes.push(note))
    svelte5Matches.forEach(({ note }) => result.notes.push(note))
  }

  return result
}

/**
 * Provides upgrade guidance for migrating from Svelte 4 to Svelte 5
 *
 * @param code - The Svelte code to analyze
 * @returns Guidance for upgrading to Svelte 5
 */
export function getSvelteUpgradeGuidance(code: string): string[] {
  const guidance = []

  // Example patterns to check - in real implementation, this would be more comprehensive
  if (code.includes('$:')) {
    guidance.push(
      'Consider replacing reactive declarations ($: x = y) with $derived for better type safety.',
    )
  }

  if (code.includes('svelte/store')) {
    guidance.push(
      'Svelte 5 introduces a new reactive primitive model that replaces svelte/store. Consider using $state and $derived instead.',
    )
  }

  if (code.includes('beforeUpdate') || code.includes('afterUpdate')) {
    guidance.push(
      'Lifecycle methods like beforeUpdate/afterUpdate can be replaced with the new $effect function in Svelte 5.',
    )
  }

  return guidance
}
