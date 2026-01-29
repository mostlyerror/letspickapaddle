/**
 * Generic Recommendation Engine
 *
 * Platform-agnostic recommendation engine that works for any product vertical.
 * Scoring logic is entirely configuration-driven.
 */

import {
  Product,
  QuizResponses,
  ScoringConfig,
  ScoringRule,
  RuleEvaluation,
  ScoringResult,
  Recommendation,
} from './types';

export class RecommendationEngine {
  constructor(private config: ScoringConfig) {
    this.validateConfig();
  }

  /**
   * Validate scoring configuration
   */
  private validateConfig(): void {
    if (!this.config.rules || this.config.rules.length === 0) {
      throw new Error('Scoring config must have at least one rule');
    }

    if (!this.config.maxScore || this.config.maxScore <= 0) {
      throw new Error('Scoring config must have a positive maxScore');
    }
  }

  /**
   * Score a single product against user responses
   */
  public score(product: Product, responses: QuizResponses): ScoringResult {
    let totalScore = 0;
    const reasons: string[] = [];
    const ruleMatches: ScoringResult['ruleMatches'] = [];

    // Evaluate each rule
    for (const rule of this.config.rules) {
      // Skip disabled rules
      if (rule.enabled === false) {
        continue;
      }

      const responseValue = responses[rule.responseKey];
      const productValue = product.attributes[rule.productAttribute];

      // Evaluate the rule
      const evaluation = this.evaluateRule(rule, responseValue, productValue);

      // Track rule match
      ruleMatches.push({
        ruleId: rule.id,
        matched: evaluation.matched,
        points: evaluation.points,
      });

      if (evaluation.matched) {
        totalScore += evaluation.points;

        // Add reasoning if provided
        if (evaluation.reasoning) {
          reasons.push(evaluation.reasoning);
        }
      }
    }

    // Cap at max score
    const finalScore = Math.min(totalScore, this.config.maxScore);

    return {
      score: finalScore,
      reasons,
      ruleMatches,
    };
  }

  /**
   * Evaluate a single scoring rule
   */
  private evaluateRule(
    rule: ScoringRule,
    responseValue: any,
    productValue: any
  ): RuleEvaluation {
    // If response or product value is missing, no match
    if (responseValue === undefined || responseValue === null) {
      return { matched: false, points: 0 };
    }

    switch (rule.type) {
      case 'exact_match':
        return this.evaluateExactMatch(rule, responseValue, productValue);

      case 'range':
        return this.evaluateRange(rule, responseValue, productValue);

      case 'threshold':
        return this.evaluateThreshold(rule, responseValue, productValue);

      case 'inverse_threshold':
        return this.evaluateInverseThreshold(rule, responseValue, productValue);

      case 'preference_weight':
        return this.evaluatePreferenceWeight(rule, responseValue, productValue);

      case 'contains':
        return this.evaluateContains(rule, responseValue, productValue);

      case 'multi_match':
        return this.evaluateMultiMatch(rule, responseValue, productValue);

      default:
        console.warn(`Unknown rule type: ${rule.type}`);
        return { matched: false, points: 0 };
    }
  }

  /**
   * Exact match: Response value exactly matches condition
   */
  private evaluateExactMatch(
    rule: ScoringRule,
    responseValue: any,
    productValue: any
  ): RuleEvaluation {
    const conditionValue = rule.logic.condition?.value;

    if (conditionValue === undefined) {
      return { matched: false, points: 0 };
    }

    // Check if response matches the condition
    const responseMatches = responseValue === conditionValue;

    if (!responseMatches) {
      return { matched: false, points: 0 };
    }

    // Now check if product value meets expectations
    // This is useful for "if user wants X, find products with Y"
    const operator = rule.logic.condition?.operator || '==';
    const productMatches = this.compareValues(productValue, operator, conditionValue);

    return {
      matched: productMatches,
      points: rule.logic.weight,
      reasoning: rule.reasoning,
    };
  }

  /**
   * Range: Product value falls within range
   */
  private evaluateRange(
    rule: ScoringRule,
    responseValue: any,
    productValue: any
  ): RuleEvaluation {
    if (typeof productValue !== 'number') {
      return { matched: false, points: 0 };
    }

    const range = rule.logic.range;
    if (!range || range.length !== 2) {
      return { matched: false, points: 0 };
    }

    const [min, max] = range;
    const matched = productValue >= min && productValue <= max;

    return {
      matched,
      points: matched ? rule.logic.weight : 0,
      reasoning: matched ? rule.reasoning : undefined,
    };
  }

  /**
   * Threshold: Product value meets or exceeds threshold
   */
  private evaluateThreshold(
    rule: ScoringRule,
    responseValue: any,
    productValue: any
  ): RuleEvaluation {
    if (typeof productValue !== 'number') {
      return { matched: false, points: 0 };
    }

    const threshold = rule.logic.threshold;
    if (threshold === undefined) {
      return { matched: false, points: 0 };
    }

    // Check if response matches condition (if specified)
    if (rule.logic.condition?.value !== undefined) {
      const conditionMatches = responseValue === rule.logic.condition.value;
      if (!conditionMatches) {
        return { matched: false, points: 0 };
      }
    }

    const matched = productValue >= threshold;

    return {
      matched,
      points: matched ? rule.logic.weight : 0,
      reasoning: matched ? rule.reasoning : undefined,
    };
  }

