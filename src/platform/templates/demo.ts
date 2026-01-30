/**
 * Template System Demo
 *
 * Shows how to use the template system to create quizzes for clients.
 * Run with: npx tsx src/platform/templates/demo.ts
 */

import {
  templateRegistry,
  templateInstantiationService,
} from './index';

async function demo() {
  console.log('='.repeat(70));
  console.log('Quiz Template System Demo');
  console.log('='.repeat(70));
  console.log();

  // ===================================================================
  // 1. List all available templates
  // ===================================================================
  console.log('📋 Available Templates:');
  console.log('-'.repeat(70));

  const entries = templateRegistry.getRegistryEntries();
  entries.forEach((entry) => {
    console.log(`\n✓ ${entry.name}`);
    console.log(`  ID: ${entry.id}`);
    console.log(`  Category: ${entry.category}`);
    console.log(`  Product Type: ${entry.productType}`);
    console.log(`  Setup Time: ${entry.estimatedSetupTime} minutes`);
    console.log(`  Featured: ${entry.featured ? 'Yes' : 'No'}`);
  });

  console.log('\n');

  // ===================================================================
  // 2. Get specific template details
  // ===================================================================
  console.log('🔍 Template Details: Paddle Finder');
  console.log('-'.repeat(70));

  const paddleTemplate = templateRegistry.getTemplate('template_paddle_finder');
  if (paddleTemplate) {
    console.log(`\nName: ${paddleTemplate.metadata.name}`);
    console.log(`Description: ${paddleTemplate.metadata.description}`);
    console.log(`Questions: ${paddleTemplate.questions.length}`);
    console.log(`Scoring Rules: ${paddleTemplate.scoringConfig.rules.length}`);
    console.log(`Product Attributes: ${paddleTemplate.productSchema.length}`);

    console.log('\nQuestions:');
    paddleTemplate.questions.forEach((q, i) => {
      console.log(`  ${i + 1}. ${q.text} (${q.responseKey})`);
      console.log(`     Type: ${q.type}, Required: ${q.required}`);
      console.log(`     Options: ${q.options?.length || 0}`);
    });

    console.log('\nProduct Schema:');
    paddleTemplate.productSchema.forEach((attr) => {
      console.log(`  - ${attr.label} (${attr.key}): ${attr.type}`);
      if (attr.required) console.log(`    Required`);
      if (attr.unit) console.log(`    Unit: ${attr.unit}`);
    });

    console.log('\nSample Products:');
    paddleTemplate.sampleProducts.forEach((product) => {
      console.log(`  - ${product.name} by ${product.brand}`);
      console.log(`    Price: $${(product.priceCents / 100).toFixed(2)}`);
      console.log(`    Power: ${product.attributes.powerRating}/10, Control: ${product.attributes.controlRating}/10`);
    });
  }

  console.log('\n');

  // ===================================================================
  // 3. Validate template
  // ===================================================================
  console.log('✅ Validate Template');
  console.log('-'.repeat(70));

  const validation = templateRegistry.validateTemplate('template_paddle_finder');
  console.log(`\nValid: ${validation.valid}`);
  if (!validation.valid) {
    console.log('Errors:');
    validation.errors.forEach((err) => console.log(`  - ${err}`));
  } else {
    console.log('No validation errors found.');
  }

  console.log('\n');

  // ===================================================================
  // 4. Estimate setup effort
  // ===================================================================
  console.log('⏱️  Setup Effort Estimation');
  console.log('-'.repeat(70));

  const effort = templateInstantiationService.estimateSetupEffort(
    'template_paddle_finder',
    50 // 50 products
  );

  console.log(`\nFor 50 products:`);
  console.log(`  Template Setup: ${effort.templateSetup} min`);
  console.log(`  Product Import: ${effort.productImport} min`);
  console.log(`  Testing: ${effort.testing} min`);
  console.log(`  TOTAL: ${effort.total} min (${(effort.total / 60).toFixed(1)} hours)`);

  console.log('\n');

  // ===================================================================
  // 5. Generate onboarding checklist
  // ===================================================================
  console.log('📝 Client Onboarding Checklist');
  console.log('-'.repeat(70));

  const checklist = templateInstantiationService.generateOnboardingChecklist(
    'template_paddle_finder'
  );

  console.log(`\nTotal estimated time: ${checklist.totalTime} minutes\n`);
  checklist.steps.forEach((step, i) => {
    const required = step.required ? '(Required)' : '(Optional)';
    console.log(`${i + 1}. ${step.step} ${required}`);
    console.log(`   ${step.description}`);
    console.log(`   Estimated time: ${step.estimatedTime} min\n`);
  });

  // ===================================================================
  // 6. Instantiate template for a client
  // ===================================================================
  console.log('🚀 Instantiate Template for Client');
  console.log('-'.repeat(70));

  const result = await templateInstantiationService.instantiate({
    templateId: 'template_paddle_finder',
    clientId: 'client_acme_sports',
    customQuizName: 'ACME Sports Paddle Finder',
    customSlug: 'acme-paddle-finder',
    themeOverrides: {
      primaryColor: '#FF6B35',
      fontFamily: 'Roboto, sans-serif',
    },
    subdomain: 'acme-sports',
  });

  console.log(`\nInstantiation result:`);
  console.log(`  Success: ${result.success}`);
  if (result.success) {
    console.log(`  Quiz ID: ${result.quizId}`);
    console.log(`  Workspace ID: ${result.workspaceId}`);
    console.log(`  Quiz URL: ${result.quizUrl}`);
    console.log(`\n  Embed Code:`);
    console.log(
      result.embedCode
        ?.split('\n')
        .map((line) => `    ${line}`)
        .join('\n')
    );
  } else {
    console.log(`  Error: ${result.error}`);
  }

  console.log('\n');

  // ===================================================================
  // 7. Search templates
  // ===================================================================
  console.log('🔎 Search Templates');
  console.log('-'.repeat(70));

  const searchResults = templateRegistry.searchTemplates('paddle');
  console.log(`\nSearch for "paddle": ${searchResults.length} result(s)`);
  searchResults.forEach((template) => {
    console.log(`  - ${template.metadata.name} (${template.metadata.productType})`);
  });

  console.log('\n');
  console.log('='.repeat(70));
  console.log('Demo Complete');
  console.log('='.repeat(70));
}

// Run demo if executed directly
if (require.main === module) {
  demo().catch((error) => {
    console.error('Demo failed:', error);
    process.exit(1);
  });
}

export { demo };
