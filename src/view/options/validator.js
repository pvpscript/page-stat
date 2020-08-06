const validTypesConfig = {
	protocols: typeof [],
	pMatching: typeof true,
	inactive: typeof [],
	log: typeof true,
};

// Ugly >>temporary<< JSON validator! (I'll make it better!)
function validateHosts(obj, callback) {
    for (let i in obj) {
        if (typeof obj[i] === "object") {
            for (let j in obj[i]) {
                if (j === "favicon") {
                    if (typeof obj[i][j] === "string") {
                        continue;
                    } else {
                        return callback(false,
                            `Favicon type must be 'string', ` +
                            `got ${typeof obj[i][j]}.`);
                    }
                } else if (j === "time") {
                    if (typeof obj[i][j] === "object") {
                        for (let k in obj[i][j]) {
                            if (typeof obj[i][j][k] !== "number") {
                                return callback(false,
                                    `Wrong type: Expected number, ` +
                                    `got ${typeof obj[i][j][k]}`);
                            }
                        }
                    } else {
                        return callback(false,
                            `Wrong type: Expected object, ` +
                            `got ${typeof obj[i][j]}.`);
                    }
                } else {
                    return callback(false, `Key must be ` +
                        `'favicon' or 'time', got ${j}.`);
                }
            }
        } else {
            return callback(false,
                `Host must be an object, got ${typeof obj[i]}.`);
        }
    }
    return callback(true, "JSON is valid");
}

// More uglyness
function validateSettings(obj, callback) {
	for (let i in obj) {
		const expected = validTypesConfig[i];
		const got = typeof obj[i];
		
		if (expected) {
			if (expected === got) {
				if (got === "object") {
					for (let j in obj[i]) {
						if (typeof obj[i][j] !== "string") {
							return callback(false, `Wrong type: `+
								`Expected 'string', ` +
								`got ${typeof obj[i][j]}.`);
						}
					}
				}
			} else {
				return callback(false, `Wrong type: expected ` +
					`${expected}, got ${got}`);
			}
		} else {
			return callback(false, `Unknown key ${i}`);
		}
	}

	return callback(true, "Valid config JSON");
}

const validateImport = {
	pagesImport: (obj, callback) => validateHosts(obj, callback),
	settingsImport: (obj, callback) => validateSettings(obj, callback),
};

export { validateImport };
