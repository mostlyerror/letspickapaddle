/**
 * Template Registry
 *
 * Central registry of all available quiz templates.
 * Used by:
 * - Template selector UI
 * - Template instantiation service
 * - Admin dashboard
 */

import { QuizTemplate, TemplateRegistryEntry, TemplateCategory } from './types';
import { paddleTemplate } from './paddle-template';

/**
 * All available templates
 */
const templates: QuizTemplate[] = [
  paddleTemplate,
  // More templates will be added here:
  // kayakTemplate,
  // laptopTemplate,
  // runningShoesTemplate,
  // etc.
];

/**
 * Template registry for quick lookups
 */
export class TemplateRegistry {
  private templates: Map<string, QuizTemplate>;

  constructor() {
    this.templates = new Map();
    this.loadTemplates();
  }

  /**
   * Load all templates into registry
   */
  private loadTemplates(): void {
    templates.forEach((template) => {
      this.templates.set(template.metadata.id, template);
    });
  }

  /**
   * Get all templates
   */
  getAllTemplates(): QuizTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Get template by ID
   */
  getTemplate(templateId: string): QuizTemplate | undefined {
    return this.templates.get(templateId);
  }

  /**
   * Get templates by category
   */
  getTemplatesByCategory(category: TemplateCategory): QuizTemplate[] {
    return this.getAllTemplates().filter(
      (t) => t.metadata.category === category
    );
  }

  /**
   * Get templates by product type
   */
  getTemplatesByProductType(productType: string): QuizTemplate[] {
    return this.getAllTemplates().filter(
      (t) => t.metadata.productType === productType
    );
  }

  /**
   * Get template registry entries (for UI)
   */
  getRegistryEntries(): TemplateRegistryEntry[] {
    return this.getAllTemplates().map((template) => ({
      id: template.metadata.id,
      name: template.metadata.name,
      slug: template.metadata.slug,
      description: template.metadata.description,
      category: template.metadata.category,
      productType: template.metadata.productType,
      previewImage: template.metadata.previewImage,
      estimatedSetupTime: template.customizationGuide.typicalSetupTime,
      featured: template.metadata.id === 'template_paddle_finder', // Featured flag
    }));
  }

  /**
   * Search templates by name or description
   */
  searchTemplates(query: string): QuizTemplate[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllTemplates().filter(
      (t) =>
        t.metadata.name.toLowerCase().includes(lowerQuery) ||
        t.metadata.description.toLowerCase().includes(lowerQuery) ||
        t.metadata.productType.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Validate that a template is complete
   */
  validateTemplate(templateId: string): {
    valid: boolean;
    errors: string[];
  } {
    const template = this.getTemplate(templateId);
    if (!template) {
      return { valid: false, errors: ['Template not found'] };
    }

    const errors: string[] = [];

    // Check required fields
    if (!template.metadata.name) errors.push('Missing template name');
    if (!template.questions || template.questions.length === 0) {
      errors.push('Template must have at least one question');
    }
    if (!template.scoringConfig || template.scoringConfig.rules.length === 0) {
      errors.push('Template must have at least one scoring rule');
    }
    if (!template.productSchema || template.productSchema.length === 0) {
      errors.push('Template must define product schema');
    }

    // Check question/scoring config alignment
    const responseKeys = new Set(
      template.questions.map((q) => q.responseKey)
    );
    const scoringKeys = new Set(
      template.scoringConfig.rules.map((r) => r.responseKey)
    );

    scoringKeys.forEach((key) => {
      if (!responseKeys.has(key)) {
        errors.push(
          `Scoring config references question key "${key}" but no question has this responseKey`
        );
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

/**
 * Singleton instance
 */
export const templateRegistry = new TemplateRegistry();
