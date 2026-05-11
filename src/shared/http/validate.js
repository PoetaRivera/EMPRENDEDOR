const { BadRequestError } = require("./errors");

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ");
      return next(new BadRequestError(message));
    }
    req.body = result.data;
    next();
  };
}

module.exports = { validate };
