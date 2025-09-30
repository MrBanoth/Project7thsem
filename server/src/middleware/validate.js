import { validationResult } from 'express-validator';

export function validate(rules) {
  return async (req, res, next) => {
    await Promise.all(rules.map((rule) => rule.run(req)));
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(422).json({ success: false, message: 'Validation error', errors: result.array() });
    }
    next();
  };
}


