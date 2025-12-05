package migrations

import (
	"database/sql"
	"embed"
	"fmt"
	"log/slog"

	"github.com/pressly/goose/v3"
)

//go:embed *.sql
var embedMigrations embed.FS

// Run executes all pending migrations using embedded SQL files.
func Run(db *sql.DB, logger *slog.Logger) error {
	goose.SetBaseFS(embedMigrations)

	if err := goose.SetDialect("sqlite3"); err != nil {
		return fmt.Errorf("set goose dialect: %w", err)
	}

	version, err := goose.GetDBVersion(db)
	if err != nil {
		return fmt.Errorf("get db version: %w", err)
	}
	logger.Info("current migration version", "version", version)

	if err := goose.Up(db, "."); err != nil {
		return fmt.Errorf("run migrations: %w", err)
	}

	newVersion, err := goose.GetDBVersion(db)
	if err != nil {
		return fmt.Errorf("get new db version: %w", err)
	}

	if newVersion != version {
		logger.Info("migrations applied", "from", version, "to", newVersion)
	} else {
		logger.Info("no new migrations to apply")
	}

	return nil
}
