/**
 * Generic Quiz Platform - Core Type Definitions
 *
 * These types define the contract for any product vertical using the platform.
 */

/**
 * Generic product interface that works for any product type
 */
export interface Product {
  id: string;
  workspaceId: string;
  name: string;
  brand: string;
  priceCents: number;
  imageUrl: string | null;
  affiliateUrls: Record<string, string>; // {"amazon": "...", "direct": "..."}
  attributes: Record<string, any>; // Product-specific attributes
}

/**
 * Quiz question definition
 */
export interface QuizQuestion {
  id: string;
  text: string;
  type: 'single_choice' | 'multiple_choice' | 'range' | 'text';
  options?: QuizOption[];
  responseKey: string; // Key used to store response (e.g., "playStyle")
  required?: boolean;
  min?: number; // For range type
  max?: number; // For range type
}

export interface QuizOption {
  value: string | number;
  label: string;
  description?: string;
  icon?: string;
}

/**
 * Quiz responses - generic key-value storage
 */
export type QuizResponses = Record<string, any>;

/**
 * Scoring rule types
 */
export type RuleType =
  | 'exact_match'       // Response exactly matches condition
  | 'range'             // Product attribute in range
  | 'threshold'         // Product attribute meets threshold
  | 'preference_weight' // Score based on proximity to preference
  | 'inverse_threshold' // Product attribute below threshold (e.g., for price)
  | 'contains'          // Array contains value
  | 'multi_match';      // Multiple response values match

/**
 * Individual scoring rule
 */
export interface ScoringRule {
  id?: string;
  type: RuleType;

  // Which response key to check (e.g., "playStyle")
  responseKey: string;

  // Which product attribute to evaluate (e.g., "powerRating")
  productAttribute: string;

  // Rule logic configuration
  logic: {
    // Condition to check response against
    condition?: {
      value?: any;
      operator?: '==' | '!=' | '>' | '<' | '>=' | '<=';
    };

    // For range rules
    range?: [number, number];

    // For threshold rules
    threshold?: number;

    // Score weight/points
    weight: number;

    // For preference_weight: max distance before score becomes 0
    maxDistance?: number;

    // For inverse_threshold: direction matters
    direction?: 'above' | 'below';
  };

  // Human-readable reason for the match
  reasoning?: string;

  // Optional: Only apply rule if condition is met
  enabled?: boolean;
}

/**
 * Complete scoring configuration for a quiz
 */
export interface ScoringConfig {
  rules: ScoringRule[];
  maxScore: number;

  // Global weights for different attribute categories
  weights?: {
    [category: string]: number;
  };

  // Minimum score to be considered a match
  minScore?: number;
}

/**
 * Recommendation result
 */
export interface Recommendation extends Product {
  score: number;
  matchReasons: string[];
}

/**
 * Quiz configuration
 */
export interface QuizConfig {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  questions: QuizQuestion[];
  scoringConfig: ScoringConfig;

  // Display configuration
  theme?: {
    primaryColor?: string;
    fontFamily?: string;
    buttonStyle?: 'rounded' | 'square';
  };

  // Result page configuration
  resultsConfig?: {
    showScores?: boolean;
    maxResults?: number;
    ctaText?: string;
  };
}

/**
 * Product attribute schema definition for a workspace
 */
export interface AttributeSchema {
  key: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'enum';
  required?: boolean;

  // For number types
  min?: number;
  max?: number;

  // For enum types
  enum?: string[];

  // For display
  description?: string;
  unit?: string; // e.g., "oz", "inches", "hours"
}

/**
 * Workspace configuration
 */
export interface WorkspaceConfig {
  id: string;
  name: string;
  slug: string;
  productType: string; // "paddle", "kayak", "laptop"

  // Product attribute schema
  productSchema: AttributeSchema[];

  // Default affiliate networks
  affiliateNetworks?: string[]; // ["amazon", "direct", "commissioned"]
}

/**
 * Evaluation result for a single rule
 */
export interface RuleEvaluation {
  matched: boolean;
  points: number;
  reasoning?: string;
}

/**
 * Complete scoring result
 */
export interface ScoringResult {
  score: number;
  reasons: string[];
  ruleMatches: {
    ruleId?: string;
    matched: boolean;
    points: number;
  }[];
}
