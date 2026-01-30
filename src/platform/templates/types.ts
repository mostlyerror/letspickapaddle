/**
 * Quiz Template System
 *
 * Templates allow rapid quiz creation for different clients.
 * Each template includes:
 * - Quiz questions
 * - Scoring configuration
 * - Product schema
 * - Default theme/branding
 * - Sample questions text
 */

import {
  QuizQuestion,
  ScoringConfig,
  AttributeSchema,
  QuizConfig
} from '../core/engine/types';

/**
 * Template category for organization
 */
export type TemplateCategory =
  | 'sports_equipment'
  | 'outdoor_gear'
  | 'electronics'
  | 'health_wellness'
  | 'home_goods'
  | 'fashion'
  | 'services';

/**
 * Template metadata
 */
export interface TemplateMetadata {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: TemplateCategory;
  productType: string; // "paddle", "kayak", "laptop", etc.

  // Template characteristics
  estimatedCompletionTime: number; // seconds
  typicalQuestionCount: number;
  typicalProductCount: number;

  // Visual preview
  previewImage?: string;

  // Version info
  version: string;
  lastUpdated: string;
}

/**
 * Complete quiz template
 *
 * This is the "blueprint" for a quiz that can be:
 * 1. Instantiated for a client with their products
 * 2. Customized with their branding
 * 3. Deployed to their subdomain
 */
export interface QuizTemplate {
  metadata: TemplateMetadata;

  /**
   * Quiz questions with default text
   * Clients can customize the text but structure remains
   */
  questions: QuizQuestion[];

  /**
   * Scoring configuration
   * Pre-configured rules that work with the product schema
   */
  scoringConfig: ScoringConfig;

  /**
   * Product attribute schema
   * Defines what attributes products need
   */
  productSchema: AttributeSchema[];

  /**
   * Default theme
   * Clients can override colors/fonts
   */
  defaultTheme: {
    primaryColor: string;
    secondaryColor?: string;
    fontFamily: string;
    buttonStyle: 'rounded' | 'square';
  };

  /**
   * Sample products (for testing/preview)
   * Shows what kind of products work with this template
   */
  sampleProducts: Array<{
    name: string;
    brand: string;
    priceCents: number;
    attributes: Record<string, any>;
  }>;

  /**
   * Customization hints
   * Helps onboarding team know what to customize
   */
  customizationGuide: {
    questionsToReview: string[]; // Question IDs that commonly need tweaking
    requiredBrandingAssets: string[]; // ["logo", "favicon", "primary_color"]
    typicalSetupTime: number; // minutes
  };
}

/**
 * Template instantiation request
 * Used when creating a quiz from a template for a client
 */
export interface TemplateInstantiationRequest {
  templateId: string;
  clientId: string;

  // Customizations
  customQuizName?: string;
  customSlug?: string;

  // Branding overrides
  themeOverrides?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
    logoUrl?: string;
  };

  // Question text overrides
  questionOverrides?: Record<string, Partial<QuizQuestion>>;

  // Initial products to import
  products?: Array<{
    name: string;
    brand: string;
    priceCents: number;
    imageUrl?: string;
    affiliateUrls: Record<string, string>;
    attributes: Record<string, any>;
  }>;

  // Subdomain for hosting
  subdomain?: string;
}

/**
 * Result of template instantiation
 */
export interface TemplateInstantiationResult {
  success: boolean;
  quizId?: string;
  workspaceId?: string;
  quizUrl?: string;
  embedCode?: string;
  error?: string;
}

/**
 * Template registry entry
 * Used by template selector UI
 */
export interface TemplateRegistryEntry {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: TemplateCategory;
  productType: string;
  previewImage?: string;
  estimatedSetupTime: number; // minutes
  featured: boolean;
}
