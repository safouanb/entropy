package validation

import (
	"fmt"

	"github.com/go-playground/validator/v10"
)

var validate *validator.Validate

func init() {
	validate = validator.New()
}

// Struct validates a struct and returns a formatted error if validation fails.
func Struct(s interface{}) error {
	if err := validate.Struct(s); err != nil {
		if validationErrors, ok := err.(validator.ValidationErrors); ok {
			return fmt.Errorf("validation failed: %s", formatValidationErrors(validationErrors))
		}
		return fmt.Errorf("validation error: %w", err)
	}
	return nil
}

// formatValidationErrors converts validator errors to a readable string.
func formatValidationErrors(errs validator.ValidationErrors) string {
	var msg string
	for i, err := range errs {
		if i > 0 {
			msg += "; "
		}
		msg += fmt.Sprintf("%s: %s", err.Field(), err.Tag())
	}
	return msg
}

// Validator returns the underlying validator instance for custom rules.
func Validator() *validator.Validate {
	return validate
}
