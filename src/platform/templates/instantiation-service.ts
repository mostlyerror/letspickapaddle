/**
 * Template Instantiation Service
 *
 * Takes a quiz template and creates a working quiz for a client:
 * 1. Creates workspace
 * 2. Sets up quiz with questions
 * 3. Configures scoring
 * 4. Applies branding
 * 5. Imports initial products
 * 6. Generates embed code
 */

import {
  QuizTemplate,
  TemplateInstantiationRequest,
  TemplateInstantiationResult,
} from './types';
import { templateRegistry } from './registry';

export class TemplateInstantiationService {
  /**
   * Instantiate a template for a client
   */
  async instantiate(
    request: TemplateInstantiationRequest
  ): Promise<TemplateInstantiationResult> {
    try {
      // 1. Get template
      const template = templateRegistry.getTemplate(request.templateId);
      if (!template) {
        return {
          success: false,
          error: `Template not found: ${request.templateId}`,
        };
      }

      // 2. Validate template
      const validation = templateRegistry.validateTemplate(request.templateId);
      if (!validation.valid) {
        return {
          success: false,
          error: `Template validation failed: ${validation.errors.join(', ')}`,
        };
      }

      // 3. Generate IDs
      const workspaceId = this.generateWorkspaceId(request.clientId);
      const quizId = this.generateQuizId(template.metadata.slug);

      // 4. Create workspace (would normally be database operation)
      // For now, return the structure that would be created
      const workspace = {
        id: workspaceId,
        clientId: request.clientId,
        name: request.customQuizName || template.metadata.name,
        slug: request.customSlug || template.metadata.slug,
        productType: template.metadata.productType,
        productSchema: template.productSchema,
        createdAt: new Date().toISOString(),
      };

      // 5. Apply theme overrides
      const theme = {
        ...template.defaultTheme,
        ...request.themeOverrides,
      };

      // 6. Apply question overrides
      const questions = template.questions.map((question) => {
        const override = request.questionOverrides?.[question.id];
        return override ? { ...question, ...override } : question;
      });

      // 7. Create quiz configuration
      const quiz = {
        id: quizId,
        workspaceId,
        name: request.customQuizName || template.metadata.name,
        slug: request.customSlug || template.metadata.slug,
        questions,
        scoringConfig: template.scoringConfig,
        theme,
        metadata: {
          templateId: template.metadata.id,
          templateVersion: template.metadata.version,
          instantiatedAt: new Date().toISOString(),
        },
      };

      // 8. Generate subdomain URL
      const subdomain =
        request.subdomain ||
        this.generateSubdomain(request.clientId, template.metadata.slug);
      const quizUrl = `https://${subdomain}.quizplatform.com`;

      // 9. Generate embed code
      const embedCode = this.generateEmbedCode(workspaceId, quizId, theme);

      return {
        success: true,
        quizId,
        workspaceId,
        quizUrl,
        embedCode,
      };
    } catch (error) {
      return {
        success: false,
        error: `Instantiation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Preview template before instantiation
   */
  async preview(templateId: string): Promise<{
    success: boolean;
    template?: QuizTemplate;
    validationErrors?: string[];
  }> {
    const template = templateRegistry.getTemplate(templateId);
    if (!template) {
      return {
        success: false,
        validationErrors: ['Template not found'],
      };
    }

    const validation = templateRegistry.validateTemplate(templateId);
    if (!validation.valid) {
      return {
        success: false,
        validationErrors: validation.errors,
      };
    }

    return {
      success: true,
      template,
    };
  }

  /**
   * Calculate estimated setup effort for a template
   */
  estimateSetupEffort(
    templateId: string,
    productCount: number
  ): {
    templateSetup: number; // minutes
    productImport: number; // minutes
    testing: number; // minutes
    total: number; // minutes
  } {
    const template = templateRegistry.getTemplate(templateId);
    if (!template) {
      return { templateSetup: 0, productImport: 0, testing: 0, total: 0 };
    }

    const templateSetup = template.customizationGuide.typicalSetupTime;
    const productImport = Math.ceil(productCount * 1.5); // 1.5 min per product
    const testing = 15; // 15 minutes for testing

    return {
      templateSetup,
      productImport,
      testing,
      total: templateSetup + productImport + testing,
    };
  }

  // ===================================================================
  // PRIVATE HELPER METHODS
  // ===================================================================

  private generateWorkspaceId(clientId: string): string {
    return `ws_${clientId}_${Date.now()}`;
  }

  private generateQuizId(slug: string): string {
    return `quiz_${slug}_${Date.now()}`;
  }

  private generateSubdomain(clientId: string, slug: string): string {
    // Convert to lowercase, remove special chars
    const cleanClient = clientId.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `${cleanClient}-${cleanSlug}`;
  }

  private generateEmbedCode(
    workspaceId: string,
    quizId: string,
    theme: any
  ): string {
    return `<!-- Quiz Platform Embed Code -->
<script src="https://quizplatform.com/widget.js"></script>
<div id="quiz-container"></div>
<script>
  QuizPlatform.init({
    workspaceId: '${workspaceId}',
    quizId: '${quizId}',
    container: '#quiz-container',
    theme: {
      primaryColor: '${theme.primaryColor}',
      fontFamily: '${theme.fontFamily}',
      buttonStyle: '${theme.buttonStyle}'
    }
  });
</script>`;
  }

  /**
   * Generate client onboarding checklist
   */
  generateOnboardingChecklist(templateId: string): {
    steps: Array<{
      step: string;
      description: string;
      estimatedTime: number;
      required: boolean;
    }>;
    totalTime: number;
  } {
    const template = templateRegistry.getTemplate(templateId);
    if (!template) {
      return { steps: [], totalTime: 0 };
    }

    const steps = [
      {
        step: 'Choose template',
        description: `Selected: ${template.metadata.name}`,
        estimatedTime: 5,
        required: true,
      },
      {
        step: 'Provide branding assets',
        description: `Required: ${template.customizationGuide.requiredBrandingAssets.join(', ')}`,
        estimatedTime: 15,
        required: true,
      },
      {
        step: 'Review and customize questions',
        description: `Review ${template.customizationGuide.questionsToReview.length} key questions`,
        estimatedTime: 20,
        required: true,
      },
      {
        step: 'Import products',
        description: `Upload product catalog (CSV or API)`,
        estimatedTime: 30,
        required: true,
      },
      {
        step: 'Configure subdomain',
        description: 'Choose your quiz subdomain',
        estimatedTime: 5,
        required: true,
      },
      {
        step: 'Test quiz',
        description: 'Test with sample data',
        estimatedTime: 15,
        required: true,
      },
      {
        step: 'Deploy',
        description: 'Go live with your quiz',
        estimatedTime: 5,
        required: true,
      },
    ];

    const totalTime = steps.reduce((sum, step) => sum + step.estimatedTime, 0);

    return { steps, totalTime };
  }
}

/**
 * Singleton instance
 */
export const templateInstantiationService = new TemplateInstantiationService();
