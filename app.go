package main

import (
	"context"
	"log"
)

type App struct {
	ctx context.Context
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) ConsoleLog(route string) {
	log.Printf("Route changed: %s", route)
}
