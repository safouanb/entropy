package service

import (
	"fmt"
)

type NotFoundError struct {
	Resource string
	ID       int64
}

func (e *NotFoundError) Error() string {
	return fmt.Sprintf("%s with ID %d not found", e.Resource, e.ID)
}

type ValidationError struct {
	Field  string
	Reason string
}

func (e *ValidationError) Error() string {
	return fmt.Sprintf("invalid %s: %s", e.Field, e.Reason)
}

type ConflictError struct {
	Message string
}

func (e *ConflictError) Error() string { return e.Message }

