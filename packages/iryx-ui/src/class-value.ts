/**
 * What every component's `class` prop accepts: the subset of Vue's class
 * binding that `tailwind-merge` can also merge. Object syntax
 * (`:class="{ active: on }"`) is excluded on purpose — tailwind-merge does not
 * understand it, so it would pass through unmerged and silently lose to a
 * built-in class.
 */
export type ClassValue = string | false | null | undefined | ClassValue[]
