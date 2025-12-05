package service

import "database/sql"

func valFloat64(n sql.NullFloat64, def float64) float64 {
	if n.Valid {
		return n.Float64
	}
	return def
}

func valInt64(n sql.NullInt64, def int64) int64 {
	if n.Valid {
		return n.Int64
	}
	return def
}

func ptrOrDefaultFloat64(ptr *float64, def float64) float64 {
	if ptr != nil {
		return *ptr
	}
	return def
}
