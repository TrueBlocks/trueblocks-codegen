export namespace config {
	
	export class Preferences {
	    x: number;
	    y: number;
	    width: number;
	    height: number;
	    lastFile: string;
	    lastView: string;
	    menuCollapsed: boolean;
	    helpCollapsed: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Preferences(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.x = source["x"];
	        this.y = source["y"];
	        this.width = source["width"];
	        this.height = source["height"];
	        this.lastFile = source["lastFile"];
	        this.lastView = source["lastView"];
	        this.menuCollapsed = source["menuCollapsed"];
	        this.helpCollapsed = source["helpCollapsed"];
	    }
	}

}

