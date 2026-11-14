import { validationResult } from 'express-validator';

/**
 * Runs after express-validator checks and turns failures into a 400 response.
 * Without this middleware the checks are registered but never enforced.
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const details = errors.array();
  return res.status(400).json({
    success: false,
    msg: details[0]?.msg || 'Invalid request data',
    message: details[0]?.msg || 'Invalid request data',
    errors: details.map(({ path, msg }) => ({ field: path, message: msg })),
  });
};

export default validate;
