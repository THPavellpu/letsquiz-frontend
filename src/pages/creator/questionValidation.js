export function normalizeAndValidateOptions({ options, correctAnswerIndex }) {
  const rawOptions = Array.isArray(options) ? options : [];

  const normalized = rawOptions.slice(0, 4).map((opt) => {
    if (opt === null || opt === undefined) return "";
    return String(opt).trim();
  });

  // Ensure we always have exactly 4 options for validation
  while (normalized.length < 4) normalized.push("");

  // Duplicate check is case-insensitive after trim
  const keyCounts = new Map();
  normalized.forEach((val) => {
    const key = val.toLowerCase();
    const prev = keyCounts.get(key) || 0;
    keyCounts.set(key, prev + 1);
  });

  // duplicates are invalid even if the values are empty
  const hasDuplicates = normalized.some((val, i) => {
    const key = val.toLowerCase();
    return (keyCounts.get(key) || 0) > 1;
  });

  // Correct answer: exactly one true among provided boolean or exactly one index match
  const correctIndex = Number(correctAnswerIndex);
  const correctIndices = [0, 1, 2, 3].filter((i) => i === correctIndex);

  const hasSingleCorrect = correctIndices.length === 1;

  // Highlight invalid option indices only for duplicates
  const invalidIndices = new Set();
  if (hasDuplicates) {
    normalized.forEach((val, i) => {
      const key = val.toLowerCase();
      if ((keyCounts.get(key) || 0) > 1) invalidIndices.add(i);
    });
  }

  if (hasDuplicates) {
    return {
      ok: false,
      error: "Duplicate options are not allowed. Please make all four options unique.",
      invalidOptionIndices: invalidIndices,
    };
  }

  if (!hasSingleCorrect) {
    return {
      ok: false,
      error: "Please select exactly one correct answer.",
      invalidOptionIndices: new Set(),
    };
  }

  return { ok: true, invalidOptionIndices: new Set() };
}

export function validateAiQuestion({ question }) {
  const options = Array.isArray(question?.options) ? question.options.slice(0, 4) : [];
  const normalizedOptions = options.map((o) => String(o?.option_text ?? "").trim());
  while (normalizedOptions.length < 4) normalizedOptions.push("");

  const correctIdx = [0, 1, 2, 3].filter((i) => options?.[i]?.is_correct === true);
  const correctAnswerIndex = correctIdx.length ? correctIdx[0] : -1;

  // duplicates (case-insensitive, trimmed)
  const keyCounts = new Map();
  normalizedOptions.forEach((val) => {
    const key = val.toLowerCase();
    keyCounts.set(key, (keyCounts.get(key) || 0) + 1);
  });
  const hasDuplicates = normalizedOptions.some((val) => (keyCounts.get(val.toLowerCase()) || 0) > 1);

  const invalidOptionIndices = new Set();
  if (hasDuplicates) {
    normalizedOptions.forEach((val, i) => {
      if ((keyCounts.get(val.toLowerCase()) || 0) > 1) invalidOptionIndices.add(i);
    });
  }

  if (hasDuplicates) {
    return {
      ok: false,
      error: "Duplicate options are not allowed. Please make all four options unique.",
      invalidOptionIndices,
    };
  }

  if (correctIdx.length !== 1) {
    return {
      ok: false,
      error: "Please select exactly one correct answer.",
      invalidOptionIndices: new Set(),
      invalidCorrectAnswer: true,
    };
  }

  return { ok: true, invalidOptionIndices: new Set() };
}

