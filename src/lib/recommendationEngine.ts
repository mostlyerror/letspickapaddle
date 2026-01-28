interface WeightMapping {
  power?: number;
  control?: number;
  spin?: number;
  sweetSpot?: string;
  weight?: string;
  weightMin?: number;
  weightMax?: number;
  shape?: string;
  priceMin?: number;
  priceMax?: number;
  gripCircumference?: number;
  coreMaterial?: string;
  faceMaterial?: string;
  balance?: string;
}

interface Paddle {
  id: string;
  name: string;
  brand: string;
  priceCents: number;
  weightOz: number | null;
  gripCircumference: number | null;
  coreMaterial: string | null;
  faceMaterial: string | null;
  shape: string | null;
  powerRating: number | null;
  controlRating: number | null;
  spinRating: number | null;
  sweetSpotSize: string | null;
  imageUrl: string | null;
}

interface QuizResponse {
  [key: string]: string | string[];
}

interface WeightMappings {
  [key: string]: WeightMapping;
}

export function calculatePaddleScore(
  paddle: Paddle,
  responses: QuizResponse,
  weightMappings: Record<string, WeightMappings>
): { score: number; matchReasons: string[] } {
  let score = 0;
  const matchReasons: string[] = [];
  let totalWeight = 0;

  // Aggregate all weight mappings from responses
  const aggregatedWeights: WeightMapping = {};

  Object.entries(responses).forEach(([questionKey, answer]) => {
    const questionWeights = weightMappings[questionKey];
    if (!questionWeights) return;

    const answers = Array.isArray(answer) ? answer : [answer];

    answers.forEach((ans) => {
      const weights = questionWeights[ans];
      if (!weights) return;

      // Aggregate numeric weights
      if (weights.power) {
        aggregatedWeights.power = (aggregatedWeights.power || 0) + weights.power;
      }
      if (weights.control) {
        aggregatedWeights.control = (aggregatedWeights.control || 0) + weights.control;
      }
      if (weights.spin) {
        aggregatedWeights.spin = (aggregatedWeights.spin || 0) + weights.spin;
      }

      // Store preference weights
      if (weights.sweetSpot) aggregatedWeights.sweetSpot = weights.sweetSpot;
      if (weights.weight) aggregatedWeights.weight = weights.weight;
      if (weights.shape) aggregatedWeights.shape = weights.shape;
      if (weights.priceMin) aggregatedWeights.priceMin = weights.priceMin;
      if (weights.priceMax) aggregatedWeights.priceMax = weights.priceMax;
      if (weights.weightMin) aggregatedWeights.weightMin = weights.weightMin;
      if (weights.weightMax) aggregatedWeights.weightMax = weights.weightMax;
      if (weights.gripCircumference) aggregatedWeights.gripCircumference = weights.gripCircumference;
      if (weights.coreMaterial) aggregatedWeights.coreMaterial = weights.coreMaterial;
      if (weights.faceMaterial) aggregatedWeights.faceMaterial = weights.faceMaterial;
    });
  });

  // Score power rating
  if (aggregatedWeights.power && paddle.powerRating) {
    const powerScore = (paddle.powerRating / 10) * aggregatedWeights.power * 10;
    score += powerScore;
    totalWeight += aggregatedWeights.power;
    if (paddle.powerRating >= 8) {
      matchReasons.push(`High power rating (${paddle.powerRating}/10)`);
    }
  }

  // Score control rating
  if (aggregatedWeights.control && paddle.controlRating) {
    const controlScore = (paddle.controlRating / 10) * aggregatedWeights.control * 10;
    score += controlScore;
    totalWeight += aggregatedWeights.control;
    if (paddle.controlRating >= 8) {
      matchReasons.push(`Excellent control (${paddle.controlRating}/10)`);
    }
  }

  // Score spin rating
  if (aggregatedWeights.spin && paddle.spinRating) {
    const spinScore = (paddle.spinRating / 10) * aggregatedWeights.spin * 10;
    score += spinScore;
    totalWeight += aggregatedWeights.spin;
    if (paddle.spinRating >= 8) {
      matchReasons.push(`Great spin potential (${paddle.spinRating}/10)`);
    }
  }

  // Score sweet spot
  if (aggregatedWeights.sweetSpot && paddle.sweetSpotSize) {
    if (aggregatedWeights.sweetSpot === paddle.sweetSpotSize) {
      score += 10;
      totalWeight += 1;
      matchReasons.push(`${paddle.sweetSpotSize} sweet spot`);
    }
  }

  // Score shape preference
  if (aggregatedWeights.shape && paddle.shape) {
    if (aggregatedWeights.shape === paddle.shape) {
      score += 10;
      totalWeight += 1;
      matchReasons.push(`${paddle.shape} shape`);
    }
  }

  // Score weight preference
  if (paddle.weightOz) {
    if (aggregatedWeights.weightMin && paddle.weightOz < aggregatedWeights.weightMin) {
      score -= 5;
    } else if (aggregatedWeights.weightMax && paddle.weightOz > aggregatedWeights.weightMax) {
      score -= 5;
    } else if (aggregatedWeights.weightMin || aggregatedWeights.weightMax) {
      score += 8;
      totalWeight += 0.8;
      matchReasons.push(`Ideal weight (${paddle.weightOz} oz)`);
    }
  }

  // Score price range
  if (aggregatedWeights.priceMin || aggregatedWeights.priceMax) {
    const inRange =
      (!aggregatedWeights.priceMin || paddle.priceCents >= aggregatedWeights.priceMin) &&
      (!aggregatedWeights.priceMax || paddle.priceCents <= aggregatedWeights.priceMax);

    if (inRange) {
      score += 15;
      totalWeight += 1.5;
      matchReasons.push('Within budget');
    } else {
      score -= 10;
    }
  }

  // Score grip size
  if (aggregatedWeights.gripCircumference && paddle.gripCircumference) {
    const diff = Math.abs(paddle.gripCircumference - aggregatedWeights.gripCircumference);
    if (diff <= 0.125) {
      score += 8;
      totalWeight += 0.8;
      matchReasons.push(`Perfect grip (${paddle.gripCircumference}")`);
    }
  }

  // Score materials
  if (aggregatedWeights.coreMaterial && paddle.coreMaterial) {
    if (paddle.coreMaterial.toLowerCase().includes(aggregatedWeights.coreMaterial.toLowerCase())) {
      score += 5;
      totalWeight += 0.5;
      matchReasons.push(`${paddle.coreMaterial} core`);
    }
  }

  if (aggregatedWeights.faceMaterial && paddle.faceMaterial) {
    if (paddle.faceMaterial.toLowerCase().includes(aggregatedWeights.faceMaterial.toLowerCase())) {
      score += 5;
      totalWeight += 0.5;
      matchReasons.push(`${paddle.faceMaterial} face`);
    }
  }

  // Normalize score to 0-100
  const normalizedScore = totalWeight > 0 ? Math.min(100, (score / totalWeight) * 10) : 0;

  return {
    score: Math.round(normalizedScore),
    matchReasons: matchReasons.slice(0, 3), // Top 3 reasons
  };
}

export async function getRecommendations(
  responses: QuizResponse,
  weightMappings: Record<string, WeightMappings>,
  limit: number = 5
) {
  // In a real app, this would fetch from database
  // For now, return empty array as placeholder
  return [];
}
