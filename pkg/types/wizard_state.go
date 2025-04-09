package types

type WizardState struct {
	MissingNameEmail      bool `json:"missingNameEmail"`
	RPCUnavailable        bool `json:"rpcUnavailable"`
	MissingLastOpenedFile bool `json:"missingLastOpenedFile"`
}
