/**
 * Quiz Response Mapper
 *
 * Maps actual quiz response keys to the keys expected by scoring config.
 * The quiz sends snake_case keys (play_style, skill_level) but scoring
 * config uses semantic keys (playStyle, experience, etc.)
 */

/**
 * Map quiz responses to generic scoring config format
 */
export function mapQuizResponsesToScoringFormat(responses: Record<string, any>): Record<string, any> {
  const mapped: Record<string, any> = {};

  // Map play_style -> playStyle
  if (responses.play_style) {
    mapped.playStyle = responses.play_style;
  }

  // Map skill_level -> experience
  if (responses.skill_level) {
    mapped.experience = responses.skill_level;
  }

  // Map budget directly (already good key)
  if (responses.budget) {
    mapped.budget = responses.budget;
  }

  // Map weight_preference -> weightPreference
  if (responses.weight_preference) {
    mapped.weightPreference = responses.weight_preference;
  }

  // Map paddle_shape -> shapePreference
  if (responses.paddle_shape) {
    mapped.shapePreference = responses.paddle_shape;
  }

  // Map grip_size -> gripPreference
  if (responses.grip_size) {
    mapped.gripPreference = responses.grip_size;
  }

  // Map shot_preference (array) -> individual preferences
  if (responses.shot_preference && Array.isArray(responses.shot_preference)) {
    // Extract spin preference from shot_preference
    if (responses.shot_preference.includes('spins')) {
      mapped.spinPreference = 'high';
    }

    // Extract control preference from dinks/volleys
    if (responses.shot_preference.includes('dinks') || responses.shot_preference.includes('volleys')) {
      mapped.controlFocus = true;
    }

    // Extract power preference from drives/serves
    if (responses.shot_preference.includes('drives') || responses.shot_preference.includes('serves')) {
      mapped.powerFocus = true;
    }
  }

  // Map physical_condition to sweet spot preference
  if (responses.physical_condition && Array.isArray(responses.physical_condition)) {
    if (responses.physical_condition.includes('arm_issues') ||
        responses.physical_condition.includes('wrist_issues') ||
        responses.physical_condition.includes('shoulder_issues')) {
      // Physical issues suggest need for larger sweet spot
      mapped.sweetSpotPreference = 'large';
      mapped.weightPreference = mapped.weightPreference || 'lightweight';
    }
  }

  return mapped;
}
