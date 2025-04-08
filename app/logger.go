package app

import "fmt"

func (a *App) Logger(msg string) {
	fmt.Println(msg)
}
