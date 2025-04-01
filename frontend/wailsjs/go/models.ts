export namespace config {
	
	export class Preferences {
	    x: number;
	    y: number;
	    width: number;
	    height: number;
	    lastView: string;
	    menuOpen: boolean;
	    helpOpen: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Preferences(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.x = source["x"];
	        this.y = source["y"];
	        this.width = source["width"];
	        this.height = source["height"];
	        this.lastView = source["lastView"];
	        this.menuOpen = source["menuOpen"];
	        this.helpOpen = source["helpOpen"];
	    }
	}

}