  /**
   * Inverse threshold: Product value is below threshold (e.g., for price)
   */
  private evaluateInverseThreshold(
    rule: ScoringRule,
    responseValue: any,
    productValue: any
  ): RuleEvaluation {
    if (typeof productValue !== 'number') {
      return { matched: false, points: 0 };
    }

    const threshold = rule.logic.threshold;
    if (threshold === undefined) {
      return { matched: false, points: 0 };
    }

    // Check if response matches condition (if specified)
    if (rule.logic.condition?.value !== undefined) {
      const conditionMatches = responseValue === rule.logic.condition.value;
      if (!conditionMatches) {
        return { matched: false, points: 0 };
      }
    }

    const direction = rule.logic.direction || 'below';
    const matched =
      direction === 'below' ? productValue <= threshold : productValue >= threshold;

    return {
      matched,
      points: matched ? rule.logic.weight : 0,
      reasoning: matched ? rule.reasoning : undefined,
    };
  }

  /**
   * Preference weight: Linear scoring based on proximity to preference
   */
  private evaluatePreferenceWeight(
    rule: ScoringRule,
    responseValue: any,
    productValue: any
  ): RuleEvaluation {
    if (typeof responseValue !== 'number' || typeof productValue !== 'number') {
      return { matched: false, points: 0 };
    }

    const distance = Math.abs(productValue - responseValue);
    const maxDistance = rule.logic.maxDistance || 10;

    // Normalize score: closer = higher score
    const normalizedScore = Math.max(0, 1 - distance / maxDistance);

    if (normalizedScore <= 0) {
      return { matched: false, points: 0 };
    }

    return {
      matched: true,
      points: Math.round(normalizedScore * rule.logic.weight),
      reasoning: rule.reasoning,
    };
  }

  /**
   * Contains: Array contains value
   */
  private evaluateContains(
    rule: ScoringRule,
    responseValue: any,
    productValue: any
  ): RuleEvaluation {
    if (!Array.isArray(productValue)) {
      return { matched: false, points: 0 };
    }

    const matched = productValue.includes(responseValue);

    return {
      matched,
      points: matched ? rule.logic.weight : 0,
      reasoning: matched ? rule.reasoning : undefined,
    };
  }

  /**
   * Multi-match: Multiple response values match product attributes
   */
  private evaluateMultiMatch(
    rule: ScoringRule,
    responseValue: any,
    productValue: any
  ): RuleEvaluation {
    if (!Array.isArray(responseValue)) {
      return { matched: false, points: 0 };
    }

    // Count how many response values match
    let matchCount = 0;
    for (const value of responseValue) {
      if (Array.isArray(productValue)) {
        if (productValue.includes(value)) {
          matchCount++;
        }
      } else if (productValue === value) {
        matchCount++;
      }
    }

    if (matchCount === 0) {
      return { matched: false, points: 0 };
    }

    // Partial scoring based on match percentage
    const matchPercentage = matchCount / responseValue.length;
    const points = Math.round(matchPercentage * rule.logic.weight);

    return {
      matched: true,
      points,
      reasoning: rule.reasoning,
    };
  }

  /**
   * Compare values with operator
   */
  private compareValues(
    value: any,
    operator: string,
    target: any
  ): boolean {
    switch (operator) {
      case '==':
        return value == target;
      case '!=':
        return value != target;
      case '>':
        return value > target;
      case '<':
        return value < target;
      case '>=':
        return value >= target;
      case '<=':
        return value <= target;
      default:
        return false;
    }
  }

  /**
   * Generate recommendations for a list of products
   */
  public recommend(
    products: Product[],
    responses: QuizResponses,
    options: {
      limit?: number;
      minScore?: number;
    } = {}
  ): Recommendation[] {
    const limit = options.limit || 5;
    const minScore = options.minScore || this.config.minScore || 0;

    // Score all products
    const scored = products.map((product) => {
      const result = this.score(product, responses);
      return {
        ...product,
        score: result.score,
        matchReasons: result.reasons,
      };
    });

    // Filter by minimum score and sort
    return scored
      .filter((product) => product.score >= minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Get detailed scoring breakdown for debugging
   */
  public explainScore(
    product: Product,
    responses: QuizResponses
  ): {
    totalScore: number;
    maxScore: number;
    percentage: number;
    breakdown: Array<{
      rule: ScoringRule;
      matched: boolean;
      points: number;
      responseValue: any;
      productValue: any;
    }>;
  } {
    let totalScore = 0;
    const breakdown: any[] = [];

    for (const rule of this.config.rules) {
      if (rule.enabled === false) continue;

      const responseValue = responses[rule.responseKey];
      const productValue = product.attributes[rule.productAttribute];
      const evaluation = this.evaluateRule(rule, responseValue, productValue);

      if (evaluation.matched) {
        totalScore += evaluation.points;
      }

      breakdown.push({
        rule,
        matched: evaluation.matched,
        points: evaluation.points,
        responseValue,
        productValue,
      });
    }

    const finalScore = Math.min(totalScore, this.config.maxScore);

    return {
      totalScore: finalScore,
      maxScore: this.config.maxScore,
      percentage: Math.round((finalScore / this.config.maxScore) * 100),
      breakdown,
    };
  }
}
